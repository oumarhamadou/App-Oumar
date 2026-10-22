import type { Background } from "../theme";

/**
 * Styles de ligne, tous repris de la vidéo de référence :
 * - title      : grand titre dont les mots sortent du flou
 * - subtitle   : sous-titre discret tapé à la machine
 * - type       : ligne tapée à la machine, couleur d'encre de la scène
 * - typeStrong : variante calligraphiée (roqaa, encre foncée)
 * - box        : texte dans un encadré « surligneur » qui s'étire avec la voix
 * - pill       : texte dans une pastille arrondie
 * - blur       : mots qui tombent en place en sortant du flou
 * - credit     : petite signature (auteur du texte)
 */
export type LineKind =
  | "title"
  | "subtitle"
  | "type"
  | "typeStrong"
  | "box"
  | "pill"
  | "blur"
  | "credit";

/** Entrée de la scène par-dessus la précédente. */
export type Enter = "fade" | "wipeDown" | "softWipeDown" | "blinds" | "wipeUp";

export type ScriptLine = {
  kind: LineKind;
  /** Texte affiché ; chaque mot est calé sur la transcription de la voix. */
  text: string;
  /** Tiret « — » en début de ligne, comme dans la référence. */
  dash?: boolean;
  /** Ligne non prononcée : instant d'apparition fixe (ms) au lieu de la voix. */
  atMs?: number;
};

export type ScriptScene = {
  id: string;
  bg: Background;
  enter: Enter;
  lines: ScriptLine[];
};

export type TimedWord = {
  text: string;
  startMs: number;
  endMs: number;
};

export type TimedLine = ScriptLine & { words: TimedWord[] };

export type TimedScene = Omit<ScriptScene, "lines"> & {
  lines: TimedLine[];
  /** Début et fin de la scène, en images, sur la timeline globale. */
  from: number;
  to: number;
};
