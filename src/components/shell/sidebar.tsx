"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { SITE } from "@/lib/site";
import { LEVELS } from "@/lib/taxonomy";
import { useAppStore, useHydrated } from "@/lib/store";
import { LogoMark } from "./logo";
import { NAV_PRIMARY, NAV_SECONDARY, isActive, type NavItem } from "./nav-items";

function NavLink({ item, pathname, onNavigate }: { item: NavItem; pathname: string; onNavigate?: () => void }) {
  const active = isActive(pathname, item.href);
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group flex items-center gap-3 rounded-xl px-3 py-2 text-[14px] font-medium transition-colors",
        active ? "bg-surface text-ink shadow-card ring-1 ring-line" : "text-ink-2 hover:bg-surface-2 hover:text-ink",
      )}
    >
      <Icon className={cn("h-[18px] w-[18px] shrink-0", active ? "text-accent-text" : "text-ink-3 group-hover:text-ink-2")} />
      {item.label}
    </Link>
  );
}

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Navigation principale" className="flex flex-col gap-0.5">
      {NAV_PRIMARY.map((item) => (
        <NavLink key={item.href} item={item} pathname={pathname} onNavigate={onNavigate} />
      ))}
      <div className="my-3 h-px bg-line" />
      {NAV_SECONDARY.map((item) => (
        <NavLink key={item.href} item={item} pathname={pathname} onNavigate={onNavigate} />
      ))}
    </nav>
  );
}

function ProfileCard() {
  const hydrated = useHydrated();
  const profile = useAppStore((s) => s.profile);
  if (!hydrated) return <div className="h-14" />;
  const initial = (profile.name.trim()[0] ?? "P").toUpperCase();
  return (
    <Link href="/parametres" className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-surface-2">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-soft text-sm font-semibold text-accent-text">
        {initial}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[13.5px] font-medium text-ink">{profile.name.trim() || "Mon profil"}</span>
        <span className="block text-[12px] text-ink-3">Niveau {LEVELS[profile.level].label.toLowerCase()}</span>
      </span>
    </Link>
  );
}

export function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-dvh w-[260px] shrink-0 flex-col border-r border-line bg-page px-4 py-5 lg:flex">
      <Link href="/" className="mb-7 flex items-center gap-2.5 px-2">
        <LogoMark />
        <span className="leading-none">
          <span className="block text-[17px] font-semibold tracking-tight text-ink">{SITE.name}</span>
          <span className="mt-1 block text-[11.5px] font-medium text-ink-3">{SITE.tagline}</span>
        </span>
      </Link>
      <SidebarNav />
      <div className="mt-auto border-t border-line pt-3">
        <ProfileCard />
      </div>
    </aside>
  );
}
