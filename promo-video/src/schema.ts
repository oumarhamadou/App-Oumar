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
  ctaLine1: z.string(),
  ctaLine2: z.string(),
  ctaButton: z.string(),
  hasReel1: z.boolean(),
  hasReel2: z.boolean(),
});

export type PromoProps = z.infer<typeof promoSchema>;

// Every text in the video lives here: edit, save, re-render.
export const defaultPromoProps: PromoProps = {
  name: "Oumar",
  role: "Monteur vidéo",
  hookLine1: "Tu cherches un",
  hookLine2: "monteur vidéo ?",
  greeting: "Bonjour, je suis",
  buttonLabel: "Voir mes réalisations",
  availability: "Disponible",
  experience: "",
  instagram: "@oumar___hamadou",
  reelsEyebrow: "Portfolio",
  reelsTitle: "Mes derniers reels.",
  reelsSubtitle: "Publiés récemment sur Instagram.",
  reel1: "reels/reel-1.mp4",
  reel2: "reels/reel-2.mp4",
  ctaLine1: "Construisons ton contenu.",
  ctaLine2: "Commande maintenant.",
  ctaButton: "Écris-moi sur Instagram",
  hasReel1: false,
  hasReel2: false,
};
