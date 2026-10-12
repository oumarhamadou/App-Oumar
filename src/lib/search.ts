import { aiNotions, aiTools } from "@/content/ai-space";
import { caseStudies } from "@/content/case-studies";
import { concepts } from "@/content/concepts";
import { learningPaths } from "@/content/learning-paths";
import type { NewsItem } from "@/lib/news/types";
import type { Topic } from "@/lib/taxonomy";
import { TOPICS } from "@/lib/taxonomy";
import { normalize } from "@/lib/text";

export type SearchKind = "concept" | "lecon" | "parcours" | "outil" | "notion" | "cas" | "actualite" | "page";

export const SEARCH_KIND_LABELS: Record<SearchKind, string> = {
  concept: "Concept",
  lecon: "Leçon",
  parcours: "Parcours",
  outil: "Outil IA",
  notion: "Notion IA",
  cas: "Étude de cas",
  actualite: "Actualité",
  page: "Page",
};

export interface SearchDoc {
  id: string;
  kind: SearchKind;
  title: string;
  description: string;
  href: string;
  /** Extra searchable text (tags, body excerpts). */
  keywords?: string;
  topics?: Topic[];
}

const PAGES: SearchDoc[] = [
  { id: "page-accueil", kind: "page", title: "Tableau de bord", description: "Votre vue d'ensemble personnalisée.", href: "/" },
  { id: "page-actualites", kind: "page", title: "Fil d'actualité", description: "Actualités IA, économie et finance expliquées.", href: "/actualites" },
  { id: "page-assistant", kind: "page", title: "Assistant IA", description: "Posez vos questions, obtenez des explications adaptées.", href: "/assistant" },
  { id: "page-ia", kind: "page", title: "Espace IA", description: "Outils, notions et tendances de l'intelligence artificielle.", href: "/ia" },
  { id: "page-savoir", kind: "page", title: "Centre de connaissances", description: "Concepts d'économie et de finance, études de cas.", href: "/savoir" },
  { id: "page-simulateurs", kind: "page", title: "Simulateurs", description: "Intérêts composés, crédit, inflation, budget, obligations.", href: "/savoir/simulateurs", keywords: "calculateur graphique interactif" },
  { id: "page-apprendre", kind: "page", title: "Apprendre", description: "Parcours, leçons, quiz et progression.", href: "/apprendre" },
  { id: "page-bibliotheque", kind: "page", title: "Ma bibliothèque", description: "Favoris, listes de lecture et historique.", href: "/bibliotheque" },
  { id: "page-parametres", kind: "page", title: "Paramètres", description: "Profil, centres d'intérêt, notifications, apparence.", href: "/parametres", keywords: "mode sombre clair theme notifications" },
];

/** Static documents: everything except live news. */
export function buildStaticIndex(): SearchDoc[] {
  const docs: SearchDoc[] = [...PAGES];
  for (const c of concepts) {
    docs.push({
      id: `concept-${c.slug}`,
      kind: "concept",
      title: c.title,
      description: c.tagline,
      href: `/savoir/${c.slug}`,
      keywords: [...c.keyPoints, c.example.title].join(" "),
      topics: c.topics,
    });
  }
  for (const cs of caseStudies) {
    docs.push({
      id: `cas-${cs.slug}`,
      kind: "cas",
      title: cs.title,
      description: cs.summary,
      href: `/savoir/cas/${cs.slug}`,
      keywords: `${cs.place} ${cs.period}`,
    });
  }
  for (const p of learningPaths) {
    docs.push({
      id: `parcours-${p.slug}`,
      kind: "parcours",
      title: p.title,
      description: p.description,
      href: `/apprendre/${p.slug}`,
      keywords: p.outcomes.join(" "),
      topics: p.topics,
    });
    for (const l of p.lessons) {
      docs.push({
        id: `lecon-${p.slug}-${l.slug}`,
        kind: "lecon",
        title: l.title,
        description: l.summary,
        href: `/apprendre/${p.slug}/${l.slug}`,
        keywords: l.takeaways.join(" "),
        topics: p.topics,
      });
    }
  }
  for (const t of aiTools) {
    docs.push({
      id: `outil-${t.id}`,
      kind: "outil",
      title: t.name,
      description: t.description,
      href: `/ia#outil-${t.id}`,
      keywords: `${t.vendor} ${t.useCases.join(" ")}`,
      topics: ["ia"],
    });
  }
  for (const n of aiNotions) {
    docs.push({
      id: `notion-${n.slug}`,
      kind: "notion",
      title: n.title,
      description: n.definition,
      href: `/ia#notion-${n.slug}`,
      keywords: n.detail,
      topics: ["ia"],
    });
  }
  return docs;
}

