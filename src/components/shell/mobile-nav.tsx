"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import { SITE } from "@/lib/site";
import { LogoMark } from "./logo";
import { NAV_MOBILE, isActive } from "./nav-items";
import { SidebarNav } from "./sidebar";
import { useUiStore } from "./ui-store";

export function MobileTabBar() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Navigation rapide"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-around px-2">
        {NAV_MOBILE.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
                  active ? "text-accent-text" : "text-ink-3 hover:text-ink",
                )}
              >
                <Icon className="h-5 w-5" />
                {item.short}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function MobileMenu() {
  const open = useUiStore((s) => s.menuOpen);
  const setOpen = useUiStore((s) => s.setMenuOpen);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname, setOpen]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
      <button type="button" aria-label="Fermer le menu" className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" onClick={() => setOpen(false)} />
      <div className="animate-rise absolute inset-y-0 left-0 flex w-[280px] max-w-[85vw] flex-col bg-page px-4 py-5 shadow-pop">
        <div className="mb-6 flex items-center justify-between px-2">
          <span className="flex items-center gap-2.5">
            <LogoMark />
            <span className="text-[17px] font-semibold tracking-tight">{SITE.name}</span>
          </span>
          <button type="button" onClick={() => setOpen(false)} aria-label="Fermer" className="rounded-lg p-1.5 text-ink-3 hover:bg-surface-2">
            <X className="h-5 w-5" />
          </button>
        </div>
        <SidebarNav onNavigate={() => setOpen(false)} />
      </div>
    </div>
  );
}
