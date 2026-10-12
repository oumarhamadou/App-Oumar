import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { DOMAINS, TOPICS, type Domain, type Topic } from "@/lib/taxonomy";

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-2 px-2 py-0.5 text-[11.5px] font-medium text-ink-2",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function DomainDot({ domain, className }: { domain: Domain; className?: string }) {
  return <span aria-hidden className={cn("inline-block h-1.5 w-1.5 shrink-0 rounded-full", DOMAINS[domain].dotClass, className)} />;
}

export function TopicBadge({ topic, className }: { topic: Topic; className?: string }) {
  return (
    <Badge className={className}>
      <DomainDot domain={TOPICS[topic].domain} />
      {TOPICS[topic].label}
    </Badge>
  );
}

export function DomainBadge({ domain, className }: { domain: Domain; className?: string }) {
  return (
    <Badge className={className}>
      <DomainDot domain={domain} />
      {DOMAINS[domain].short}
    </Badge>
  );
}
