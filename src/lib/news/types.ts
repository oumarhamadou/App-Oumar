import type { Topic } from "@/lib/taxonomy";

export interface NewsSource {
  name: string;
  url: string;
}

export interface NewsItem {
  id: string;
  title: string;
  /** Plain-text summary. */
  summary: string;
  /** Why this matters in the real world. */
  whyItMatters?: string;
  keyPoints?: string[];
  url: string;
  source: NewsSource;
  /** ISO 8601 date. */
  publishedAt: string;
  topics: Topic[];
  lang: "fr" | "en";
  image?: string;
  /** Concept slugs from the knowledge center. */
  relatedConcepts?: string[];
  /** Editorial example used when live feeds are unreachable. */
  isDemo?: boolean;
}

export interface NewsFeedResult {
  items: NewsItem[];
  /** "live" when at least one feed answered, "demo" otherwise. */
  mode: "live" | "demo";
  fetchedAt: string;
  sources: { name: string; ok: boolean }[];
}
