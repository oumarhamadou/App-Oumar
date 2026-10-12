"use client";

import { useEffect, useState } from "react";
import type { NewsFeedResult } from "@/lib/news/types";

let cache: { at: number; data: NewsFeedResult } | null = null;
let inflight: Promise<NewsFeedResult> | null = null;
const TTL_MS = 5 * 60_000;

export function loadNews(): Promise<NewsFeedResult> {
  if (cache && Date.now() - cache.at < TTL_MS) return Promise.resolve(cache.data);
  inflight ??= fetch("/api/news")
    .then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json() as Promise<NewsFeedResult>;
    })
    .then((data) => {
      cache = { at: Date.now(), data };
      return data;
    })
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

/** Client-side access to the aggregated feed (shared, memoized). */
export function useNews(enabled = true): NewsFeedResult | null {
  const [data, setData] = useState<NewsFeedResult | null>(cache?.data ?? null);
  useEffect(() => {
    if (!enabled) return;
    let active = true;
    loadNews()
      .then((result) => active && setData(result))
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [enabled]);
  return data;
}
