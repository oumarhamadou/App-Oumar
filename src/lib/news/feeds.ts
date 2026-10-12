import type { Topic } from "@/lib/taxonomy";

export interface FeedConfig {
  id: string;
  name: string;
  url: string;
  homepage: string;
  lang: "fr" | "en";
  /** Topics assumed when keyword classification finds nothing. */
  defaultTopics: Topic[];
}

/**
 * Public RSS/Atom feeds. Add or remove sources here; each one is fetched
 * independently, so a failing feed never blocks the others.
 */
export const FEEDS: FeedConfig[] = [
  {
    id: "lemonde-eco",
    name: "Le Monde — Économie",
    url: "https://www.lemonde.fr/economie/rss_full.xml",
    homepage: "https://www.lemonde.fr/economie/",
    lang: "fr",
    defaultTopics: ["economie-mondiale"],
  },
  {
    id: "lemonde-pixels",
    name: "Le Monde — Pixels",
    url: "https://www.lemonde.fr/pixels/rss_full.xml",
    homepage: "https://www.lemonde.fr/pixels/",
    lang: "fr",
    defaultTopics: ["innovation"],
  },
  {
    id: "gnews-ia",
    name: "Google Actualités — IA",
    url: "https://news.google.com/rss/search?q=%22intelligence+artificielle%22&hl=fr&gl=FR&ceid=FR:fr",
    homepage: "https://news.google.com/",
    lang: "fr",
    defaultTopics: ["ia"],
  },
  {
    id: "gnews-finance",
    name: "Google Actualités — Marchés",
    url: "https://news.google.com/rss/search?q=bourse+OR+%22march%C3%A9s+financiers%22&hl=fr&gl=FR&ceid=FR:fr",
    homepage: "https://news.google.com/",
    lang: "fr",
    defaultTopics: ["marches"],
  },
  {
    id: "gnews-startups",
    name: "Google Actualités — Startups",
    url: "https://news.google.com/rss/search?q=startup+lev%C3%A9e+de+fonds&hl=fr&gl=FR&ceid=FR:fr",
    homepage: "https://news.google.com/",
    lang: "fr",
    defaultTopics: ["startups"],
  },
  {
    id: "bbc-business",
    name: "BBC — Business",
    url: "https://feeds.bbci.co.uk/news/business/rss.xml",
    homepage: "https://www.bbc.com/news/business",
    lang: "en",
    defaultTopics: ["economie-mondiale"],
  },
  {
    id: "techcrunch-ai",
    name: "TechCrunch — AI",
    url: "https://techcrunch.com/category/artificial-intelligence/feed/",
    homepage: "https://techcrunch.com/category/artificial-intelligence/",
    lang: "en",
    defaultTopics: ["ia", "startups"],
  },
  {
    id: "mit-tech-review",
    name: "MIT Technology Review",
    url: "https://www.technologyreview.com/feed/",
    homepage: "https://www.technologyreview.com/",
    lang: "en",
    defaultTopics: ["innovation"],
  },
  {
    id: "fed",
    name: "Federal Reserve",
    url: "https://www.federalreserve.gov/feeds/press_all.xml",
    homepage: "https://www.federalreserve.gov/newsevents/pressreleases.htm",
    lang: "en",
    defaultTopics: ["politique-monetaire"],
  },
  {
    id: "ecb",
    name: "Banque centrale européenne",
    url: "https://www.ecb.europa.eu/rss/press.html",
    homepage: "https://www.ecb.europa.eu/press/html/index.en.html",
    lang: "en",
    defaultTopics: ["politique-monetaire"],
  },
];
