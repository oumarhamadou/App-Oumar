import { getMarkets } from "@/lib/markets";

export async function GET() {
  return Response.json(await getMarkets());
}
