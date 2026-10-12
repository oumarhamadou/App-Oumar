import { aiNotions } from "@/content/ai-space";
import { getConcept } from "@/content/concepts";
import { buildStaticIndex, search } from "@/lib/search";
import type { Level } from "@/lib/taxonomy";

const index = buildStaticIndex().filter((doc) => ["concept", "notion", "lecon", "cas"].includes(doc.kind));

/**
 * Answer built from the platform's own knowledge base, used when no
 * Anthropic credentials are configured. Deterministic and source-linked.
 */
export function offlineAnswer(question: string, level: Level): { text: string; sources: { title: string; url: string }[] } {
  const results = search(index, question, 4, { requireAll: false });
  const top = results[0];

  if (!top) {
    return {
      text: `Je fonctionne actuellement en **mode hors ligne** : l'assistant conversationnel n'est pas encore connecté à un modèle d'IA, et je n'ai pas trouvé de fiche correspondant à votre question dans la base de connaissances.

Essayez avec un mot-clé comme *inflation*, *taux d'intérêt*, *obligations*, *budget*, *intérêts composés*, *modèle économique* ou *agent IA*, ou parcourez le [centre de connaissances](/savoir).`,
      sources: [],
    };
  }

  const sources = results.map((r) => ({ title: r.title, url: r.href }));

  if (top.kind === "concept") {
    const concept = getConcept(top.href.split("/").pop() ?? "");
    if (concept) {
      return {
        text: `**${concept.title}** — ${concept.tagline}

${concept.explanations[level]}

### Exemple : ${concept.example.title}
${concept.example.body}

### À retenir
${concept.keyPoints.map((p) => `- ${p}`).join("\n")}

[Ouvrir la fiche complète](/savoir/${concept.slug}) pour les simulateurs, le quiz et les sources.`,
        sources,
      };
    }
  }

  if (top.kind === "notion") {
    const notion = aiNotions.find((n) => top.id === `notion-${n.slug}`);
    if (notion) {
      return {
        text: `**${notion.title}** — ${notion.definition}

${notion.detail}

Découvrez les autres notions et les outils dans l'[espace IA](/ia).`,
        sources,
      };
    }
  }

  return {
    text: `Voici les contenus de la plateforme qui répondent le mieux à votre question :

${results.map((r) => `- [${r.title}](${r.href}) — ${r.description}`).join("\n")}`,
    sources,
  };
}
