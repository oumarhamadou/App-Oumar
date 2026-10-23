// Script minuté de la vidéo « التوبة ».
//
// Tous les temps sont en secondes dans la piste voix (public/voix.m4a) :
// chaque mot apparaît à l'instant où il est prononcé. Les temps ont été
// relevés par détection de voix + transcription Whisper sur la voix.
//
// Pour monter une autre vidéo dans le même style : remplacer voix.m4a,
// réécrire les textes ci-dessous et recaler les temps « at ».

export type Word = {
  text: string;
  at: number;
  accent?: boolean;
  mark?: "underline";
  // Retour à la ligne forcé avant ce mot, en vertical uniquement.
  breakPortrait?: boolean;
};

const w = (
  text: string,
  at: number,
  accent?: boolean,
  mark?: Word["mark"],
): Word => ({ text, at, accent, mark });

// Même mot, avec un retour à la ligne avant lui dans la version verticale.
const br = (word: Word): Word => ({ ...word, breakPortrait: true });

export const VOICE = {
  file: "voix.m4a",
  // Silence ajouté avant la voix pour laisser respirer l'ouverture.
  offset: 0.5,
  duration: 22.36,
};

export const INTRO = {
  start: -0.5,
  end: 3.9,
  title: [w("التوبة", 0.38)],
  subtitle: [w("ـ لها", 0.96), w("ثلاثة", 1.2), w("شروط :", 1.5)],
  boxIn: 2.08,
  box: [
    w("حتى", 2.2),
    w("تكون", 2.45),
    br(w("صحيحةً", 2.75)),
    w("وصادقة", 3.1),
  ],
  exit: 3.3,
};

export type Condition = {
  numeral: string;
  heading: Word[];
  sub: Word[];
  quote: Word[];
  exit: number;
};

export const CONDITIONS_SCENE = {
  start: 3.3,
  end: 14.42,
};

export const CONDITIONS: Condition[] = [
  {
    numeral: "١",
    heading: [w("الشرط", 3.52), w("الأول", 3.85)],
    sub: [w("١ ـ الإقلاع", 4.51)],
    quote: [
      w("« لا", 5.28),
      w("تقول", 5.42),
      w("لي", 5.7),
      w("أنا", 5.85),
      w("تائب", 6.0),
      br(w("وأنت", 6.52)),
      w("مستمرٌّ", 6.72),
      w("على", 7.05),
      w("الخطأ »", 7.2),
    ],
    exit: 7.55,
  },
  {
    numeral: "٢",
    heading: [w("الشرط", 7.88), w("الثاني", 8.02)],
    sub: [w("٢ ـ الندم", 8.57)],
    quote: [
      w("« الندم", 9.37, true),
      w("توبة »", 9.65, true),
      br(w("كما", 9.95)),
      w("قال", 10.15),
      w("النبي", 10.4),
      w("ﷺ", 10.7),
    ],
    exit: 11.4,
  },
  {
    numeral: "٣",
    heading: [w("الشرط", 11.68), w("الثالث", 11.9)],
    sub: [
      w("٣ ـ العزم", 12.48),
      br(w("على", 13.4)),
      w("عدم", 13.58),
      w("العودة", 13.8),
    ],
    quote: [],
    exit: 99,
  },
];

// Volets bordeaux entre la partie crème et la partie pêche.
export const BLINDS = { start: 14.06, mid: 14.38, end: 14.72 };

export const RIGHTS = {
  start: 14.38,
  end: 18.3,
  boxIn: 14.42,
  box: [
    w("ـ إذا", 14.5),
    w("كان", 14.62),
    w("الذنب", 14.8),
    br(w("متعلقًا", 15.3)),
    w("بحقوق", 15.85),
    w("الآخرين !", 16.1),
  ],
  quote: [
    w("« مثل", 16.6),
    w("أخذ", 16.85),
    w("أموال", 17.2),
    w("أحدٍ", 17.5),
    w("أو", 17.82),
    w("كذا »", 17.95),
  ],
  exit: 18.02,
};

export const FOURTH = {
  start: 18.02,
  end: 23.1,
  line: [
    w("ـ ما", 18.1),
    w("تصحّ", 18.25),
    w("توبتك", 18.6),
    br(w("إلا", 19.2)),
    w("بشرطٍ", 19.5),
    w("رابع", 19.95, true, "underline"),
    w(":", 20.1),
  ],
  quote: [
    w("« أن", 20.44),
    w("تُرجع", 20.75),
    w("الحقوق", 21.08),
    w("لأصحابها »", 21.48, true),
  ],
};

// Carte récapitulative finale (après la voix).
export const OUTRO = {
  start: 22.55,
  end: 25.6,
  title: [w("شروط", 23.0), w("التوبة", 23.12)],
  items: [
    { numeral: "١", label: "الإقلاع", at: 23.45 },
    { numeral: "٢", label: "الندم", at: 23.6 },
    { numeral: "٣", label: "العزم", at: 23.75 },
    { numeral: "٤", label: "ردّ الحقوق", at: 23.9 },
  ],
};

export const VIDEO_END = OUTRO.end;
