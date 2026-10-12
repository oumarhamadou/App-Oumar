import { Compass } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-20 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-2 text-ink-3">
        <Compass className="h-6 w-6" />
      </span>
      <h1 className="mt-5 text-2xl font-semibold tracking-tight">Page introuvable</h1>
      <p className="mt-2 text-[14.5px] text-ink-2">
        Ce contenu n&apos;existe pas ou n&apos;est plus disponible (les actualités anciennes quittent le fil au fil des mises à jour).
      </p>
      <div className="mt-6 flex gap-2">
        <ButtonLink href="/">Tableau de bord</ButtonLink>
        <ButtonLink href="/recherche" variant="outline">
          Rechercher
        </ButtonLink>
      </div>
    </div>
  );
}
