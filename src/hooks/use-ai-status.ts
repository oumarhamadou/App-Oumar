"use client";

import { useEffect, useState } from "react";

let status: Promise<boolean> | null = null;

/** Whether the server has AI credentials configured; null while unknown. */
export function useAiStatus(): boolean | null {
  const [online, setOnline] = useState<boolean | null>(null);
  useEffect(() => {
    status ??= fetch("/api/status")
      .then((r) => r.json() as Promise<{ ai: boolean }>)
      .then((s) => s.ai)
      .catch(() => false);
    let active = true;
    status.then((value) => active && setOnline(value));
    return () => {
      active = false;
    };
  }, []);
  return online;
}
