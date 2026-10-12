"use client";

import { useId } from "react";
import { formatNumber } from "@/lib/format";

/** Slider + numeric input pair, kept in sync and clamped. */
export function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
  hint,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  hint?: string;
}) {
  const id = useId();
  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  const decimals = step < 1 ? String(step).split(".")[1]?.length ?? 1 : 0;
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-[13px] font-medium text-ink-2">
          {label}
        </label>
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            inputMode="decimal"
            value={Number.isFinite(value) ? value : ""}
            min={min}
            max={max}
            step={step}
            onChange={(e) => {
              const parsed = Number(e.target.value);
              if (e.target.value !== "" && Number.isFinite(parsed)) onChange(clamp(parsed));
            }}
            aria-label={`${label}${unit ? ` (${unit})` : ""}`}
            className="h-8 w-28 rounded-lg border border-line bg-surface px-2 text-right text-[13.5px] font-medium tabular-nums outline-none focus:border-accent"
          />
          {unit ? <span className="w-8 text-[12.5px] text-ink-3">{unit}</span> : null}
        </div>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-[var(--accent)]"
        aria-valuetext={`${formatNumber(value, decimals)}${unit ? ` ${unit}` : ""}`}
      />
      {hint ? <p className="mt-0.5 text-[11.5px] text-ink-3">{hint}</p> : null}
    </div>
  );
}

export function ResultTile({ label, value, emphasis = false, sub }: { label: string; value: string; emphasis?: boolean; sub?: string }) {
  return (
    <div className={emphasis ? "rounded-xl bg-accent-soft p-4" : "rounded-xl bg-surface-2 p-4"}>
      <p className="text-[12px] text-ink-3">{label}</p>
      <p className={emphasis ? "mt-1 text-[24px] font-semibold tracking-tight text-ink" : "mt-1 text-[18px] font-semibold tracking-tight text-ink"}>{value}</p>
      {sub ? <p className="mt-0.5 text-[11.5px] text-ink-3">{sub}</p> : null}
    </div>
  );
}

export function SimulatorLayout({ controls, results, chart, insight }: { controls: React.ReactNode; results: React.ReactNode; chart: React.ReactNode; insight?: React.ReactNode }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <div className="space-y-5">{controls}</div>
      <div className="min-w-0">
        <div className="grid gap-3 sm:grid-cols-3">{results}</div>
        {insight ? <p className="mt-4 rounded-xl border border-line px-4 py-3 text-[13.5px] leading-relaxed text-ink-2">{insight}</p> : null}
        <div className="mt-5">{chart}</div>
      </div>
    </div>
  );
}
