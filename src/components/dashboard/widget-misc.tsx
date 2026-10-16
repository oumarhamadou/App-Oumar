"use client";

import { ArrowRight, BookOpen, Bookmark, GraduationCap, Lightbulb, Sparkles } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { DomainDot } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/misc";
import { aiTools, aiTrends } from "@/content/ai-space";
import { concepts } from "@/content/concepts";
import { learningPaths, lessonKey, totalLessons } from "@/content/learning-paths";
import { useNow } from "@/hooks/use-now";
import { formatNumber } from "@/lib/format";
import { nextLessons, recommendConcepts } from "@/lib/recommend";
import { useAppStore } from "@/lib/store";
import { Widget } from "./widget-shell";

export function ProgressWidget({ editing }: { editing: boolean }) {
  const progress = useAppStore((s) => s.progress);
  const quizzes = useAppStore((s) => s.quizzes);
  const profile = useAppStore((s) => s.profile);
  const history = useAppStore((s) => s.history);
  const done = Object.keys(progress).length;
  const scored = Object.values(progress).filter((p) => p.total);
  const quizList = [...scored.map((p) => ({ score: p.score ?? 0, total: p.total ?? 0 })), ...Object.values(quizzes)];
  const avg = quizList.length > 0 ? (quizList.reduce((s, q) => s + q.score / q.total, 0) / quizList.length) * 100 : null;
  const next = nextLessons({ interests: profile.interests, goals: profile.goals, level: profile.level, history, progress }, 1)[0];

  return (
    <Widget id="progression" editing={editing} icon={<GraduationCap className="h-4 w-4" />}>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-surface-2 p-3.5">
          <p className="text-[12px] text-ink-3">Leçons terminées</p>
          <p className="mt-1 text-[24px] font-semibold tracking-tight">
            {done}
            <span className="text-[14px] font-medium text-ink-3"> / {totalLessons}</span>
          </p>
        </div>
        <div className="rounded-xl bg-surface-2 p-3.5">
          <p className="text-[12px] text-ink-3">Réussite aux quiz</p>
          <p className="mt-1 text-[24px] font-semibold tracking-tight">{avg === null ? "—" : `${formatNumber(avg)} %`}</p>
        </div>
      </div>
      <ul className="mt-4 space-y-3">
        {learningPaths.map((path) => {
          const count = path.lessons.filter((l) => progress[lessonKey(path.slug, l.slug)]).length;
          return (
            <li key={path.slug}>
              <Link href={`/apprendre/${path.slug}`} className="group block">
                <div className="mb-1.5 flex items-center justify-between gap-2 text-[13px]">
                  <span className="flex min-w-0 items-center gap-2 font-medium text-ink group-hover:underline">
                    <DomainDot domain={path.domain} />
                    <span className="truncate">{path.title}</span>
                  </span>
                  <span className="shrink-0 tabular-nums text-ink-3">
                    {count}/{path.lessons.length}
                  </span>
                </div>
                <ProgressBar value={(count / path.lessons.length) * 100} label={`Progression : ${path.title}`} />
              </Link>
            </li>
          );
        })}
      </ul>
      {next ? (
        <Link href={next.href} className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-line px-3.5 py-3 transition-colors hover:bg-surface-2">
          <span className="min-w-0">
            <span className="block text-[11.5px] font-medium uppercase tracking-wide text-ink-3">{done > 0 ? "Continuer" : "Commencer"}</span>
            <span className="block truncate text-[13.5px] font-medium text-ink">{next.title}</span>
          </span>
          <ArrowRight className="h-4 w-4 shrink-0 text-ink-3" />
        </Link>
      ) : null}
    </Widget>
  );
}

