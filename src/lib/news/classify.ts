import type { Topic } from "@/lib/taxonomy";
import { normalize } from "@/lib/text";

/**
 * Keyword lists are matched on accent-free, lowercased text with word
 * boundaries, so "IA" matches "l'IA" but not "media".
 */
const KEYWORDS: Record<Topic, string[]> = {
  ia: [
    "ia",
    "ai",
    "intelligence artificielle",
    "artificial intelligence",
    "ia generative",
    "generative ai",
    "genai",
    "llm",
    "chatgpt",
    "openai",
    "anthropic",
    "claude",
    "gemini",
    "mistral ai",
    "deepseek",
    "machine learning",
    "apprentissage automatique",
    "deep learning",
    "reseau de neurones",
    "neural network",
    "chatbot",
    "agent ia",
    "ai agent",
    "copilot",
  ],
  "politique-monetaire": [
    "bce",
    "ecb",
    "fed",
    "federal reserve",
    "reserve federale",
    "banque centrale",
    "central bank",
    "taux directeur",
    "taux directeurs",
    "interest rate",
    "interest rates",
    "rate cut",
    "rate hike",
    "baisse des taux",
    "hausse des taux",
    "politique monetaire",
    "monetary policy",
    "lagarde",
    "powell",
    "bceao",
    "beac",
    "banque de france",
    "bank of england",
  ],
  "economie-mondiale": [
    "pib",
    "gdp",
    "croissance economique",
    "economic growth",
    "recession",
    "inflation",
    "chomage",
    "unemployment",
    "emploi",
    "jobs report",
    "commerce mondial",
    "global trade",
    "droits de douane",
    "tariff",
    "tariffs",
    "fmi",
    "imf",
    "banque mondiale",
    "world bank",
    "ocde",
    "oecd",
    "dette publique",
    "public debt",
    "deficit",
    "economie",
    "economy",
  ],
  marches: [
    "bourse",
    "stock market",
    "stocks",
    "shares",
    "cac 40",
    "s&p 500",
    "nasdaq",
    "dow jones",
    "wall street",
    "euro stoxx",
    "obligation",
    "obligations",
    "bond",
    "bonds",
    "treasury yields",
    "rendement",
    "marches financiers",
    "petrole",
    "oil prices",
    "prix de l'or",
    "gold price",
    "devise",
    "currency",
    "taux de change",
    "exchange rate",
    "investisseurs",
    "investors",
  ],
  entreprises: [
    "resultats",
    "earnings",
    "chiffre d'affaires",
    "revenue",
    "benefice",
    "profit",
    "rachat",
    "acquisition",
    "fusion",
    "merger",
    "pdg",
    "ceo",
    "licenciements",
    "layoffs",
    "entreprise",
    "entreprises",
    "company",
    "industrie",
  ],
  startups: [
    "startup",
    "startups",
    "start-up",
    "start-ups",
    "levee de fonds",
    "funding round",
    "raises",
    "series a",
    "series b",
    "serie a",
    "serie b",
    "capital-risque",
    "venture capital",
    "licorne",
    "unicorn",
    "fondateur",
    "founder",
    "entrepreneur",
    "entrepreneuriat",
    "incubateur",
  ],
  innovation: [
    "technologie",
    "technology",
    "innovation",
    "robot",
    "robotique",
    "quantique",
    "quantum",
    "semi-conducteur",
    "semi-conducteurs",
    "semiconductor",
    "semiconductors",
    "puce",
    "puces",
    "chip",
    "chips",
    "cloud",
    "cybersecurite",
    "cybersecurity",
    "data center",
    "centre de donnees",
    "centres de donnees",
    "numerique",
    "digital",
  ],
  "finance-perso": [
    "epargne",
    "savings",
    "livret a",
    "credit immobilier",
    "mortgage",
    "retraite",
    "pension",
    "pouvoir d'achat",
    "impots",
    "impot sur le revenu",
    "assurance vie",
    "loyer",
    "budget des menages",
    "consommateurs",
  ],
  crypto: [
    "bitcoin",
    "crypto",
    "cryptomonnaie",
    "cryptomonnaies",
    "cryptoactif",
    "cryptoactifs",
    "cryptocurrency",
    "ethereum",
    "blockchain",
    "stablecoin",
    "stablecoins",
    "mica",
    "binance",
    "coinbase",
  ],
};

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function keywordPattern(keyword: string): string {
  const escaped = escapeRegExp(normalize(keyword));
  // English "AI" must not match the French verb form "j'ai"; French "l'IA" must still match "ia".
  return keyword === "ai" ? `(?<!['’])${escaped}` : escaped;
}

const PATTERNS: [Topic, RegExp][] = (Object.keys(KEYWORDS) as Topic[]).map((topic) => {
  const alternatives = KEYWORDS[topic].map(keywordPattern).join("|");
  return [topic, new RegExp(`(?<![\\p{L}\\p{N}])(?:${alternatives})(?![\\p{L}\\p{N}])`, "gu")];
});

/** Score each topic by keyword hits; title hits weigh double. */
export function scoreTopics(title: string, body = ""): Map<Topic, number> {
  const scores = new Map<Topic, number>();
  const normalizedTitle = normalize(title);
  const normalizedBody = normalize(body);
  for (const [topic, pattern] of PATTERNS) {
    const inTitle = normalizedTitle.match(pattern)?.length ?? 0;
    const inBody = normalizedBody.match(pattern)?.length ?? 0;
    const score = inTitle * 2 + inBody;
    if (score > 0) scores.set(topic, score);
  }
  return scores;
}

export function classifyTopics(title: string, body: string, fallback: Topic[], max = 3): Topic[] {
  const ranked = [...scoreTopics(title, body).entries()].sort((a, b) => b[1] - a[1]).map(([topic]) => topic);
  return (ranked.length > 0 ? ranked : fallback).slice(0, max);
}
