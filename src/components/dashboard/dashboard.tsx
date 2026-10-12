"use client";

import { BarChart3, Check, Eye, RotateCcw, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNow } from "@/hooks/use-now";
import { formatDate } from "@/lib/format";
import type { MarketSnapshot } from "@/lib/markets/types";
import type { NewsFeedResult } from "@/lib/news/types";
import { useAppStore, useHydrated, type WidgetId } from "@/lib/store";
import { MacroExplorer } from "./macro-explorer";
import { AiTrendsWidget, ConceptWidget, ProgressWidget, ReadingWidget, RecommendationsWidget } from "./widget-misc";
import { MarketsWidget } from "./widget-markets";
import { NewsWidget } from "./widget-news";
import { LiveBadge, WIDGET_META, Widget } from "./widget-shell";

function greeting(hour: number): string {
  if (hour < 5 || hour >= 18) return "Bonsoir";
  return "Bonjour";
}

export function Dashboard({ news, markets }: { news: NewsFeedResult; markets: MarketSnapshot }) {
  const hydrated = useHydrated();
  const now = useNow();
  const name = useAppStore((s) => s.profile.name.trim());
  const dashboard = useAppStore((s) => s.dashboard);
  const toggleWidget = useAppStore((s) => s.toggleWidget);
  const resetDashboard = useAppStore((s) => s.resetDashboard);
  const [editing, setEditing] = useState(false);

  const visible = dashboard.order.filter((id) => !dashboard.hidden.includes(id));

  const render = (id: WidgetId) => {
    switch (id) {
      case "une":
        return <NewsWidget key={id} news={news} editing={editing} hydrated={hydrated} />;
      case "marches":
        return <MarketsWidget key={id} markets={markets} editing={editing} />;
      case "macro":
        return (
          <Widget
            key={id}
            id="macro"
            editing={editing}
            icon={<BarChart3 className="h-4 w-4" />}
            description="Comparez jusqu'à quatre économies"
            action={<LiveBadge live={markets.macro.live} offlineLabel="Instantané" />}
          >
            <MacroExplorer macro={markets.macro} />
          </Widget>
        );
      case "progression":
        return <ProgressWidget key={id} editing={editing} />;
      case "recommandations":
        return <RecommendationsWidget key={id} editing={editing} />;
      case "ia":
        return <AiTrendsWidget key={id} editing={editing} />;
      case "concept":
        return <ConceptWidget key={id} editing={editing} />;
      case "lecture":
        return <ReadingWidget key={id} editing={editing} />;
    }
  };

  return (
    <div>
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[13px] font-medium text-ink-3 first-letter:uppercase" suppressHydrationWarning>
            {now ? formatDate(new Date(now).toISOString(), { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : " "}
          </p>
          <h1 className="mt-1 text-[28px] font-semibold tracking-[-0.02em] sm:text-[32px]">
            {now ? greeting(new Date(now).getHours()) : "Bonjour"}
            {hydrated && name ? `, ${name}` : ""}
          </h1>
          <p className="mt-1.5 text-[15px] text-ink-2">L&apos;essentiel de l&apos;IA, de l&apos;économie et de la finance, expliqué pour vous.</p>
        </div>
        <div className="flex items-center gap-2">
          {editing ? (
            <Button variant="ghost" size="sm" onClick={resetDashboard}>
              <RotateCcw className="h-3.5 w-3.5" /> Réinitialiser
            </Button>
          ) : null}
          <Button variant={editing ? "primary" : "outline"} size="sm" onClick={() => setEditing((e) => !e)} aria-pressed={editing}>
            {editing ? <Check className="h-3.5 w-3.5" /> : <SlidersHorizontal className="h-3.5 w-3.5" />}
            {editing ? "Terminer" : "Personnaliser"}
          </Button>
        </div>
      </header>

      {editing && dashboard.hidden.length > 0 ? (
        <div className="mb-5 flex flex-wrap items-center gap-2 rounded-2xl border border-dashed border-line-strong px-4 py-3">
          <span className="text-[13px] text-ink-3">Widgets masqués :</span>
          {dashboard.hidden.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => toggleWidget(id)}
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1 text-[12.5px] font-medium hover:bg-surface-2"
            >
              <Eye className="h-3.5 w-3.5" /> {WIDGET_META[id].title}
            </button>
          ))}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">{visible.map(render)}</div>
    </div>
  );
}
