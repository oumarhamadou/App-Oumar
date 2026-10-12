export type Domain = "ia" | "economie" | "finance";

export type Topic =
  | "ia"
  | "economie-mondiale"
  | "politique-monetaire"
  | "marches"
  | "entreprises"
  | "startups"
  | "innovation"
  | "finance-perso"
  | "crypto";

export type Level = "debutant" | "intermediaire" | "avance";

export const DOMAINS: Record<Domain, { label: string; short: string; colorClass: string; dotClass: string }> = {
  ia: {
    label: "Intelligence artificielle",
    short: "IA",
    colorClass: "text-domain-ia",
    dotClass: "bg-domain-ia",
  },
  economie: {
    label: "Économie",
    short: "Économie",
    colorClass: "text-domain-eco",
    dotClass: "bg-domain-eco",
  },
  finance: {
    label: "Finance",
    short: "Finance",
    colorClass: "text-domain-fin",
    dotClass: "bg-domain-fin",
  },
};

export const TOPICS: Record<Topic, { label: string; domain: Domain; description: string }> = {
  ia: {
    label: "Intelligence artificielle",
    domain: "ia",
    description: "Modèles, outils, usages et régulation de l'IA.",
  },
  innovation: {
    label: "Innovation & tech",
    domain: "ia",
    description: "Technologies émergentes et transformations numériques.",
  },
  "economie-mondiale": {
    label: "Économie mondiale",
    domain: "economie",
    description: "Croissance, inflation, emploi, commerce international.",
  },
  "politique-monetaire": {
    label: "Banques centrales",
    domain: "economie",
    description: "Taux directeurs, inflation et décisions monétaires.",
  },
  entreprises: {
    label: "Entreprises",
    domain: "economie",
    description: "Résultats, stratégies et secteurs d'activité.",
  },
  startups: {
    label: "Startups & entrepreneuriat",
    domain: "economie",
    description: "Création d'entreprise, levées de fonds, écosystèmes.",
  },
  marches: {
    label: "Marchés financiers",
    domain: "finance",
    description: "Actions, obligations, devises et matières premières.",
  },
  "finance-perso": {
    label: "Finance personnelle",
    domain: "finance",
    description: "Budget, épargne, crédit et investissement.",
  },
  crypto: {
    label: "Cryptoactifs",
    domain: "finance",
    description: "Bitcoin, blockchain, stablecoins et régulation.",
  },
};

export const TOPIC_IDS = Object.keys(TOPICS) as Topic[];

export const LEVELS: Record<Level, { label: string; description: string }> = {
  debutant: {
    label: "Débutant",
    description: "Je découvre : des mots simples, des exemples du quotidien.",
  },
  intermediaire: {
    label: "Intermédiaire",
    description: "J'ai des bases : je veux comprendre les mécanismes.",
  },
  avance: {
    label: "Avancé",
    description: "Je maîtrise : nuances, chiffres, débats et limites.",
  },
};

export const LEVEL_IDS = Object.keys(LEVELS) as Level[];

export function topicDomain(topic: Topic): Domain {
  return TOPICS[topic].domain;
}

export function isTopic(value: string): value is Topic {
  return value in TOPICS;
}
