import type { Caption } from "@remotion/captions";

/**
 * Builds word-level captions for the style demo, which has no real voice.
 * Real edits use captions transcribed from the footage instead.
 */
export const fakeCaptions = (lines: [number, string][], wordSec = 0.27): Caption[] =>
  lines.flatMap(([start, text]) =>
    text.split(" ").map((word, i) => {
      const from = (start + i * wordSec) * 1000;
      return {
        text: ` ${word}`,
        startMs: from,
        endMs: from + wordSec * 1000 - 20,
        timestampMs: from + (wordSec * 1000) / 2,
        confidence: 1,
      };
    }),
  );
