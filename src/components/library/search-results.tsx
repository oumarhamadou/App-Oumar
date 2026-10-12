"use client";

import { Search, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { EmptyState } from "@/components/ui/misc";
import { useNews } from "@/hooks/use-news";
import { cn } from "@/lib/cn";
import { SEARCH_KIND_LABELS, buildStaticIndex, newsToDocs, search, type SearchKind } from "@/lib/search";

const staticIndex = buildStaticIndex();

export function SearchResults() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [kind, setKind] = useState<SearchKind | "tout">("tout");
  const news = useNews();
  const docs = useMemo(() => (news ? [...staticIndex, ...newsToDocs(news.items)] : staticIndex), [news]);
  const results = useMemo(() => {
    const strict = search(docs, query, 60);
    return strict.length > 0 ? strict : search(docs, query, 30, { requireAll: false });
  }, [docs, query]);
  const counts = results.reduce<Record<string, number>>((acc, r) => ({ ...acc, [r.kind]: (acc[r.kind] ?? 0) + 1 }), {});
  const shown = kind === "tout" ? results : results.filter((r) => r.kind === kind);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          router.replace(`${pathname}?q=${encodeURIComponent(query)}`);
        }}
        className="relative mb-5"
      >
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-3" />
        <label htmlFor="search-page-input" className="sr-only">
          Rechercher
        </label>
        <input
          id="search-page-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          placeholder="Inflation, ETF, agent IA, seuil de rentabilité…"
          className="h-14 w-full rounded-2xl border border-line-strong bg-surface pl-12 pr-4 text-[16px] shadow-card outline-none focus:border-accent"
        />
      </form>

      {query.trim() ? (
        <div className="mb-5 flex flex-wrap gap-1.5">
          {(["tout", ...(Object.keys(counts) as SearchKind[])] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setKind(k)}
              aria-pressed={kind === k}
              className={cn(
                "rounded-full border px-3 py-1 text-[12.5px] font-medium",
                kind === k ? "border-accent bg-accent-soft text-ink" : "border-line text-ink-3 hover:text-ink",
              )}
            >
              {k === "tout" ? `Tout (${results.length})` : `${SEARCH_KIND_LABELS[k]} (${counts[k]})`}
            </button>
          ))}
        </div>
      ) : null}

      {!query.trim() ? (
        <p className="text-[14px] text-ink-3">Recherchez parmi les actualités, les fiches, les leçons, les études de cas et les outils d&apos;IA.</p>
      ) : shown.length === 0 ? (
        <EmptyState icon={<Search className="h-6 w-6" />} title={`Aucun résultat pour « ${query} »`} description="Vérifiez l'orthographe ou posez directement la question à l'assistant." />
      ) : (
        <ul className="divide-y divide-line rounded-2xl border border-line bg-surface px-4 shadow-card">
          {shown.map((r) => (
            <li key={r.id}>
              <Link href={r.href} className="flex gap-4 py-3.5 hover:opacity-80">
                <span className="w-[86px] shrink-0 pt-0.5 text-[11.5px] font-medium text-ink-3">{SEARCH_KIND_LABELS[r.kind]}</span>
                <span className="min-w-0">
                  <span className="block text-[14.5px] font-medium text-ink">{r.title}</span>
                  <span className="mt-0.5 line-clamp-2 block text-[13px] text-ink-2">{r.description}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {query.trim() ? (
        <Link
          href={`/assistant?q=${encodeURIComponent(query)}`}
          className="mt-6 flex items-center gap-3 rounded-2xl border border-line bg-surface p-4 shadow-card transition-shadow hover:shadow-pop"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-soft text-accent-text">
            <Sparkles className="h-4 w-4" />
          </span>
          <span>
            <span className="block text-[14px] font-medium">Demander à l&apos;assistant : « {query} »</span>
            <span className="block text-[12.5px] text-ink-3">Une réponse expliquée à votre niveau, avec des sources</span>
          </span>
        </Link>
      ) : null}
    </div>
  );
}
