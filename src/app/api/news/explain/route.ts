import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";
import { concepts } from "@/content/concepts";
import { FALLBACK_BETA, MODEL, describeApiError, getAnthropic } from "@/lib/ai/client";
import { NEWS_EXPLAIN_PROMPT } from "@/lib/ai/prompts";
import { clientKey, rateLimit } from "@/lib/rate-limit";

export const maxDuration = 60;

const RequestSchema = z.object({
  id: z.string().min(1).max(100),
  title: z.string().min(1).max(500),
  summary: z.string().max(3000).default(""),
  source: z.string().max(200),
  url: z.string().url().max(2000),
  publishedAt: z.string().max(40).optional(),
});

const conceptSlugs = concepts.map((c) => c.slug) as [string, ...string[]];

const ExplanationSchema = z.object({
  summary: z.string(),
  whyItMatters: z.string(),
  keyPoints: z.array(z.string()),
  concepts: z.array(z.enum(conceptSlugs)),
});

type Explanation = z.infer<typeof ExplanationSchema>;

/** Per-instance memo: the same article is explained once per server instance. */
const memo = new Map<string, Explanation>();

export async function POST(request: Request): Promise<Response> {
  const parsed = RequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Requête invalide." }, { status: 400 });
  const article = parsed.data;

  const cached = memo.get(article.id);
  if (cached) return Response.json({ explanation: cached, cached: true });

  const client = getAnthropic();
  if (!client) {
    return Response.json(
      { error: "L'explication par IA nécessite une clé API Anthropic (variable ANTHROPIC_API_KEY).", offline: true },
      { status: 503 },
    );
  }

  const limit = rateLimit(`explain:${clientKey(request.headers)}`, 40, 10 * 60_000);
  if (!limit.ok) {
    return Response.json({ error: "Trop de demandes. Réessayez dans quelques minutes." }, { status: 429 });
  }

  const allowed = concepts.map((c) => `${c.slug} (${c.title})`).join(", ");
  try {
    const response = await client.beta.messages.parse({
      model: MODEL,
      max_tokens: 4000,
      betas: [FALLBACK_BETA],
      fallbacks: "default",
      output_config: { effort: "low", format: betaZodOutputFormat(ExplanationSchema) },
      system: NEWS_EXPLAIN_PROMPT,
      messages: [
        {
          role: "user",
          content: `Concepts autorisés : ${allowed}

<article>
Titre : ${article.title}
Source : ${article.source}${article.publishedAt ? `\nDate : ${article.publishedAt}` : ""}
Lien : ${article.url}
Extrait : ${article.summary || "(aucun extrait fourni par la source)"}
</article>`,
        },
      ],
    });

    if (response.stop_reason === "refusal" || !response.parsed_output) {
      return Response.json({ error: "Impossible de générer une explication pour cet article." }, { status: 502 });
    }
    const explanation: Explanation = {
      ...response.parsed_output,
      keyPoints: response.parsed_output.keyPoints.slice(0, 4),
      concepts: [...new Set(response.parsed_output.concepts)].slice(0, 3),
    };
    memo.set(article.id, explanation);
    if (memo.size > 500) memo.delete(memo.keys().next().value!);
    return Response.json({ explanation });
  } catch (error) {
    console.error("[news/explain]", error);
    return Response.json({ error: describeApiError(error) }, { status: 502 });
  }
}
