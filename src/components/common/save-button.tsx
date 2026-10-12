"use client";

import { Bookmark, BookmarkCheck, Check, ListPlus, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { useAppStore, useHydrated, type LibraryItem } from "@/lib/store";

/** Bookmark toggle with an optional "add to reading list" menu. */
export function SaveButton({ item, withLists = true, className, label = false }: { item: LibraryItem; withLists?: boolean; className?: string; label?: boolean }) {
  const hydrated = useHydrated();
  const saved = useAppStore((s) => s.saved.some((x) => x.key === item.key));
  const toggleSaved = useAppStore((s) => s.toggleSaved);
  const isSaved = hydrated && saved;
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleSaved(item);
        }}
        aria-pressed={isSaved}
        aria-label={isSaved ? "Retirer des favoris" : "Ajouter aux favoris"}
        title={isSaved ? "Retirer des favoris" : "Ajouter aux favoris"}
        className={cn(
          "inline-flex h-8 items-center justify-center gap-1.5 rounded-lg px-2 text-[13px] font-medium transition-colors",
          isSaved ? "text-accent-text hover:bg-accent-soft" : "text-ink-3 hover:bg-surface-2 hover:text-ink",
        )}
      >
        {isSaved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
        {label ? <span>{isSaved ? "Enregistré" : "Enregistrer"}</span> : null}
      </button>
      {withLists ? <ListMenu item={item} /> : null}
    </div>
  );
}

function ListMenu({ item }: { item: LibraryItem }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const lists = useAppStore((s) => s.lists);
  const toggleInList = useAppStore((s) => s.toggleInList);
  const createList = useAppStore((s) => s.createList);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        aria-expanded={open}
        aria-label="Ajouter à une liste de lecture"
        title="Ajouter à une liste de lecture"
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink-3 transition-colors hover:bg-surface-2 hover:text-ink"
      >
        <ListPlus className="h-4 w-4" />
      </button>
      {open ? (
        <div
          className="animate-rise absolute right-0 top-9 z-30 w-64 rounded-xl border border-line bg-surface p-1.5 text-left shadow-pop"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="px-2.5 pb-1.5 pt-1 text-[11.5px] font-medium uppercase tracking-wide text-ink-3">Listes de lecture</p>
          {lists.length === 0 ? <p className="px-2.5 pb-2 text-[12.5px] text-ink-3">Aucune liste pour l&apos;instant.</p> : null}
          {lists.map((list) => {
            const inList = list.itemKeys.includes(item.key);
            return (
              <button
                key={list.id}
                type="button"
                onClick={() => toggleInList(list.id, item)}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-[13.5px] hover:bg-surface-2"
              >
                <span className={cn("flex h-4 w-4 items-center justify-center rounded border", inList ? "border-accent bg-accent text-accent-ink" : "border-line-strong")}>
                  {inList ? <Check className="h-3 w-3" /> : null}
                </span>
                <span className="truncate">{list.name}</span>
                <span className="ml-auto text-[11.5px] text-ink-3">{list.itemKeys.length}</span>
              </button>
            );
          })}
          <form
            className="mt-1 flex items-center gap-1 border-t border-line px-1 pt-1.5"
            onSubmit={(e) => {
              e.preventDefault();
              if (!name.trim()) return;
              const id = createList(name);
              toggleInList(id, item);
              setName("");
            }}
          >
            <input
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 40))}
              placeholder="Nouvelle liste…"
              aria-label="Nom de la nouvelle liste"
              className="h-8 min-w-0 flex-1 rounded-lg bg-transparent px-1.5 text-[13px] outline-none placeholder:text-ink-3"
            />
            <button type="submit" aria-label="Créer la liste" className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink-2 hover:bg-surface-2">
              <Plus className="h-4 w-4" />
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
