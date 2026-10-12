import { Dashboard } from "@/components/dashboard/dashboard";
import { getMarkets } from "@/lib/markets";
import { getNews } from "@/lib/news";

export default async function HomePage() {
  const [news, markets] = await Promise.all([getNews(), getMarkets()]);
  return <Dashboard news={news} markets={markets} />;
}
