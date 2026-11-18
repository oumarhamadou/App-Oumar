// Source clip: 1090x1080, 30 fps, 12.7 s. The montage keeps that exact format.
export const WIDTH = 1090;
export const HEIGHT = 1080;
export const FPS = 30;
export const DURATION = 381;

// First frame of the close-up shot (hard cut in the source at 9.6 s).
export const CUT = 288;

// Frame each spoken word starts at (whisper large-v3 + audio-energy alignment).
// "You're behind because you're in a rush, and you're in a rush because you
// feel behind, and you feel behind because you're in a different season than
// the people you're comparing yourself to. You're not behind. You're just early."
export const W = {
  youre1: 1,
  behind1: 4,
  because1: 13,
  youre2: 24,
  in1: 30,
  a1: 33,
  rush1: 34,
  and1: 55,
  youre3: 60,
  in2: 68,
  a2: 72,
  rush2: 75,
  because2: 83,
  you1: 96,
  feel1: 102,
  behind2: 106,
  and2: 116,
  you2: 142,
  feel2: 144,
  behind3: 148,
  because3: 156,
  youre4: 180,
  in3: 187,
  a3: 190,
  different: 191,
  season: 199,
  than: 210,
  the: 217,
  people: 220,
  youre5: 228,
  comparing: 233,
  yourself: 241,
  to: 250,
  speechEndA: 265,
  youre6: 293,
  not: 297,
  behind4: 301,
  youre7: 337,
  just: 340,
  early: 345,
} as const;

// Global colours
export const GOLD_GRADIENT =
  "linear-gradient(180deg, #FFEAB0 0%, #F6CB66 40%, #E2A93F 72%, #BF862C 100%)";
export const CREAM_GRADIENT = "linear-gradient(180deg, #FFFFFF 0%, #F3EADB 100%)";
