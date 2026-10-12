import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchResults } from "@/components/library/search-results";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = { title: "Recherche" };

export default function SearchPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader eyebrow="Recherche" title="Que cherchez-vous ?" className="mb-6" />
      <Suspense fallback={<div className="h-14 rounded-2xl bg-surface-2" />}>
        <SearchResults />
      </Suspense>
    </div>
  );
}
