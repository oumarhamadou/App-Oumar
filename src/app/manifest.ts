import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

/** Makes Prisme installable on phones and desktops, with shortcuts to the main spaces. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE.name} — ${SITE.tagline}`,
    short_name: SITE.name,
    description: SITE.description,
    lang: "fr",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#f7f7f5",
    theme_color: "#0b0b0b",
    categories: ["education", "finance", "news"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Actualités", url: "/actualites", icons: [{ src: "/icon-192.png", sizes: "192x192" }] },
      { name: "Assistant IA", url: "/assistant", icons: [{ src: "/icon-192.png", sizes: "192x192" }] },
      { name: "Apprendre", url: "/apprendre", icons: [{ src: "/icon-192.png", sizes: "192x192" }] },
    ],
  };
}
