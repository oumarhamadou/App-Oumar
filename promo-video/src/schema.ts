import { z } from "zod";

export const promoSchema = z.object({
  name: z.string(),
  role: z.string(),
  hookLine1: z.string(),
  hookLine2: z.string(),
  greeting: z.string(),
  buttonLabel: z.string(),
  availability: z.string(),
  experience: z.string(),
  instagram: z.string(),
  reelsEyebrow: z.string(),
  reelsTitle: z.string(),
  reelsSubtitle: z.string(),
  reel1: z.string(),
  reel2: z.string(),
  reel1Label: z.string(),
  reel2Label: z.string(),
  ctaLine1: z.string(),
  ctaLine2: z.string(),
  ctaButton: z.string(),
  // Width / height of each portfolio video, filled in by calculateMetadata (0 = file missing).
  reel1Aspect: z.number(),
  reel2Aspect: z.number(),
});

export type PromoProps = z.infer<typeof promoSchema>;

// Every text in the video lives here: edit, save, re-render.
// "­" is a soft hyphen: the word only breaks there when it does not fit.
export const ruProps: PromoProps = {
  name: "Oumar",
  role: "Видеомонтажёр и моушн-дизайнер",
  hookLine1: "Ищешь",
  hookLine2: "видео­монтажёра?",
  greeting: "Привет, я",
  buttonLabel: "Смотреть мои работы",
  availability: "Открыт к проектам",
  experience: "",
  instagram: "@oumar___hamadou",
  reelsEyebrow: "Портфолио",
  reelsTitle: "Мои последние работы.",
  reelsSubtitle: "Монтаж · Моушн-дизайн · UI-анимация",
  reel1: "reels/reel-1.mp4",
  reel2: "reels/reel-2.mp4",
  reel1Label: "Проект 01",
  reel2Label: "Проект 02",
  ctaLine1: "Давай создадим твой контент.",
  ctaLine2: "Закажи сейчас.",
  ctaButton: "Написать в Instagram",
  reel1Aspect: 0,
  reel2Aspect: 0,
};

export const frProps: PromoProps = {
  ...ruProps,
  role: "Monteur vidéo & motion designer",
  hookLine1: "Tu cherches un",
  hookLine2: "monteur vidéo ?",
  greeting: "Bonjour, je suis",
  buttonLabel: "Voir mes réalisations",
  availability: "Disponible",
  reelsEyebrow: "Portfolio",
  reelsTitle: "Mes dernières réalisations.",
  reelsSubtitle: "Montage · Motion design · Animation UI",
  reel1Label: "Projet 01",
  reel2Label: "Projet 02",
  ctaLine1: "Construisons ton contenu.",
  ctaLine2: "Commande maintenant.",
  ctaButton: "Écris-moi sur Instagram",
};
