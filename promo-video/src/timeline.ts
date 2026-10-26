// Scene lengths and transition overlaps, in frames at 30 fps.
export const HOOK_DURATION = 105;
export const INTRO_DURATION = 236;
export const REELS_DURATION = 300;
export const CTA_DURATION = 210;

export const ORB_WIPE = 24;
export const INTO_REELS = 12;
export const INTO_CTA = 20;

// Where each scene starts on the main timeline (transitions overlap scenes).
export const INTRO_START = HOOK_DURATION - ORB_WIPE;
export const REELS_START = INTRO_START + INTRO_DURATION - INTO_REELS;
export const CTA_START = REELS_START + REELS_DURATION - INTO_CTA;
export const PROMO_DURATION = CTA_START + CTA_DURATION;
