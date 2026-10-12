"use client";

import { Bell, BookOpen, CheckCheck, Newspaper, Settings2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useNow } from "@/hooks/use-now";
import { cn } from "@/lib/cn";
import { formatRelative } from "@/lib/format";
import { useAppStore, useHydrated, type AppNotification } from "@/lib/store";
import { useUiStore } from "./ui-store";

const KIND_ICON: Record<AppNotification["kind"], typeof Bell> = {
  actualite: Newspaper,
  apprentissage: BookOpen,
  systeme: Bell,
};

export function NotificationBell() {
  const hydrated = useHydrated();
  const unread = useAppStore((s) => s.notifications.filter((n) => !n.read).length);
  const open = useUiStore((s) => s.notificationsOpen);
  const setOpen = useUiStore((s) => s.setNotificationsOpen);
  const count = hydrated ? unread : 0;
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={count > 0 ? `Notifications (${count} non lues)` : "Notifications"}
        aria-expanded={open}
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink"
      >
        <Bell className="h-[18px] w-[18px]" />
        {count > 0 ? (
          <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-ink">
            {count > 9 ? "9+" : count}
          </span>
        ) : null}
      </button>
      {open ? <NotificationPanel onClose={() => setOpen(false)} /> : null}
    </div>
  );
}

function NotificationPanel({ onClose }: { onClose: () => void }) {
  const notifications = useAppStore((s) => s.notifications);
  const markRead = useAppStore((s) => s.markNotificationRead);
  const markAll = useAppStore((s) => s.markAllNotificationsRead);
  const now = useNow();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onPointer = (e: PointerEvent) => {
      if (ref.current && !ref.current.parentElement?.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="animate-rise fixed inset-x-3 top-16 z-50 overflow-hidden rounded-2xl border border-line bg-surface shadow-pop sm:absolute sm:inset-x-auto sm:right-0 sm:top-11 sm:w-[380px]"
    >
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <p className="text-sm font-semibold">Notifications</p>
        <div className="flex items-center gap-1">
          <button type="button" onClick={markAll} className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[12.5px] text-ink-2 hover:bg-surface-2">
            <CheckCheck className="h-3.5 w-3.5" /> Tout lire
          </button>
          <Link href="/parametres#notifications" onClick={onClose} aria-label="Réglages des notifications" className="rounded-lg p-1.5 text-ink-3 hover:bg-surface-2 hover:text-ink">
            <Settings2 className="h-4 w-4" />
          </Link>
        </div>
      </div>
      {notifications.length === 0 ? (
        <div className="px-6 py-10 text-center">
          <Bell className="mx-auto mb-3 h-6 w-6 text-ink-3" />
          <p className="text-sm font-medium">Aucune notification</p>
          <p className="mt-1 text-[13px] text-ink-3">Suivez des thèmes pour être alerté des actualités importantes.</p>
        </div>
      ) : (
        <ul className="max-h-[60vh] divide-y divide-line overflow-y-auto">
          {notifications.map((n) => {
            const Icon = KIND_ICON[n.kind];
            const content = (
              <div className="flex gap-3 px-4 py-3">
                <span className={cn("mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg", n.read ? "bg-surface-2 text-ink-3" : "bg-accent-soft text-accent-text")}>
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className={cn("text-[13.5px] leading-snug", n.read ? "text-ink-2" : "font-medium text-ink")}>{n.title}</p>
                  {n.body ? <p className="mt-0.5 line-clamp-2 text-[12.5px] text-ink-3">{n.body}</p> : null}
                  <p className="mt-1 text-[11.5px] text-ink-3">{now ? formatRelative(n.createdAt, now) : ""}</p>
                </div>
                {!n.read ? <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent" aria-label="Non lue" /> : null}
              </div>
            );
            return (
              <li key={n.id} className="transition-colors hover:bg-surface-2">
                {n.href ? (
                  <Link href={n.href} onClick={() => { markRead(n.id); onClose(); }}>
                    {content}
                  </Link>
                ) : (
                  <button type="button" className="w-full text-left" onClick={() => markRead(n.id)}>
                    {content}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
