import React, { createContext, useContext } from "react";
import { buildTimeline, SceneId, Timeline, Voiceover } from "./timeline";
import frVoiceover from "./voiceover-fr.json";
import ruVoiceover from "./voiceover-ru.json";

export type Lang = "fr" | "ru";

/** A piece of on-screen text and the index of the spoken word it appears with. */
type Tok = { label: string; word: number };
export type KeepToken = Tok & { color?: string; wipe?: boolean; wave?: boolean };

/** Everything written on screen, per scene. Word indices refer to src/voiceover-<lang>.json. */
export type Copy = {
  intro: { lines: Tok[][]; accentWord: number; fontSize: number };
  name: { lead: Tok[]; name: string; nameWord: number };
  /** The pill shows the spoken line minus its first `skipChars` characters. */
  challenge: { skipChars: number };
  stepper: { title: string; countUntilWord: number; expandWord: number };
  years: { text: string; fontSize: number };
  prompt: { text: string; menu: string[]; menuWords: number[] };
  segmented: { labels: string[] };
  messages: { bubbles: Tok[]; receipt: string };
  platforms: {
    prefix: Tok;
    line1: Tok;
    line2: Tok;
    badge: string;
    title: Tok[];
    /** Spoken words for Instagram, X, YouTube. */
    platformWords: [number, number, number];
  };
  keep: { phases: { startWord: number; lines: KeepToken[][] }[] };
  client: { words: Tok[]; tagWidth: number };
  calendar: { growFrom: number; growTo: number; question: number };
  exciting: { lines: Tok[][]; big: Tok };
  tagline: string;
};

const CORAL = "#F2665A";
const BLUE = "#4C8DFF";
const RED = "#FF4D5E";

const FR: Copy = {
  intro: {
    lines: [
      [
        { label: "Salut,", word: 0 },
        { label: "je", word: 1 },
        { label: "suis", word: 2 },
      ],
      [
        { label: "motion", word: 3 },
        { label: "designer.", word: 4 },
      ],
    ],
    accentWord: 4,
    fontSize: 98,
  },
  name: {
    lead: [
      { label: "je", word: 0 },
      { label: "m'appelle", word: 1 },
    ],
    name: "Oumar",
    nameWord: 2,
  },
  challenge: { skipChars: 3 },
  stepper: { title: "montage vidéo", countUntilWord: 2, expandWord: 5 },
  years: { text: "Depuis quelques années", fontSize: 80 },
  prompt: {
    text: "je fais ce que j'aime le plus : monter des vidéos",
    menu: ["Aujourd'hui", "j'ai", "zéro client"],
    menuWords: [0, 1, 2],
  },
  segmented: { labels: ["Pas d'audience", "Pas d'agence", "Derrière moi"] },
  messages: {
    bubbles: [
      { label: "Juste une obsession :", word: 0 },
      { label: "créer de meilleures vidéos", word: 3 },
    ],
    receipt: "Lu à 15:15",
  },
  platforms: {
    prefix: { label: "Alors,", word: 0 },
    line1: { label: "À partir", word: 1 },
    line2: { label: "d'aujourd'hui", word: 3 },
    badge: "Jour 1",
    title: [
      { label: "Je", word: 4 },
      { label: "publie", word: 5 },
      { label: "sur", word: 6 },
    ],
    platformWords: [7, 8, 10],
  },
  keep: {
    phases: [
      {
        startWord: 0,
        lines: [
          [
            { label: "Je", word: 0 },
            { label: "vais", word: 1 },
            { label: "continuer", word: 2 },
          ],
          [
            { label: "à", word: 3 },
            { label: "créer", word: 4, color: CORAL, wipe: true },
          ],
        ],
      },
      {
        startWord: 5,
        lines: [
          [{ label: "continuer", word: 5 }],
          [
            { label: "à", word: 6 },
            { label: "publier", word: 7, color: BLUE, wipe: true },
          ],
        ],
      },
      {
        startWord: 8,
        lines: [
          [
            { label: "et", word: 8, wave: true },
            { label: "voir", word: 9, wave: true },
          ],
          [
            { label: "ce", word: 10, wave: true },
            { label: "qui", word: 11, wave: true },
            { label: "se", word: 12, wave: true, color: RED },
            { label: "passe", word: 13, wave: true, color: RED },
          ],
        ],
      },
    ],
  },
  client: {
    words: [
      { label: "jusqu'à", word: 0 },
      { label: "décrocher", word: 1 },
      { label: "mon", word: 2 },
      { label: "premier", word: 3 },
      { label: "client", word: 4 },
    ],
    tagWidth: 470,
  },
  calendar: { growFrom: 1, growTo: 9, question: 10 },
  exciting: {
    lines: [
      [
        { label: "Et", word: 0 },
        { label: "c'est", word: 1 },
        { label: "justement", word: 2 },
        { label: "ça", word: 3 },
      ],
      [
        { label: "qui", word: 4 },
        { label: "est", word: 5 },
      ],
    ],
    big: { label: "excitant.", word: 6 },
  },
  tagline: "motion designer · jour 1",
};

