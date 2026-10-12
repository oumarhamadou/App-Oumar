"use client";

import { Bookmark, Check, History, ListPlus, Pencil, Plus, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { EmptyState, Skeleton } from "@/components/ui/misc";
import { useNow } from "@/hooks/use-now";
import { cn } from "@/lib/cn";
import { formatRelative } from "@/lib/format";
import { useAppStore, useHydrated, type ItemKind, type LibraryItem } from "@/lib/store";

const KIND_LABELS: Record<ItemKind, string> = {
  actualite: "Actualité",
  concept: "Concept",
  lecon: "Leçon",
  cas: "Étude de cas",
  outil: "Outil IA",
};

type Tab = "favoris" | "listes" | "historique";

function ItemRow({ item, date, onRemove, removeLabel }: { item: LibraryItem; date?: string; onRemove?: () => void; removeLabel?: string }) {
  const now = useNow();
  return (
    <li className="flex items-center gap-3 py-3">
      <span className="w-[86px] shrink-0 text-[11.5px] font-medium text-ink-3">{KIND_LABELS[item.kind]}</span>
      <Link href={item.href} className="min-w-0 flex-1 hover:underline">
        <span className="block truncate text-[14px] font-medium text-ink">{item.title}</span>
        <span className="block truncate text-[12px] text-ink-3">
          {item.meta}
          {item.meta && date && now ? " · " : ""}
          {date && now ? formatRelative(date, now) : ""}
        </span>
      </Link>
      {onRemove ? (
        <button type="button" onClick={onRemove} aria-label={removeLabel} title={removeLabel} className="rounded-lg p-1.5 text-ink-3 hover:bg-surface-2 hover:text-ink">
          <X className="h-4 w-4" />
        </button>
      ) : null}
    </li>
  );
}

export function Library() {
  const hydrated = useHydrated();
  const [tab, setTab] = useState<Tab>("favoris");
  const [kind, setKind] = useState<ItemKind | "tous">("tous");
  const saved = useAppStore((s) => s.saved);
  const lists = useAppStore((s) => s.lists);
  const history = useAppStore((s) => s.history);
  const toggleSaved = useAppStore((s) => s.toggleSaved);
  const createList = useAppStore((s) => s.createList);
  const renameList = useAppStore((s) => s.renameList);
  const deleteList = useAppStore((s) => s.deleteList);
  const toggleInList = useAppStore((s) => s.toggleInList);
  const clearHistory = useAppStore((s) => s.clearHistory);
  const [newList, setNewList] = useState("");
  const [editing, setEditing] = useState<{ id: string; name: string } | null>(null);

  if (!hydrated) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const kinds = [...new Set(saved.map((s) => s.kind))];
  const filtered = kind === "tous" ? saved : saved.filter((s) => s.kind === kind);
  const byKey = new Map(saved.map((s) => [s.key, s]));

  const tabs: { id: Tab; label: string; count: number; icon: typeof Bookmark }[] = [
    { id: "favoris", label: "Favoris", count: saved.length, icon: Bookmark },
    { id: "listes", label: "Listes de lecture", count: lists.length, icon: ListPlus },
    { id: "historique", label: "Historique", count: history.length, icon: History },
  ];

  return (
    <div>
      <div role="tablist" aria-label="Bibliothèque" className="mb-6 flex gap-1 overflow-x-auto border-b border-line scrollbar-none">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "-mb-px inline-flex shrink-0 items-center gap-2 border-b-2 px-3 pb-3 pt-1 text-[14px] font-medium transition-colors",
              tab === t.id ? "border-accent text-ink" : "border-transparent text-ink-3 hover:text-ink",
            )}
          >
            <t.icon className="h-4 w-4" /> {t.label}
            <span className="rounded-full bg-surface-2 px-1.5 text-[11.5px] tabular-nums text-ink-3">{t.count}</span>
          </button>
        ))}
      </div>

      {tab === "favoris" ? (
        saved.length === 0 ? (
          <EmptyState
            icon={<Bookmark className="h-6 w-6" />}
            title="Aucun favori"
            description="Enregistrez des actualités, des fiches, des leçons ou des outils grâce à l'icône de signet."
            action={
              <Link href="/actualites" className="text-[13.5px] font-medium text-accent-text hover:underline">
                Parcourir les actualités
              </Link>
            }
          />
        ) : (
          <>
            {kinds.length > 1 ? (
              <div className="mb-3 flex flex-wrap gap-1.5">
                {(["tous", ...kinds] as const).map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setKind(k)}
                    aria-pressed={kind === k}
                    className={cn(
                      "rounded-full border px-3 py-1 text-[12.5px] font-medium",
                      kind === k ? "border-accent bg-accent-soft text-ink" : "border-line text-ink-3 hover:text-ink",
                    )}
                  >
                    {k === "tous" ? "Tout" : KIND_LABELS[k]}
                  </button>
                ))}
              </div>
            ) : null}
            <ul className="divide-y divide-line rounded-2xl border border-line bg-surface px-4 shadow-card">
              {filtered.map((item) => (
                <ItemRow key={item.key} item={item} date={item.savedAt} onRemove={() => toggleSaved(item)} removeLabel="Retirer des favoris" />
              ))}
            </ul>
          </>
        )
      ) : null}

      {tab === "listes" ? (
        <div className="space-y-5">
          <form
            className="flex max-w-md gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!newList.trim()) return;
              createList(newList);
              setNewList("");
            }}
          >
            <label htmlFor="new-list" className="sr-only">
              Nom de la liste
            </label>
            <input
              id="new-list"
              value={newList}
              onChange={(e) => setNewList(e.target.value.slice(0, 40))}
              placeholder="Ex. : À lire ce week-end, Préparer mon examen…"
              className="h-10 min-w-0 flex-1 rounded-xl border border-line bg-surface px-3.5 text-[14px] outline-none focus:border-accent"
            />
            <Button type="submit" disabled={!newList.trim()}>
              <Plus className="h-4 w-4" /> Créer
            </Button>
          </form>
          {lists.length === 0 ? (
            <EmptyState
              icon={<ListPlus className="h-6 w-6" />}
              title="Aucune liste de lecture"
              description="Créez une liste, puis ajoutez-y des contenus avec l'icône « ajouter à une liste »."
            />
          ) : (
            lists.map((list) => (
              <section key={list.id} className="rounded-2xl border border-line bg-surface p-5 shadow-card">
                <div className="flex items-center justify-between gap-3">
                  {editing?.id === list.id ? (
                    <form
                      className="flex flex-1 gap-2"
                      onSubmit={(e) => {
                        e.preventDefault();
                        renameList(list.id, editing.name);
                        setEditing(null);
                      }}
                    >
                      <input
                        autoFocus
                        value={editing.name}
                        onChange={(e) => setEditing({ id: list.id, name: e.target.value.slice(0, 40) })}
                        aria-label="Nouveau nom"
                        className="h-9 min-w-0 flex-1 rounded-lg border border-line-strong bg-surface px-3 text-[14px] outline-none focus:border-accent"
                      />
                      <Button type="submit" size="sm">
                        <Check className="h-3.5 w-3.5" /> OK
                      </Button>
                    </form>
                  ) : (
                    <h2 className="text-[16px] font-semibold">
                      {list.name} <span className="text-[13px] font-normal text-ink-3">· {list.itemKeys.length}</span>
                    </h2>
                  )}
                  {editing?.id !== list.id ? (
                    <div className="flex gap-1">
                      <button type="button" onClick={() => setEditing({ id: list.id, name: list.name })} aria-label="Renommer la liste" className="rounded-lg p-1.5 text-ink-3 hover:bg-surface-2 hover:text-ink">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Supprimer la liste « ${list.name} » ? Les favoris sont conservés.`)) deleteList(list.id);
                        }}
                        aria-label="Supprimer la liste"
                        className="rounded-lg p-1.5 text-ink-3 hover:bg-surface-2 hover:text-critical-text"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ) : null}
                </div>
                {list.itemKeys.length === 0 ? (
                  <p className="mt-3 text-[13px] text-ink-3">Liste vide pour l&apos;instant.</p>
                ) : (
                  <ul className="mt-2 divide-y divide-line">
                    {list.itemKeys.map((key) => {
                      const item = byKey.get(key);
                      return item ? (
                        <ItemRow key={key} item={item} onRemove={() => toggleInList(list.id, item)} removeLabel="Retirer de la liste" />
                      ) : null;
                    })}
                  </ul>
                )}
              </section>
            ))
          )}
        </div>
      ) : null}

      {tab === "historique" ? (
        history.length === 0 ? (
          <EmptyState icon={<History className="h-6 w-6" />} title="Historique vide" description="Les contenus que vous consultez apparaîtront ici et nourriront vos recommandations." />
        ) : (
          <>
            <div className="mb-3 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (window.confirm("Effacer tout l'historique de lecture ?")) clearHistory();
                }}
              >
                <Trash2 className="h-3.5 w-3.5" /> Effacer l&apos;historique
              </Button>
            </div>
            <ul className="divide-y divide-line rounded-2xl border border-line bg-surface px-4 shadow-card">
              {history.map((item) => (
                <ItemRow key={item.key} item={item} date={item.at} />
              ))}
            </ul>
          </>
        )
      ) : null}
    </div>
  );
}