export function newsToDocs(items: NewsItem[]): SearchDoc[] {
  return items.map((item) => ({
    id: `actualite-${item.id}`,
    kind: "actualite" as const,
    title: item.title,
    description: item.summary || item.source.name,
    href: `/actualites/${item.id}`,
    keywords: `${item.source.name} ${item.topics.map((t) => TOPICS[t].label).join(" ")}`,
    topics: item.topics,
  }));
}

export interface SearchResult extends SearchDoc {
  score: number;
}

const STOPWORDS = new Set(
  (
    "le la les un une des du de d l c qu que qui quoi quel quelle quels quelles est sont etre ete a au aux et ou en " +
    "pour par sur sous dans avec sans ce cet cette ces ca cela mon ma mes ton ta tes son sa ses se il elle ils elles on " +
    "je tu nous vous me moi te comment pourquoi quand combien explique expliquer explique-moi dis dire peux peut " +
    "faire fait the a an of to is what how why and or in on for with"
  ).split(" "),
);

/** Query terms: accent-free, stopwords removed, light plural stemming. */
export function queryTerms(query: string): string[] {
  return normalize(query)
    .split(/[^a-z0-9%&]+/)
    .filter((t) => (t.length > 1 || /\d/.test(t)) && !STOPWORDS.has(t))
    .map((t) => (t.length > 4 && t.endsWith("s") ? t.slice(0, -1) : t));
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function termScore(term: string, title: string, description: string, keywords: string): number {
  const wordStart = new RegExp(`(^|[^a-z0-9])${escapeRegExp(term)}`);
  if (wordStart.test(title)) return 10;
  if (term.length >= 4 && title.includes(term)) return 5;
  if (wordStart.test(description)) return 4;
  if (wordStart.test(keywords)) return 3;
  if (term.length >= 5 && (description.includes(term) || keywords.includes(term))) return 1;
  return 0;
}

/**
 * Accent-insensitive search. With `requireAll`, every meaningful term must
 * match (command palette); otherwise documents are ranked by how many terms
 * they match (natural-language questions).
 */
export function search(docs: SearchDoc[], query: string, limit = 20, { requireAll = true } = {}): SearchResult[] {
  const terms = queryTerms(query);
  if (terms.length === 0) return [];
  const normalizedQuery = normalize(query.trim());

  const results: SearchResult[] = [];
  for (const doc of docs) {
    const title = normalize(doc.title);
    const description = normalize(doc.description);
    const keywords = normalize(doc.keywords ?? "");
    let score = 0;
    let matched = 0;
    for (const term of terms) {
      const s = termScore(term, title, description, keywords);
      if (s > 0) matched += 1;
      else if (requireAll) {
        matched = -1;
        break;
      }
      score += s;
    }
    if (matched <= 0) continue;
    if (!requireAll) score *= matched / terms.length;
    if (title === normalizedQuery) score += 20;
    if (doc.kind === "page" || doc.kind === "concept") score += 1;
    results.push({ ...doc, score });
  }
  return results.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title)).slice(0, limit);
}
