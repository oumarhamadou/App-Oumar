// Un mot du script, avec l'instant (en secondes dans la piste voix) où il est prononcé.
export type Word = {
  text: string;
  at: number;
  accent?: boolean;
  mark?: "underline";
  // Retour à la ligne forcé avant ce mot, en vertical uniquement.
  breakPortrait?: boolean;
};

export const w = (
  text: string,
  at: number,
  accent?: boolean,
  mark?: Word["mark"],
): Word => ({ text, at, accent, mark });

// Même mot, avec un retour à la ligne avant lui dans la version verticale.
export const br = (word: Word): Word => ({ ...word, breakPortrait: true });
