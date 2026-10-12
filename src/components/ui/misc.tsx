import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function ProgressBar({ value, className, label }: { value: number; className?: string; label?: string }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
      aria-label={label}
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-accent-soft", className)}
    >
      <div className="h-full rounded-full bg-accent transition-[width] duration-500" style={{ width: `${pct}%` }} />
    </div>
  );
}

export function EmptyState({ icon, title, description, action, className }: { icon?: ReactNode; title: string; description?: ReactNode; action?: ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-2xl border border-dashed border-line-strong px-6 py-10 text-center", className)}>
      {icon ? <div className="mb-3 text-ink-3">{icon}</div> : null}
      <p className="text-sm font-medium text-ink">{title}</p>
      {description ? <p className="mt-1 max-w-sm text-[13px] text-ink-3">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-lg bg-surface-2", className)} />;
}

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded-md border border-line-strong bg-surface px-1 font-sans text-[11px] font-medium text-ink-3">
      {children}
    </kbd>
  );
}

export function Notice({ tone = "info", children, className }: { tone?: "info" | "warning"; children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "flex gap-2.5 rounded-xl border px-3.5 py-2.5 text-[13px] leading-relaxed",
        tone === "info" ? "border-line bg-surface-2 text-ink-2" : "border-warning/40 bg-warning/10 text-ink",
        className,
      )}
    >
      {children}
    </div>
  );
}
