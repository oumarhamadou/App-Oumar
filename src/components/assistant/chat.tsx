"use client";

import {
  ArrowUp,
  BookOpenCheck,
  Check,
  Copy,
  FileText,
  Globe,
  Lightbulb,
  Loader2,
  RotateCcw,
  Scale,
  Sparkles,
  Square,
  TriangleAlert,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Markdown } from "@/components/common/markdown";
import { Skeleton } from "@/components/ui/misc";
import { useAiStatus } from "@/hooks/use-ai-status";
import { parseEventLine } from "@/lib/ai/events";
import { cn } from "@/lib/cn";
import { useAppStore, useHydrated, type ChatMessage } from "@/lib/store";
import { LEVELS, LEVEL_IDS } from "@/lib/taxonomy";

const MODES = [
  { icon: Lightbulb, label: "Expliquer simplement", prompt: "Explique-moi simplement ce qu'est " },
  { icon: FileText, label: "Résumer un article", prompt: "Résume cet article et explique pourquoi il est important :\n" },
  { icon: Scale, label: "Comparer deux idées", prompt: "Compare ces deux approches (arguments, limites, ce qui fait consensus) : " },
  { icon: BookOpenCheck, label: "Me tester", prompt: "Pose-moi 3 questions de quiz pour vérifier que j'ai compris " },
];

const SUGGESTIONS = [
  "Pourquoi les banques centrales relèvent-elles leurs taux quand l'inflation monte ?",
  "Quelle différence entre une action, une obligation et un ETF ?",
  "Comment fonctionne un modèle de langage comme Claude ?",
  "Keynésiens et monétaristes : qu'est-ce qui les oppose ?",
  "Comment calculer le seuil de rentabilité d'une petite entreprise ?",
  "Le franc CFA : comment fonctionne sa parité avec l'euro ?",
];

