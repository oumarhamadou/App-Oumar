// Single source of truth for timing, shared by visuals and sound design.
// All scene starts sit on a 120 BPM grid (BEAT = 15 frames).

export const SCENES = {
  hook: { from: 0, duration: 120 },
  play: { from: 105, duration: 235 },
  cards: { from: 330, duration: 132 },
  outro: { from: 450, duration: 270 },
} as const;

export const TOTAL_FRAMES = 720; // 24 s @ 30 fps

// Global "Difference" flash between the list and the cards
export const FLASH = { from: 320, duration: 22 } as const;

export const hookTiming = (wordCount: number) => {
  const step = Math.round(36 / (wordCount - 1));
  const appear = (k: number) => k * step - 3;
  const last = appear(wordCount - 1);
  return {
    appear,
    diffIn: last + 12,
    diffOut: 90,
    iconsAt: (k: number) => 64 + k * 5,
    scatterAt: 96,
    lastExit: 100,
  };
};

export const playTiming = (wordCount: number) => {
  const step = Math.round(24 / (wordCount - 1));
  const appear = (k: number) => 8 + k * step;
  return {
    appear,
    diffIn: 40,
    diffOut: 56,
    othersExit: 52,
    headerMove: [68, 88] as const,
    wheelIn: [84, 106] as const,
    pillIn: 92,
    stepAt: (i: number) => 108 + i * 11,
    steps: 9,
    exit: 212,
  };
};

export const cardsTiming = {
  flyIn: 0,
  kick: 58,
  exit: 104,
};

export const outroTiming = {
  dots: [6, 12, 18],
  turns: [30, 45, 58],
  merge: 64,
  reveal: 75,
  nameDiffIn: 92,
  nameDiffOut: 110,
  handle: 112,
  subtitle: 120,
  button: 148,
  cursorIn: [150, 174] as const,
  click: 178,
  ctaLine: 196,
  link: 204,
  linkDiffIn: 214,
  linkDiffOut: 236,
  fadeOut: [254, 268] as const,
};