const RU: Copy = {
  intro: {
    lines: [
      [
        { label: "Привет,", word: 0 },
        { label: "я", word: 1 },
      ],
      [{ label: "моушн-дизайнер.", word: 2 }],
    ],
    accentWord: 2,
    fontSize: 86,
  },
  name: {
    lead: [
      { label: "меня", word: 0 },
      { label: "зовут", word: 1 },
    ],
    name: "Умар",
    nameWord: 2,
  },
  challenge: { skipChars: 2 },
  stepper: { title: "монтаж видео", countUntilWord: 2, expandWord: 4 },
  years: { text: "Последние несколько лет", fontSize: 60 },
  prompt: {
    text: "я занимаюсь тем, что люблю больше всего: монтирую видео",
    menu: ["Сейчас", "у меня", "ноль клиентов"],
    menuWords: [0, 1, 3],
  },
  segmented: { labels: ["Ни аудитории", "Ни агентства", "За спиной"] },
  messages: {
    bubbles: [
      { label: "Только одержимость:", word: 0 },
      { label: "делать видео лучше", word: 2 },
    ],
    receipt: "Прочитано 15:15",
  },
  platforms: {
    prefix: { label: "Поэтому", word: 0 },
    line1: { label: "С сегодняшнего", word: 1 },
    // "дня" shows with "сегодняшнего": the voice gives it no time of its own.
    line2: { label: "дня", word: 2 },
    badge: "День 1",
    title: [
      { label: "Я", word: 4 },
      { label: "публикую", word: 5 },
      { label: "в", word: 6 },
    ],
    platformWords: [7, 8, 10],
  },
  keep: {
    phases: [
      {
        startWord: 0,
        lines: [
          [
            { label: "Я", word: 0 },
            { label: "буду", word: 1 },
          ],
          [{ label: "продолжать", word: 2 }],
          [{ label: "создавать", word: 3, color: CORAL, wipe: true }],
        ],
      },
      {
        startWord: 4,
        lines: [
          [{ label: "продолжать", word: 4 }],
          [{ label: "публиковать", word: 5, color: BLUE, wipe: true }],
        ],
      },
      {
        startWord: 6,
        lines: [
          [
            { label: "и", word: 6, wave: true },
            { label: "смотреть,", word: 7, wave: true },
          ],
          [
            { label: "что", word: 8, wave: true },
            { label: "будет", word: 9, wave: true, color: RED },
          ],
        ],
      },
    ],
  },
  client: {
    words: [
      { label: "пока", word: 0 },
      { label: "не", word: 1 },
      { label: "найду", word: 2 },
      { label: "своего", word: 3 },
      { label: "первого", word: 4 },
      { label: "клиента", word: 5 },
    ],
    tagWidth: 700,
  },
  calendar: { growFrom: 2, growTo: 7, question: 8 },
  exciting: {
    lines: [
      [
        { label: "И", word: 0 },
        { label: "именно", word: 1 },
        { label: "в", word: 2 },
        { label: "этом", word: 3 },
      ],
      [{ label: "весь", word: 4 }],
    ],
    big: { label: "азарт.", word: 5 },
  },
  tagline: "моушн-дизайнер · день 1",
};

export const LOCALES: Record<Lang, { audio: string; timeline: Timeline; copy: Copy }> = {
  fr: {
    audio: "voiceover/voix-oumar-fr.mp3",
    timeline: buildTimeline(frVoiceover as Voiceover),
    copy: FR,
  },
  ru: {
    audio: "voiceover/voix-oumar-ru.mp3",
    timeline: buildTimeline(ruVoiceover as Voiceover),
    copy: RU,
  },
};

export const LangContext = createContext<Lang>("fr");

export const useLocale = () => LOCALES[useContext(LangContext)];
export const useScene = (id: SceneId) => useLocale().timeline.scene(id);
export const useCopy = () => useLocale().copy;

/** Wrap a scene so it previews in a given language in the Studio. */
export const withLang = (lang: Lang, Scene: React.FC, name: string): React.FC => {
  const Wrapped: React.FC = () => (
    <LangContext.Provider value={lang}>
      <Scene />
    </LangContext.Provider>
  );
  Wrapped.displayName = `${name}-${lang}`;
  return Wrapped;
};
