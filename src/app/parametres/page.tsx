import type { Metadata } from "next";
import { Settings } from "@/components/settings/settings";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = { title: "Paramètres", description: "Profil, thèmes suivis, apparence, notifications et données." };

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader eyebrow="Paramètres" title="Votre expérience, à votre façon" description="Profil, thèmes suivis, apparence, notifications, tableau de bord et données." />
      <Settings />
    </div>
  );
}
