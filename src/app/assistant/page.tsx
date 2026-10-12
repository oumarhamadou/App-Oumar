import type { Metadata } from "next";
import { Suspense } from "react";
import { Chat } from "@/components/assistant/chat";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "Assistant IA",
  description: "Un assistant pédagogique qui explique l'IA, l'économie et la finance à votre niveau, avec des sources.",
};

export default function AssistantPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        eyebrow="Assistant pédagogique"
        title="Mentor, votre assistant IA"
        description="Il explique avec des mots simples, résume des articles, compare des idées économiques et vous teste, en citant ses sources lorsqu'il le peut."
        className="mb-6"
      />
      <Suspense fallback={<div className="h-96" />}>
        <Chat />
      </Suspense>
    </div>
  );
}
