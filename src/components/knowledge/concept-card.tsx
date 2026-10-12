import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { DomainDot } from "@/components/ui/badge";
import type { Concept } from "@/content/types";

export function ConceptCard({ concept }: { concept: Concept }) {
  return (
    <Link
      href={`/savoir/${concept.slug}`}
      className="group flex flex-col rounded-2xl border border-line bg-surface p-5 shadow-card transition-shadow hover:shadow-pop"
    >
      <span className="flex items-center gap-2 text-[15.5px] font-semibold tracking-tight">
        <DomainDot domain={concept.domain} />
        {concept.title}
      </span>
      <span className="mt-2 line-clamp-3 text-[13.5px] leading-relaxed text-ink-2">{concept.tagline}</span>
      <span className="mt-auto inline-flex items-center gap-1 pt-4 text-[12.5px] font-medium text-accent-text">
        {concept.simulator ? "Fiche + simulateur" : "Lire la fiche"}
        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
