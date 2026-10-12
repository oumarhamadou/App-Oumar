"use client";

import { useState } from "react";
import { Markdown } from "@/components/common/markdown";
import { cn } from "@/lib/cn";
import { useAppStore, useHydrated } from "@/lib/store";
import { LEVELS, LEVEL_IDS, type Level } from "@/lib/taxonomy";

/** Explanation tabs; opens on the reader's level once their profile is loaded. */
export function LevelExplainer({ explanations }: { explanations: Record<Level, string> }) {
  const hydrated = useHydrated();
  const profileLevel = useAppStore((s) => s.profile.level);
  const [chosen, setChosen] = useState<Level | null>(null);
  const level = chosen ?? (hydrated ? profileLevel : "debutant");
  return (
    <section aria-label="Explication par niveau">
      <div role="tablist" aria-label="Niveau d'explication" className="mb-5 inline-flex rounded-xl bg-surface-2 p-1">
        {LEVEL_IDS.map((l) => (
          <button
            key={l}
            type="button"
            role="tab"
            id={`tab-${l}`}
            aria-selected={level === l}
            aria-controls="explication"
            onClick={() => setChosen(l)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors",
              level === l ? "bg-surface text-ink shadow-card" : "text-ink-3 hover:text-ink",
            )}
          >
            {LEVELS[l].label}
          </button>
        ))}
      </div>
      <div id="explication" role="tabpanel" aria-labelledby={`tab-${level}`} key={level} className="animate-rise">
        <Markdown className="text-[15.5px]">{explanations[level]}</Markdown>
      </div>
    </section>
  );
}
