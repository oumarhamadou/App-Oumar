import { ArrowLeft, ArrowRight, Clock, PenLine, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Markdown } from "@/components/common/markdown";
import { SaveButton } from "@/components/common/save-button";
import { TrackVisit } from "@/components/common/track-visit";
import { LessonCompletion } from "@/components/learn/lesson-completion";
import { DomainDot } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/misc";
import { getConcept } from "@/content/concepts";
import { getLesson, learningPaths, lessonKey } from "@/content/learning-paths";

type Params = { params: Promise<{ path: string; lesson: string }> };

export function generateStaticParams() {
  return learningPaths.flatMap((p) => p.lessons.map((l) => ({ path: p.slug, lesson: l.slug })));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { path, lesson } = await params;
  const found = getLesson(path, lesson);
  return found ? { title: found.lesson.title, description: found.lesson.summary } : { title: "Leçon introuvable" };
}

export default function LessonPage({ params }: Params) {
  return (
    <Suspense fallback={<div className="mx-auto max-w-2xl space-y-4"><Skeleton className="h-10 w-2/3" /><Skeleton className="h-96 w-full" /></div>}>
      <LessonContent params={params} />
    </Suspense>
  );
}

async function LessonContent({ params }: Params) {
  const { path: pathSlug, lesson: lessonSlug } = await params;
  const found = getLesson(pathSlug, lessonSlug);
  if (!found) notFound();
  const { path, lesson, index } = found;
  const key = lessonKey(path.slug, lesson.slug);
  const nextLesson = path.lessons[index + 1];
  const previousLesson = path.lessons[index - 1];
  const concepts = lesson.concepts.map(getConcept).filter((c) => c !== undefined);
  const libraryItem = { key: `lecon:${key}`, kind: "lecon" as const, title: lesson.title, href: `/apprendre/${key}`, topics: path.topics, meta: path.title };

  return (
    <article className="mx-auto max-w-2xl">
      <TrackVisit item={libraryItem} />
      <Link href={`/apprendre/${path.slug}`} className="mb-6 inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-3 hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> {path.title}
      </Link>
      <p className="flex items-center gap-2 text-[12.5px] font-medium text-ink-3">
        <DomainDot domain={path.domain} /> Leçon {index + 1} sur {path.lessons.length}
        <span aria-hidden>·</span>
        <Clock className="h-3.5 w-3.5" /> {lesson.minutes} min
      </p>
      <h1 className="mt-3 text-[30px] font-semibold tracking-[-0.02em] sm:text-[36px]">{lesson.title}</h1>
      <p className="mt-3 text-[17px] leading-relaxed text-ink-2">{lesson.summary}</p>
      <div className="mt-4 flex flex-wrap items-center gap-2 border-b border-line pb-6">
        <SaveButton item={libraryItem} label />
        <ButtonLink href={`/assistant?q=${encodeURIComponent(`Je suis la leçon « ${lesson.title} ». Peux-tu me donner un exemple supplémentaire et vérifier ma compréhension ?`)}`} variant="secondary" size="sm">
          <Sparkles className="h-3.5 w-3.5" /> Réviser avec l&apos;assistant
        </ButtonLink>
      </div>

      <Markdown className="mt-6 text-[16px]">{lesson.body}</Markdown>

      <section className="mt-10 rounded-2xl border border-line bg-surface p-5 shadow-card sm:p-6">
        <h2 className="text-[15px] font-semibold">L&apos;essentiel</h2>
        <ul className="mt-3 space-y-2">
          {lesson.takeaways.map((t) => (
            <li key={t} className="flex gap-2.5 text-[14.5px] leading-relaxed text-ink-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
              {t}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-5 rounded-2xl bg-accent-soft p-5 sm:p-6">
        <h2 className="flex items-center gap-2 text-[15px] font-semibold">
          <PenLine className="h-4 w-4 text-accent-text" /> Exercice pratique
        </h2>
        <p className="mt-2 text-[14.5px] leading-relaxed text-ink">{lesson.exercise}</p>
      </section>

      {concepts.length > 0 ? (
        <p className="mt-5 text-[13.5px] text-ink-3">
          Pour approfondir :{" "}
          {concepts.map((c, i) => (
            <span key={c.slug}>
              {i > 0 ? ", " : ""}
              <Link href={`/savoir/${c.slug}`} className="font-medium text-accent-text hover:underline">
                {c.title}
              </Link>
            </span>
          ))}
        </p>
      ) : null}

      <div className="mt-10">
        <LessonCompletion
          lessonKey={key}
          questions={lesson.quiz}
          next={nextLesson ? { href: `/apprendre/${path.slug}/${nextLesson.slug}`, title: nextLesson.title } : undefined}
        />
      </div>

      {previousLesson ? (
        <Link href={`/apprendre/${path.slug}/${previousLesson.slug}`} className="mt-6 inline-flex items-center gap-1.5 text-[13px] text-ink-3 hover:text-ink">
          <ArrowLeft className="h-3.5 w-3.5" /> Leçon précédente : {previousLesson.title}
        </Link>
      ) : null}
      {!nextLesson ? (
        <Link href="/apprendre" className="ml-4 mt-6 inline-flex items-center gap-1.5 text-[13px] text-ink-3 hover:text-ink">
          Tous les parcours <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      ) : null}
    </article>
  );
}
