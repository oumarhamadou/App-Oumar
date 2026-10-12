"use client";

import { Table2 } from "lucide-react";
import { useId, useState, type ReactNode } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
  type TooltipValueType,
} from "recharts";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/cn";

/** Categorical slots in fixed order (validated palette, stepped per theme in globals.css). */
export const SERIES_COLORS = [
  "var(--series-1)",
  "var(--series-2)",
  "var(--series-3)",
  "var(--series-4)",
  "var(--series-5)",
  "var(--series-6)",
  "var(--series-7)",
  "var(--series-8)",
];

export interface SeriesDef {
  key: string;
  label: string;
  color: string;
}

type Row = Record<string, string | number | null>;

const AXIS_TICK = { fill: "var(--chart-muted)", fontSize: 11.5 };

function Legend({ series, shape }: { series: SeriesDef[]; shape: "line" | "rect" }) {
  if (series.length < 2) return null;
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-[12.5px] text-ink-2">
      {series.map((s) => (
        <li key={s.key} className="flex items-center gap-1.5">
          <span
            aria-hidden
            className={shape === "line" ? "h-[3px] w-3.5 rounded-full" : "h-2.5 w-2.5 rounded-[3px]"}
            style={{ background: s.color }}
          />
          {s.label}
        </li>
      ))}
    </ul>
  );
}

