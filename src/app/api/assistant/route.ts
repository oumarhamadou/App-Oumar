import type Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { FALLBACK_BETA, MODEL, describeApiError, getAnthropic } from "@/lib/ai/client";
import type { AssistantEvent } from "@/lib/ai/events";
import { offlineAnswer } from "@/lib/ai/offline";
import { MENTOR_SYSTEM_PROMPT, sessionContext } from "@/lib/ai/prompts";
import { formatDate } from "@/lib/format";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { LEVEL_IDS, type Level } from "@/lib/taxonomy";

export const maxDuration = 120;

const RequestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(12_000),
      }),
    )
    .min(1)
    .max(30)
    .refine((m) => m.length > 0 && m[m.length - 1].role === "user", "Le dernier message doit venir de l'utilisateur."),
  level: z.enum(LEVEL_IDS as [Level, ...Level[]]).default("debutant"),
  webSearch: z.boolean().default(true),
  page: z
    .object({ title: z.string().max(300), excerpt: z.string().max(1500).optional() })
    .optional(),
});

const MAX_PAUSE_RESUMES = 3;
const MAX_SOURCES = 6;

type Source = { title: string; url: string };

function ndjson(events: AsyncIterable<AssistantEvent>, signal: AbortSignal): Response {
  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of events) {
          if (signal.aborted) break;
          controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
        }
      } finally {
        controller.close();
      }
    },
  });
  return new Response(body, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}

async function* offlineEvents(question: string, level: Level): AsyncGenerator<AssistantEvent> {
  const { text, sources } = offlineAnswer(question, level);
  yield { type: "notice", message: "Mode hors ligne : réponses issues de la base de connaissances de la plateforme." };
  // Emit in small chunks so the interface behaves like a streamed answer.
  for (const chunk of text.match(/[\s\S]{1,80}/g) ?? []) yield { type: "text", text: chunk };
  if (sources.length > 0) yield { type: "sources", sources };
  yield { type: "done", mode: "offline" };
}

async function* claudeEvents(
  client: Anthropic,
  input: z.infer<typeof RequestSchema>,
  signal: AbortSignal,
): AsyncGenerator<AssistantEvent> {
  const webEnabled = input.webSearch && process.env.ASSISTANT_WEB_SEARCH !== "false";
  const today = formatDate(new Date().toISOString());
  const cited: Source[] = [];
  const found: Source[] = [];

  let messages: Anthropic.Beta.BetaMessageParam[] = input.messages.map((m) => ({ role: m.role, content: m.content }));

  try {
    for (let round = 0; round <= MAX_PAUSE_RESUMES; round++) {
      const stream = client.beta.messages.stream(
        {
          model: MODEL,
          max_tokens: 16000,
          betas: [FALLBACK_BETA],
          fallbacks: "default",
          thinking: { type: "adaptive" },
          output_config: { effort: "medium" },
          system: [
            { type: "text", text: MENTOR_SYSTEM_PROMPT, cache_control: { type: "ephemeral" } },
            { type: "text", text: sessionContext(input.level, today, input.page) },
          ],
          tools: webEnabled
            ? [
                { type: "web_search_20260209", name: "web_search", max_uses: 4 },
                { type: "web_fetch_20260209", name: "web_fetch", max_uses: 2 },
              ]
            : undefined,
          messages,
        },
        { signal },
      );

      for await (const event of stream) {
        if (event.type === "content_block_start") {
          const block = event.content_block;
          if (block.type === "server_tool_use") {
            yield {
              type: "status",
              message: block.name === "web_fetch" ? "Lecture de la page demandée…" : "Recherche de sources fiables…",
            };
          } else if (block.type === "web_search_tool_result" && Array.isArray(block.content)) {
            for (const result of block.content) {
              if (result.type === "web_search_result") found.push({ title: result.title, url: result.url });
            }
            yield { type: "status", message: "Analyse des sources…" };
          }
        } else if (event.type === "content_block_delta") {
          if (event.delta.type === "text_delta") {
            yield { type: "text", text: event.delta.text };
          } else if (event.delta.type === "citations_delta") {
            const citation = event.delta.citation;
            if (citation.type === "web_search_result_location") {
              cited.push({ title: citation.title ?? citation.url, url: citation.url });
            }
          }
        }
      }

      const final = await stream.finalMessage();
      if (final.stop_reason === "pause_turn") {
        // A long server-tool turn paused: send it back so the model continues where it stopped.
        messages = [...messages, { role: "assistant", content: final.content }];
        continue;
      }
      if (final.stop_reason === "refusal") {
        yield { type: "error", message: "Je ne peux pas répondre à cette demande. Essayez de la reformuler." };
      } else if (final.stop_reason === "max_tokens") {
        yield { type: "notice", message: "La réponse a été tronquée : demandez la suite si besoin." };
      }
      break;
    }

    const seen = new Set<string>();
    const sources = [...cited, ...found].filter((s) => (seen.has(s.url) ? false : (seen.add(s.url), true)));
    if (sources.length > 0) yield { type: "sources", sources: sources.slice(0, MAX_SOURCES) };
    yield { type: "done", mode: "online" };
  } catch (error) {
    if (signal.aborted) return;
    console.error("[assistant]", error);
    yield { type: "error", message: describeApiError(error) };
  }
}

export async function POST(request: Request): Promise<Response> {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Corps de requête JSON invalide." }, { status: 400 });
  }
  const parsed = RequestSchema.safeParse(payload);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message ?? "Requête invalide." }, { status: 400 });
  }

  const client = getAnthropic();
  if (!client) {
    const question = parsed.data.messages[parsed.data.messages.length - 1].content;
    return ndjson(offlineEvents(question, parsed.data.level), request.signal);
  }

  const limit = rateLimit(`assistant:${clientKey(request.headers)}`, 30, 10 * 60_000);
  if (!limit.ok) {
    return Response.json(
      { error: "Vous avez envoyé beaucoup de questions. Patientez quelques minutes." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  return ndjson(claudeEvents(client, parsed.data, request.signal), request.signal);
}
