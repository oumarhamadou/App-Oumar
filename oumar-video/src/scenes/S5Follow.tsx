import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { GridBg } from "../components/GridBg";
import { Line, Word } from "../components/Reveal";
import { Profile } from "../profile";
import { clamp, easeInOut, expoInOut, lerp, sans, script } from "../theme";
import { AVATAR_ZOOMED, PILL, T } from "../timeline";

// Local frames (scene starts at T.impact = 352, on the bar):
//   0  "Вы подписаны" pill takes over from the zoomed Follow button
//   8  avatar pops out of the card and loops under the pill (8 → 36)
//  42  avatar slides across the pill, wiping the label to the handle (42 → 54)
// 104  pill floods the screen with the blue grid (→ 128 = T.reveal)
// 132  closing line
// All positions are relative to the frame centre so 9:16 and 16:9 share code.
const START = T.impact;
const AV = PILL.h - 20;
const LAND_DX = PILL.w / 2 - 10 - AV / 2;
const REST_DX = -PILL.w / 2 + 10 + AV / 2;
const HANDLE_DX = (REST_DX + AV / 2 + PILL.w / 2) / 2;

// Loop under the pill (Catmull-Rom through these points).
const LOOP = {
  portrait: [
    [-370, -140],
    [-250, 370],
    [20, 520],
    [310, 340],
  ],
  landscape: [
    [-620, -150],
    [-520, 280],
    [0, 400],
    [520, 300],
  ],
};

const catmullRom = (points: number[][], u: number) => {
  const n = points.length - 1;
  const seg = Math.min(Math.floor(u * n), n - 1);
  const t = u * n - seg;
  const p0 = points[Math.max(seg - 1, 0)];
  const p1 = points[seg];
  const p2 = points[seg + 1];
  const p3 = points[Math.min(seg + 2, n)];
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
  const { width, height } = useVideoConfig();
  const cx = width / 2;
  const cy = height / 2;
  const path = [
    [AVATAR_ZOOMED.dx, AVATAR_ZOOMED.dy],
    ...(width > height ? LOOP.landscape : LOOP.portrait),
    [LAND_DX, 0],
  ];

  // Avatar flight → landing → slide → exit
  const u = interpolate(frame, [8, 36], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.33, 0, 0.3, 1),
  });
  const [fx, fy] = catmullRom(path, u);
  const slide = interpolate(frame, [42, 54], [0, 1], { ...clamp, easing: easeInOut });
  const flood = interpolate(frame, [104, 128], [0, 1], { ...clamp, easing: expoInOut });
  const avX = cx + (frame < 42 ? fx : lerp(lerp(LAND_DX, REST_DX, slide), cx + 200, flood));
  const avY = cy + (frame < 42 ? fy : 0);
  const avSize = lerp(AVATAR_ZOOMED.size, AV, Math.min(1, u * 1.6));
  const land = interpolate(frame, [36, 39, 44], [1, 1.14, 1], clamp);

  // Pill
  const bounce = interpolate(frame, [0, 4, 12], [1, 1.06, 1], clamp);
  const pw = lerp(PILL.w, width, flood);
  const ph = lerp(PILL.h, height, flood);
  const pl = cx - pw / 2;
  const pt = cy - ph / 2;

  // Label wipe follows the avatar's centre while it slides.
  const wipeX = frame < 42 ? width : cx + lerp(LAND_DX, REST_DX, slide);
  const handleX = cx + lerp(HANDLE_DX, 0, flood);
  const handleY = cy + lerp(0, -55, flood);
  const handleSize = lerp(52, Math.min(150, width * 0.1), flood);

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
        <div style={{ position: "absolute", left: -pl, top: -pt, width, height, opacity: flood }}>
          <GridBg variant="blue" />
        </div>
      </div>

      {/* Old label, visible left of the avatar */}
      <div
        style={{
          position: "absolute",
          left: 0,
          width,
          top: cy - 50,
          height: 100,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#FFFFFF",
          fontSize: PILL.font,
          fontWeight: 600,
          letterSpacing: "-0.02em",
          scale: `${bounce}`,
          clipPath: `inset(0 ${width - wipeX}px 0 0)`,
        }}
      >
        ✓ Вы подписаны
      </div>

      {/* Handle, revealed right of the avatar, then grows into the title */}
      <div
        style={{
          position: "absolute",
          left: handleX - cx,
          width,
          top: handleY - 110,
          height: 220,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#FFFFFF",
          fontSize: handleSize,
          fontWeight: lerp(650, 800, flood),
          letterSpacing: "-0.04em",
          whiteSpace: "nowrap",
          clipPath: frame < 54 ? `inset(0 0 0 ${wipeX - (handleX - cx)}px)` : "none",
          opacity: frame < 42 ? 0 : 1,
        }}
      >
        <span style={{ display: "inline-grid", gridTemplateColumns: `${flood}fr` }}>
          <span style={{ minWidth: 0, opacity: flood }}>@</span>
        </span>
        {profile.handle}
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
          top: cy + 50,
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
