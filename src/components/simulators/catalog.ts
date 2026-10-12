import type { SimulatorId } from "@/content/types";

/** Server-safe metadata for the simulators (components live in simulators.tsx). */
export const SIMULATOR_LIST: { id: SimulatorId; title: string; description: string }[] = [
  { id: "interets-composes", title: "Intérêts composés", description: "Voyez comment l'épargne grossit avec le temps, et ce que coûtent les frais." },
  { id: "pouvoir-achat", title: "Pouvoir d'achat et inflation", description: "Ce que vaudra votre argent demain si les prix augmentent." },
  { id: "credit", title: "Crédit et mensualités", description: "Mensualité, coût total et part des intérêts d'un emprunt." },
  { id: "budget", title: "Budget 50/30/20", description: "Répartissez vos revenus entre besoins, envies et épargne." },
  { id: "prix-obligation", title: "Taux et prix des obligations", description: "Pourquoi le prix d'une obligation baisse quand les taux montent." },
  { id: "seuil-rentabilite", title: "Seuil de rentabilité", description: "Combien de ventes pour couvrir vos coûts." },
];
