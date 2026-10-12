import type { Metadata } from "next";
import { LearningStats, PathCard } from "@/components/learn/path-progress";
import { PageHeader } from "@/components/ui/page-header";
import { learningPaths } from "@/content/learning-paths";

export const metadata: Metadata = {
  title: "Apprendre",
  description: "Des parcours progressifs avec leçons courtes, exercices et quiz, pour apprendre à votre rythme.",
};

export default function LearnPage() {
  return (
    <>
      <PageHeader
        eyebrow="Espace d'apprentissage"
        title="Apprenez à votre rythme"
        description="Des parcours courts et progressifs : chaque leçon dure moins de 10 minutes et se termine par un exercice pratique et un quiz."
      />
      <LearningStats />
      <div className="grid gap-5 md:grid-cols-2">
        {learningPaths.map((path) => (
          <PathCard key={path.slug} path={path} />
        ))}
      </div>
    </>
  );
}
