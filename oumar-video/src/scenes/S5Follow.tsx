import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { GridBg } from "../components/GridBg";
import { Line, Word } from "../components/Reveal";
import { Profile } from "../profile";
import { clamp, easeInOut, expoInOut, lerp, sans, script } from "../theme";
import { AVATAR_ON_SCREEN, PILL, T } from "../timeline";

// Local frames (scene starts at T.impact = 352, on the bar):
//   0  "Вы подписаны" pill takes over from the zoomed Follow button
//   8  avatar pops out of the card and loops under the pill (8 → 36)
//  42  avatar slides across the pill, wiping the label to the name (42 → 54)
// 104  pill floods the screen with the blue grid (→ 128 = T.reveal)
// 132  closing line
const START = T.impact;
const AV = PILL.h - 20;
const PILL_LEFT = 540 - PILL.w / 2;
const LAND_X = 540 + PILL.w / 2 - 10 - AV / 2;
const REST_X = PILL_LEFT + 10 + AV / 2;
const NAME_X = (REST_X + AV / 2 + 540 + PILL.w / 2) / 2;

// Catmull-Rom path through the avatar's loop under the pill.
const PATH = [
  [AVATAR_ON_SCREEN.x, AVATAR_ON_SCREEN.y],
  [170, 820],
  [290, 1330],
  [560, 1480],
  [850, 1300],
  [LAND_X, 960],
];
const along = (u: number) => {
  const n = PATH.length - 1;
  const seg = Math.min(Math.floor(u * n), n - 1);
  const t = u * n - seg;
  const p0 = PATH[Math.max(seg - 1, 0)];
  const p1 = PATH[seg];
  const p2 = PATH[seg + 1];
  const p3 = PATH[Math.min(seg + 2, n)];
  const cr = (a: number, b: number, c: number, d: number) =>
    0.5 *
    (2 * b +
      (-a + c) * t +
      (2 * a - 5 * b + 4 * c - d) * t * t +
      (-a + 3 * b - 3 * c + d) * t * t * t);
  return [cr(p0[0], p1[0], p2[0], p3[0]), cr(p0[1], p1[1], p2[1], p3[1])];
};

export const S5Follow: React.FC<{ profile: Profile }> = ({ profile }) => {
  const frame = useCurrentFrame();

  // Avatar flight → landing → slide → exit
  const u = interpolate(frame, [8, 36], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.33, 0, 0.3, 1),
  });
  const [fx, fy] = along(u);
  const slide = interpolate(frame, [42, 54], [0, 1], { ...clamp, easing: easeInOut });
  const flood = interpolate(frame, [104, 128], [0, 1], { ...clamp, easing: expoInOut });
  const avX = frame < 42 ? fx : lerp(lerp(LAND_X, REST_X, slide), 1280, flood);
  const avY = frame < 42 ? fy : 960;
  const avSize = lerp(AVATAR_ON_SCREEN.size, AV, Math.min(1, u * 1.6));
  const land = interpolate(frame, [36, 39, 44], [1, 1.14, 1], clamp);

  // Pill
  const bounce = interpolate(frame, [0, 4, 12], [1, 1.06, 1], clamp);
  const pw = lerp(PILL.w, 1080, flood);
  const ph = lerp(PILL.h, 1920, flood);
  const pl = 540 - pw / 2;
  const pt = 960 - ph / 2;

  // Label wipe follows the avatar's centre while it slides.
  const wipeX = frame < 42 ? 1080 : lerp(LAND_X, REST_X, slide);
  const nameX = lerp(NAME_X, 540, flood);
  const nameY = lerp(960, 905, flood);
  const nameSize = lerp(PILL.font, 150, flood);

  return (
    <AbsoluteFill style={{ fontFamily: sans }}>
      <Sequence from={16} layout="absolute-fill">
        <GridBg variant="green" frameOffset={START + 16} />
      </Sequence>

      {/* Pill → full-screen blue */}
      <div
        style={{
          position: "absolute",
          left: pl,
          top: pt,
          width: pw,
          height: ph,
          borderRadius: lerp(PILL.r, 0, flood),
          overflow: "hidden",
          background: "#0A84FF",
          scale: `${bounce}`,
          boxShadow: `0 ${24 * (1 - flood)}px ${60 * (1 - flood)}px rgba(0,60,160,${0.35 * (1 - flood)})`,
        }}
      >
        <div style={{ position: "absolute", left: -pl, top: -pt, width: 1080, height: 1920, opacity: flood }}>
          <GridBg variant="blue" />
        </div>
      </div>

      {/* Old label, visible left of the avatar */}
      <div
        style={{
          position: "absolute",
          left: 0,
          width: 1080,
          top: 960 - 50,
          height: 100,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#FFFFFF",
          fontSize: PILL.font,
          fontWeight: 600,
          letterSpacing: "-0.02em",
          scale: `${bounce}`,
          clipPath: `inset(0 ${1080 - wipeX}px 0 0)`,
        }}
      >
        ✓ Вы подписаны
      </div>

      {/* Name, revealed right of the avatar, then grows into the title */}
      <div
        style={{
          position: "absolute",
          left: nameX - 540,
          width: 1080,
          top: nameY - 110,
          height: 220,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#FFFFFF",
          fontSize: nameSize,
          fontWeight: lerp(650, 800, flood),
          letterSpacing: "-0.045em",
          clipPath: frame < 54 ? `inset(0 0 0 ${wipeX - (nameX - 540)}px)` : "none",
          opacity: frame < 42 ? 0 : 1,
        }}
      >
        {profile.name}
      </div>

      {/* Avatar */}
      <div
        style={{
          position: "absolute",
          left: avX - avSize / 2,
          top: avY - avSize / 2,
          width: avSize,
          height: avSize,
          borderRadius: "50%",
          padding: lerp(11.2, 6, Math.min(1, u * 1.6)),
          background: "#FFFFFF",
          boxShadow: "0 14px 34px rgba(0,40,20,0.28)",
          opacity: frame < 8 ? 0 : interpolate(frame, [112, 126], [1, 0], clamp),
          scale: `${land}`,
        }}
      >
        <Img
          src={staticFile("avatar.jpg")}
          style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", display: "block" }}
        />
      </div>

      {/* Closing line on the blue grid */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1010,
          color: "#FFFFFF",
          fontSize: 60,
          fontWeight: 600,
          letterSpacing: "-0.035em",
          lineHeight: 1.15,
        }}
      >
        <Line at={132}>
          <Word at={132} tint="#B8F5C8" style={{ color: "#FFFFFF" }}>Ты</Word>
          <Word at={135} tint="#B8F5C8" style={{ color: "#FFFFFF" }}>становишься</Word>
          <Word at={138} tint="#B8F5C8" space={false} style={{ color: "#FFFFFF" }}>тем,</Word>
        </Line>
        <Line at={141}>
          <Word at={141} tint="#B8F5C8" style={{ color: "#FFFFFF" }}>что</Word>
          <Word
            at={144}
            tint="#B8F5C8"
            style={{ fontFamily: script, fontSize: 130, fontWeight: 400, letterSpacing: 0, color: "#FFFFFF" }}
          >
            повторяешь
          </Word>
          <Word at={150} tint="#B8F5C8" space={false} style={{ color: "#FFFFFF" }}>⚡</Word>
        </Line>
      </div>
    </AbsoluteFill>
  );
};
