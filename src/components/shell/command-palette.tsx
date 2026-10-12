"use client";

import { ArrowRight, CornerDownLeft, Search, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { Kbd } from "@/components/ui/misc";
import { useNews } from "@/hooks/use-news";
import { cn } from "@/lib/cn";
import { SEARCH_KIND_LABELS, buildStaticIndex, newsToDocs, search, type SearchDoc } from "@/lib/search";
import { useUiStore } from "./ui-store";

const staticIndex = buildStaticIndex();

const SUGGESTIONS: SearchDoc[] = staticIndex.filter((d) =>
  ["concept-inflation", "concept-interets-composes", "page-simulateurs", "parcours-ia-pour-tous", "notion-agent", "page-assistant"].includes(d.id),
);

type Row = { kind: "doc"; doc: SearchDoc } | { kind: "ask"; query: string };

/** Always mounted: owns the global shortcuts (Ctrl/Cmd+K, "/"). */
export function CommandPalette() {
  const open = useUiStore((s) => s.paletteOpen);
  const setOpen = useUiStore((s) => s.setPaletteOpen);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing = target?.closest("input, textarea, [contenteditable=true]");
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!useUiStore.getState().paletteOpen);
      } else if (e.key === "/" && !typing) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);

  // Mounted only while open, so each opening starts with a fresh query.
  return open ? <PaletteDialog onClose={() => setOpen(false)} /> : null;
}

function PaletteDialog({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);
  const news = useNews(true);
  const deferredQuery = useDeferredValue(query);

  const docs = useMemo(() => (news ? [...staticIndex, ...newsToDocs(news.items)] : staticIndex), [news]);

  const rows: Row[] = useMemo(() => {
    const q = deferredQuery.trim();
    if (!q) return SUGGESTIONS.map((doc) => ({ kind: "doc" as const, doc }));
    const results = search(docs, q, 12).map((doc) => ({ kind: "doc" as const, doc }));
    return [...results, { kind: "ask" as const, query: q }];
  }, [deferredQuery, docs]);

  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const go = (row: Row) => {
    onClose();
    if (row.kind === "ask") router.push(`/assistant?q=${encodeURIComponent(row.query)}`);
    else router.push(row.doc.href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(rows.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter" && rows[active]) {
      e.preventDefault();
      go(rows[active]);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[12vh]" role="dialog" aria-modal="true" aria-label="Recherche">
      <button type="button" aria-label="Fermer la recherche" className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" onClick={onClose} />
      <div className="animate-rise relative w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-surface shadow-pop">
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search className="h-[18px] w-[18px] shrink-0 text-ink-3" />
          <input
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Rechercher un concept, une actualité, un outil…"
            className="h-14 w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-3"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-results"
            aria-activedescendant={`palette-row-${active}`}
          />
          <Kbd>Échap</Kbd>
        </div>
        <ul id="palette-results" ref={listRef} role="listbox" className="max-h-[min(60vh,440px)] overflow-y-auto p-2">
          {!deferredQuery.trim() ? (
            <li className="px-3 pb-1 pt-2 text-[11.5px] font-medium uppercase tracking-wide text-ink-3">Suggestions</li>
          ) : null}
          {rows.map((row, index) => {
            const selected = index === active;
            return (
              <li
                key={row.kind === "ask" ? "ask" : row.doc.id}
                id={`palette-row-${index}`}
                data-index={index}
                role="option"
                aria-selected={selected}
                onMouseMove={() => setActive(index)}
                onClick={() => go(row)}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5",
                  selected ? "bg-surface-2" : "",
                )}
              >
                {row.kind === "ask" ? (
                  <>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent-text">
                      <Sparkles className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14px] font-medium text-ink">Demander à l&apos;assistant : « {row.query} »</span>
                      <span className="block text-[12.5px] text-ink-3">Réponse expliquée et sourcée</span>
                    </span>
                  </>
                ) : (
                  <>
                    <span className="w-[86px] shrink-0 text-[11.5px] font-medium text-ink-3">{SEARCH_KIND_LABELS[row.doc.kind]}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14px] font-medium text-ink">{row.doc.title}</span>
                      <span className="block truncate text-[12.5px] text-ink-3">{row.doc.description}</span>
                    </span>
                  </>
                )}
                {selected ? <CornerDownLeft className="h-4 w-4 shrink-0 text-ink-3" /> : <ArrowRight className="h-4 w-4 shrink-0 text-transparent" />}
              </li>
            );
          })}
          {deferredQuery.trim() && rows.length === 1 ? (
            <li className="px-3 pb-2 pt-1 text-[12.5px] text-ink-3">Aucun contenu ne correspond. L&apos;assistant peut vous répondre.</li>
          ) : null}
        </ul>
        <div className="flex items-center gap-4 border-t border-line px-4 py-2.5 text-[11.5px] text-ink-3">
          <span className="flex items-center gap-1.5"><Kbd>↑</Kbd><Kbd>↓</Kbd> naviguer</span>
          <span className="flex items-center gap-1.5"><Kbd>↵</Kbd> ouvrir</span>
          <span className="ml-auto hidden sm:inline">
            <a href="/recherche" onClick={(e) => { e.preventDefault(); onClose(); router.push(`/recherche${query ? `?q=${encodeURIComponent(query)}` : ""}`); }} className="hover:text-ink">
              Recherche avancée
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}
