/* eslint-disable @next/next/no-img-element -- remote feed images come from arbitrary hosts */
import { Bitcoin, Briefcase, Cpu, Landmark, LineChart, Lightbulb, Rocket, Wallet, Globe2, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import type { NewsItem } from "@/lib/news/types";
import { TOPICS, type Topic } from "@/lib/taxonomy";

const TOPIC_ICON: Record<Topic, LucideIcon> = {
  ia: Cpu,
  innovation: Lightbulb,
  "economie-mondiale": Globe2,
  "politique-monetaire": Landmark,
  entreprises: Briefcase,
  startups: Rocket,
  marches: LineChart,
  "finance-perso": Wallet,
  crypto: Bitcoin,
};

const DOMAIN_GRADIENT = {
  ia: "from-domain-ia/25 via-domain-ia/10 to-transparent",
  economie: "from-domain-eco/25 via-domain-eco/10 to-transparent",
  finance: "from-domain-fin/25 via-domain-fin/10 to-transparent",
} as const;

const DOMAIN_TEXT = {
  ia: "text-domain-ia",
  economie: "text-domain-eco",
  finance: "text-domain-fin",
} as const;

export function NewsVisual({ item, className, iconSize = "h-7 w-7" }: { item: NewsItem; className?: string; iconSize?: string }) {
  const topic = item.topics[0] ?? "economie-mondiale";
  const domain = TOPICS[topic].domain;
  const Icon = TOPIC_ICON[topic];
  return (
    <div className={cn("relative overflow-hidden bg-surface-2", className)}>
      <div className={cn("absolute inset-0 bg-gradient-to-br", DOMAIN_GRADIENT[domain])} />
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{ backgroundImage: "radial-gradient(circle at 1px 1px, var(--border-strong) 1px, transparent 0)", backgroundSize: "14px 14px" }}
      />
      <Icon className={cn("absolute bottom-3 right-3", iconSize, DOMAIN_TEXT[domain])} strokeWidth={1.5} />
      {item.image ? (
        <img src={item.image} alt="" loading="lazy" referrerPolicy="no-referrer" className="absolute inset-0 h-full w-full object-cover" />
      ) : null}
    </div>
  );
}
