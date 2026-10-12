"use client";

import { ThemeProvider } from "next-themes";
import { useEffect, type ReactNode } from "react";
import { useAppStore } from "@/lib/store";

function StoreHydrator() {
  useEffect(() => {
    void useAppStore.persist.rehydrate();
    // Keep tabs in sync when the user changes data in another window.
    const onStorage = (e: StorageEvent) => {
      if (e.key === useAppStore.persist.getOptions().name) void useAppStore.persist.rehydrate();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <StoreHydrator />
      {children}
    </ThemeProvider>
  );
}
