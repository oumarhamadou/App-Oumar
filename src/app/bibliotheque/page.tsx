import type { Metadata } from "next";
import { Library } from "@/components/library/library";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = { title: "Ma bibliothèque", description: "Vos favoris, listes de lecture et historique." };

export default function LibraryPage() {
  return (
    <>
      <PageHeader
        eyebrow="Ma bibliothèque"
        title="Tout ce que vous avez gardé"
        description="Favoris, listes de lecture et historique. Ces données restent sur cet appareil, dans votre navigateur."
      />
      <Library />
    </>
  );
}
