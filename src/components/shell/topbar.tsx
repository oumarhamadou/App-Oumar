"use client";

import { Menu, Search } from "lucide-react";
import Link from "next/link";
import { Kbd } from "@/components/ui/misc";
import { SITE } from "@/lib/site";
import { LogoMark } from "./logo";
import { NotificationBell } from "./notification-center";
import { ThemeToggle } from "./theme-toggle";
import { useUiStore } from "./ui-store";

export function Topbar() {
  const setPaletteOpen = useUiStore((s) => s.setPaletteOpen);
  const setMenuOpen = useUiStore((s) => s.setMenuOpen);
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-page/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-4 sm:px-6 lg:px-10">
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Ouvrir le menu"
          className="-ml-1 inline-flex h-9 w-9 items-center justify-center rounded-xl text-ink-2 hover:bg-surface-2 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link href="/" className="flex items-center gap-2 lg:hidden">
          <LogoMark className="h-6 w-6" />
          <span className="text-[16px] font-semibold tracking-tight">{SITE.name}</span>
        </Link>

        <button
          type="button"
          onClick={() => setPaletteOpen(true)}
          className="ml-auto hidden h-10 w-full max-w-md items-center gap-2.5 rounded-xl border border-line bg-surface px-3.5 text-left text-[14px] text-ink-3 shadow-card transition-colors hover:border-line-strong sm:flex lg:ml-0"
        >
          <Search className="h-4 w-4" />
          <span className="flex-1">Rechercher sur {SITE.name}…</span>
          <span className="hidden items-center gap-1 md:flex">
            <Kbd>Ctrl</Kbd>
            <Kbd>K</Kbd>
          </span>
        </button>

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            aria-label="Rechercher"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-ink-2 hover:bg-surface-2 sm:hidden"
          >
            <Search className="h-[18px] w-[18px]" />
          </button>
          <NotificationBell />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
