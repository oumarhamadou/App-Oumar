import { ArrowLeft, Check } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { LessonList } from "@/components/learn/path-progress";
import { DomainBadge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/misc";
import { learningPaths, pathBySlug } from "@/content/learning-paths";
import { LEVELS } from "@/lib/taxonomy";

type Params = { params: Promise<{ path: string }> };

export function generateStaticParams() {
  return learningPaths.map((p) => ({ path: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const path = pathBySlug.get((await params).path);
  return path ? { title: path.title, description: path.description } : { title: "Parcours introuvable" };
}

export default function PathPage({ params }: Params) {
  return (
    <Suspense fallback={<div className="mx-auto max-w-3xl space-y-4"><Skeleton className="h-10 w-2/3" /><Skeleton className="h-48 w-full" /></div>}>
      <PathContent params={params} />
    </Suspense>
  );
}

async function PathContent({ params }: Params) {
  const path = pathBySlug.get((await params).path);
  if (!path) notFound();
  const minutes = path.lessons.reduce((s, l) => s + l.minutes, 0);
  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/apprendre" className="mb-6 inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-3 hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> Tous les parcours
      </Link>
      <div className="flex flex-wrap items-center gap-2">
        <DomainBadge domain={path.domain} />
        <span className="text-[12.5px] text-ink-3">
          {LEVELS[path.level].label} · {path.lessons.length} leçons · environ {minutes} minutes
        </span>
      </div>
      <h1 className="mt-4 text-[30px] font-semibold tracking-[-0.02em] sm:text-[36px]">{path.title}</h1>
      <p className="mt-3 text-[16px] leading-relaxed text-ink-2">{path.description}</p>
      <div className="mt-6 rounded-2xl bg-surface-2 p-5">
        <h2 className="text-[14px] font-semibold">À la fin de ce parcours, vous saurez :</h2>
        <ul className="mt-3 space-y-2">
          {path.outcomes.map((o) => (
            <li key={o} className="flex gap-2 text-[14px] text-ink-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-domain-fin" /> {o}
            </li>
          ))}
        </ul>
      </div>
      <h2 className="mb-4 mt-10 text-lg font-semibold tracking-tight">Programme</h2>
      <LessonList pathSlug={path.slug} />
    </div>
  );
}
