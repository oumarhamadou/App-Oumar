"use client";

import { ArrowRight, Check, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button, buttonClass } from "@/components/ui/button";
import type { QuizQuestion } from "@/content/types";
import { useAppStore, useHydrated } from "@/lib/store";
import { Quiz } from "./quiz";

export function LessonCompletion({
  lessonKey,
  questions,
  next,
}: {
  lessonKey: string;
  questions: QuizQuestion[];
  next?: { href: string; title: string };
}) {
  const hydrated = useHydrated();
  const record = useAppStore((s) => s.progress[lessonKey]);
  const completeLesson = useAppStore((s) => s.completeLesson);
  const completed = hydrated && Boolean(record);

  return (
    <div className="space-y-5">
      <Quiz
        quizKey={`lecon:${lessonKey}`}
        questions={questions}
        title="Quiz de la leçon"
        onComplete={(score, total) => completeLesson(lessonKey, score, total)}
      />
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-surface-2 px-5 py-4">
        {completed ? (
          <p className="flex items-center gap-2 text-[14px] font-medium text-good-text">
            <CheckCircle2 className="h-5 w-5" /> Leçon terminée
            {record?.total ? <span className="font-normal text-ink-3">· quiz {record.score}/{record.total}</span> : null}
          </p>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-[13.5px] text-ink-2">Terminez le quiz pour valider la leçon, ou</p>
            <Button variant="outline" size="sm" onClick={() => completeLesson(lessonKey)}>
              <Check className="h-3.5 w-3.5" /> Marquer comme lue
            </Button>
          </div>
        )}
        {next ? (
          <Link href={next.href} className={buttonClass(completed ? "primary" : "ghost", "sm")}>
            Leçon suivante : {next.title} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        ) : completed ? (
          <Link href="/apprendre" className={buttonClass("primary", "sm")}>
            Parcours terminé · voir les autres <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        ) : null}
      </div>
    </div>
  );
}
