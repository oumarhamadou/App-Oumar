import type { ScriptScene } from "./types";

/**
 * Le poème récité dans la vidéo source (attribué à Abû Nuwâs), découpé
 * comme la vidéo de référence : une scène par vers, deux lignes par scène,
 * puis une scène finale rose poudré et la carte de fin. Chaque mot est calé
 * sur la voix grâce à `src/data/captions.json` (transcription horodatée).
 */
export const settings = {
  /** Une scène entre un peu avant son premier mot, pour finir sa transition à temps. */
  prerollMs: 380,
  /** Fin de la dernière scène de texte ; la carte de fin enchaîne. */
  textEndMs: 30800,
};

export const script: ScriptScene[] = [
  {
    id: "Vers-1",
    bg: "maroon",
    enter: "fade",
    badge: "top-right",
    lines: [
      { kind: "title", text: "يا ربِّ إنْ عظُمتْ ذنوبي كثرةً" },
      { kind: "subtitle", text: "فلقدْ علمتُ بأنَّ عفوَكَ أعظمُ" },
    ],
  },
  {
    id: "Vers-2",
    bg: "cream",
    enter: "wipeDown",
    badge: "top-right",
    lines: [
      { kind: "type", text: "إنْ كانَ لا يرجوكَ إلّا محسنٌ", dash: true },
      {
        kind: "typeStrong",
        text: "فبمَنْ يلوذُ ويستجيرُ المجرمُ؟",
        dash: true,
      },
    ],
  },
  {
    id: "Vers-3",
    bg: "maroon",
    enter: "blinds",
    badge: "left",
    lines: [
      { kind: "box", text: "أدعوكَ ربِّ كما أمرتَ تضرُّعًا" },
      { kind: "blur", text: "فإذا رددتَ يدي فمَنْ ذا يرحمُ؟", dash: true },
    ],
  },
  {
    id: "Vers-4",
    bg: "cream",
    enter: "softWipeDown",
    badge: "top-right",
    lines: [
      { kind: "pill", text: "ما لي إليكَ وسيلةٌ" },
      { kind: "typeStrong", text: "إلّا الرَّجا", dash: true },
    ],
  },
  {
    id: "Final",
    bg: "blush",
    enter: "wipeUp",
    badge: "top-right",
    lines: [
      { kind: "title", text: "وجميلُ عفوِكَ" },
      { kind: "blur", text: "ثمَّ إنّي مسلمُ" },
      { kind: "credit", text: "أبو نواس", atMs: 28900 },
    ],
  },
];
