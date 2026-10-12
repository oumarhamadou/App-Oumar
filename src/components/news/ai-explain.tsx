"use client";

import { AlertCircle, ArrowRight, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getConcept } from "@/content/concepts";
import { formatDate } from "@/lib/format";
import type { NewsItem } from "@/lib/news/types";
import { useAppStore, useHydrated, type NewsExplanation } from "@/lib/store";

/**
 * Article-specific explanation generated on demand (and cached locally).
 * Until then, the generic reading key for the article's topic is shown,
 * clearly labelled as such.
 */
export function AiExplain({ item, genericWhy }: { item: NewsItem; genericWhy: string }) {
  const hydrated = useHydrated();
  const cached = useAppStore((s) => s.explanations[item.id]);
  const cacheExplanation = useAppStore((s) => s.cacheExplanation);
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const explanation: NewsExplanation | undefined = hydrated ? cached : undefined;

  const run = async () => {
    setState("loading");
    setError(null);
    try {
      const response = await fetch("/api/news/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: item.id,
          title: item.title,
          summary: item.summary,
          source: item.source.name,
          url: item.url,
          publishedAt: item.publishedAt,
        }),
      });
      const data = (await response.json()) as { explanation?: Omit<NewsExplanation, "generatedAt">; error?: string };
      if (!response.ok || !data.explanation) throw new Error(data.error ?? "Explication indisponible.");
      cacheExplanation(item.id, { ...data.explanation, generatedAt: new Date().toISOString() });
      setState("idle");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Explication indisponible.");
      setState("error");
    }
  };

  if (explanation) {
    return (
      <section className="rounded-2xl border border-line bg-surface p-5 shadow-card sm:p-6" aria-labelledby="explication-ia">
        <div className="mb-3 flex items-center gap-2 text-[12px] font-medium text-accent-text">
          <Sparkles className="h-3.5 w-3.5" />
          <span id="explication-ia">Expliqué par l&apos;IA · {formatDate(explanation.generatedAt)}</span>
        </div>
        <h2 className="text-[15px] font-semibold">En bref</h2>
        <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink-2">{explanation.summary}</p>
        <h2 className="mt-5 text-[15px] font-semibold">Pourquoi c&apos;est important</h2>
        <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink-2">{explanation.whyItMatters}</p>
        {explanation.keyPoints.length > 0 ? (
          <>
            <h2 className="mt-5 text-[15px] font-semibold">Points clés</h2>
            <ul className="mt-2 space-y-1.5">
              {explanation.keyPoints.map((p) => (
                <li key={p} className="flex gap-2.5 text-[14px] leading-relaxed text-ink-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                  {p}
                </li>
              ))}
            </ul>
          </>
        ) : null}
        {explanation.concepts.length > 0 ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {explanation.concepts.map((slug) => {
              const concept = getConcept(slug);
              return concept ? (
                <Link key={slug} href={`/savoir/${slug}`} className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1 text-[12.5px] font-medium hover:bg-surface-2">
                  {concept.title} <ArrowRight className="h-3 w-3" />
                </Link>
              ) : null;
            })}
          </div>
        ) : null}
        <p className="mt-5 text-[11.5px] text-ink-3">
          Généré à partir du titre et de l&apos;extrait publiés par la source. Vérifiez les détails dans l&apos;article original.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-line bg-surface p-5 shadow-card sm:p-6">
      <h2 className="text-[15px] font-semibold">Pourquoi c&apos;est important</h2>
      <p className="mt-1 text-[12px] font-medium text-ink-3">Repère général sur ce thème</p>
      <p className="mt-2 text-[14.5px] leading-relaxed text-ink-2">{genericWhy}</p>
      <div className="mt-5 flex flex-wrap items-center gap-3 rounded-xl bg-accent-soft p-4">
        <Sparkles className="h-5 w-5 shrink-0 text-accent-text" />
        <p className="min-w-0 flex-1 text-[13.5px] text-ink">Obtenez un résumé clair, les points clés et l&apos;importance concrète de cet article.</p>
        <Button size="sm" onClick={run} disabled={state === "loading"}>
          {state === "loading" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
          {state === "loading" ? "Analyse…" : "Expliquer avec l'IA"}
        </Button>
      </div>
      {error ? (
        <p className="mt-3 flex items-start gap-2 text-[13px] text-critical-text" role="alert">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </p>
      ) : null}
    </section>
  );
}
