import { ArrowRight, GraduationCap, ShieldCheck, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ToolDirectory } from "@/components/ai/tool-directory";
import { ButtonLink } from "@/components/ui/button";
import { PageHeader, SectionTitle } from "@/components/ui/page-header";
import { aiGoodPractices, aiNotions, aiTrends } from "@/content/ai-space";

export const metadata: Metadata = {
  title: "Espace IA",
  description: "Outils d'intelligence artificielle, notions clés, tendances et bonnes pratiques.",
};

export default function AiSpacePage() {
  return (
    <>
      <PageHeader
        eyebrow="Espace IA"
        title="L'intelligence artificielle, sans jargon"
        description="Les tendances qui comptent, les outils utiles pour étudier, travailler, créer et entreprendre, et les notions pour comprendre ce qui se passe."
        actions={
          <>
            <ButtonLink href="/apprendre/ia-pour-tous" variant="outline" size="sm">
              <GraduationCap className="h-4 w-4" /> Parcours « L&apos;IA pour tous »
            </ButtonLink>
            <ButtonLink href="/assistant" size="sm">
              <Sparkles className="h-4 w-4" /> Poser une question
            </ButtonLink>
          </>
        }
      />

      <section className="mb-14" aria-labelledby="tendances">
        <SectionTitle id="tendances" title="Les grandes tendances" description="Ce qui transforme le secteur et pourquoi cela vous concerne." />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {aiTrends.map((trend, index) => (
            <article key={trend.id} className="flex flex-col rounded-2xl border border-line bg-surface p-5 shadow-card">
              <span className="text-[12px] font-semibold tabular-nums text-domain-ia">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="mt-1.5 text-[16px] font-semibold tracking-tight">{trend.title}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-ink-2">{trend.summary}</p>
              <div className="mt-4 rounded-xl bg-surface-2 px-3.5 py-3">
                <p className="text-[11.5px] font-medium uppercase tracking-wide text-ink-3">Pourquoi c&apos;est important</p>
                <p className="mt-1 text-[13px] leading-relaxed text-ink-2">{trend.whyItMatters}</p>
              </div>
              <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
                {trend.signals.map((s) => (
                  <span key={s} className="rounded-full border border-line px-2.5 py-0.5 text-[11.5px] text-ink-3">
                    {s}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mb-14" aria-labelledby="outils">
        <SectionTitle id="outils" title="Boîte à outils" description="Des outils reconnus, classés par usage." />
        <ToolDirectory />
      </section>

      <section className="mb-14" aria-labelledby="notions">
        <SectionTitle id="notions" title="Les notions clés" description="Le vocabulaire indispensable pour suivre l'actualité de l'IA." />
        <div className="grid gap-x-8 md:grid-cols-2">
          {aiNotions.map((notion) => (
            <details key={notion.slug} id={`notion-${notion.slug}`} className="group scroll-mt-24 border-b border-line py-4">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                <span>
                  <span className="block text-[15px] font-semibold">{notion.title}</span>
                  <span className="mt-1 block text-[13.5px] leading-relaxed text-ink-2">{notion.definition}</span>
                </span>
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-ink-3 transition-transform group-open:rotate-90" />
              </summary>
              <p className="mt-3 rounded-xl bg-surface-2 px-3.5 py-3 text-[13.5px] leading-relaxed text-ink-2">{notion.detail}</p>
            </details>
          ))}
        </div>
      </section>

      <section aria-labelledby="pratiques">
        <SectionTitle id="pratiques" title="Utiliser l'IA de façon responsable" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {aiGoodPractices.map((p) => (
            <div key={p.title} className="rounded-2xl border border-line bg-surface p-5 shadow-card">
              <ShieldCheck className="h-5 w-5 text-domain-fin" />
              <h3 className="mt-3 text-[15px] font-semibold">{p.title}</h3>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-2">{p.body}</p>
            </div>
          ))}
        </div>
        <Link href="/apprendre/ia-pour-tous/limites-risques" className="mt-5 inline-flex items-center gap-1 text-[13.5px] font-medium text-accent-text hover:underline">
          Leçon : limites, risques et éthique de l&apos;IA <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </section>
    </>
  );
}
