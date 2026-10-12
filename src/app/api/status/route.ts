import { connection } from "next/server";
import { hasAnthropicCredentials } from "@/lib/ai/client";

/** Lets the interface know whether AI features are online. */
export async function GET() {
  await connection();
  return Response.json({ ai: hasAnthropicCredentials() });
}
