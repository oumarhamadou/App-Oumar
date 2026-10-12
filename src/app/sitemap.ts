import type { MetadataRoute } from "next";
import { caseStudies } from "@/content/case-studies";
import { concepts } from "@/content/concepts";
import { learningPaths } from "@/content/learning-paths";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/actualites",
    "/assistant",
    "/ia",
    "/savoir",
    "/savoir/simulateurs",
    "/apprendre",
    ...concepts.map((c) => `/savoir/${c.slug}`),
    ...caseStudies.map((c) => `/savoir/cas/${c.slug}`),
    ...learningPaths.flatMap((p) => [`/apprendre/${p.slug}`, ...p.lessons.map((l) => `/apprendre/${p.slug}/${l.slug}`)]),
  ];
  return paths.map((path) => ({ url: `${BASE_URL}${path}` }));
}
