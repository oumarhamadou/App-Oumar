"use client";

import { useNow } from "@/hooks/use-now";
import { formatDate, formatRelative } from "@/lib/format";

/** Absolute date on the server, relative ("il y a 2 h") once in the browser. */
export function RelativeTime({ iso, className }: { iso: string; className?: string }) {
  const now = useNow();
  return (
    <time dateTime={iso} className={className} title={formatDate(iso, { dateStyle: "full", timeStyle: "short" })} suppressHydrationWarning>
      {now ? formatRelative(iso, now) : formatDate(iso)}
    </time>
  );
}
