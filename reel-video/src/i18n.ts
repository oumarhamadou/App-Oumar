import { staticFile } from "remotion";

export type Lang = "fr" | "ru";

export type Copy = {
  // Hook: each inner array is one line; the last word gets the "difference" box.
  hook: string[][];
  hookAccent: string; // word painted green
  play: string[][]; // last word = the "play" word that becomes the list header
  services: string[];
  cards: {
    timeline: string;
    growth: string;
    views: string;
    captions: string[];
    toggle: string;
    cta: string;
    sound: string;
    keyframes: string;
  };
  name: string;
  handle: string;
  subtitle: string;
  follow: string;
  following: string;
  ctaLine: string;
  link: string;
  photo: string;
};

export const COPY: Record<Lang, Copy> = {
  fr: {
    hook: [["Le", "montage,"], ["c'est", "comme"], ["un", "jeu."]],
    hookAccent: "montage,",
    play: [["Et", "oui,"], ["j'adore"], ["jouer."]],
    services: [
      "Montage vidéo",
      "Motion design",
      "Animation UI",
      "Animation SaaS",
      "Reels & TikTok",
      "Sous-titres animés",
      "Sound design",
      "Color grading",
      "Publicités vidéo",
      "Contenu viral",
    ],
    cards: {
      timeline: "Timeline",
      growth: "Rétention",
      views: "vues",
      captions: ["C'EST", "COMME", "UN JEU"],
      toggle: "Mode créatif",
      cta: "Commencer",
      sound: "Sound design",
      keyframes: "Keyframes",
    },
    name: "Oumar",
    handle: "Vidéo edit",
    subtitle: "Montage vidéo · UI & SaaS animation",
    follow: "Suivre",
    following: "Abonné",
    ctaLine: "Écris-moi sur Telegram",
    link: "t.me/video_editorsss",
    photo: staticFile("photos/avatar-facebook.jpg"),
  },
  ru: {
    hook: [["Монтаж", "—"], ["это", "как"], ["игра."]],
    hookAccent: "Монтаж",
    play: [["И", "да,"], ["я", "обожаю"], ["играть."]],
    services: [
      "Видеомонтаж",
      "Моушн-дизайн",
      "UI-анимация",
      "SaaS-анимация",
      "Reels и TikTok",
      "Анимированные титры",
      "Саунд-дизайн",
      "Цветокоррекция",
      "Видеореклама",
      "Вирусный контент",
    ],
    cards: {
      timeline: "Таймлайн",
      growth: "Удержание",
      views: "просмотров",
      captions: ["ЭТО", "КАК", "ИГРА"],
      toggle: "Режим творца",
      cta: "Начать",
      sound: "Саунд-дизайн",
      keyframes: "Ключевые кадры",
    },
    name: "Oumar",
    handle: "@oumar___hamadou",
    subtitle: "Видеомонтаж · UI & SaaS анимация",
    follow: "Подписаться",
    following: "Вы подписаны",
    ctaLine: "Пиши мне в Telegram",
    link: "t.me/video_editorsss",
    photo: staticFile("photos/avatar-instagram.jpg"),
  },
};

export type LangProps = { lang: Lang };
