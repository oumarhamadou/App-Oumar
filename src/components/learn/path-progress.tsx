"use client";

import { ArrowRight, Check, CircleDashed, Flame, Target, Trophy } from "lucide-react";
import Link from "next/link";
import { buttonClass } from "@/components/ui/button";
import { DomainDot } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/misc";
import { learningPaths, lessonKey, totalLessons } from "@/content/learning-paths";
import type { LearningPath } from "@/content/types";
import { useNow } from "@/hooks/use-now";
import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/format";
import { useAppStore, useHydrated, type LessonProgress } from "@/lib/store";
import { GOALS, LEVELS } from "@/lib/taxonomy";

/** Consecutive days (ending today or yesterday) with at least one completed lesson. */
export function learningStreak(progress: Record<string, LessonProgress>, now: number): number {
  const days = new Set(Object.values(progress).map((p) => p.completedAt.slice(0, 10)));
  let streak = 0;
  const cursor = new Date(now);
  if (!days.has(cursor.toISOString().slice(0, 10))) cursor.setUTCDate(cursor.getUTCDate() - 1);
  while (days.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return streak;
}

export function LearningStats() {
  const hydrated = useHydrated();
  const now = useNow();
  const progress = useAppStore((s) => s.progress);
  const quizzes = useAppStore((s) => s.quizzes);
  const done = hydrated ? Object.keys(progress).length : 0;
  const results = hydrated ? Object.values(quizzes) : [];
  const avg = results.length ? (results.reduce((s, q) => s + q.score / q.total, 0) / results.length) * 100 : null;
  const streak = hydrated && now ? learningStreak(progress, now) : 0;
  const stats = [
    { icon: Target, label: "Leçons terminées", value: `${done} / ${totalLessons}` },
    { icon: Trophy, label: "Réussite moyenne aux quiz", value: avg === null ? "—" : `${formatNumber(avg)} %` },
    { icon: Flame, label: "Série en cours", value: `${streak} jour${streak > 1 ? "s" : ""}` },
  ];
  return (
    <div className="mb-10 grid gap-3 sm:grid-cols-3">
      {stats.map((s) => (
        <div key={s.label} className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-5 shadow-card">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent-text">
            <s.icon className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-[12.5px] text-ink-3">{s.label}</span>
            <span className="block text-[22px] font-semibold tracking-tight">{s.value}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

function usePathProgress(path: LearningPath) {
  const hydrated = useHydrated();
  const progress = useAppStore((s) => s.progress);
  const doneKeys = hydrated ? path.lessons.filter((l) => progress[lessonKey(path.slug, l.slug)]).map((l) => l.slug) : [];
  const next = path.lessons.find((l) => !doneKeys.includes(l.slug));
  return { done: doneKeys, next, ratio: doneKeys.length / path.lessons.length };
}

export function PathCard({ path }: { path: LearningPath }) {
  const { done, next, ratio } = usePathProgress(path);
  const level = useAppStore((s) => s.profile.level);
  const interests = useAppStore((s) => s.profile.interests);
  const goals = useAppStore((s) => s.profile.goals);
  const hydrated = useHydrated();
  const recommended =
    hydrated &&
    (goals.some((g) => GOALS[g].paths.includes(path.slug)) ||
      (path.level === level && (interests.length === 0 || path.topics.some((t) => interests.includes(t)))));
  const minutes = path.lessons.reduce((s, l) => s + l.minutes, 0);
  return (
    <article className={cn("flex flex-col rounded-2xl border bg-surface p-6 shadow-card", recommended ? "border-accent/50" : "border-line")}>
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-2 text-[12.5px] font-medium text-ink-3">
          <DomainDot domain={path.domain} /> {LEVELS[path.level].label} · {path.lessons.length} leçons · {minutes} min
        </span>
        {recommended ? <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[11.5px] font-medium text-accent-text">Recommandé</span> : null}
      </div>
      <h3 className="mt-3 text-[19px] font-semibold tracking-tight">{path.title}</h3>
      <p className="mt-2 text-[14px] leading-relaxed text-ink-2">{path.description}</p>
      <ul className="mt-4 space-y-1.5">
        {path.outcomes.map((o) => (
          <li key={o} className="flex gap-2 text-[13.5px] text-ink-2">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-domain-fin" /> {o}
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-6">
        <div className="mb-3 flex items-center gap-3">
          <ProgressBar value={ratio * 100} label={`Progression : ${path.title}`} />
          <span className="shrink-0 text-[12px] tabular-nums text-ink-3">
            {done.length}/{path.lessons.length}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={next ? `/apprendre/${path.slug}/${next.slug}` : `/apprendre/${path.slug}`} className={buttonClass("primary", "sm")}>
            {done.length === 0 ? "Commencer" : next ? "Continuer" : "Revoir"} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link href={`/apprendre/${path.slug}`} className={buttonClass("ghost", "sm")}>
            Programme
          </Link>
        </div>
      </div>
    </article>
  );
}

export function LessonList({ pathSlug }: { pathSlug: string }) {
  const path = learningPaths.find((p) => p.slug === pathSlug)!;
  const { done, next } = usePathProgress(path);
  const progress = useAppStore((s) => s.progress);
  return (
    <ol className="space-y-3">
      {path.lessons.map((lesson, i) => {
        const completed = done.includes(lesson.slug);
        const current = next?.slug === lesson.slug;
        const record = progress[lessonKey(path.slug, lesson.slug)];
        return (
          <li key={lesson.slug}>
            <Link
              href={`/apprendre/${path.slug}/${lesson.slug}`}
              className={cn(
                "flex items-center gap-4 rounded-2xl border bg-surface p-4 shadow-card transition-shadow hover:shadow-pop sm:p-5",
                current ? "border-accent/50" : "border-line",
              )}
            >
              <span
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[14px] font-semibold",
                  completed ? "bg-good text-white" : current ? "bg-accent text-accent-ink" : "bg-surface-2 text-ink-3",
                )}
              >
                {completed ? <Check className="h-5 w-5" /> : i + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-semibold">{lesson.title}</span>
                <span className="mt-0.5 block text-[13px] text-ink-3">{lesson.summary}</span>
              </span>
              <span className="hidden shrink-0 text-right text-[12.5px] text-ink-3 sm:block">
                {lesson.minutes} min
                {record?.total ? (
                  <span className="block">
                    Quiz {record.score}/{record.total}
                  </span>
                ) : current ? (
                  <span className="block font-medium text-accent-text">À suivre</span>
                ) : !completed ? (
                  <CircleDashed className="ml-auto mt-1 h-3.5 w-3.5" />
                ) : null}
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
