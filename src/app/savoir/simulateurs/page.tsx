import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { SIMULATOR_LIST } from "@/components/simulators/catalog";
import { Simulator } from "@/components/simulators/simulators";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "Simulateurs",
  description: "Intérêts composés, inflation, crédit, budget, obligations et seuil de rentabilité : des calculateurs interactifs pour comprendre.",
};

export default function SimulatorsPage() {
  return (
    <>
      <Link href="/savoir" className="mb-6 inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-3 hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> Centre de connaissances
      </Link>
      <PageHeader
        eyebrow="Laboratoire"
        title="Simulateurs interactifs"
        description="Changez les hypothèses et observez l'effet sur les résultats. Les calculs sont pédagogiques : ils simplifient la réalité (taux constants, hors fiscalité)."
      />
      <nav aria-label="Simulateurs" className="mb-8 flex flex-wrap gap-2">
        {SIMULATOR_LIST.map((s) => (
          <a key={s.id} href={`#${s.id}`} className="rounded-full border border-line bg-surface px-3 py-1.5 text-[13px] font-medium text-ink-2 shadow-card hover:text-ink">
            {s.title}
          </a>
        ))}
      </nav>
      <div className="space-y-8">
        {SIMULATOR_LIST.map((s) => (
          <section key={s.id} id={s.id} className="scroll-mt-24 rounded-2xl border border-line bg-surface p-5 shadow-card sm:p-7" aria-labelledby={`${s.id}-titre`}>
            <h2 id={`${s.id}-titre`} className="text-lg font-semibold tracking-tight">
              {s.title}
            </h2>
            <p className="mb-6 mt-1 text-[13.5px] text-ink-3">{s.description}</p>
            <Simulator id={s.id} />
          </section>
        ))}
      </div>
    </>
  );
}
