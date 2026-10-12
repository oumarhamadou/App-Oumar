import { describe, expect, it } from "vitest";
import { offlineAnswer } from "@/lib/ai/offline";
import { buildStaticIndex, queryTerms, search } from "@/lib/search";

const index = buildStaticIndex();

describe("search", () => {
  it("is accent-insensitive", () => {
    expect(search(index, "interets composes")[0].title).toBe("Intérêts composés");
  });

  it("ignores stopwords and plural forms", () => {
    expect(queryTerms("C'est quoi les obligations ?")).toEqual(["obligation"]);
    expect(search(index, "les obligations")[0].title).toBe("Obligations");
  });

  it("requires every term by default", () => {
    expect(search(index, "inflation zzzz")).toEqual([]);
  });

  it("ranks partial matches for natural-language questions", () => {
    const results = search(index, "Pourquoi l'inflation zzzz ?", 5, { requireAll: false });
    expect(results[0].title).toBe("Inflation");
  });
});

describe("offlineAnswer", () => {
  it("answers from the matching concept at the requested level", () => {
    const answer = offlineAnswer("C'est quoi l'inflation ?", "debutant");
    expect(answer.text).toContain("**Inflation**");
    expect(answer.text).toContain("baguettes");
    expect(answer.sources[0].url).toBe("/savoir/inflation");
  });

  it("explains offline mode when nothing matches", () => {
    expect(offlineAnswer("xyzzy", "avance").text).toContain("mode hors ligne");
  });
});
