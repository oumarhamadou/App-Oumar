import { concepts } from "@/content/concepts";
import { learningPaths, lessonKey } from "@/content/learning-paths";
import type { NewsItem } from "@/lib/news/types";
import type { HistoryEntry, LessonProgress } from "@/lib/store";
import type { Level, Topic } from "@/lib/taxonomy";

export interface Recommendation {
  key: string;
  kind: "concept" | "lecon" | "actualite";
  title: string;
  description: string;
  href: string;
  reason: string;
  score: number;
}

interface Signals {
  interests: Topic[];
  level: Level;
  history: HistoryEntry[];
  progress: Record<string, LessonProgress>;
}

const LEVEL_ORDER: Level[] = ["debutant", "intermediaire", "avance"];

/** Topic affinity: declared interests weigh more than recent browsing. */
export function topicWeights({ interests, history }: Pick<Signals, "interests" | "history">): Map<Topic, number> {
  const weights = new Map<Topic, number>();
  for (const topic of interests) weights.set(topic, (weights.get(topic) ?? 0) + 3);
  history.slice(0, 20).forEach((entry, index) => {
    const recency = 1 - index / 25;
    for (const topic of entry.topics ?? []) weights.set(topic, (weights.get(topic) ?? 0) + recency);
  });
  return weights;
}

function affinity(topics: Topic[], weights: Map<Topic, number>): number {
  return topics.reduce((sum, topic) => sum + (weights.get(topic) ?? 0), 0);
}

function reasonFor(topics: Topic[], interests: Topic[]): string {
  return topics.some((t) => interests.includes(t)) ? "Correspond à vos centres d'intérêt" : "Dans la lignée de vos lectures";
}

/** Next lesson to take in each path the user started, or the first lesson of matching paths. */
export function nextLessons(signals: Signals, limit = 3): Recommendation[] {
  const weights = topicWeights(signals);
  const levelIndex = LEVEL_ORDER.indexOf(signals.level);
  const recs: Recommendation[] = [];
  for (const path of learningPaths) {
    const done = path.lessons.filter((l) => signals.progress[lessonKey(path.slug, l.slug)]);
    const next = path.lessons.find((l) => !signals.progress[lessonKey(path.slug, l.slug)]);
    if (!next) continue;
    const started = done.length > 0;
    const levelGap = Math.abs(LEVEL_ORDER.indexOf(path.level) - levelIndex);
    const score = (started ? 10 : 0) + affinity(path.topics, weights) - levelGap;
    recs.push({
      key: `lecon:${path.slug}/${next.slug}`,
      kind: "lecon",
      title: next.title,
      description: `${path.title} · ${next.minutes} min`,
      href: `/apprendre/${path.slug}/${next.slug}`,
      reason: started ? `Suite du parcours (${done.length}/${path.lessons.length})` : reasonFor(path.topics, signals.interests),
      score,
    });
  }
  return recs.sort((a, b) => b.score - a.score).slice(0, limit);
}

export function recommendConcepts(signals: Signals, limit = 3): Recommendation[] {
  const weights = topicWeights(signals);
  const seen = new Set(signals.history.map((h) => h.key));
  return concepts
    .filter((c) => !seen.has(`concept:${c.slug}`))
    .map((c) => ({
      key: `concept:${c.slug}`,
      kind: "concept" as const,
      title: c.title,
      description: c.tagline,
      href: `/savoir/${c.slug}`,
      reason: reasonFor(c.topics, signals.interests),
      score: affinity(c.topics, weights),
    }))
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, limit);
}

/** Rank news by topic affinity, with a freshness bonus. */
export function rankNews(items: NewsItem[], signals: Pick<Signals, "interests" | "history">, now: number): NewsItem[] {
  const weights = topicWeights(signals);
  const hasSignals = weights.size > 0;
  return [...items]
    .map((item) => {
      const ageDays = Math.max(0, (now - new Date(item.publishedAt).getTime()) / 86_400_000);
      const freshness = 2 / (1 + ageDays);
      return { item, score: (hasSignals ? affinity(item.topics, weights) : 0) + freshness };
    })
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item);
}

export function matchesInterests(item: NewsItem, interests: Topic[]): boolean {
  return interests.length === 0 || item.topics.some((t) => interests.includes(t));
}
