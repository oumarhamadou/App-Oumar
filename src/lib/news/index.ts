import { cacheLife } from "next/cache";
import { hashId, normalize, truncate } from "@/lib/text";
import { classifyTopics } from "./classify";
import { genericContext } from "./context";
import { DEMO_NEWS } from "./demo";
import { FEEDS, type FeedConfig } from "./feeds";
import { parseFeed, type RawFeedItem } from "./rss";
import type { NewsFeedResult, NewsItem } from "./types";

export type { NewsItem, NewsFeedResult } from "./types";

const FETCH_TIMEOUT_MS = 6000;
const MAX_ITEMS = 80;
const MAX_PER_FEED = 15;

async function fetchFeed(feed: FeedConfig): Promise<RawFeedItem[]> {
  const response = await fetch(feed.url, {
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    headers: {
      "User-Agent": "Prisme/1.0 (+news aggregation; contact via site)",
      Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml;q=0.9, */*;q=0.5",
    },
  });
  if (!response.ok) throw new Error(`${feed.id}: HTTP ${response.status}`);
  return parseFeed(await response.text()).slice(0, MAX_PER_FEED);
}

/** Google News appends " - Publisher" to titles; split it out. */
function splitPublisher(title: string, publisher?: string): { title: string; publisher?: string } {
  if (publisher && title.endsWith(` - ${publisher}`)) {
    return { title: title.slice(0, -(publisher.length + 3)).trim(), publisher };
  }
  return { title, publisher };
}

function isNearDuplicate(summary: string, title: string): boolean {
  const s = normalize(summary).replace(/[^a-z0-9]/g, "");
  const t = normalize(title).replace(/[^a-z0-9]/g, "");
  return s.length === 0 || s.startsWith(t) || t.startsWith(s);
}

export function toNewsItem(raw: RawFeedItem, feed: FeedConfig, fallbackDate: string): NewsItem {
  const { title, publisher } = splitPublisher(raw.title, raw.publisher);
  const summary = isNearDuplicate(raw.description, title) ? "" : truncate(raw.description, 420);
  const topics = classifyTopics(title, raw.description, feed.defaultTopics);
  const context = genericContext(topics);
  return {
    id: hashId(raw.link),
    title,
    summary,
    url: raw.link,
    source: { name: publisher ?? feed.name, url: feed.homepage },
    publishedAt: raw.publishedAt ?? fallbackDate,
    topics,
    lang: feed.lang,
    image: raw.image,
    relatedConcepts: context.concepts,
  };
}

function dedupe(items: NewsItem[]): NewsItem[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = normalize(item.title).replace(/[^a-z0-9]/g, "").slice(0, 80);
    if (seen.has(item.id) || seen.has(key)) return false;
    seen.add(item.id);
    seen.add(key);
    return true;
  });
}

/**
 * Aggregated news feed, cached and refreshed in the background every 30
 * minutes. Falls back to editorial examples when no feed is reachable.
 */
export async function getNews(): Promise<NewsFeedResult> {
  "use cache";
  cacheLife({ stale: 300, revalidate: 1800, expire: 86400 });

  const fetchedAt = new Date().toISOString();
  const results = await Promise.allSettled(FEEDS.map(fetchFeed));
  const sources = FEEDS.map((feed, i) => ({ name: feed.name, ok: results[i].status === "fulfilled" }));

  const live: NewsItem[] = [];
  results.forEach((result, i) => {
    if (result.status === "fulfilled") {
      for (const raw of result.value) live.push(toNewsItem(raw, FEEDS[i], fetchedAt));
    }
  });

  if (live.length === 0) {
    return { items: DEMO_NEWS, mode: "demo", fetchedAt, sources };
  }

  const items = dedupe(live)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, MAX_ITEMS);
  return { items, mode: "live", fetchedAt, sources };
}

export async function getNewsItem(id: string): Promise<NewsItem | undefined> {
  const { items } = await getNews();
  return items.find((item) => item.id === id) ?? DEMO_NEWS.find((item) => item.id === id);
}
