"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/cn";

/** Icon swap is CSS-driven (dark: variant), so server and client markup match. */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Basculer entre mode clair et mode sombre"
      title="Mode clair / sombre"
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-xl text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink",
        className,
      )}
    >
      <Sun className="h-[18px] w-[18px] dark:hidden" />
      <Moon className="hidden h-[18px] w-[18px] dark:block" />
    </button>
  );
}
