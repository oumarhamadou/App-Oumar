/** NDJSON events streamed by /api/assistant, one JSON object per line. */
export type AssistantEvent =
  | { type: "text"; text: string }
  | { type: "status"; message: string }
  | { type: "notice"; message: string }
  | { type: "sources"; sources: { title: string; url: string }[] }
  | { type: "error"; message: string }
  | { type: "done"; mode: "online" | "offline" };

export function parseEventLine(line: string): AssistantEvent | null {
  if (!line.trim()) return null;
  try {
    const event = JSON.parse(line) as AssistantEvent;
    return typeof event?.type === "string" ? event : null;
  } catch {
    return null;
  }
}
