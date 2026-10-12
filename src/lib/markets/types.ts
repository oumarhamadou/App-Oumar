export interface FxQuote {
  code: string;
  label: string;
  /** Units of `code` for 1 EUR. */
  rate: number;
  /** Change in percent versus the previous observation, when known. */
  change?: number;
}

export interface CryptoQuote {
  id: string;
  name: string;
  symbol: string;
  priceEur: number;
  priceUsd: number;
  change24h: number | null;
}

export interface CountrySeries {
  code: string;
  name: string;
  points: { year: number; value: number }[];
}

export interface MarketSnapshot {
  fetchedAt: string;
  fx: {
    live: boolean;
    date: string;
    note?: string;
    quotes: FxQuote[];
    /** EUR/USD daily history, most recent last. */
    history: { date: string; value: number }[];
  };
  crypto: {
    live: boolean;
    assets: CryptoQuote[];
  };
  macro: {
    live: boolean;
    note?: string;
    source: string;
    inflation: CountrySeries[];
    growth: CountrySeries[];
  };
}
