import { describe, expect, it } from "vitest";
import { concepts, getConcept } from "@/content/concepts";
import { caseStudyBySlug } from "@/content/case-studies";
import { learningPaths } from "@/content/learning-paths";
import { parseCoinGecko, parseFrankfurterSeries, parseWorldBank } from "@/lib/markets";
import { nextLessons, rankNews, recommendConcepts } from "@/lib/recommend";
import type { NewsItem } from "@/lib/news/types";
import { decodeEntities, hashId, stripHtml, truncate } from "@/lib/text";
import { rateLimit } from "@/lib/rate-limit";

describe("content integrity", () => {
  it("links only to existing concepts, case studies and valid quiz answers", () => {
    for (const c of concepts) {
      for (const slug of c.related) expect(getConcept(slug), `${c.slug} → ${slug}`).toBeDefined();
      if (c.caseStudy) expect(caseStudyBySlug.get(c.caseStudy), c.caseStudy).toBeDefined();
      for (const q of c.quiz) expect(q.answer).toBeLessThan(q.options.length);
    }
    for (const p of learningPaths) {
      for (const l of p.lessons) {
        for (const slug of l.concepts) expect(getConcept(slug), `${l.slug} → ${slug}`).toBeDefined();
        for (const q of l.quiz) expect(q.answer).toBeLessThan(q.options.length);
      }
    }
  });

  it("uses unique slugs and quiz ids", () => {
    const ids = [...concepts.flatMap((c) => c.quiz.map((q) => q.id)), ...learningPaths.flatMap((p) => p.lessons.flatMap((l) => l.quiz.map((q) => q.id)))];
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(concepts.map((c) => c.slug)).size).toBe(concepts.length);
  });
});

describe("market parsers", () => {
  it("parses Frankfurter time series with day-over-day change", () => {
    const parsed = parseFrankfurterSeries({ rates: { "2025-01-02": { USD: 1.0, JPY: 160 }, "2025-01-03": { USD: 1.01, JPY: 160 } } })!;
    expect(parsed.date).toBe("2025-01-03");
    expect(parsed.quotes.find((q) => q.code === "USD")!.change).toBeCloseTo(1, 6);
    expect(parsed.history).toEqual([
      { date: "2025-01-02", value: 1.0 },
      { date: "2025-01-03", value: 1.01 },
    ]);
  });

  it("parses World Bank rows and skips missing values", () => {
    const series = parseWorldBank([
      {},
      [
        { countryiso3code: "FRA", date: "2023", value: 4.88 },
        { countryiso3code: "FRA", date: "2022", value: 5.22 },
        { countryiso3code: "FRA", date: "2024", value: null },
        { countryiso3code: "XXX", date: "2023", value: 1 },
      ],
    ]);
    expect(series).toEqual([{ code: "FRA", name: "France", points: [{ year: 2022, value: 5.2 }, { year: 2023, value: 4.9 }] }]);
  });

  it("parses CoinGecko prices", () => {
    expect(parseCoinGecko({ bitcoin: { eur: 50000, usd: 55000, eur_24h_change: -1.5 } })).toEqual([
      { id: "bitcoin", name: "Bitcoin", symbol: "BTC", priceEur: 50000, priceUsd: 55000, change24h: -1.5 },
    ]);
  });
});

describe("recommendations", () => {
  const base = { level: "debutant" as const, history: [], progress: {} };

  it("continues a started path first", () => {
    const recs = nextLessons({ ...base, interests: ["ia"], progress: { "investir-fondamentaux/epargner-avant-investir": { completedAt: "2025-01-01T00:00:00Z" } } });
    expect(recs[0].href).toBe("/apprendre/investir-fondamentaux/temps-et-interets-composes");
  });

  it("puts the path serving a declared goal first, with the goal as reason", () => {
    const recs = nextLessons({ ...base, interests: [], goals: ["entreprendre"] });
    expect(recs[0].href).toBe("/apprendre/entreprendre-analyser/modele-economique");
    expect(recs[0].reason).toContain("créer ou développer une entreprise");
  });

  it("ranks news matching interests first", () => {
    const now = Date.parse("2025-06-10T00:00:00Z");
    const item = (id: string, topics: NewsItem["topics"]): NewsItem => ({
      id,
      title: id,
      summary: "",
      url: "https://example.com",
      source: { name: "x", url: "https://example.com" },
      publishedAt: "2025-06-09T00:00:00Z",
      topics,
      lang: "fr",
    });
    const ranked = rankNews([item("a", ["marches"]), item("b", ["ia"])], { interests: ["ia"], history: [] }, now);
    expect(ranked.map((i) => i.id)).toEqual(["b", "a"]);
  });
});

describe("goal-aware concepts", () => {
  it("boosts concepts linked to the user's goals", () => {
    const recs = recommendConcepts({ level: "debutant", history: [], progress: {}, interests: [], goals: ["investir"] }, 3);
    expect(recs.map((r) => r.key).sort()).toEqual(["concept:budget-personnel", "concept:diversification", "concept:interets-composes"]);
  });
});

describe("text utilities", () => {
  it("decodes entities and strips tags", () => {
    expect(decodeEntities("&eacute;t&#233; &amp; &#x2014;")).toBe("été & —");
    expect(stripHtml("<p>Bonjour<br/>le <b>monde</b></p>")).toBe("Bonjour le monde");
  });
  it("truncates on word boundaries", () => {
    expect(truncate("Une phrase assez longue pour être coupée", 20)).toBe("Une phrase assez…");
  });
  it("hashes deterministically", () => {
    expect(hashId("https://example.com")).toBe(hashId("https://example.com"));
    expect(hashId("a")).not.toBe(hashId("b"));
  });
});

describe("rateLimit", () => {
  it("blocks after the limit within the window", () => {
    const key = `test-${Math.random()}`;
    expect(rateLimit(key, 2, 1000, 0).ok).toBe(true);
    expect(rateLimit(key, 2, 1000, 1).ok).toBe(true);
    expect(rateLimit(key, 2, 1000, 2)).toEqual({ ok: false, retryAfter: 1 });
    expect(rateLimit(key, 2, 1000, 1001).ok).toBe(true);
  });
});
