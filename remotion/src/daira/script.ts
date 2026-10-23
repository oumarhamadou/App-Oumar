// Script minuté de la vidéo « الدائرة » (Inspi Story).
//
// Voix : piste audio d'origine de la vidéo fournie (public/daira/voix.m4a), sans musique ajoutée.
// Chaque « at » est l'instant, en secondes dans la voix, où le mot est prononcé :
// relevé par transcription Whisper puis alignement lettre par lettre (CTC multilingue).

import type { SceneSpec } from "../components/StoryScene";
import { br, w } from "../text";

export const VOICE = {
  file: "daira/voix.m4a",
  duration: 48.83,
};

// 1. Bordeaux — l'accroche : « si ton cercle rétrécit… »
export const INTRO: SceneSpec = {
  start: -0.5,
  end: 7.4,
  bg: "maroon",
  enter: "cut",
  blocks: [
    {
      settle: true,
      lines: [
        {
          kind: "title",
          words: [
            w("إذا", 0.0),
            w("دائرتك", 0.18),
            br(w("صارت", 0.51)),
            w("تصغر", 0.84),
          ],
        },
        {
          kind: "sub",
          words: [
            w("لا", 1.45),
            w("تخاف،", 1.59),
            br(w("ولا", 2.26)),
            w("تركض،", 2.52),
            br(w("ولا", 3.1)),
            w("تترجّى", 3.34),
            w("أي", 3.92),
            w("أحد", 4.2),
          ],
        },
        {
          kind: "box",
          words: [
            w("ولا", 4.74),
            w("تقارن", 4.96),
            w("دائرتك", 5.38),
            br(w("بدوائر", 5.88)),
            w("ناس", 6.38),
            w("ثانية", 6.6),
          ],
        },
      ],
    },
  ],
};

// 2. Crème — le piège des chiffres et des réseaux sociaux.
export const NUMBERS: SceneSpec = {
  start: 6.95,
  end: 16.8,
  bg: "cream",
  enter: "circle",
  blocks: [
    {
      exit: 10.02,
      lines: [
        {
          kind: "heading",
          words: [w("ولا", 7.11), w("تنخدع", 7.31), w("بالعدد", 7.75)],
        },
        { kind: "divider", words: [], at: 8.0 },
        {
          kind: "sub",
          words: [
            w("خاصةً", 8.23),
            w("اللي", 8.61),
            w("بتشوفه", 8.87),
            br(w("على", 9.37)),
            w("السوشال", 9.47),
            w("ميديا", 9.87),
          ],
        },
      ],
    },
    {
      lines: [
        {
          kind: "heading",
          words: [w("لا", 10.35), w("تنخدع", 10.49), w("بصورة", 10.97)],
        },
        {
          kind: "quote",
          words: [
            w("فيها", 11.45),
            w("خمسة", 11.94, true),
            w("وعشرين", 12.44, true),
            w("واحد", 12.93),
            br(w("بيصفّق", 13.11)),
            w("للإنسان", 13.61),
          ],
        },
        {
          kind: "box",
          words: [
            w("ولكن", 14.32),
            w("يمكن", 14.64),
            w("ما", 14.9),
            w("حدا", 15.02),
            br(w("بيقعد", 15.18)),
            w("معه", 15.58),
            w("لمّا", 15.96, true),
            w("بيطيح", 16.12, true),
          ],
        },
      ],
    },
  ],
};

// Volets bordeaux vers la partie pêche.
export const BLINDS_1 = { start: 16.42, mid: 16.78, end: 17.12 };

// 3. Pêche — l'ami fidèle.
export const FRIENDS: SceneSpec = {
  start: 16.78,
  end: 23.36,
  bg: "peach",
  enter: "cut",
  exit: 23.04,
  blocks: [
    {
      settle: true,
      lines: [
        {
          kind: "heading",
          words: [w("صديق", 16.91), w("واحد", 17.47), w("وفي", 17.79)],
        },
        {
          kind: "sub",
          words: [
            w("أو", 18.26),
            w("صديقة", 18.42),
            w("وحدة", 18.9),
            w("وفيّة", 19.18),
          ],
        },
        {
          kind: "quote",
          words: [
            w("تكون", 19.9),
            w("أهم", 20.26),
            w("من", 20.78),
            w("مليون", 20.98, true),
            w("صديق", 21.46),
            br(w("ومليون", 21.94, true)),
            w("أخ", 22.46),
            w("حتى", 22.72),
          ],
        },
      ],
    },
  ],
};

