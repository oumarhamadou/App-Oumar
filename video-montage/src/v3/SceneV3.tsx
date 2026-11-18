import React from "react";
import { Video } from "@remotion/media";
import { chromaticAberration } from "@remotion/effects/chromatic-aberration";
import { lightLeak } from "@remotion/effects/light-leak";
import {
  AbsoluteFill,
  interpolate,
  random,
  Solid,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { CUT, HEIGHT, W, WIDTH } from "../lib/constants";
import { easeIn, easeOut, keys, prog } from "../lib/motion";

// ─── Timeline of version 3 ───────────────────────────────────────────────
export const CARD_IN = W.and2 + 1; // video shrinks into a card ("and you feel…")
export const GLITCH = W.because3 + 10; // card glitches out during the pause
export const WHITE_IN = W.youre4 - 3; // white typography interlude
export const WHITE_OUT = W.speechEndA + 1; // hard cut back to the video
export const OUTRO = 361; // video shrinks back into a card, "early." turns black

type Shot = {
  from: number;
  scale: number;
  origin: readonly [number, number];
  drift: number;
  snap: number;
};
const SHOTS: readonly Shot[] = [
  { from: 0, scale: 1.22, origin: [500, 290], drift: 0.0011, snap: 0.06 }, // hook – tight
  { from: W.and1, scale: 1.0, origin: [500, 300], drift: 0.0007, snap: 0.045 }, // wide
  {
    from: W.because2,
    scale: 1.32,
    origin: [500, 290],
    drift: 0.0009,
    snap: 0.045,
  }, // tight
  {
    from: CARD_IN - 1,
    scale: 1.02,
    origin: [500, 300],
    drift: 0.0006,
    snap: 0,
  }, // wide, inside the card
  {
    from: WHITE_OUT,
    scale: 1.28,
    origin: [500, 290],
    drift: 0.0008,
    snap: 0.05,
  }, // back from white – tight
  { from: CUT, scale: 1.0, origin: [575, 380], drift: 0.0007, snap: 0.05 }, // close-up (after warm flash)
  {
    from: W.youre7,
    scale: 1.15,
    origin: [575, 360],
    drift: 0.001,
    snap: 0.045,
  }, // final punch-in
];
export const JUMP_CUTS = [W.and1, W.because2, W.youre7];

const shotAt = (f: number) => {
  let s = SHOTS[0];
  for (const shot of SHOTS) if (f >= shot.from) s = shot;
  return s;
};

/** The filmed scene with jump-cut reframing. Always mounted so the voice never stops. */
export const SceneV3: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const f = useCurrentFrame();
  const s = shotAt(f);
  const snap = 1 + s.snap * (1 - prog(f, s.from, 7, easeOut));
  const push =
    f >= WHITE_OUT && f < CUT
      ? keys(f, [
          [WHITE_OUT, 1],
          [CUT - 1, 1.16, easeIn],
        ])
      : 1;
  const scale = s.scale * (1 + (f - s.from) * s.drift) * snap * push;
  const chroma =
    interpolate(f, [CUT - 6, CUT - 1], [0, 9], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) *
      (f < CUT ? 1 : 0) +
    interpolate(f, [CUT, CUT + 10], [12, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) *
      (f >= CUT ? 1 : 0);
  return (
    <AbsoluteFill
      style={{
        transformOrigin: `${s.origin[0]}px ${s.origin[1]}px`,
        scale: String(scale),
        filter: "contrast(1.05) saturate(1.05)",
      }}
    >
      <Video
        name="Source"
        src={staticFile("source.mp4")}
        volume={0.95}
        style={{ width: WIDTH, height: HEIGHT }}
        effects={[
          chromaticAberration({
            amount: chroma,
            angle: 0,
            disabled: chroma < 0.3,
          }),
        ]}
      />
      {children}
    </AbsoluteFill>
  );
};

const cardState = (f: number) => {
  // card #1: shrink → float → glitch out
  if (f >= CARD_IN && f < WHITE_IN) {
    const p = prog(f, CARD_IN, 10, easeOut);
    const scale = 1 - p * 0.52 + Math.max(0, f - CARD_IN - 10) * 0.0007;
    return { scale, y: p * -30, p, visible: true };
  }
  if (f >= WHITE_IN && f < WHITE_OUT)
    return { scale: 0.5, y: 0, p: 1, visible: false };
  // card #2: outro
  if (f >= OUTRO) {
    const p = prog(f, OUTRO, 11, easeOut);
    const scale = 1 - p * 0.46 + Math.max(0, f - OUTRO - 11) * 0.0008;
    return { scale, y: p * -160, p, visible: true };
  }
  return { scale: 1, y: 0, p: 0, visible: true };
};

/**
 * Reference #3 move: the whole video shrinks into a rounded, shadowed card on
 * white, floats, then breaks up in a digital glitch.
 */
export const CardFrame: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const f = useCurrentFrame();
  const c = cardState(f);
  const glitching = f >= GLITCH && f < WHITE_IN;
  const g = glitching ? f - GLITCH : -1;
  const jx = glitching ? (random(`gx${f}`) - 0.5) * 70 : 0;
  const hue = glitching ? Math.floor(random(`gh${f}`) * 360) : 0;
  return (
    <AbsoluteFill
      style={{
        scale: String(c.scale),
        translate: `${jx}px ${c.y}px`,
        borderRadius: (46 * c.p) / c.scale,
        overflow: "hidden",
        boxShadow:
          c.p > 0
            ? `0 ${(34 * c.p) / c.scale}px ${(80 * c.p) / c.scale}px rgba(0,0,0,${0.3 * c.p})`
            : "none",
        opacity: c.visible ? 1 : 0,
        filter: glitching
          ? `hue-rotate(${hue}deg) saturate(${2 + (g % 3)}) contrast(1.3)`
          : "none",
      }}
    >
      {children}
      {glitching && <GlitchBlocks f={f} strong={g > 4} />}
    </AbsoluteFill>
  );
};

