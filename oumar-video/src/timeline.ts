// Edit grid: 30 fps, 112.5 BPM → one beat every 16 frames, one bar every 64.
// Bars land on frames 32, 96, 160, 224, 288, 352, 416, 480 — the drop (224),
// the follow tap impact (352) and the blue reveal (480) all sit on bar lines.
// scripts/make_soundtrack.py uses the same frame numbers.
export const FPS = 30;
export const BEAT = 16;

export const T = {
  newBeginning: 0,
  wheel: 60,
  introducing: 120,
  profile: 216,
  drop: 224,
  impact: 352,
  reveal: 480,
  end: 544,
};

// Profile card geometry (card space, px). Shared by the profile scene and the
// follow scene so the hand-off between them is pixel-exact.
export const CARD = { w: 880, h: 640, r: 56 };
export const AVATAR = { left: 48, top: 136, size: 180 };
export const FOLLOW = { left: 48, top: 496, w: 384, h: 96, r: 24, font: 36 };

// Camera after zooming on the Follow button: scale 1.6, button centred.
export const ZOOM = 1.6;
const followCx = FOLLOW.left + FOLLOW.w / 2 - CARD.w / 2;
const followCy = FOLLOW.top + FOLLOW.h / 2 - CARD.h / 2;
export const ZOOM_SHIFT = { x: -followCx * ZOOM, y: -followCy * ZOOM };

// Screen-space hand-off values (1080×1920 frame, centre 540/960).
export const PILL = {
  w: FOLLOW.w * ZOOM,
  h: FOLLOW.h * ZOOM,
  r: FOLLOW.r * ZOOM,
  font: FOLLOW.font * ZOOM,
};
export const AVATAR_ON_SCREEN = {
  x:
    540 +
    ZOOM_SHIFT.x +
    (AVATAR.left + AVATAR.size / 2 - CARD.w / 2) * ZOOM,
  y:
    960 +
    ZOOM_SHIFT.y +
    (AVATAR.top + AVATAR.size / 2 - CARD.h / 2) * ZOOM,
  size: AVATAR.size * ZOOM,
};
