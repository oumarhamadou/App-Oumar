"use client";

import { ArrowRight, Info } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { NewsCard } from "@/components/news/news-card";
import { useNow } from "@/hooks/use-now";
import type { NewsFeedResult } from "@/lib/news/types";
import { rankNews } from "@/lib/recommend";
import { useAppStore } from "@/lib/store";
import { Widget } from "./widget-shell";

export function NewsWidget({ news, editing, hydrated }: { news: NewsFeedResult; editing: boolean; hydrated: boolean }) {
  const interests = useAppStore((s) => s.profile.interests);
  const history = useAppStore((s) => s.history);
  const now = useNow();
  const ranked = useMemo(
    () => (hydrated && now ? rankNews(news.items, { interests, history }, now) : news.items),
    [hydrated, now, news.items, interests, history],
  );
  const [feature, ...rest] = ranked;
  return (
    <Widget
      id="une"
      editing={editing}
      description={interests.length > 0 && hydrated ? "Classé selon vos centres d'intérêt et vos lectures" : "Les dernières actualités IA, économie et finance"}
      action={
        <Link href="/actualites" className="inline-flex items-center gap-1 text-[13px] font-medium text-accent-text hover:underline">
          Tout le fil <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      }
    >
      {news.mode === "demo" ? (
        <p className="mb-4 flex items-start gap-2 rounded-xl bg-surface-2 px-3 py-2 text-[12.5px] text-ink-2">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          Flux en direct indisponibles : affichage d&apos;exemples éditoriaux fondés sur des événements réels et datés.
        </p>
      ) : null}
      {feature ? (
        <div className="grid gap-5 md:grid-cols-[1.15fr_1fr] md:items-start">
          <NewsCard item={feature} variant="feature" />
          <div className="divide-y divide-line">
            {rest.slice(0, 3).map((item) => (
              <NewsCard key={item.id} item={item} variant="row" showImage={false} className="first:pt-0" />
            ))}
          </div>
        </div>
      ) : null}
    </Widget>
  );
}
