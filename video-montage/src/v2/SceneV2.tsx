import React from "react";
import { Video } from "@remotion/media";
import { chromaticAberration } from "@remotion/effects/chromatic-aberration";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from "remotion";
import { CUT, HEIGHT, W, WIDTH } from "../lib/constants";
import { easeIn, easeInOut, easeOut, keys, prog } from "../lib/motion";

type Shot = { from: number; scale: number; origin: readonly [number, number]; drift: number; snap: number };

// Viral pacing: a "jump cut" with a new framing on (almost) every phrase,
// like a multi-camera podcast edit. Scale >= 1 so the format never shows borders.
export const SHOTS: readonly Shot[] = [
  { from: 0, scale: 1.24, origin: [500, 290], drift: 0.0011, snap: 0.07 }, // hook – tight on the face
  { from: W.and1, scale: 1.0, origin: [500, 300], drift: 0.0007, snap: 0.045 }, // wide
  { from: W.because2, scale: 1.34, origin: [500, 290], drift: 0.0009, snap: 0.045 }, // tight
  { from: W.you2, scale: 1.04, origin: [500, 300], drift: 0.0007, snap: 0.045 }, // wide
  { from: W.youre4, scale: 1.16, origin: [500, 300], drift: 0.0008, snap: 0.045 }, // medium (SEASON behind)
  { from: W.youre5, scale: 1.34, origin: [500, 290], drift: 0.0009, snap: 0.045 }, // tight
  { from: CUT, scale: 1.0, origin: [575, 380], drift: 0.0007, snap: 0.06 }, // close-up (after light sweep)
  { from: W.youre7, scale: 1.17, origin: [575, 360], drift: 0.0011, snap: 0.045 }, // final punch-in
];

export const CUTS = SHOTS.slice(1).map((s) => s.from);

const shotAt = (f: number) => {
  let s = SHOTS[0];
  for (const shot of SHOTS) if (f >= shot.from) s = shot;
  return s;
};

export const SceneV2: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const s = shotAt(f);
  const snap = 1 + s.snap * (1 - prog(f, s.from, 7, easeOut));
  // accelerate into the light-sweep transition
  const push = f < CUT ? keys(f, [[W.speechEndA, 1], [CUT - 1, 1.14, easeIn]]) : 1;
  const scale = s.scale * (1 + (f - s.from) * s.drift) * snap * push;
  const chroma =
    f < CUT
      ? interpolate(f, [CUT - 8, CUT - 1], [0, 12], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
      : interpolate(f, [CUT, CUT + 12], [22, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
  return (
    <AbsoluteFill
      style={{
        transformOrigin: `${s.origin[0]}px ${s.origin[1]}px`,
        scale: String(scale),
        filter: "contrast(1.05) saturate(1.04)",
      }}
    >
      <Video
        name="Source"
        src={staticFile("source.mp4")}
        volume={0.95}
        style={{ width: WIDTH, height: HEIGHT }}
        effects={[chromaticAberration({ amount: chroma, angle: 0, disabled: chroma < 0.3 })]}
      />
      {children}
    </AbsoluteFill>
  );
};

/**
 * Reference #2 transition: a prism light sweep (white core, magenta + cyan
 * fringes) crossing right → left, burning to white over the cut, then leaving
 * a colour fringe on the new shot.
 */
export const PrismSweep: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  const start = at - 12;
  const end = at + 16;
  if (f < start || f > end) return null;
  const t = interpolate(f, [start, at + 3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeInOut });
  const bandX = WIDTH * 1.35 - t * WIDTH * 2.0;
  const white = keys(f, [
    [at - 5, 0],
    [at - 2, 0.94, easeIn],
    [at + 2, 0.94],
    [at + 6, 0, easeOut],
  ]);
  const fringe = interpolate(f, [at + 1, at + 16], [0.85, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
  const band = (left: number, width: number, background: string, blur: number, opacity = 1): React.CSSProperties => ({
    position: "absolute",
    top: -320,
    height: HEIGHT + 640,
    left: bandX + left,
    width,
    background,
    filter: `blur(${blur}px)`,
    rotate: "9deg",
    opacity,
  });
  return (
    <>
      <AbsoluteFill style={{ mixBlendMode: "screen" }}>
        <div style={band(-430, 300, "linear-gradient(90deg, rgba(255,40,200,0), rgba(255,40,200,0.95) 55%, rgba(170,60,255,0))", 34)} />
        <div style={band(-190, 470, "linear-gradient(90deg, rgba(255,255,255,0), #ffffff 30%, #ffffff 70%, rgba(255,255,255,0))", 40)} />
        <div style={band(230, 240, "linear-gradient(90deg, rgba(60,170,255,0), rgba(60,170,255,0.9) 45%, rgba(60,170,255,0))", 34)} />
        {[-300, -250, -120, -60, 40, 140].map((dx, i) => (
          <div
            key={dx}
            style={band(dx, 6 + (i % 3) * 7, i % 2 ? "#ff5ad8" : "#ffffff", 3, 0.75)}
          />
        ))}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "#F3F9FF", opacity: white }} />
      {f > at && (
        <AbsoluteFill
          style={{
            mixBlendMode: "screen",
            opacity: fringe,
            background:
              "linear-gradient(102deg, rgba(120,70,255,0.9) 0%, rgba(255,40,200,0.6) 16%, rgba(60,170,255,0.28) 30%, rgba(0,0,0,0) 46%)",
          }}
        />
      )}
    </>
  );
};

/** Soft vignette – the reference is clean, so this stays subtle. */
export const SoftVignette: React.FC = () => (
  <AbsoluteFill
    style={{ background: "radial-gradient(ellipse 80% 75% at 50% 45%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.32) 100%)" }}
  />
);

export { easeInOut };
