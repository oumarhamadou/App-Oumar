import { cacheLife } from "next/cache";
import { FALLBACK_FX, FALLBACK_GROWTH, FALLBACK_INFLATION } from "./fallback";
import type { CountrySeries, CryptoQuote, FxQuote, MarketSnapshot } from "./types";

export type { MarketSnapshot, CountrySeries, FxQuote, CryptoQuote } from "./types";

const TIMEOUT_MS = 6000;

export const FX_CODES: Record<string, string> = {
  USD: "Dollar américain",
  GBP: "Livre sterling",
  JPY: "Yen japonais",
  CHF: "Franc suisse",
  CNY: "Yuan chinois",
};

export const MACRO_COUNTRIES: Record<string, string> = {
  FRA: "France",
  USA: "États-Unis",
  DEU: "Allemagne",
  GBR: "Royaume-Uni",
  JPN: "Japon",
  CHN: "Chine",
  IND: "Inde",
  BRA: "Brésil",
  NGA: "Nigeria",
  ZAF: "Afrique du Sud",
  MAR: "Maroc",
  CIV: "Côte d'Ivoire",
  SEN: "Sénégal",
  CMR: "Cameroun",
  KEN: "Kenya",
};

const CRYPTO_ASSETS: Record<string, { name: string; symbol: string }> = {
  bitcoin: { name: "Bitcoin", symbol: "BTC" },
  ethereum: { name: "Ethereum", symbol: "ETH" },
  solana: { name: "Solana", symbol: "SOL" },
};

async function getJson(url: string, headers: Record<string, string> = {}): Promise<unknown> {
  const response = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS), headers });
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
  return response.json();
}

/** Frankfurter (ECB reference rates) time series → quotes with day-over-day change + EUR/USD history. */
export function parseFrankfurterSeries(payload: unknown): { date: string; quotes: FxQuote[]; history: { date: string; value: number }[] } | null {
  const rates = (payload as { rates?: Record<string, Record<string, number>> })?.rates;
  if (!rates) return null;
  const dates = Object.keys(rates).sort();
  if (dates.length === 0) return null;
  const last = rates[dates[dates.length - 1]];
  const previous = dates.length > 1 ? rates[dates[dates.length - 2]] : undefined;
  const quotes: FxQuote[] = Object.keys(FX_CODES)
    .filter((code) => typeof last[code] === "number")
    .map((code) => ({
      code,
      label: FX_CODES[code],
      rate: last[code],
      change: previous?.[code] ? ((last[code] - previous[code]) / previous[code]) * 100 : undefined,
    }));
  const history = dates
    .filter((date) => typeof rates[date].USD === "number")
    .map((date) => ({ date, value: rates[date].USD }));
  return { date: dates[dates.length - 1], quotes, history };
}

/** World Bank API v2 → one series per country, oldest year first. */
export function parseWorldBank(payload: unknown): CountrySeries[] {
  if (!Array.isArray(payload) || !Array.isArray(payload[1])) return [];
  const rows = payload[1] as { countryiso3code?: string; date?: string; value?: number | null }[];
  const byCountry = new Map<string, { year: number; value: number }[]>();
  for (const row of rows) {
    const code = row.countryiso3code;
    if (!code || !(code in MACRO_COUNTRIES) || typeof row.value !== "number") continue;
    const year = Number(row.date);
    if (!Number.isFinite(year)) continue;
    const list = byCountry.get(code) ?? [];
    list.push({ year, value: Math.round(row.value * 10) / 10 });
    byCountry.set(code, list);
  }
  return Object.keys(MACRO_COUNTRIES)
    .filter((code) => byCountry.has(code))
    .map((code) => ({
      code,
      name: MACRO_COUNTRIES[code],
      points: byCountry.get(code)!.sort((a, b) => a.year - b.year),
    }));
}

export function parseCoinGecko(payload: unknown): CryptoQuote[] {
  const data = payload as Record<string, { eur?: number; usd?: number; eur_24h_change?: number }>;
  if (!data || typeof data !== "object") return [];
  return Object.entries(CRYPTO_ASSETS)
    .filter(([id]) => typeof data[id]?.eur === "number" && typeof data[id]?.usd === "number")
    .map(([id, meta]) => ({
      id,
      ...meta,
      priceEur: data[id].eur!,
      priceUsd: data[id].usd!,
      change24h: typeof data[id].eur_24h_change === "number" ? data[id].eur_24h_change! : null,
    }));
}

function isoDaysAgo(days: number): string {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString().slice(0, 10);
}

async function loadFx(): Promise<MarketSnapshot["fx"]> {
  try {
    const symbols = Object.keys(FX_CODES).join(",");
    const payload = await getJson(`https://api.frankfurter.app/${isoDaysAgo(120)}..?from=EUR&to=${symbols}`);
    const parsed = parseFrankfurterSeries(payload);
    if (!parsed || parsed.quotes.length === 0) throw new Error("empty FX payload");
    return { live: true, ...parsed };
  } catch {
    return { live: false, date: FALLBACK_FX.date, note: FALLBACK_FX.label, quotes: FALLBACK_FX.quotes, history: [] };
  }
}

async function loadCrypto(): Promise<MarketSnapshot["crypto"]> {
  try {
    const headers: Record<string, string> = {};
    if (process.env.COINGECKO_API_KEY) headers["x-cg-demo-api-key"] = process.env.COINGECKO_API_KEY;
    const ids = Object.keys(CRYPTO_ASSETS).join(",");
    const payload = await getJson(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=eur,usd&include_24hr_change=true`,
      headers,
    );
    const assets = parseCoinGecko(payload);
    if (assets.length === 0) throw new Error("empty crypto payload");
    return { live: true, assets };
  } catch {
    return { live: false, assets: [] };
  }
}

async function loadIndicator(indicator: string): Promise<CountrySeries[]> {
  const countries = Object.keys(MACRO_COUNTRIES).join(";");
  const endYear = new Date().getUTCFullYear();
  const payload = await getJson(
    `https://api.worldbank.org/v2/country/${countries}/indicator/${indicator}?format=json&date=${endYear - 10}:${endYear}&per_page=500`,
  );
  return parseWorldBank(payload);
}

async function loadMacro(): Promise<MarketSnapshot["macro"]> {
  try {
    const [inflation, growth] = await Promise.all([
      loadIndicator("FP.CPI.TOTL.ZG"),
      loadIndicator("NY.GDP.MKTP.KD.ZG"),
    ]);
    if (inflation.length === 0 || growth.length === 0) throw new Error("empty macro payload");
    return { live: true, source: "Banque mondiale — Indicateurs du développement", inflation, growth };
  } catch {
    return {
      live: false,
      source: "Banque mondiale / instituts nationaux",
      note: "Instantané hors ligne (2015-2023), valeurs arrondies susceptibles d'avoir été révisées.",
      inflation: FALLBACK_INFLATION,
      growth: FALLBACK_GROWTH,
    };
  }
}

/** Market and macro data, refreshed hourly; each block degrades independently. */
export async function getMarkets(): Promise<MarketSnapshot> {
  "use cache";
  cacheLife("hours");
  const [fx, crypto, macro] = await Promise.all([loadFx(), loadCrypto(), loadMacro()]);
  return { fetchedAt: new Date().toISOString(), fx, crypto, macro };
}