function makeTooltip(series: SeriesDef[], format: (v: number) => string, labelFormat?: (l: string) => string) {
  return function ChartTooltip({ active, payload, label }: TooltipContentProps<TooltipValueType, string | number>) {
    if (!active || !payload?.length) return null;
    return (
      <div className="min-w-[150px] rounded-xl border border-line bg-surface px-3 py-2.5 shadow-pop">
        <p className="mb-1.5 text-[11.5px] font-medium text-ink-3">{labelFormat ? labelFormat(String(label)) : label}</p>
        <ul className="space-y-1">
          {series.map((s) => {
            const entry = payload.find((p) => p.dataKey === s.key);
            if (!entry || entry.value === null || entry.value === undefined) return null;
            return (
              <li key={s.key} className="flex items-center gap-2 text-[12.5px]">
                <span aria-hidden className="h-[3px] w-3 rounded-full" style={{ background: s.color }} />
                <span className="font-semibold tabular-nums text-ink">{format(Number(entry.value))}</span>
                <span className="text-ink-3">{s.label}</span>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };
}

function DataTable({ data, xKey, xLabel, series, format }: { data: Row[]; xKey: string; xLabel: string; series: SeriesDef[]; format: (v: number) => string }) {
  return (
    <div className="max-h-72 overflow-auto rounded-xl border border-line">
      <table className="w-full text-[12.5px]">
        <thead className="sticky top-0 bg-surface-2">
          <tr>
            <th className="px-3 py-2 text-left font-medium text-ink-2">{xLabel}</th>
            {series.map((s) => (
              <th key={s.key} className="px-3 py-2 text-right font-medium text-ink-2">
                {s.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {data.map((row) => (
            <tr key={String(row[xKey])}>
              <td className="px-3 py-1.5 text-ink-2">{row[xKey]}</td>
              {series.map((s) => (
                <td key={s.key} className="px-3 py-1.5 text-right tabular-nums text-ink">
                  {row[s.key] === null || row[s.key] === undefined ? "—" : format(Number(row[s.key]))}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ChartFrame({
  title,
  description,
  series,
  legendShape = "line",
  source,
  table,
  children,
  className,
  actions,
}: {
  title?: ReactNode;
  description?: ReactNode;
  series: SeriesDef[];
  legendShape?: "line" | "rect";
  source?: ReactNode;
  table: ReactNode;
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
}) {
  const [showTable, setShowTable] = useState(false);
  const id = useId();
  // Charts render client-side only: they measure their container and generate SVG ids.
  const mounted = useMounted();
  return (
    <figure className={cn("min-w-0", className)}>
      {title || actions ? (
        <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
          <div>
            {title ? <figcaption className="text-[14px] font-semibold text-ink">{title}</figcaption> : null}
            {description ? <p className="mt-0.5 text-[12.5px] text-ink-3">{description}</p> : null}
          </div>
          {actions}
        </div>
      ) : null}
      <div className="mb-3">
        <Legend series={series} shape={legendShape} />
      </div>
      <div id={id}>{showTable ? table : mounted ? children : <div className="animate-pulse rounded-xl bg-surface-2" style={{ height: 220 }} />}</div>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11.5px] text-ink-3">
        <span>{source}</span>
        <button
          type="button"
          onClick={() => setShowTable((v) => !v)}
          aria-controls={id}
          className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 hover:bg-surface-2 hover:text-ink"
        >
          <Table2 className="h-3.5 w-3.5" />
          {showTable ? "Voir le graphique" : "Voir les données"}
        </button>
      </div>
    </figure>
  );
}

interface CommonProps {
  data: Row[];
  xKey: string;
  xLabel: string;
  series: SeriesDef[];
  format: (v: number) => string;
  /** Compact formatter for axis ticks. */
  tickFormat?: (v: number) => string;
  height?: number;
  title?: ReactNode;
  description?: ReactNode;
  source?: ReactNode;
  className?: string;
  zeroLine?: boolean;
  actions?: ReactNode;
  labelFormat?: (l: string) => string;
}

export function LineChartView({ data, xKey, xLabel, series, format, tickFormat, height = 260, zeroLine, ...frame }: CommonProps) {
  const Tip = makeTooltip(series, format, frame.labelFormat);
  return (
    <ChartFrame {...frame} series={series} legendShape="line" table={<DataTable data={data} xKey={xKey} xLabel={xLabel} series={series} format={format} />}>
      <div style={{ height }} className="w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
            <XAxis dataKey={xKey} tick={AXIS_TICK} tickLine={false} axisLine={{ stroke: "var(--chart-axis)" }} minTickGap={16} />
            <YAxis tick={AXIS_TICK} tickLine={false} axisLine={false} width={48} tickFormatter={tickFormat ?? format} />
            {zeroLine ? <ReferenceLine y={0} stroke="var(--chart-axis)" /> : null}
            <Tooltip content={Tip} cursor={{ stroke: "var(--chart-axis)", strokeWidth: 1 }} />
            {series.map((s) => (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.label}
                stroke={s.color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4.5, strokeWidth: 2, stroke: "var(--surface)" }}
                connectNulls
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartFrame>
  );
}

export function StackedAreaView({ data, xKey, xLabel, series, format, tickFormat, height = 260, ...frame }: CommonProps) {
  const Tip = makeTooltip(series, format, frame.labelFormat);
  return (
    <ChartFrame {...frame} series={series} legendShape="rect" table={<DataTable data={data} xKey={xKey} xLabel={xLabel} series={series} format={format} />}>
      <div style={{ height }} className="w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
            <XAxis dataKey={xKey} tick={AXIS_TICK} tickLine={false} axisLine={{ stroke: "var(--chart-axis)" }} minTickGap={16} />
            <YAxis tick={AXIS_TICK} tickLine={false} axisLine={false} width={56} tickFormatter={tickFormat ?? format} />
            <Tooltip content={Tip} cursor={{ stroke: "var(--chart-axis)", strokeWidth: 1 }} />
            {series.map((s) => (
              <Area
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.label}
                stackId="stack"
                stroke={s.color}
                strokeWidth={2}
                fill={s.color}
                fillOpacity={0.12}
                isAnimationActive={false}
                activeDot={{ r: 4.5, strokeWidth: 2, stroke: "var(--surface)" }}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartFrame>
  );
}

export function BarChartView({ data, xKey, xLabel, series, format, tickFormat, height = 260, stacked = false, ...frame }: CommonProps & { stacked?: boolean }) {
  const Tip = makeTooltip(series, format, frame.labelFormat);
  return (
    <ChartFrame {...frame} series={series} legendShape="rect" table={<DataTable data={data} xKey={xKey} xLabel={xLabel} series={series} format={format} />}>
      <div style={{ height }} className="w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }} barCategoryGap="28%" barGap={2}>
            <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
            <XAxis dataKey={xKey} tick={AXIS_TICK} tickLine={false} axisLine={{ stroke: "var(--chart-axis)" }} minTickGap={8} />
            <YAxis tick={AXIS_TICK} tickLine={false} axisLine={false} width={56} tickFormatter={tickFormat ?? format} />
            <ReferenceLine y={0} stroke="var(--chart-axis)" />
            <Tooltip content={Tip} cursor={{ fill: "var(--surface-2)" }} />
            {series.map((s, i) => (
              <Bar
                key={s.key}
                dataKey={s.key}
                name={s.label}
                fill={s.color}
                stackId={stacked ? "stack" : undefined}
                maxBarSize={24}
                stroke="var(--surface)"
                strokeWidth={stacked ? 1 : 0}
                radius={!stacked || i === series.length - 1 ? [4, 4, 0, 0] : 0}
                isAnimationActive={false}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartFrame>
  );
}
