import type { Caption } from "@remotion/captions";
import type { ScriptScene, TimedScene, TimedWord } from "./types";

/** Forme de comparaison : sans voyelles ni accents, alifs et tā' marbūṭa unifiés. */
const normalize = (word: string) =>
  word
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f\u064b-\u065f\u0670\u0640]/g, "")
    .replace(/[\u0622\u0623\u0625\u0671]/g, "\u0627")
    .replace(/\u0629/g, "\u0647")
    .replace(/\u0649/g, "\u064a")
    .replace(/[^\p{L}\p{N}]/gu, "");

/** Découpe un texte en mots ; la ponctuation isolée (« ? », « ! ») reste collée au mot précédent. */
export const splitWords = (text: string): string[] => {
  const words: string[] = [];
  for (const token of text.split(/\s+/).filter(Boolean)) {
    if (normalize(token) === "" && words.length > 0) {
      words[words.length - 1] += `\u00a0${token}`;
    } else {
      words.push(token);
    }
  }
  return words;
};

/**
 * Associe chaque mot du script à un horodatage de la transcription
 * (plus longue sous-séquence commune sur les mots normalisés). Les mots
 * corrigés ou ajoutés à la main sont répartis entre leurs voisins.
 */
export const timeWords = (
  scriptWords: string[],
  captions: Caption[],
): TimedWord[] => {
  const spoken = captions.filter((c) => normalize(c.text) !== "");
  const a = scriptWords.map(normalize);
  const b = spoken.map((c) => normalize(c.text));
  const lcs: number[][] = Array.from({ length: a.length + 1 }, () =>
    new Array<number>(b.length + 1).fill(0),
  );
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      lcs[i][j] =
        a[i] === b[j]
          ? lcs[i + 1][j + 1] + 1
          : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
    }
  }

  const match = new Array<number>(a.length).fill(-1);
  for (let i = 0, j = 0; i < a.length && j < b.length; ) {
    if (a[i] === b[j]) {
      match[i++] = j++;
    } else if (lcs[i + 1][j] >= lcs[i][j + 1]) {
      i++;
    } else {
      j++;
    }
  }

  const timed: TimedWord[] = scriptWords.map((text, i) =>
    match[i] === -1
      ? { text, startMs: NaN, endMs: NaN }
      : {
          text,
          startMs: spoken[match[i]].startMs,
          endMs: spoken[match[i]].endMs,
        },
  );

  // Mots sans correspondance : répartis entre le mot horodaté précédent et le suivant.
  for (let i = 0; i < timed.length; i++) {
    if (!Number.isNaN(timed[i].startMs)) continue;
    let k = i;
    while (k < timed.length && Number.isNaN(timed[k].startMs)) k++;
    const lo = i === 0 ? (spoken[0]?.startMs ?? 0) : timed[i - 1].endMs;
    const hi =
      k < timed.length
        ? timed[k].startMs
        : (spoken[spoken.length - 1]?.endMs ?? lo + 400);
    const step = Math.max(hi - lo, 1) / (k - i);
    for (let m = i; m < k; m++) {
      timed[m].startMs = lo + step * (m - i);
      timed[m].endMs = lo + step * (m - i + 1);
    }
    i = k - 1;
  }
  return timed;
};

/**
 * Horodate le script et calcule l'intervalle de chaque scène. Une scène
 * commence `prerollMs` avant son premier mot, pour que la transition soit
 * terminée quand la voix attaque ; la première commence à 0.
 */
export const timeScript = ({
  scenes,
  captions,
  fps,
  prerollMs,
  endMs,
}: {
  scenes: ScriptScene[];
  captions: Caption[];
  fps: number;
  prerollMs: number;
  endMs: number;
}): TimedScene[] => {
  const spokenLines = scenes.flatMap((s) =>
    s.lines.filter((l) => l.atMs === undefined),
  );
  const timed = timeWords(
    spokenLines.flatMap((l) => splitWords(l.text)),
    captions,
  );

  let cursor = 0;
  const withWords = scenes.map((scene) => ({
    ...scene,
    lines: scene.lines.map((line) => {
      const texts = splitWords(line.text);
      if (line.atMs !== undefined) {
        const at = line.atMs;
        // Ligne non prononcée : un mot toutes les 250 ms.
        const words = texts.map((text, i) => ({
          text,
          startMs: at + i * 250,
          endMs: at + (i + 1) * 250,
        }));
        return { ...line, words };
      }
      const words = timed.slice(cursor, cursor + texts.length);
      cursor += texts.length;
      return { ...line, words };
    }),
  }));

  const toFrame = (ms: number) => Math.round((ms / 1000) * fps);
  const starts = withWords.map((scene, i) =>
    i === 0
      ? 0
      : Math.max(
          0,
          toFrame(
            Math.min(...scene.lines.map((l) => l.words[0].startMs)) - prerollMs,
          ),
        ),
  );
  return withWords.map((scene, i) => ({
    ...scene,
    from: starts[i],
    to: i + 1 < starts.length ? starts[i + 1] : toFrame(endMs),
  }));
};
