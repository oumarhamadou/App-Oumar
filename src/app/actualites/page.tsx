import type { Metadata } from "next";
import { NewsFeed } from "@/components/news/news-feed";
import { PageHeader } from "@/components/ui/page-header";
import { getNews } from "@/lib/news";

export const metadata: Metadata = {
  title: "Actualités",
  description: "Les actualités de l'IA, de l'économie et de la finance, résumées et expliquées.",
};

export default async function NewsPage() {
  const feed = await getNews();
  return (
    <>
      <PageHeader
        eyebrow="Fil d'actualité"
        title="Comprendre l'actualité"
        description="IA, marchés, économie mondiale, entreprises et startups : chaque information avec son résumé, sa source et ce qu'elle change concrètement."
      />
      <NewsFeed feed={feed} />
    </>
  );
}
