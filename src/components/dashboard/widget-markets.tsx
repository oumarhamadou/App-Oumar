"use client";

import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { useMemo } from "react";
import { Line, LineChart, ResponsiveContainer, YAxis } from "recharts";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/cn";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";
import type { MarketSnapshot } from "@/lib/markets/types";
import { LiveBadge, Widget } from "./widget-shell";

function Change({ value }: { value: number | null | undefined }) {
  if (value === null || value === undefined || !Number.isFinite(value)) return <span className="text-[12px] text-ink-3">—</span>;
  const flat = Math.abs(value) < 0.005;
  const Icon = flat ? Minus : value > 0 ? ArrowUpRight : ArrowDownRight;
  return (
    <span className={cn("inline-flex items-center gap-0.5 text-[12px] font-medium tabular-nums", flat ? "text-ink-3" : value > 0 ? "text-good-text" : "text-critical-text")}>
      <Icon className="h-3.5 w-3.5" aria-hidden />
      <span className="sr-only">{value > 0 ? "en hausse de" : "en baisse de"}</span>
      {formatPercent(value, 2, true)}
    </span>
  );
}

export function MarketsWidget({ markets, editing }: { markets: MarketSnapshot; editing: boolean }) {
  const { fx, crypto } = markets;
  const mounted = useMounted();
  const eurUsd = fx.quotes.find((q) => q.code === "USD");
  const history = useMemo(() => fx.history.slice(-90), [fx.history]);
  const periodChange = history.length > 1 ? ((history[history.length - 1].value - history[0].value) / history[0].value) * 100 : null;

  return (
    <Widget id="marches" editing={editing} description="Devises (BCE) et cryptoactifs" action={<LiveBadge live={fx.live || crypto.live} />}>
      {eurUsd ? (
        <div className="mb-4 rounded-xl bg-surface-2 p-4">
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-[12.5px] font-medium text-ink-2">EUR / USD</p>
            {history.length > 1 ? <Change value={periodChange} /> : null}
          </div>
          <p className="mt-1 text-[28px] font-semibold tracking-tight text-ink">{formatNumber(eurUsd.rate, 4)}</p>
          {history.length > 1 && mounted ? (
            <div className="mt-2 h-12" aria-hidden>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history}>
                  <YAxis hide domain={["dataMin", "dataMax"]} />
                  <Line type="monotone" dataKey="value" stroke="var(--series-1)" strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : null}
          <p className="mt-1 text-[11.5px] text-ink-3">
            {fx.live ? `Taux de référence BCE du ${fx.date} · variation sur ${history.length} séances` : fx.note}
          </p>
        </div>
      ) : null}

      <ul className="divide-y divide-line">
        {fx.quotes
          .filter((q) => q.code !== "USD")
          .map((q) => (
            <li key={q.code} className="flex items-center justify-between gap-3 py-2">
              <span className="min-w-0">
                <span className="block text-[13.5px] font-medium text-ink">EUR / {q.code}</span>
                <span className="block truncate text-[12px] text-ink-3">{q.label}</span>
              </span>
              <span className="text-right">
                <span className="block text-[13.5px] font-medium tabular-nums text-ink">{formatNumber(q.rate, q.rate > 50 ? 2 : 4)}</span>
                {fx.live ? <Change value={q.change} /> : null}
              </span>
            </li>
          ))}
        <li className="flex items-center justify-between gap-3 py-2">
          <span>
            <span className="block text-[13.5px] font-medium text-ink">EUR / XOF · XAF</span>
            <span className="block text-[12px] text-ink-3">Franc CFA (parité fixe)</span>
          </span>
          <span className="text-[13.5px] font-medium tabular-nums text-ink">655,957</span>
        </li>
      </ul>

      <div className="mt-4 border-t border-line pt-3">
        <p className="mb-2 text-[12px] font-medium uppercase tracking-wide text-ink-3">Cryptoactifs</p>
        {crypto.live ? (
          <ul className="space-y-2">
            {crypto.assets.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-3">
                <span className="text-[13.5px] font-medium text-ink">
                  {a.name} <span className="text-ink-3">{a.symbol}</span>
                </span>
                <span className="text-right">
                  <span className="block text-[13.5px] font-medium tabular-nums text-ink">{formatCurrency(a.priceEur, "EUR", a.priceEur > 100 ? 0 : 2)}</span>
                  <Change value={a.change24h} />
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[12.5px] text-ink-3">Cours en direct indisponibles pour le moment. Ils s&apos;afficheront dès que la source (CoinGecko) répondra.</p>
        )}
      </div>
    </Widget>
  );
}
