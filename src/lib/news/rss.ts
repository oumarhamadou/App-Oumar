import { XMLParser } from "fast-xml-parser";
import { stripHtml, truncate } from "@/lib/text";

export interface RawFeedItem {
  title: string;
  link: string;
  description: string;
  publishedAt?: string;
  image?: string;
  /** Publisher name when the feed is an aggregator (e.g. Google News). */
  publisher?: string;
}

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  textNodeName: "#text",
  cdataPropName: false,
  processEntities: true,
  htmlEntities: true,
  trimValues: true,
});

type Node = Record<string, unknown> | string | number | undefined | null;

function asArray<T>(value: T | T[] | undefined | null): T[] {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
}

function text(node: Node): string {
  if (node === undefined || node === null) return "";
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  const inner = (node as Record<string, unknown>)["#text"];
  return typeof inner === "string" || typeof inner === "number" ? String(inner) : "";
}

function attr(node: Node, name: string): string | undefined {
  if (!node || typeof node !== "object") return undefined;
  const value = (node as Record<string, unknown>)[`@_${name}`];
  return typeof value === "string" ? value : undefined;
}

function toIsoDate(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function firstImage(entry: Record<string, unknown>, html: string): string | undefined {
  const candidates: Node[] = [
    ...asArray(entry["media:content"] as Node | Node[]),
    ...asArray(entry["media:thumbnail"] as Node | Node[]),
    ...asArray(entry["enclosure"] as Node | Node[]),
  ];
  for (const candidate of candidates) {
    const url = attr(candidate, "url");
    const type = attr(candidate, "type");
    if (url && (!type || type.startsWith("image"))) return url;
  }
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1];
}

function atomLink(entry: Record<string, unknown>): string {
  const links = asArray(entry["link"] as Node | Node[]);
  const alternate = links.find((l) => attr(l, "rel") === undefined || attr(l, "rel") === "alternate");
  return attr(alternate ?? links[0], "href") ?? text(links[0]);
}

/** Parse an RSS 2.0, RSS 1.0 (RDF) or Atom document into normalized items. */
export function parseFeed(xml: string): RawFeedItem[] {
  let doc: Record<string, unknown>;
  try {
    doc = parser.parse(xml) as Record<string, unknown>;
  } catch {
    return [];
  }

  const rss = doc["rss"] as Record<string, unknown> | undefined;
  const rdf = doc["rdf:RDF"] as Record<string, unknown> | undefined;
  const atom = doc["feed"] as Record<string, unknown> | undefined;

  const items: RawFeedItem[] = [];

  const rssEntries = rss
    ? asArray((rss["channel"] as Record<string, unknown> | undefined)?.["item"] as Record<string, unknown>[])
    : rdf
      ? asArray(rdf["item"] as Record<string, unknown>[])
      : [];

  for (const entry of rssEntries) {
    const rawDescription = text(entry["content:encoded"] as Node) || text(entry["description"] as Node);
    const title = stripHtml(text(entry["title"] as Node));
    const link = text(entry["link"] as Node) || text(entry["guid"] as Node);
    if (!title || !link) continue;
    items.push({
      title,
      link: link.trim(),
      description: truncate(stripHtml(rawDescription), 600),
      publishedAt: toIsoDate(text(entry["pubDate"] as Node) || text(entry["dc:date"] as Node)),
      image: firstImage(entry, rawDescription),
      publisher: text(entry["source"] as Node) || undefined,
    });
  }

  if (atom) {
    for (const entry of asArray(atom["entry"] as Record<string, unknown>[])) {
      const rawDescription = text(entry["summary"] as Node) || text(entry["content"] as Node);
      const title = stripHtml(text(entry["title"] as Node));
      const link = atomLink(entry);
      if (!title || !link) continue;
      items.push({
        title,
        link: link.trim(),
        description: truncate(stripHtml(rawDescription), 600),
        publishedAt: toIsoDate(text(entry["published"] as Node) || text(entry["updated"] as Node)),
        image: firstImage(entry, rawDescription),
      });
    }
  }

  return items;
}