function newId(): string {
  return `m-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

/** Waits for persisted data so the saved conversation and level are available on first render. */
export function Chat() {
  const hydrated = useHydrated();
  if (!hydrated) {
    return (
      <div className="space-y-4" aria-busy="true">
        <Skeleton className="h-10 w-80" />
        <Skeleton className="h-56 w-full" />
        <Skeleton className="h-14 w-full" />
      </div>
    );
  }
  return <ChatSession />;
}

function ChatSession() {
  const aiOnline = useAiStatus();
  const level = useAppStore((s) => s.profile.level);
  const setProfile = useAppStore((s) => s.setProfile);
  const setChat = useAppStore((s) => s.setChat);
  const clearChat = useAppStore((s) => s.clearChat);
  const searchParams = useSearchParams();

  const [messages, setMessages] = useState<ChatMessage[]>(() => useAppStore.getState().chat);
  const [input, setInput] = useState("");
  const [webSearch, setWebSearch] = useState(true);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const initialised = useRef(false);

  const send = useCallback(
    async (text: string, base: ChatMessage[]) => {
      const content = text.trim();
      if (!content || busy) return;
      const userMessage: ChatMessage = { id: newId(), role: "user", content };
      const assistantId = newId();
      const history = [...base, userMessage];
      setMessages([...history, { id: assistantId, role: "assistant", content: "" }]);
      setInput("");
      setBusy(true);
      setStatus(null);
      setNotice(null);

      const controller = new AbortController();
      abortRef.current = controller;
      let answer = "";
      let sources: ChatMessage["sources"];
      let failed: string | null = null;

      const snapshot = (): ChatMessage[] => [
        ...history,
        { id: assistantId, role: "assistant", content: answer || (failed ?? ""), sources, error: Boolean(failed) && !answer },
      ];
      const update = () => setMessages(snapshot());

      try {
        const response = await fetch("/api/assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            level,
            webSearch,
            messages: history.filter((m) => !m.error && m.content).map((m) => ({ role: m.role, content: m.content })),
          }),
        });
        if (!response.ok || !response.body) {
          const data = (await response.json().catch(() => ({}))) as { error?: string };
          throw new Error(data.error ?? `Erreur ${response.status}`);
        }
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            const event = parseEventLine(line);
            if (!event) continue;
            if (event.type === "text") {
              answer += event.text;
              setStatus(null);
              update();
            } else if (event.type === "status") setStatus(event.message);
            else if (event.type === "notice") setNotice(event.message);
            else if (event.type === "sources") {
              sources = event.sources;
              update();
            } else if (event.type === "error") {
              failed = event.message;
              update();
            }
          }
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          failed = error instanceof Error ? error.message : "La réponse n'a pas pu être obtenue.";
        }
      } finally {
        if (failed && answer) answer += `\n\n> ⚠️ ${failed}`;
        const finalMessages = snapshot().filter((m) => m.content);
        setMessages(finalMessages);
        setChat(finalMessages);
        setBusy(false);
        setStatus(null);
        abortRef.current = null;
      }
    },
    [busy, level, webSearch, setChat],
  );

  // A question passed in the URL (?q=…) is sent once, after the saved conversation.
  useEffect(() => {
    if (initialised.current) return;
    initialised.current = true;
    const q = searchParams.get("q");
    if (!q) return;
    window.history.replaceState(null, "", "/assistant");
    const restored = useAppStore.getState().chat;
    if (restored[restored.length - 2]?.content !== q) queueMicrotask(() => void send(q, restored));
  }, [searchParams, send]);

  // Follow new messages, but leave the page where it is on first load.
  const lastCount = useRef(messages.length);
  useEffect(() => {
    if (messages.length > lastCount.current || busy) endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    lastCount.current = messages.length;
  }, [messages.length, busy]);

  const empty = messages.length === 0;
  const stop = () => abortRef.current?.abort();
  const reset = () => {
    stop();
    setMessages([]);
    clearChat();
    setNotice(null);
  };
  const applyPrompt = (prompt: string) => {
    setInput(prompt);
    requestAnimationFrame(() => {
      const el = inputRef.current;
      if (el) {
        el.focus();
        el.setSelectionRange(prompt.length, prompt.length);
      }
    });
  };

  return (
    <div className="flex min-h-[calc(100dvh-12rem)] flex-col">
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <div role="radiogroup" aria-label="Niveau d'explication" className="inline-flex rounded-xl bg-surface-2 p-1">
          {LEVEL_IDS.map((l) => (
            <button
              key={l}
              type="button"
              role="radio"
              aria-checked={level === l}
              onClick={() => setProfile({ level: l })}
              className={cn(
                "rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors",
                level === l ? "bg-surface text-ink shadow-card" : "text-ink-3 hover:text-ink",
              )}
            >
              {LEVELS[l].label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setWebSearch((v) => !v)}
          aria-pressed={webSearch}
          title="Autoriser l'assistant à rechercher des sources récentes sur le web"
          className={cn(
            "inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-[13px] font-medium transition-colors",
            webSearch ? "border-accent/40 bg-accent-soft text-ink" : "border-line text-ink-3 hover:text-ink",
          )}
        >
          <Globe className="h-3.5 w-3.5" />
          Sources web {webSearch ? "activées" : "désactivées"}
        </button>
        {!empty ? (
          <button type="button" onClick={reset} className="ml-auto inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-[13px] font-medium text-ink-3 hover:bg-surface-2 hover:text-ink">
            <RotateCcw className="h-3.5 w-3.5" /> Nouvelle conversation
          </button>
        ) : null}
      </div>

      {aiOnline === false ? (
        <div className="mb-5 flex gap-2.5 rounded-xl border border-line bg-surface-2 px-3.5 py-2.5 text-[13px] leading-relaxed text-ink-2">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-ink-3" />
          <p>
            <strong className="font-semibold text-ink">Mode hors ligne.</strong> Aucune clé d&apos;API n&apos;est configurée sur le serveur : l&apos;assistant répond à
            partir des fiches de la plateforme. Ajoutez <code className="rounded bg-surface px-1">ANTHROPIC_API_KEY</code> pour activer les réponses de Claude
            avec recherche de sources.
          </p>
        </div>
      ) : null}

      <div className="flex-1">
        {empty ? (
          <div className="animate-rise py-6">
            <div className="mb-8 flex flex-col items-center text-center">
              <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent-text">
                <Sparkles className="h-6 w-6" />
              </span>
              <h2 className="text-xl font-semibold tracking-tight">Que voulez-vous comprendre aujourd&apos;hui ?</h2>
              <p className="mt-1.5 max-w-md text-[14px] text-ink-2">
                Posez une question, collez un article à résumer ou demandez une comparaison. Les explications s&apos;adaptent au niveau choisi.
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => void send(s, messages)}
                  className="rounded-2xl border border-line bg-surface px-4 py-3 text-left text-[13.5px] leading-snug text-ink-2 shadow-card transition-colors hover:border-line-strong hover:text-ink"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <ol className="space-y-6" aria-live="polite">
            {messages.map((m, i) => (
              <MessageBubble key={m.id} message={m} streaming={busy && i === messages.length - 1} status={i === messages.length - 1 ? status : null} />
            ))}
          </ol>
        )}
        {notice ? <p className="mt-4 text-center text-[12px] text-ink-3">{notice}</p> : null}
        <div ref={endRef} />
      </div>

      <div className="sticky bottom-16 z-10 -mx-4 mt-6 bg-gradient-to-t from-page from-75% to-transparent px-4 pb-4 pt-8 sm:-mx-6 sm:px-6 lg:bottom-0 lg:pb-6">
        <div className="mb-2 flex gap-1.5 overflow-x-auto scrollbar-none">
          {MODES.map((mode) => (
            <button
              key={mode.label}
              type="button"
              onClick={() => applyPrompt(mode.prompt)}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-[12.5px] font-medium text-ink-2 shadow-card hover:text-ink"
            >
              <mode.icon className="h-3.5 w-3.5" /> {mode.label}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void send(input, messages);
          }}
          className="flex items-end gap-2 rounded-2xl border border-line-strong bg-surface p-2 shadow-pop focus-within:border-accent"
        >
          <label htmlFor="chat-input" className="sr-only">
            Votre question
          </label>
          <textarea
            id="chat-input"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, 12_000))}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                void send(input, messages);
              }
            }}
            rows={1}
            placeholder="Posez votre question… (Maj + Entrée pour aller à la ligne)"
            className="max-h-48 min-h-[44px] flex-1 resize-none bg-transparent px-2.5 py-2.5 text-[15px] leading-snug outline-none placeholder:text-ink-3 [field-sizing:content]"
          />
          {busy ? (
            <button type="button" onClick={stop} aria-label="Arrêter la réponse" className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink text-page">
              <Square className="h-3.5 w-3.5" fill="currentColor" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              aria-label="Envoyer"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-ink transition-opacity disabled:opacity-40"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          )}
        </form>
        <p className="mt-2 text-center text-[11.5px] text-ink-3">
          L&apos;IA peut se tromper : vérifiez les informations importantes. Contenu éducatif, pas un conseil en investissement.
        </p>
      </div>
    </div>
  );
}

function MessageBubble({ message, streaming, status }: { message: ChatMessage; streaming: boolean; status: string | null }) {
  const [copied, setCopied] = useState(false);
  if (message.role === "user") {
    return (
      <li className="flex justify-end">
        <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-ink px-4 py-2.5 text-[14.5px] leading-relaxed text-page">{message.content}</div>
      </li>
    );
  }
  return (
    <li className="flex gap-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent-text">
        <Sparkles className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        {message.content ? (
          <div className={cn(message.error && "text-critical-text")}>
            <Markdown className={cn(streaming && "caret")}>{message.content}</Markdown>
          </div>
        ) : (
          <p className="flex items-center gap-2 py-1 text-[13.5px] text-ink-3">
            <Loader2 className="h-4 w-4 animate-spin" /> {status ?? "Réflexion en cours…"}
          </p>
        )}
        {streaming && message.content && status ? (
          <p className="mt-2 flex items-center gap-2 text-[12.5px] text-ink-3">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> {status}
          </p>
        ) : null}
        {message.sources?.length ? (
          <div className="mt-4">
            <p className="mb-2 text-[11.5px] font-medium uppercase tracking-wide text-ink-3">Sources</p>
            <ol className="flex flex-wrap gap-1.5">
              {message.sources.map((s, i) => {
                const internal = s.url.startsWith("/");
                let host = s.url;
                try {
                  host = internal ? "Prisme" : new URL(s.url).hostname.replace(/^www\./, "");
                } catch {
                  // keep raw url
                }
                return (
                  <li key={s.url}>
                    <a
                      href={s.url}
                      target={internal ? undefined : "_blank"}
                      rel={internal ? undefined : "noopener noreferrer"}
                      className="inline-flex max-w-[260px] items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-1 text-[12px] text-ink-2 hover:border-line-strong hover:text-ink"
                      title={s.title}
                    >
                      <span className="font-semibold text-ink-3">{i + 1}</span>
                      <span className="truncate">{internal ? s.title : host}</span>
                    </a>
                  </li>
                );
              })}
            </ol>
          </div>
        ) : null}
        {!streaming && message.content && !message.error ? (
          <button
            type="button"
            onClick={() => {
              void navigator.clipboard?.writeText(message.content).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              });
            }}
            className="mt-2 inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[12px] text-ink-3 hover:bg-surface-2 hover:text-ink"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copié" : "Copier"}
          </button>
        ) : null}
      </div>
    </li>
  );
}
