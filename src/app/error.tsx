"use client";

import { RotateCcw, TriangleAlert } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-20 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-2 text-ink-3">
        <TriangleAlert className="h-6 w-6" />
      </span>
      <h1 className="mt-5 text-2xl font-semibold tracking-tight">Un problème est survenu</h1>
      <p className="mt-2 text-[14.5px] text-ink-2">Cette page n&apos;a pas pu s&apos;afficher. Réessayez ; si le problème persiste, revenez plus tard.</p>
      <Button className="mt-6" onClick={reset}>
        <RotateCcw className="h-4 w-4" /> Réessayer
      </Button>
    </div>
  );
}
