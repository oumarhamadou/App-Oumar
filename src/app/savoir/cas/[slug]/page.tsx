import { ArrowLeft, ExternalLink, MapPin } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { SaveButton } from "@/components/common/save-button";
import { TrackVisit } from "@/components/common/track-visit";
import { CaseChart } from "@/components/knowledge/case-chart";
import { ConceptCard } from "@/components/knowledge/concept-card";
import { DomainBadge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/misc";
import { caseStudies, caseStudyBySlug } from "@/content/case-studies";
import { getConcept } from "@/content/concepts";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const cs = caseStudyBySlug.get((await params).slug);
  return cs ? { title: cs.title, description: cs.summary } : { title: "Étude de cas introuvable" };
}

export default function CaseStudyPage({ params }: Params) {
  return (
    <Suspense fallback={<div className="mx-auto max-w-3xl space-y-4"><Skeleton className="h-10 w-2/3" /><Skeleton className="h-64 w-full" /></div>}>
      <CaseStudyContent params={params} />
    </Suspense>
  );
}

async function CaseStudyContent({ params }: Params) {
  const cs = caseStudyBySlug.get((await params).slug);
  if (!cs) notFound();
  const libraryItem = { key: `cas:${cs.slug}`, kind: "cas" as const, title: cs.title, href: `/savoir/cas/${cs.slug}`, meta: "Étude de cas" };
  const concepts = cs.concepts.map(getConcept).filter((c) => c !== undefined);

  return (
    <article className="mx-auto max-w-3xl">
      <TrackVisit item={libraryItem} />
      <Link href="/savoir#cas" className="mb-6 inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-3 hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> Études de cas
      </Link>
      <div className="flex flex-wrap items-center gap-2">
        <DomainBadge domain={cs.domain} />
        <span className="inline-flex items-center gap-1 text-[12.5px] text-ink-3">
          <MapPin className="h-3.5 w-3.5" /> {cs.place} · {cs.period}
        </span>
      </div>
      <h1 className="mt-4 text-[28px] font-semibold tracking-[-0.02em] sm:text-[36px]">{cs.title}</h1>
      <p className="mt-3 text-[17px] leading-relaxed text-ink-2">{cs.summary}</p>
      <div className="mt-4 border-b border-line pb-6">
        <SaveButton item={libraryItem} label />
      </div>

      {cs.chart ? (
        <div className="mt-8 rounded-2xl border border-line bg-surface p-5 shadow-card">
          <CaseChart chart={cs.chart} />
        </div>
      ) : null}

      <div className="mt-8 space-y-8">
        {cs.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-[19px] font-semibold tracking-tight">{section.heading}</h2>
            <p className="mt-2 text-[15.5px] leading-[1.75] text-ink-2">{section.body}</p>
          </section>
        ))}
      </div>

      <section className="mt-10 rounded-2xl bg-surface-2 p-5 sm:p-6">
        <h2 className="text-[16px] font-semibold">Les leçons à en tirer</h2>
        <ol className="mt-3 space-y-2.5">
          {cs.lessons.map((lesson, i) => (
            <li key={lesson} className="flex gap-3 text-[14.5px] leading-relaxed text-ink-2">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface text-[12px] font-semibold text-ink">{i + 1}</span>
              {lesson}
            </li>
          ))}
        </ol>
      </section>

      {concepts.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-lg font-semibold tracking-tight">Les concepts en jeu</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {concepts.map((c) => (
              <ConceptCard key={c.slug} concept={c} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight">Sources</h2>
        <ul className="mt-3 space-y-2">
          {cs.sources.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[14px] text-accent-text hover:underline">
                {s.label} <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
