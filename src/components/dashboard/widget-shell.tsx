"use client";

import { ChevronDown, ChevronUp, EyeOff } from "lucide-react";
import type { ReactNode } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import { useAppStore, type WidgetId } from "@/lib/store";

export const WIDGET_META: Record<WidgetId, { title: string; span: string }> = {
  une: { title: "À la une pour vous", span: "lg:col-span-8" },
  marches: { title: "Marchés", span: "lg:col-span-4" },
  macro: { title: "Indicateurs économiques", span: "lg:col-span-8" },
  progression: { title: "Ma progression", span: "lg:col-span-4" },
  recommandations: { title: "Recommandé pour vous", span: "lg:col-span-6" },
  ia: { title: "Tendances IA", span: "lg:col-span-6" },
  concept: { title: "Concept du jour", span: "lg:col-span-6" },
  lecture: { title: "Ma liste de lecture", span: "lg:col-span-6" },
};

export function Widget({
  id,
  editing,
  description,
  action,
  icon,
  children,
  bodyClassName,
}: {
  id: WidgetId;
  editing: boolean;
  description?: ReactNode;
  action?: ReactNode;
  icon?: ReactNode;
  children: ReactNode;
  bodyClassName?: string;
}) {
  const moveWidget = useAppStore((s) => s.moveWidget);
  const toggleWidget = useAppStore((s) => s.toggleWidget);
  const meta = WIDGET_META[id];
  return (
    <Card className={cn("flex min-w-0 flex-col", meta.span, editing && "ring-2 ring-accent/30")}>
      <CardHeader
        title={meta.title}
        description={description}
        icon={icon}
        action={
          editing ? (
            <div className="flex items-center gap-0.5">
              <button type="button" onClick={() => moveWidget(id, -1)} aria-label={`Monter « ${meta.title} »`} className="rounded-lg p-1.5 text-ink-3 hover:bg-surface-2 hover:text-ink">
                <ChevronUp className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => moveWidget(id, 1)} aria-label={`Descendre « ${meta.title} »`} className="rounded-lg p-1.5 text-ink-3 hover:bg-surface-2 hover:text-ink">
                <ChevronDown className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => toggleWidget(id)} aria-label={`Masquer « ${meta.title} »`} className="rounded-lg p-1.5 text-ink-3 hover:bg-surface-2 hover:text-ink">
                <EyeOff className="h-4 w-4" />
              </button>
            </div>
          ) : (
            action
          )
        }
      />
      <CardBody className={cn("flex-1", bodyClassName)}>{children}</CardBody>
    </Card>
  );
}

export function LiveBadge({ live, offlineLabel = "Hors ligne" }: { live: boolean; offlineLabel?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-2 py-0.5 text-[11px] font-medium text-ink-3">
      <span className={cn("h-1.5 w-1.5 rounded-full", live ? "bg-good" : "bg-warning")} aria-hidden />
      {live ? "En direct" : offlineLabel}
    </span>
  );
}
