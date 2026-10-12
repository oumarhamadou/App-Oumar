import type { Topic } from "@/lib/taxonomy";

/**
 * General reading keys by topic. Shown when no article-specific
 * explanation is available (no AI key configured), and labelled as such.
 */
export const TOPIC_CONTEXT: Record<Topic, { whyItMatters: string; concepts: string[] }> = {
  ia: {
    whyItMatters:
      "Les annonces en intelligence artificielle influencent la productivité, l'emploi, l'investissement des entreprises et la valeur boursière du secteur technologique. Repérez ce qui change concrètement : capacités, coûts, usages, régulation.",
    concepts: ["croissance-pib", "modele-economique"],
  },
  innovation: {
    whyItMatters:
      "Les innovations technologiques transforment les modèles économiques, la compétitivité des pays et les besoins en compétences. Leur impact réel dépend de leur diffusion, de leur coût et de leur adoption.",
    concepts: ["croissance-pib", "modele-economique"],
  },
  "economie-mondiale": {
    whyItMatters:
      "Croissance, inflation et emploi déterminent le pouvoir d'achat, les décisions des banques centrales et la santé des entreprises. Comparez toujours un chiffre à la période précédente et aux prévisions.",
    concepts: ["croissance-pib", "inflation", "commerce-international"],
  },
  "politique-monetaire": {
    whyItMatters:
      "Les décisions des banques centrales se répercutent sur les taux des crédits immobiliers et aux entreprises, sur la rémunération de l'épargne, sur les marchés financiers et sur le taux de change.",
    concepts: ["banque-centrale", "taux-interet", "inflation"],
  },
  marches: {
    whyItMatters:
      "Les mouvements de marché reflètent les anticipations des investisseurs sur la croissance, les taux et les bénéfices. Une variation d'un jour compte moins que la tendance de fond et la diversification de votre épargne.",
    concepts: ["marches-financiers", "diversification", "obligations"],
  },
  entreprises: {
    whyItMatters:
      "Les résultats et stratégies des entreprises renseignent sur la santé d'un secteur, l'emploi et l'investissement. Regardez au-delà du chiffre d'affaires : marges, trésorerie et perspectives.",
    concepts: ["analyse-financiere", "modele-economique"],
  },
  startups: {
    whyItMatters:
      "Les levées de fonds et créations d'entreprises montrent où les investisseurs anticipent la croissance future. Une valorisation élevée reste un pari : la rentabilité se construit dans la durée.",
    concepts: ["modele-economique", "analyse-financiere"],
  },
  "finance-perso": {
    whyItMatters:
      "Ces évolutions touchent directement votre budget : coût du crédit, rémunération de l'épargne, impôts et pouvoir d'achat. Elles peuvent justifier de revoir vos choix d'épargne ou d'emprunt.",
    concepts: ["budget-personnel", "interets-composes", "taux-interet"],
  },
  crypto: {
    whyItMatters:
      "Les cryptoactifs restent très volatils et leur cadre réglementaire évolue. Les annonces du secteur peuvent faire fortement varier les prix : prudence et diversification sont essentielles.",
    concepts: ["cryptoactifs", "monnaie"],
  },
};

export function genericContext(topics: Topic[]): { whyItMatters: string; concepts: string[] } {
  const primary = topics[0] ?? "economie-mondiale";
  const concepts = [...new Set(topics.flatMap((t) => TOPIC_CONTEXT[t].concepts))].slice(0, 3);
  return { whyItMatters: TOPIC_CONTEXT[primary].whyItMatters, concepts };
}