const GlitchBlocks: React.FC<{ f: number; strong: boolean }> = ({
  f,
  strong,
}) => {
  const cells = 9;
  const size = WIDTH / cells;
  const palette = ["#7B2CFF", "#22E07A", "#FF2BD6", "#0A0A0A", "#3FA9FF"];
  const blocks = [];
  for (let y = 0; y < cells; y++) {
    for (let x = 0; x < cells; x++) {
      const r = random(`b${f}-${x}-${y}`);
      if (r < (strong ? 0.5 : 0.22)) {
        blocks.push(
          <div
            key={`${x}-${y}`}
            style={{
              position: "absolute",
              left: x * size,
              top: y * (HEIGHT / cells),
              width: size * (1 + (Math.floor(r * 10) % 2)),
              height: HEIGHT / cells,
              background:
                palette[Math.floor(random(`c${f}-${x}-${y}`) * palette.length)],
              opacity: 0.85,
              mixBlendMode: "hard-light",
            }}
          />,
        );
      }
    }
  }
  return <AbsoluteFill>{blocks}</AbsoluteFill>;
};

/** Reference #3 warm flash: pink/orange over-exposure with horizontal light streaks. */
export const WarmFlash: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  const from = at - 10;
  const to = at + 14;
  if (f < from || f > to) return null;
  const k = keys(f, [
    [from, 0],
    [at - 3, 0.9, easeIn],
    [at + 2, 0.92],
    [to, 0, easeOut],
  ]);
  const progress = interpolate(f, [from, to], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const streak = (top: number, h: number, speed: number, color: string) => (
    <div
      style={{
        position: "absolute",
        left: -400,
        width: WIDTH + 800,
        top,
        height: h,
        background: `linear-gradient(90deg, rgba(0,0,0,0), ${color}, rgba(0,0,0,0))`,
        filter: "blur(14px)",
        translate: `${(f - from) * speed}px 0px`,
      }}
    />
  );
  return (
    <>
      <AbsoluteFill style={{ mixBlendMode: "screen", opacity: k * 0.85 }}>
        <Solid
          width={WIDTH}
          height={HEIGHT}
          color="#000000"
          effects={[lightLeak({ progress, seed: 12, hueShift: 330 })]}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{ mixBlendMode: "screen", opacity: k }}>
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(180deg, rgba(255,128,48,0.95) 0%, rgba(255,84,150,0.82) 42%, rgba(255,150,110,0.6) 75%, rgba(255,190,120,0.75) 100%)",
          }}
        />
        {streak(70, 60, 26, "rgba(255,220,120,0.95)")}
        {streak(170, 26, -34, "rgba(255,120,60,0.9)")}
        {streak(520, 44, 22, "rgba(255,90,160,0.8)")}
        {streak(860, 30, -28, "rgba(255,200,120,0.85)")}
      </AbsoluteFill>
    </>
  );
};
