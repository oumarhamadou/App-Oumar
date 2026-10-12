import { describe, expect, it } from "vitest";
import { classifyTopics, scoreTopics } from "@/lib/news/classify";
import { toNewsItem } from "@/lib/news";
import { FEEDS } from "@/lib/news/feeds";
import { parseFeed } from "@/lib/news/rss";

const RSS = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Exemple</title>
    <item>
      <title><![CDATA[La BCE baisse ses taux d&#8217;un quart de point]]></title>
      <link>https://example.com/bce</link>
      <description><![CDATA[<p>La Banque centrale européenne a réduit ses taux directeurs.&nbsp;L'inflation recule.</p>]]></description>
      <pubDate>Thu, 05 Jun 2025 12:15:00 GMT</pubDate>
      <media:content url="https://example.com/bce.jpg" type="image/jpeg" />
    </item>
    <item>
      <title>Sans lien</title>
    </item>
    <item>
      <title>OpenAI lève des fonds - Les Echos</title>
      <link>https://news.google.com/x</link>
      <description>OpenAI lève des fonds - Les Echos</description>
      <source url="https://lesechos.fr">Les Echos</source>
    </item>
  </channel>
</rss>`;

const ATOM = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <entry>
    <title>Bitcoin : la volatilité revient</title>
    <link rel="alternate" href="https://example.org/btc" />
    <summary>Le cours du bitcoin a fortement varié.</summary>
    <published>2025-01-02T10:00:00Z</published>
  </entry>
</feed>`;

describe("parseFeed", () => {
  it("parses RSS items, decodes entities and strips HTML", () => {
    const items = parseFeed(RSS);
    expect(items).toHaveLength(2);
    expect(items[0]).toMatchObject({
      title: "La BCE baisse ses taux d’un quart de point",
      link: "https://example.com/bce",
      publishedAt: "2025-06-05T12:15:00.000Z",
      image: "https://example.com/bce.jpg",
    });
    expect(items[0].description).toBe("La Banque centrale européenne a réduit ses taux directeurs. L'inflation recule.");
    expect(items[1].publisher).toBe("Les Echos");
  });

  it("parses Atom entries", () => {
    expect(parseFeed(ATOM)).toEqual([
      expect.objectContaining({ title: "Bitcoin : la volatilité revient", link: "https://example.org/btc", publishedAt: "2025-01-02T10:00:00.000Z" }),
    ]);
  });

  it("returns nothing for invalid XML", () => {
    expect(parseFeed("not xml at all")).toEqual([]);
  });
});

describe("classifyTopics", () => {
  it("detects monetary policy and AI topics", () => {
    expect(classifyTopics("La BCE baisse ses taux directeurs", "", ["marches"])[0]).toBe("politique-monetaire");
    expect(classifyTopics("L'IA générative transforme le travail", "", ["marches"])).toContain("ia");
  });

  it("does not mistake the French verb form for AI", () => {
    expect(scoreTopics("J'ai acheté du pain", "").has("ia")).toBe(false);
    expect(scoreTopics("New AI model released", "").get("ia")).toBeGreaterThan(0);
  });

  it("falls back to the feed's default topics", () => {
    expect(classifyTopics("Un titre sans mot-clé", "", ["startups"])).toEqual(["startups"]);
  });
});

describe("toNewsItem", () => {
  it("splits the publisher out of aggregator titles and drops title-only summaries", () => {
    const [, google] = parseFeed(RSS);
    const feed = FEEDS.find((f) => f.id === "gnews-startups")!;
    const item = toNewsItem(google, feed, "2025-01-01T00:00:00.000Z");
    expect(item.title).toBe("OpenAI lève des fonds");
    expect(item.source.name).toBe("Les Echos");
    expect(item.summary).toBe("");
    expect(item.publishedAt).toBe("2025-01-01T00:00:00.000Z");
    expect(item.id).toMatch(/^[0-9a-z]+$/);
  });
});
