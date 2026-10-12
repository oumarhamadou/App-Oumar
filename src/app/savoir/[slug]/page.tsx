import { ArrowLeft, ArrowRight, Calculator, ExternalLink, History, Lightbulb, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { SaveButton } from "@/components/common/save-button";
import { TrackVisit } from "@/components/common/track-visit";
import { ConceptCard } from "@/components/knowledge/concept-card";
import { LevelExplainer } from "@/components/knowledge/level-explainer";
import { Quiz } from "@/components/learn/quiz";
import { SIMULATOR_LIST } from "@/components/simulators/catalog";
import { Simulator } from "@/components/simulators/simulators";
import { DomainBadge, TopicBadge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/misc";
import { caseStudyBySlug } from "@/content/case-studies";
import { concepts, getConcept } from "@/content/concepts";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return concepts.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const concept = getConcept((await params).slug);
  return concept ? { title: concept.title, description: concept.tagline } : { title: "Notion introuvable" };
}

export default function ConceptPage({ params }: Params) {
  return (
    <Suspense fallback={<ConceptSkeleton />}>
      <ConceptContent params={params} />
    </Suspense>
  );
}

function ConceptSkeleton() {
  return (
    <div className="mx-auto max-w-3xl space-y-4" aria-busy="true">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-10 w-1/2" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="mt-8 h-64 w-full" />
    </div>
  );
}

async function ConceptContent({ params }: Params) {
  const concept = getConcept((await params).slug);
  if (!concept) notFound();
  const caseStudy = concept.caseStudy ? caseStudyBySlug.get(concept.caseStudy) : undefined;
  const simulator = concept.simulator ? SIMULATOR_LIST.find((s) => s.id === concept.simulator) : undefined;
  const related = concept.related.map(getConcept).filter((c) => c !== undefined);
  const libraryItem = { key: `concept:${concept.slug}`, kind: "concept" as const, title: concept.title, href: `/savoir/${concept.slug}`, topics: concept.topics, meta: "Fiche concept" };

  return (
    <article>
      <TrackVisit item={libraryItem} />
      <div className="mx-auto max-w-3xl">
        <Link href="/savoir" className="mb-6 inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-3 hover:text-ink">
          <ArrowLeft className="h-4 w-4" /> Centre de connaissances
        </Link>
        <div className="flex flex-wrap gap-1.5">
          <DomainBadge domain={concept.domain} />
          {concept.topics.slice(0, 2).map((t) => (
            <TopicBadge key={t} topic={t} />
          ))}
        </div>
        <h1 className="mt-4 text-[30px] font-semibold tracking-[-0.02em] sm:text-[38px]">{concept.title}</h1>
        <p className="mt-3 text-[18px] leading-relaxed text-ink-2">{concept.tagline}</p>
        <div className="mt-5 flex flex-wrap items-center gap-2 border-b border-line pb-6">
          <SaveButton item={libraryItem} label />
          <ButtonLink href={`/assistant?q=${encodeURIComponent(`J'aimerais mieux comprendre : ${concept.title}. Peux-tu me l'expliquer avec un exemple récent ?`)}`} variant="secondary" size="sm">
            <Sparkles className="h-3.5 w-3.5" /> Approfondir avec l&apos;assistant
          </ButtonLink>
          {simulator ? (
            <a href="#simulateur" className="inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-[13px] font-medium text-ink-2 hover:bg-surface-2">
              <Calculator className="h-3.5 w-3.5" /> Simulateur
            </a>
          ) : null}
        </div>

        <div className="mt-8">
          <LevelExplainer explanations={concept.explanations} />
        </div>

        <section className="mt-10 rounded-2xl border border-line bg-surface p-5 shadow-card sm:p-6">
          <p className="flex items-center gap-2 text-[12px] font-medium uppercase tracking-wide text-ink-3">
            <Lightbulb className="h-3.5 w-3.5" /> Exemple concret
          </p>
          <h2 className="mt-2 text-[16px] font-semibold">{concept.example.title}</h2>
          <p className="mt-2 text-[14.5px] leading-relaxed text-ink-2">{concept.example.body}</p>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-semibold tracking-tight">À retenir</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {concept.keyPoints.map((point) => (
              <li key={point} className="flex gap-2.5 rounded-xl bg-surface-2 px-4 py-3 text-[14px] leading-relaxed text-ink-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                {point}
              </li>
            ))}
          </ul>
        </section>
      </div>

      {simulator && concept.simulator ? (
        <section id="simulateur" className="mt-12 scroll-mt-24 rounded-2xl border border-line bg-surface p-5 shadow-card sm:p-7">
          <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
            <Calculator className="h-5 w-5 text-ink-3" /> Simulateur : {simulator.title}
          </h2>
          <p className="mb-6 mt-1 text-[13.5px] text-ink-3">{simulator.description}</p>
          <Simulator id={concept.simulator} />
        </section>
      ) : null}

      <div className="mx-auto mt-12 max-w-3xl space-y-12">
        {caseStudy ? (
          <Link href={`/savoir/cas/${caseStudy.slug}`} className="group block rounded-2xl border border-line bg-surface p-5 shadow-card transition-shadow hover:shadow-pop sm:p-6">
            <span className="flex items-center gap-2 text-[12px] font-medium uppercase tracking-wide text-ink-3">
              <History className="h-3.5 w-3.5" /> Étude de cas · {caseStudy.period}
            </span>
            <span className="mt-2 block text-[17px] font-semibold tracking-tight">{caseStudy.title}</span>
            <span className="mt-1.5 block text-[14px] leading-relaxed text-ink-2">{caseStudy.summary}</span>
            <span className="mt-3 inline-flex items-center gap-1 text-[13px] font-medium text-accent-text group-hover:underline">
              Lire l&apos;étude de cas <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        ) : null}

        <Quiz quizKey={`concept:${concept.slug}`} questions={concept.quiz} />

        {related.length > 0 ? (
          <section>
            <h2 className="text-lg font-semibold tracking-tight">Notions liées</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((c) => (
                <ConceptCard key={c.slug} concept={c} />
              ))}
            </div>
          </section>
        ) : null}

        <section>
          <h2 className="text-lg font-semibold tracking-tight">Pour aller plus loin</h2>
          <ul className="mt-3 space-y-2">
            {concept.sources.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[14px] text-accent-text hover:underline">
                  {s.label} <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </article>
  );
}
