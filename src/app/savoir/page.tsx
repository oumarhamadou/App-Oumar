import { ArrowRight, Calculator, History } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { MacroExplorer } from "@/components/dashboard/macro-explorer";
import { ConceptCard } from "@/components/knowledge/concept-card";
import { SIMULATOR_LIST } from "@/components/simulators/catalog";
import { DomainDot } from "@/components/ui/badge";
import { Card, CardBody } from "@/components/ui/card";
import { PageHeader, SectionTitle } from "@/components/ui/page-header";
import { caseStudies } from "@/content/case-studies";
import { concepts } from "@/content/concepts";
import { getMarkets } from "@/lib/markets";
import { DOMAINS } from "@/lib/taxonomy";

export const metadata: Metadata = {
  title: "Centre de connaissances",
  description: "Les notions essentielles d'économie et de finance expliquées à trois niveaux, avec simulateurs et études de cas.",
};

export default async function KnowledgePage() {
  const markets = await getMarkets();
  const groups = (["economie", "finance"] as const).map((domain) => ({ domain, items: concepts.filter((c) => c.domain === domain) }));

  return (
    <>
      <PageHeader
        eyebrow="Centre de connaissances"
        title="Économie et finance, de zéro à expert"
        description="Chaque notion est expliquée à trois niveaux, avec un exemple concret, un simulateur quand c'est utile, une étude de cas et un quiz."
      />

      {groups.map(({ domain, items }) => (
        <section key={domain} className="mb-12" aria-labelledby={`domaine-${domain}`}>
          <SectionTitle
            id={`domaine-${domain}`}
            title={
              <span className="flex items-center gap-2">
                <DomainDot domain={domain} className="h-2 w-2" /> {DOMAINS[domain].label}
              </span>
            }
            description={`${items.length} notions`}
          />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {items.map((concept) => (
              <ConceptCard key={concept.slug} concept={concept} />
            ))}
          </div>
        </section>
      ))}

      <section className="mb-12" aria-labelledby="simulateurs">
        <SectionTitle
          id="simulateurs"
          title="Simulateurs interactifs"
          description="Manipulez les chiffres pour comprendre les mécanismes."
          action={
            <Link href="/savoir/simulateurs" className="inline-flex items-center gap-1 text-[13px] font-medium text-accent-text hover:underline">
              Tous les simulateurs <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          }
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SIMULATOR_LIST.map((sim) => (
            <Link
              key={sim.id}
              href={`/savoir/simulateurs#${sim.id}`}
              className="flex items-start gap-3 rounded-2xl border border-line bg-surface p-4 shadow-card transition-shadow hover:shadow-pop"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface-2 text-ink-2">
                <Calculator className="h-4 w-4" />
              </span>
              <span>
                <span className="block text-[14.5px] font-semibold">{sim.title}</span>
                <span className="mt-0.5 block text-[13px] text-ink-3">{sim.description}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-12" aria-labelledby="cas">
        <SectionTitle id="cas" title="Études de cas" description="Des épisodes réels pour voir les concepts à l'œuvre." />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {caseStudies.map((cs) => (
            <Link
              key={cs.slug}
              href={`/savoir/cas/${cs.slug}`}
              className="group flex flex-col rounded-2xl border border-line bg-surface p-5 shadow-card transition-shadow hover:shadow-pop"
            >
              <span className="flex items-center gap-2 text-[12px] font-medium text-ink-3">
                <History className="h-3.5 w-3.5" /> {cs.period} · {cs.place}
              </span>
              <span className="mt-2 text-[16px] font-semibold tracking-tight">{cs.title}</span>
              <span className="mt-2 line-clamp-3 text-[13.5px] leading-relaxed text-ink-2">{cs.summary}</span>
              <span className="mt-auto inline-flex items-center gap-1 pt-4 text-[12.5px] font-medium text-accent-text">
                Lire l&apos;étude <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="donnees">
        <SectionTitle id="donnees" title="Explorer les données" description="Inflation et croissance des grandes économies, avec la source de chaque série." />
        <Card>
          <CardBody className="pt-5">
            <MacroExplorer macro={markets.macro} height={280} />
          </CardBody>
        </Card>
      </section>
    </>
  );
}
