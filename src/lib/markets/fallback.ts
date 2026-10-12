import type { CountrySeries, FxQuote } from "./types";

/**
 * Offline snapshot used only when live sources are unreachable. Values are
 * rounded, dated, and labelled in the interface; official series may have
 * been revised since.
 */
export const FALLBACK_FX: { date: string; label: string; quotes: FxQuote[] } = {
  date: "2024",
  label: "Moyennes annuelles 2024 des taux de référence de la BCE",
  quotes: [
    { code: "USD", label: "Dollar américain", rate: 1.0824 },
    { code: "GBP", label: "Livre sterling", rate: 0.8466 },
    { code: "JPY", label: "Yen japonais", rate: 163.85 },
    { code: "CHF", label: "Franc suisse", rate: 0.9526 },
    { code: "CNY", label: "Yuan chinois", rate: 7.7875 },
  ],
};

const years = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023];

function series(code: string, name: string, values: number[]): CountrySeries {
  return { code, name, points: values.map((value, i) => ({ year: years[i], value })) };
}

export const FALLBACK_INFLATION: CountrySeries[] = [
  series("FRA", "France", [0.0, 0.2, 1.0, 1.9, 1.1, 0.5, 1.6, 5.2, 4.9]),
  series("USA", "États-Unis", [0.1, 1.3, 2.1, 2.4, 1.8, 1.2, 4.7, 8.0, 4.1]),
  series("DEU", "Allemagne", [0.5, 0.5, 1.5, 1.8, 1.4, 0.5, 3.1, 6.9, 5.9]),
  series("JPN", "Japon", [0.8, -0.1, 0.5, 1.0, 0.5, 0.0, -0.2, 2.5, 3.3]),
  series("CHN", "Chine", [1.4, 2.0, 1.6, 2.1, 2.9, 2.4, 1.0, 2.0, 0.2]),
];

export const FALLBACK_GROWTH: CountrySeries[] = [
  series("FRA", "France", [1.0, 1.1, 2.3, 1.9, 1.8, -7.5, 6.8, 2.6, 1.1]),
  series("USA", "États-Unis", [2.9, 1.8, 2.5, 3.0, 2.5, -2.2, 6.1, 2.5, 2.9]),
  series("DEU", "Allemagne", [1.5, 2.2, 2.7, 1.1, 1.0, -4.1, 3.7, 1.4, -0.3]),
  series("CHN", "Chine", [7.0, 6.8, 6.9, 6.7, 6.0, 2.2, 8.4, 3.0, 5.2]),
];