export function RecommendationsWidget({ editing }: { editing: boolean }) {
  const profile = useAppStore((s) => s.profile);
  const history = useAppStore((s) => s.history);
  const progress = useAppStore((s) => s.progress);
  const recs = useMemo(() => {
    const signals = { interests: profile.interests, goals: profile.goals, level: profile.level, history, progress };
    const lessons = nextLessons(signals, 2);
    const conceptRecs = recommendConcepts(signals, 3);
    return [lessons[0], conceptRecs[0], lessons[1], conceptRecs[1], conceptRecs[2]].filter(Boolean).slice(0, 4);
  }, [profile.interests, profile.goals, profile.level, history, progress]);

  return (
    <Widget id="recommandations" editing={editing} icon={<Sparkles className="h-4 w-4" />} description="Selon vos objectifs, vos intérêts, votre niveau et votre historique">
      <ul className="space-y-1">
        {recs.map((r) => (
          <li key={r.key}>
            <Link href={r.href} className="group flex items-start gap-3 rounded-xl px-2 py-2.5 -mx-2 transition-colors hover:bg-surface-2">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-ink-2 group-hover:bg-surface">
                {r.kind === "lecon" ? <GraduationCap className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
              </span>
              <span className="min-w-0">
                <span className="block text-[14px] font-medium text-ink">{r.title}</span>
                <span className="block truncate text-[12.5px] text-ink-3">{r.description}</span>
                <span className="mt-0.5 block text-[11.5px] text-accent-text">{r.reason}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Widget>
  );
}

export function AiTrendsWidget({ editing }: { editing: boolean }) {
  const now = useNow();
  const day = now ? Math.floor(now / 86_400_000) : 0;
  const trends = [aiTrends[day % aiTrends.length], aiTrends[(day + 1) % aiTrends.length]];
  const tool = aiTools[day % aiTools.length];
  return (
    <Widget
      id="ia"
      editing={editing}
      icon={<Sparkles className="h-4 w-4" />}
      action={
        <Link href="/ia" className="inline-flex items-center gap-1 text-[13px] font-medium text-accent-text hover:underline">
          Espace IA <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      }
    >
      <ul className="space-y-4">
        {trends.map((t) => (
          <li key={t.id}>
            <p className="text-[14px] font-medium text-ink">{t.title}</p>
            <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-ink-2">{t.summary}</p>
          </li>
        ))}
      </ul>
      <Link href={`/ia#outil-${tool.id}`} className="mt-4 flex items-center gap-3 rounded-xl border border-line px-3.5 py-3 transition-colors hover:bg-surface-2">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-[13px] font-semibold text-accent-text">
          {tool.name[0]}
        </span>
        <span className="min-w-0">
          <span className="block text-[11.5px] font-medium uppercase tracking-wide text-ink-3">Outil à découvrir</span>
          <span className="block truncate text-[13.5px] font-medium text-ink">
            {tool.name} — {tool.useCases[0]}
          </span>
        </span>
      </Link>
    </Widget>
  );
}

export function ConceptWidget({ editing }: { editing: boolean }) {
  const now = useNow();
  const concept = concepts[(now ? Math.floor(now / 86_400_000) : 0) % concepts.length];
  return (
    <Widget id="concept" editing={editing} icon={<Lightbulb className="h-4 w-4" />}>
      <div className="flex items-center gap-2">
        <DomainDot domain={concept.domain} />
        <p className="text-[18px] font-semibold tracking-tight text-ink">{concept.title}</p>
      </div>
      <p className="mt-2 text-[14px] leading-relaxed text-ink-2">{concept.tagline}</p>
      <div className="mt-4 rounded-xl bg-surface-2 p-3.5">
        <p className="text-[12px] font-medium text-ink-3">Exemple · {concept.example.title}</p>
        <p className="mt-1 line-clamp-3 text-[13px] leading-relaxed text-ink-2">{concept.example.body}</p>
      </div>
      <Link href={`/savoir/${concept.slug}`} className="mt-4 inline-flex items-center gap-1 text-[13px] font-medium text-accent-text hover:underline">
        Comprendre en détail <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </Widget>
  );
}

export function ReadingWidget({ editing }: { editing: boolean }) {
  const saved = useAppStore((s) => s.saved);
  const lists = useAppStore((s) => s.lists);
  return (
    <Widget
      id="lecture"
      editing={editing}
      icon={<Bookmark className="h-4 w-4" />}
      description={`${saved.length} favori${saved.length > 1 ? "s" : ""} · ${lists.length} liste${lists.length > 1 ? "s" : ""}`}
      action={
        <Link href="/bibliotheque" className="inline-flex items-center gap-1 text-[13px] font-medium text-accent-text hover:underline">
          Bibliothèque <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      }
    >
      {saved.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line-strong px-4 py-6 text-center">
          <Bookmark className="mx-auto mb-2 h-5 w-5 text-ink-3" />
          <p className="text-[13.5px] font-medium">Rien d&apos;enregistré pour l&apos;instant</p>
          <p className="mt-1 text-[12.5px] text-ink-3">Utilisez l&apos;icône de signet sur un article, un concept ou une leçon.</p>
        </div>
      ) : (
        <ul className="divide-y divide-line">
          {saved.slice(0, 4).map((item) => (
            <li key={item.key}>
              <Link href={item.href} className="block py-2.5 hover:underline">
                <span className="block truncate text-[13.5px] font-medium text-ink">{item.title}</span>
                {item.meta ? <span className="block truncate text-[12px] text-ink-3">{item.meta}</span> : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Widget>
  );
}
