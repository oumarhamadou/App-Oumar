"use client";

import { LineChartView, SERIES_COLORS } from "@/components/charts/charts";
import type { CaseStudy } from "@/content/types";
import { formatNumber } from "@/lib/format";

export function CaseChart({ chart }: { chart: NonNullable<CaseStudy["chart"]> }) {
  const xs = [...new Set(chart.series.flatMap((s) => s.points.map((p) => p.x)))];
  const data = xs.map((x) => {
    const row: Record<string, string | number | null> = { x };
    chart.series.forEach((s, i) => {
      row[`s${i}`] = s.points.find((p) => p.x === x)?.y ?? null;
    });
    return row;
  });
  const series = chart.series.map((s, i) => ({ key: `s${i}`, label: s.label, color: SERIES_COLORS[i] }));
  const format = (v: number) => (chart.unit === "%" ? `${formatNumber(v, 1)} %` : `${formatNumber(v)} ${chart.unit}`);
  return (
    <LineChartView
      data={data}
      xKey="x"
      xLabel="Période"
      series={series}
      format={format}
      tickFormat={(v) => (chart.unit === "%" ? `${v} %` : formatNumber(v))}
      title={chart.title}
      source={`Source : ${chart.source}`}
      zeroLine={chart.unit === "%"}
    />
  );
}