// 4. Pêche — le proverbe, en zoom avant.
export const PROVERB: SceneSpec = {
  start: 23.0,
  end: 26.75,
  bg: "peach",
  enter: "zoom",
  blocks: [
    {
      lines: [
        {
          kind: "small",
          words: [
            w("لا", 23.21),
            w("تنسى", 23.35),
            w("المثل", 23.59),
            w("العربي", 23.93),
            w("اللي", 24.23),
            w("بيقول :", 24.39),
          ],
        },
        { kind: "divider", words: [], at: 24.7 },
        {
          kind: "box",
          words: [
            w("رُبَّ", 25.07),
            w("أخٍ", 25.41),
            w("لك", 25.59),
            w("لم", 25.77),
            w("تلده", 25.95),
            w("أمك", 26.33, true),
          ],
        },
      ],
    },
  ],
};

// 5. Bordeaux — le cœur du message : petit cercle sincère contre grand cercle vide.
export const CIRCLE: SceneSpec = {
  start: 26.5,
  end: 32.85,
  bg: "maroon",
  enter: "circle",
  blocks: [
    {
      settle: true,
      lines: [
        {
          kind: "heading",
          words: [
            w("فدائرة", 26.71),
            w("صغيرة", 27.41, true),
            w("صادقة", 28.09, true),
            br(w("وصريحة", 28.85)),
            w("معاك", 29.49),
          ],
        },
        { kind: "divider", words: [], at: 29.85 },
        {
          kind: "heading",
          words: [
            w("أفضل", 30.08),
            w("من", 30.46),
            w("دائرة", 30.66),
            w("كبيرة", 31.08),
            br(w("فاضية", 31.58, true)),
            w("وزائفة", 32.14, true),
          ],
        },
      ],
    },
  ],
};

// 6. Crème — Dieu ne retire rien sans compenser ; ne reste pas là où tu as commencé.
export const COMPENSATION: SceneSpec = {
  start: 32.6,
  end: 40.85,
  bg: "cream",
  enter: "circle",
  blocks: [
    {
      exit: 37.48,
      lines: [
        {
          kind: "heading",
          words: [
            w("فربّ", 32.84),
            w("العالمين", 33.12),
            br(w("ما", 33.6)),
            w("بينقّص", 33.72),
            w("من", 34.18),
            w("حياتك", 34.34),
          ],
        },
        {
          kind: "box",
          words: [
            w("ولكن", 35.1),
            w("بيعوّضك", 35.56),
            br(w("بشي", 36.24)),
            w("أجمل", 36.6, true),
            w("بكثير", 37.0, true),
          ],
        },
      ],
    },
    {
      settle: true,
      lines: [
        { kind: "title", words: [w("فلا", 37.76), w("تعاند", 38.02)] },
        {
          kind: "quote",
          words: [
            w("ولا", 38.65),
            w("تقعد", 38.87),
            w("في", 39.19),
            w("المكان", 39.27),
            br(w("اللي", 39.65)),
            w("إنت", 39.89),
            w("بديت", 40.23),
            w("فيه", 40.45),
          ],
        },
      ],
    },
  ],
};

// Volets bordeaux vers la dernière partie.
export const BLINDS_2 = { start: 40.55, mid: 40.85, end: 41.2 };

// 7. Pêche — l'exemple de l'Hégire.
export const HIJRA: SceneSpec = {
  start: 40.85,
  end: 50.05,
  bg: "peach",
  enter: "cut",
  blocks: [
    {
      settle: true,
      lines: [
        {
          kind: "small",
          words: [
            w("أحب", 40.66),
            w("أذكّرك", 40.94),
            w("مرة", 41.48),
            w("ثانية", 41.74),
          ],
        },
        {
          kind: "heading",
          words: [w("إن", 42.2), w("الرسول", 42.38), w("ﷺ", 42.82)],
        },
        {
          kind: "quote",
          words: [
            w("لمّا", 43.98),
            w("أيقن", 44.4),
            w("إن", 44.98),
            w("المكان", 45.08),
            w("اللي", 45.56),
            w("بدأ", 45.7),
            w("فيه", 45.96),
            br(w("مو", 46.39)),
            w("هو", 46.57),
            w("المناسب", 46.79),
            w("له", 47.37),
          ],
        },
        {
          kind: "box",
          words: [w("هاجر", 47.82), w("إلى", 48.24), w("المدينة", 48.36, true)],
        },
      ],
    },
  ],
};

// 8. Carte de fin avec le logo Inspi Story.
export const LOGO = { start: 49.75, end: 53.3 };

export const VIDEO_END = LOGO.end;
