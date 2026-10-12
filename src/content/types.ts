import type { Domain, Level, Topic } from "@/lib/taxonomy";

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  /** Index of the correct option. */
  answer: number;
  explanation: string;
}

export interface SourceLink {
  label: string;
  url: string;
}

export type SimulatorId =
  | "interets-composes"
  | "pouvoir-achat"
  | "credit"
  | "budget"
  | "prix-obligation"
  | "seuil-rentabilite";

export interface Concept {
  slug: string;
  title: string;
  domain: Domain;
  topics: Topic[];
  /** One-sentence definition, in plain words. */
  tagline: string;
  /** Markdown explanation adapted to each level. */
  explanations: Record<Level, string>;
  example: { title: string; body: string };
  keyPoints: string[];
  simulator?: SimulatorId;
  caseStudy?: string;
  related: string[];
  quiz: QuizQuestion[];
  sources: SourceLink[];
}

export interface CaseStudy {
  slug: string;
  title: string;
  period: string;
  place: string;
  domain: Domain;
  summary: string;
  sections: { heading: string; body: string }[];
  lessons: string[];
  concepts: string[];
  /** Optional illustrative series rendered as a chart. */
  chart?: {
    title: string;
    unit: string;
    source: string;
    series: { label: string; points: { x: string; y: number }[] }[];
  };
  sources: SourceLink[];
}

export interface Lesson {
  slug: string;
  title: string;
  minutes: number;
  summary: string;
  /** Markdown body. */
  body: string;
  takeaways: string[];
  exercise: string;
  quiz: QuizQuestion[];
  concepts: string[];
}

export interface LearningPath {
  slug: string;
  title: string;
  domain: Domain;
  level: Level;
  topics: Topic[];
  description: string;
  outcomes: string[];
  lessons: Lesson[];
}

export type AiToolCategory =
  | "assistants"
  | "etudes"
  | "travail"
  | "creation"
  | "entrepreneuriat"
  | "automatisation"
  | "developpement";

export interface AiTool {
  id: string;
  name: string;
  vendor: string;
  url: string;
  categories: AiToolCategory[];
  description: string;
  useCases: string[];
  pricing: "gratuit" | "freemium" | "payant";
  /** Short caution or limit worth knowing. */
  watchOut?: string;
}

export interface AiNotion {
  slug: string;
  title: string;
  definition: string;
  detail: string;
}

export interface AiTrend {
  id: string;
  title: string;
  summary: string;
  whyItMatters: string;
  signals: string[];
}
