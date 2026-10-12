"use client";

import { Check, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { LineChartView, SERIES_COLORS, type SeriesDef } from "@/components/charts/charts";
import { cn } from "@/lib/cn";
import { formatPercent } from "@/lib/format";
import type { MarketSnapshot } from "@/lib/markets/types";

type Indicator = "inflation" | "growth";

const INDICATORS: Record<Indicator, { label: string; description: string }> = {
  inflation: { label: "Inflation", description: "Hausse annuelle des prix à la consommation, en %" },
  growth: { label: "Croissance du PIB", description: "Variation annuelle du PIB en volume, en %" },
};

const MAX_SERIES = 4;
const DEFAULT_COUNTRIES = ["FRA", "USA", "CHN", "DEU"];

/**
 * Country comparison with stable colors: each selected country keeps its
 * slot (and color) when others are added or removed.
 */
export function MacroExplorer({ macro, height = 240 }: { macro: MarketSnapshot["macro"]; height?: number }) {
  const [indicator, setIndicator] = useState<Indicator>("inflation");
  const available = macro[indicator === "inflation" ? "inflation" : "growth"];
  const allCodes = useMemo(() => [...new Set([...macro.inflation, ...macro.growth].map((s) => s.code))], [macro]);
  const names = useMemo(() => Object.fromEntries([...macro.inflation, ...macro.growth].map((s) => [s.code, s.name])), [macro]);
  const [slots, setSlots] = useState<(string | null)[]>(() => {
    const initial = DEFAULT_COUNTRIES.filter((c) => allCodes.includes(c)).slice(0, MAX_SERIES);
    return [...initial, ...Array(MAX_SERIES - initial.length).fill(null)];
  });

  const toggle = (code: string) =>
    setSlots((current) => {
      const index = current.indexOf(code);
      if (index >= 0) return current.map((c, i) => (i === index ? null : c));
      const free = current.indexOf(null);
      return free === -1 ? current : current.map((c, i) => (i === free ? code : c));
    });

  const series: SeriesDef[] = slots.flatMap((code, slot) =>
    code && available.some((s) => s.code === code) ? [{ key: code, label: names[code] ?? code, color: SERIES_COLORS[slot] }] : [],
  );

  const data = useMemo(() => {
    const years = [...new Set(available.flatMap((s) => s.points.map((p) => p.year)))].sort((a, b) => a - b);
    return years.map((year) => {
      const row: Record<string, number | string | null> = { year: String(year) };
      for (const s of series) {
        row[s.key] = available.find((c) => c.code === s.key)?.points.find((p) => p.year === year)?.value ?? null;
      }
      return row;
    });
  }, [available, series]);

  const full = slots.every(Boolean);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div role="tablist" aria-label="Indicateur" className="inline-flex rounded-xl bg-surface-2 p-1">
          {(Object.keys(INDICATORS) as Indicator[]).map((key) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={indicator === key}
              onClick={() => setIndicator(key)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors",
                indicator === key ? "bg-surface text-ink shadow-card" : "text-ink-3 hover:text-ink",
              )}
            >
              {INDICATORS[key].label}
            </button>
          ))}
        </div>
      </div>
      <div className="mb-4 flex flex-wrap gap-1.5" aria-label={`Pays comparés (${MAX_SERIES} au maximum)`}>
        {allCodes.map((code) => {
          const slot = slots.indexOf(code);
          const selected = slot >= 0;
          return (
            <button
              key={code}
              type="button"
              onClick={() => toggle(code)}
              disabled={!selected && full}
              aria-pressed={selected}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12.5px] font-medium transition-colors disabled:opacity-40",
                selected ? "border-line-strong bg-surface text-ink" : "border-line text-ink-3 hover:text-ink",
              )}
            >
              {selected ? (
                <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: SERIES_COLORS[slot] }} />
              ) : (
                <Plus className="h-3 w-3" />
              )}
              {names[code] ?? code}
              {selected ? <Check className="h-3 w-3 text-ink-3" /> : null}
            </button>
          );
        })}
      </div>
      {series.length === 0 ? (
        <p className="py-10 text-center text-[13px] text-ink-3">Sélectionnez au moins un pays.</p>
      ) : (
        <LineChartView
          data={data}
          xKey="year"
          xLabel="Année"
          series={series}
          format={(v) => formatPercent(v)}
          tickFormat={(v) => `${v} %`}
          height={height}
          zeroLine
          description={INDICATORS[indicator].description}
          title={INDICATORS[indicator].label}
          source={
            <>
              Source : {macro.source}
              {macro.note ? ` — ${macro.note}` : ""}
            </>
          }
        />
      )}
    </div>
  );
}
