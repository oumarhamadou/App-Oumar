"use client";

import { ArrowRight, Check, Target } from "lucide-react";
import Link from "next/link";
import { buttonClass } from "@/components/ui/button";
import { DomainDot } from "@/components/ui/badge";
import { ProgressBar, Skeleton } from "@/components/ui/misc";
import { learningPaths, lessonKey } from "@/content/learning-paths";
import { useAppStore, useHydrated } from "@/lib/store";
import { GOALS } from "@/lib/taxonomy";

/** Ordered program built from the user's goals: one step per path, with progress. */
export function GoalProgram() {
  const hydrated = useHydrated();
  const goals = useAppStore((s) => s.profile.goals);
  const progress = useAppStore((s) => s.progress);

  if (!hydrated) return <Skeleton className="mb-10 h-40 w-full" />;

  if (goals.length === 0) {
    return (
      <div className="mb-10 flex flex-wrap items-center gap-4 rounded-2xl border border-dashed border-line-strong px-5 py-4">
        <Target className="h-5 w-5 shrink-0 text-ink-3" />
        <p className="min-w-0 flex-1 text-[14px] text-ink-2">Indiquez vos objectifs pour obtenir un programme d&apos;apprentissage sur mesure.</p>
        <Link href="/parametres#objectifs" className={buttonClass("outline", "sm")}>
          Choisir mes objectifs
        </Link>
      </div>
    );
  }

  const slugs = [...new Set(goals.flatMap((g) => GOALS[g].paths))];
  const steps = slugs.map((slug) => learningPaths.find((p) => p.slug === slug)).filter((p) => p !== undefined);

  return (
    <section className="mb-10 rounded-2xl border border-line bg-surface p-5 shadow-card sm:p-6" aria-labelledby="programme">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="programme" className="flex items-center gap-2 text-[17px] font-semibold tracking-tight">
            <Target className="h-5 w-5 text-accent-text" /> Votre programme
          </h2>
          <p className="mt-1 text-[13px] text-ink-3">{goals.map((g) => GOALS[g].label).join(" · ")}</p>
        </div>
        <Link href="/parametres#objectifs" className="text-[13px] font-medium text-accent-text hover:underline">
          Modifier mes objectifs
        </Link>
      </div>
      <ol className="space-y-3">
        {steps.map((path, index) => {
          const done = path.lessons.filter((l) => progress[lessonKey(path.slug, l.slug)]).length;
          const next = path.lessons.find((l) => !progress[lessonKey(path.slug, l.slug)]);
          const complete = done === path.lessons.length;
          return (
            <li key={path.slug} className="flex items-center gap-4 rounded-xl bg-surface-2 p-4">
              <span
                className={
                  complete
                    ? "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-good text-white"
                    : "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface text-[13px] font-semibold text-ink"
                }
              >
                {complete ? <Check className="h-4 w-4" /> : index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 text-[14.5px] font-semibold">
                  <DomainDot domain={path.domain} /> {path.title}
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <ProgressBar value={(done / path.lessons.length) * 100} label={`Progression : ${path.title}`} />
                  <span className="shrink-0 text-[12px] tabular-nums text-ink-3">
                    {done}/{path.lessons.length}
                  </span>
                </div>
              </div>
              <Link
                href={next ? `/apprendre/${path.slug}/${next.slug}` : `/apprendre/${path.slug}`}
                className={buttonClass(complete ? "ghost" : "primary", "sm", "hidden shrink-0 sm:inline-flex")}
              >
                {complete ? "Revoir" : done > 0 ? "Continuer" : "Commencer"} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href={next ? `/apprendre/${path.slug}/${next.slug}` : `/apprendre/${path.slug}`}
                aria-label={`${complete ? "Revoir" : "Continuer"} : ${path.title}`}
                className="shrink-0 rounded-lg p-2 text-ink-2 hover:bg-surface sm:hidden"
              >
                <ArrowRight className="h-4 w-4" />
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
