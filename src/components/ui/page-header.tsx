import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="min-w-0 max-w-2xl">
        {eyebrow ? <div className="mb-2 text-[12.5px] font-medium text-ink-3">{eyebrow}</div> : null}
        <h1 className="text-[28px] font-semibold leading-tight tracking-[-0.02em] text-ink sm:text-[32px]">{title}</h1>
        {description ? <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}

export function SectionTitle({ title, description, action, id }: { title: ReactNode; description?: ReactNode; action?: ReactNode; id?: string }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4" id={id}>
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-ink">{title}</h2>
        {description ? <p className="mt-0.5 text-[13.5px] text-ink-3">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
