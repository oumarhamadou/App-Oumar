import { getNews } from "@/lib/news";

/** Aggregated feed as JSON (used by search and client widgets). */
export async function GET() {
  return Response.json(await getNews());
}
