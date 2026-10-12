"use client";

import { useEffect } from "react";
import { useAppStore, useHydrated, type LibraryItem } from "@/lib/store";

/** Records a page view in the reading history (feeds recommendations). */
export function TrackVisit({ item }: { item: LibraryItem }) {
  const hydrated = useHydrated();
  const recordVisit = useAppStore((s) => s.recordVisit);
  useEffect(() => {
    if (hydrated) recordVisit(item);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- record once per item key
  }, [hydrated, item.key]);
  return null;
}
