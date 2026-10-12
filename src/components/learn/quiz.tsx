"use client";

import { Check, RotateCcw, Trophy, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/misc";
import type { QuizQuestion } from "@/content/types";
import { cn } from "@/lib/cn";
import { useAppStore, useHydrated } from "@/lib/store";

/**
 * One question at a time with immediate feedback and explanation.
 * Results are saved under `quizKey`; `onComplete` lets lessons mark progress.
 */
export function Quiz({
  quizKey,
  questions,
  title = "Testez vos connaissances",
  onComplete,
}: {
  quizKey: string;
  questions: QuizQuestion[];
  title?: string;
  onComplete?: (score: number, total: number) => void;
}) {
  const hydrated = useHydrated();
  const previous = useAppStore((s) => s.quizzes[quizKey]);
  const saveQuiz = useAppStore((s) => s.saveQuiz);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const finished = answers.length === questions.length;
  const score = answers.filter(Boolean).length;
  const question = questions[index];

  const validate = (option: number) => {
    if (selected !== null) return;
    setSelected(option);
    const next = [...answers, option === question.answer];
    setAnswers(next);
    if (next.length === questions.length) {
      const total = questions.length;
      const finalScore = next.filter(Boolean).length;
      saveQuiz(quizKey, finalScore, total);
      onComplete?.(finalScore, total);
    }
  };

  const restart = () => {
    setIndex(0);
    setSelected(null);
    setAnswers([]);
  };

  return (
    <section className="rounded-2xl border border-line bg-surface p-5 shadow-card sm:p-6" aria-label={title}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-[16px] font-semibold tracking-tight">{title}</h2>
        {hydrated && previous && !finished ? (
          <span className="text-[12px] text-ink-3">
            Dernier score : {previous.score}/{previous.total}
          </span>
        ) : null}
      </div>

      {finished ? (
        <div className="py-4 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent-text">
            <Trophy className="h-6 w-6" />
          </span>
          <p className="mt-3 text-[22px] font-semibold tracking-tight">
            {score} / {questions.length}
          </p>
          <p className="mt-1 text-[14px] text-ink-2">
            {score === questions.length
              ? "Parfait ! Vous maîtrisez ces notions."
              : score >= questions.length / 2
                ? "Bien joué. Relisez les explications des questions manquées."
                : "Pas encore acquis : relisez la fiche puis réessayez."}
          </p>
          <Button variant="outline" size="sm" className="mt-4" onClick={restart}>
            <RotateCcw className="h-3.5 w-3.5" /> Recommencer
          </Button>
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-center gap-3">
            <ProgressBar value={(answers.length / questions.length) * 100} label="Avancement du quiz" />
            <span className="shrink-0 text-[12px] tabular-nums text-ink-3">
              {index + 1}/{questions.length}
            </span>
          </div>
          <p className="text-[15px] font-medium leading-snug">{question.question}</p>
          <ul className="mt-4 space-y-2">
            {question.options.map((option, i) => {
              const isAnswer = i === question.answer;
              const isChosen = i === selected;
              const revealed = selected !== null;
              return (
                <li key={option}>
                  <button
                    type="button"
                    onClick={() => validate(i)}
                    disabled={revealed}
                    aria-pressed={isChosen}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-[14px] transition-colors",
                      !revealed && "border-line hover:border-line-strong hover:bg-surface-2",
                      revealed && isAnswer && "border-good/60 bg-good/10",
                      revealed && isChosen && !isAnswer && "border-critical/60 bg-critical/10",
                      revealed && !isAnswer && !isChosen && "border-line opacity-60",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[12px] font-semibold",
                        revealed && isAnswer ? "border-good bg-good text-white" : revealed && isChosen ? "border-critical bg-critical text-white" : "border-line-strong text-ink-3",
                      )}
                    >
                      {revealed && isAnswer ? <Check className="h-3.5 w-3.5" /> : revealed && isChosen ? <X className="h-3.5 w-3.5" /> : String.fromCharCode(65 + i)}
                    </span>
                    {option}
                  </button>
                </li>
              );
            })}
          </ul>
          {selected !== null ? (
            <div className="animate-rise mt-4" role="status">
              <p className={cn("text-[13.5px] font-semibold", selected === question.answer ? "text-good-text" : "text-critical-text")}>
                {selected === question.answer ? "Bonne réponse" : "Pas tout à fait"}
              </p>
              <p className="mt-1 text-[13.5px] leading-relaxed text-ink-2">{question.explanation}</p>
              {index < questions.length - 1 ? (
                <Button
                  size="sm"
                  className="mt-4"
                  onClick={() => {
                    setIndex(index + 1);
                    setSelected(null);
                  }}
                >
                  Question suivante
                </Button>
              ) : null}
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}
