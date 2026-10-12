"use client";

import { Info, Search, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { DomainDot } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/misc";
import { useNow } from "@/hooks/use-now";
import { cn } from "@/lib/cn";
import { formatDateTime } from "@/lib/format";
import type { NewsFeedResult } from "@/lib/news/types";
import { rankNews } from "@/lib/recommend";
import { useAppStore, useHydrated } from "@/lib/store";
import { DOMAINS, TOPICS, TOPIC_IDS, type Domain, type Topic } from "@/lib/taxonomy";
import { normalize } from "@/lib/text";
import { NewsCard } from "./news-card";

type Scope = "tout" | "pour-vous";
const PAGE_SIZE = 12;

export function NewsFeed({ feed }: { feed: NewsFeedResult }) {
  const hydrated = useHydrated();
  const now = useNow();
  const interests = useAppStore((s) => s.profile.interests);
  const history = useAppStore((s) => s.history);
  const [scope, setScope] = useState<Scope>("tout");
  const [domain, setDomain] = useState<Domain | "tous">("tous");
  const [topic, setTopic] = useState<Topic | null>(null);
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const items = useMemo(() => {
    let list = feed.items;
    if (scope === "pour-vous" && hydrated && interests.length > 0) {
      list = list.filter((i) => i.topics.some((t) => interests.includes(t)));
    }
    if (domain !== "tous") list = list.filter((i) => i.topics.some((t) => TOPICS[t].domain === domain));
    if (topic) list = list.filter((i) => i.topics.includes(topic));
    const q = normalize(query.trim());
    if (q) list = list.filter((i) => normalize(`${i.title} ${i.summary} ${i.source.name}`).includes(q));
    if (scope === "pour-vous" && hydrated && now) list = rankNews(list, { interests, history }, now);
    return list;
  }, [feed.items, scope, domain, topic, query, hydrated, interests, history, now]);

  const topicsInDomain = TOPIC_IDS.filter((t) => domain === "tous" || TOPICS[t].domain === domain);
  const okSources = feed.sources.filter((s) => s.ok).length;
  const [first, ...rest] = items.slice(0, visible);

  return (
    <div>
      {feed.mode === "demo" ? (
        <div className="mb-6 flex gap-3 rounded-2xl border border-line bg-surface px-4 py-3.5 text-[13.5px] leading-relaxed text-ink-2">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-ink-3" />
          <p>
            <strong className="font-semibold text-ink">Mode démonstration.</strong> Les flux en direct ne sont pas joignables depuis ce serveur ; voici des
            exemples éditoriaux résumant des événements réels et datés, avec leurs sources officielles. En production, le fil se met à jour
            automatiquement toutes les 30 minutes à partir de {feed.sources.length} sources.
          </p>
        </div>
      ) : null}

      <div className="z-20 -mx-4 mb-6 border-b border-line bg-page/85 px-4 pb-3 pt-2 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:sticky lg:top-16 lg:-mx-10 lg:px-10">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex items-center gap-2">
            <div role="tablist" aria-label="Portée du fil" className="inline-flex shrink-0 rounded-xl bg-surface-2 p-1">
              {(["tout", "pour-vous"] as Scope[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  role="tab"
                  aria-selected={scope === s}
                  onClick={() => {
                    setScope(s);
                    setVisible(PAGE_SIZE);
                  }}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors",
                    scope === s ? "bg-surface text-ink shadow-card" : "text-ink-3 hover:text-ink",
                  )}
                >
                  {s === "tout" ? "Tout" : "Pour vous"}
                </button>
              ))}
            </div>
            <div className="flex gap-1 overflow-x-auto scrollbar-none">
              {(["tous", "ia", "economie", "finance"] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => {
                    setDomain(d);
                    setTopic(null);
                    setVisible(PAGE_SIZE);
                  }}
                  aria-pressed={domain === d}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors",
                    domain === d ? "bg-ink text-page" : "text-ink-2 hover:bg-surface-2",
                  )}
                >
                  {d !== "tous" ? <DomainDot domain={d} /> : null}
                  {d === "tous" ? "Tous" : DOMAINS[d].short}
                </button>
              ))}
            </div>
          </div>
          <label className="relative flex-1 lg:max-w-xs lg:ml-auto">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" />
            <span className="sr-only">Filtrer les actualités</span>
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setVisible(PAGE_SIZE);
              }}
              placeholder="Filtrer par mot-clé…"
              className="h-9 w-full rounded-xl border border-line bg-surface pl-9 pr-8 text-[13.5px] outline-none placeholder:text-ink-3 focus:border-accent"
            />
            {query ? (
              <button type="button" onClick={() => setQuery("")} aria-label="Effacer" className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-ink-3 hover:text-ink">
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </label>
        </div>
        <div className="mt-2.5 flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
          {topicsInDomain.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setTopic(topic === t ? null : t);
                setVisible(PAGE_SIZE);
              }}
              aria-pressed={topic === t}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12.5px] font-medium transition-colors",
                topic === t ? "border-accent bg-accent-soft text-ink" : "border-line text-ink-3 hover:text-ink",
              )}
            >
              <DomainDot domain={TOPICS[t].domain} />
              {TOPICS[t].label}
            </button>
          ))}
        </div>
      </div>

      {scope === "pour-vous" && hydrated && interests.length === 0 ? (
        <p className="mb-4 text-[13px] text-ink-3">
          Vous ne suivez encore aucun thème : choisissez-les dans les <Link href="/parametres" className="text-accent-text underline">paramètres</Link> pour personnaliser ce fil.
        </p>
      ) : null}

      {items.length === 0 ? (
        <EmptyState icon={<Search className="h-6 w-6" />} title="Aucune actualité ne correspond" description="Essayez un autre thème ou retirez des filtres." />
      ) : (
        <>
          {first ? <NewsCard item={first} variant="feature" className="mb-2" /> : null}
          <div className="divide-y divide-line">
            {rest.map((item) => (
              <NewsCard key={item.id} item={item} variant="row" />
            ))}
          </div>
          {items.length > visible ? (
            <div className="mt-6 flex justify-center">
              <Button variant="outline" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                Afficher plus ({items.length - visible})
              </Button>
            </div>
          ) : null}
        </>
      )}

      <p className="mt-10 text-[12px] text-ink-3">
        Mis à jour le {formatDateTime(feed.fetchedAt)}
        {feed.mode === "live" ? ` · ${okSources}/${feed.sources.length} sources disponibles` : ""}. Les résumés proviennent des éditeurs ; chaque
        article renvoie vers sa source d&apos;origine.
      </p>
    </div>
  );
}
