"use client";

import { AlertTriangle, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { SaveButton } from "@/components/common/save-button";
import { Badge } from "@/components/ui/badge";
import { AI_TOOL_CATEGORIES, AI_TOOL_CATEGORY_IDS, aiTools } from "@/content/ai-space";
import type { AiToolCategory } from "@/content/types";
import { cn } from "@/lib/cn";

const PRICING_LABEL = { gratuit: "Gratuit", freemium: "Offre gratuite + payante", payant: "Payant" } as const;

export function ToolDirectory() {
  const [category, setCategory] = useState<AiToolCategory | "tous">("tous");
  const [highlight, setHighlight] = useState<string | null>(null);

  // Deep links such as /ia#outil-notebooklm highlight the tool card.
  useEffect(() => {
    const sync = () => {
      const match = window.location.hash.match(/^#outil-(.+)$/);
      if (match) {
        setCategory("tous");
        setHighlight(match[1]);
        requestAnimationFrame(() => document.getElementById(`outil-${match[1]}`)?.scrollIntoView({ behavior: "smooth", block: "center" }));
      }
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const tools = category === "tous" ? aiTools : aiTools.filter((t) => t.categories.includes(category));

  return (
    <div>
      <div className="mb-5 flex gap-1.5 overflow-x-auto pb-1 scrollbar-none" role="tablist" aria-label="Catégories d'outils">
        {(["tous", ...AI_TOOL_CATEGORY_IDS] as const).map((c) => (
          <button
            key={c}
            type="button"
            role="tab"
            aria-selected={category === c}
            onClick={() => setCategory(c)}
            className={cn(
              "shrink-0 rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors",
              category === c ? "bg-ink text-page" : "text-ink-2 hover:bg-surface-2",
            )}
          >
            {c === "tous" ? "Tous" : AI_TOOL_CATEGORIES[c].label}
          </button>
        ))}
      </div>
      {category !== "tous" ? <p className="mb-4 text-[13.5px] text-ink-3">{AI_TOOL_CATEGORIES[category].description}</p> : null}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {tools.map((tool) => (
          <article
            key={tool.id}
            id={`outil-${tool.id}`}
            className={cn(
              "flex scroll-mt-24 flex-col rounded-2xl border bg-surface p-5 shadow-card transition-shadow",
              highlight === tool.id ? "border-accent ring-2 ring-accent/25" : "border-line",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-2 text-[15px] font-semibold text-ink">{tool.name[0]}</span>
                <div>
                  <h3 className="text-[15px] font-semibold leading-tight">{tool.name}</h3>
                  <p className="text-[12.5px] text-ink-3">{tool.vendor}</p>
                </div>
              </div>
              <SaveButton
                withLists={false}
                item={{ key: `outil:${tool.id}`, kind: "outil", title: tool.name, href: `/ia#outil-${tool.id}`, topics: ["ia"], meta: tool.vendor }}
              />
            </div>
            <p className="mt-3 text-[13.5px] leading-relaxed text-ink-2">{tool.description}</p>
            <ul className="mt-3 space-y-1">
              {tool.useCases.map((u) => (
                <li key={u} className="flex gap-2 text-[13px] text-ink-2">
                  <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-ink-3" aria-hidden />
                  {u}
                </li>
              ))}
            </ul>
            {tool.watchOut ? (
              <p className="mt-3 flex gap-2 rounded-lg bg-surface-2 px-2.5 py-2 text-[12.5px] text-ink-2">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-3" />
                {tool.watchOut}
              </p>
            ) : null}
            <div className="mt-auto flex items-center justify-between gap-2 pt-4">
              <Badge>{PRICING_LABEL[tool.pricing]}</Badge>
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[13px] font-medium text-accent-text hover:underline"
              >
                Site officiel <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </article>
        ))}
      </div>
      <p className="mt-4 text-[12px] text-ink-3">
        Sélection indicative, sans partenariat commercial. Les offres et tarifs évoluent souvent : vérifiez-les sur le site de chaque éditeur.
      </p>
    </div>
  );
}
