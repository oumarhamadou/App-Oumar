import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { GOLD_GRADIENT } from "../lib/constants";
import { DISPLAY, SANS, SERIF } from "../lib/fonts";
import { easeIn, easeOut, OffsetContext, overshoot, prog, useGlobalFrame } from "../lib/motion";

/** A phrase = named Studio sequence; children use absolute frames. */
export const Phrase: React.FC<{
  name: string;
  from: number;
  to: number;
  children: React.ReactNode;
}> = ({ name, from, to, children }) => (
  <Sequence name={name} from={from} durationInFrames={to - from} layout="absolute-fill">
    <OffsetContext.Provider value={from}>{children}</OffsetContext.Provider>
  </Sequence>
);

/** Exit shared by every word of a phrase: blur + lift + fade (reference "dissolve"). */
const useExit = (exitAt?: number) => {
  const f = useGlobalFrame();
  if (exitAt === undefined) return { o: 1, blur: 0, y: 0 };
  const e = prog(f, exitAt, 8, easeIn);
  return { o: 1 - e, blur: e * 14, y: -e * 14 };
};

/**
 * Positioned block, centred on (x, y) – or left-aligned at x when align="flex-start".
 * Positioned with flexbox instead of a transform on purpose: a transform would
 * create a stacking context and break `mix-blend-mode: difference` inside.
 */
export const Block: React.FC<{
  x: number;
  y: number;
  children: React.ReactNode;
  align?: "center" | "flex-start";
  gap?: number;
}> = ({ x, y, children, align = "center", gap = 0 }) => (
  <div
    style={{
      position: "absolute",
      left: align === "center" ? x - 1500 : x,
      width: 3000,
      top: y - 1000,
      height: 2000,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: align,
      gap,
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </div>
);

export const Line: React.FC<{ children: React.ReactNode; mt?: number; ml?: number; gap?: number }> = ({
  children,
  mt = 0,
  ml = 0,
  gap = 12,
}) => (
  <div style={{ display: "flex", alignItems: "baseline", gap, marginTop: mt, marginLeft: ml }}>
    {children}
  </div>
);

/** Small white caption word – appears with blur/lift exactly on the spoken word. */
export const Sans: React.FC<{ at: number; exitAt?: number; size?: number; weight?: number; children: React.ReactNode }> = ({
  at,
  exitAt,
  size = 46,
  weight = 600,
  children,
}) => {
  const f = useGlobalFrame();
  const p = prog(f, at, 7);
  const x = useExit(exitAt);
  if (f < at) return <span style={{ fontFamily: SANS, fontSize: size, fontWeight: weight, opacity: 0 }}>{children}</span>;
  return (
    <span
      style={{
        fontFamily: SANS,
        fontSize: size,
        fontWeight: weight,
        letterSpacing: "-0.015em",
        color: "#FFFFFF",
        lineHeight: 1.05,
        opacity: p * x.o,
        filter: `blur(${(1 - p) * 9 + x.blur}px)`,
        translate: `0px ${(1 - p) * 18 + x.y}px`,
        scale: String(0.94 + 0.06 * p),
        textShadow: "0 2px 16px rgba(0,0,0,0.55), 0 0 2px rgba(0,0,0,0.35)",
        display: "inline-block",
      }}
    >
      {children}
    </span>
  );
};

/** Gold editorial serif key word (reference look) – scales down from a soft blur. */
export const Gold: React.FC<{
  at: number;
  exitAt?: number;
  size?: number;
  italic?: boolean;
  children: React.ReactNode;
  breathe?: number;
}> = ({ at, exitAt, size = 170, italic = true, children, breathe = 0 }) => {
  const f = useGlobalFrame();
  const p = prog(f, at, 13);
  const x = useExit(exitAt);
  const drift = 1 + Math.max(0, f - at) * breathe;
  return (
    <span
      style={{
        fontFamily: SERIF,
        fontStyle: italic ? "italic" : "normal",
        fontWeight: 400,
        fontSize: size,
        lineHeight: 0.92,
        letterSpacing: `${(1 - p) * 0.14 - 0.01}em`,
        padding: "0.04em 0.16em 0.1em",
        margin: "0 -0.16em",
        backgroundImage: GOLD_GRADIENT,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
        opacity: f < at ? 0 : p * x.o,
        filter: `blur(${(1 - p) * 16 + x.blur}px) drop-shadow(0 0 22px rgba(255,186,72,${0.28 + 0.25 * (1 - p)})) drop-shadow(0 6px 18px rgba(0,0,0,0.55))`,
        scale: String((1.32 - 0.32 * p) * drift),
        translate: `0px ${x.y}px`,
        display: "inline-block",
      }}
    >
      {children}
    </span>
  );
};

/** Heavy white display word with an elastic pop. */
export const Bold: React.FC<{ at: number; exitAt?: number; size?: number; children: React.ReactNode }> = ({
  at,
  exitAt,
  size = 120,
  children,
}) => {
  const f = useGlobalFrame();
  const p = prog(f, at, 8, overshoot);
  const x = useExit(exitAt);
  return (
    <span
      style={{
        fontFamily: DISPLAY,
        fontWeight: 900,
        fontSize: size,
        lineHeight: 0.9,
        letterSpacing: "-0.035em",
        color: "#FFFFFF",
        opacity: f < at ? 0 : Math.min(1, p * 1.6) * x.o,
        scale: String(0.55 + 0.45 * p),
        filter: `blur(${Math.max(0, 1 - p) * 8 + x.blur}px)`,
        translate: `0px ${x.y}px`,
        textShadow: "0 6px 26px rgba(0,0,0,0.5)",
        display: "inline-block",
      }}
    >
      {children}
    </span>
  );
};

/** Gold word that rushes in from the left with a motion-blur trail ("rush."). */
export const RushIn: React.FC<{ at: number; exitAt?: number; size?: number; children: string }> = ({
  at,
  exitAt,
  size = 170,
  children,
}) => {
  const f = useGlobalFrame();
  const pos = (fr: number) => (1 - prog(fr, at, 9)) * -620;
  const x0 = pos(f);
  const v = x0 - pos(f - 1);
  const x = useExit(exitAt);
  const base: React.CSSProperties = {
    fontFamily: SERIF,
    fontStyle: "italic",
    fontSize: size,
    lineHeight: 0.92,
    padding: "0.04em 0.16em 0.1em",
    backgroundImage: GOLD_GRADIENT,
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
    display: "inline-block",
  };
  if (f < at) return <span style={{ ...base, opacity: 0 }}>{children}</span>;
  return (
    <span style={{ position: "relative", display: "inline-block", margin: "0 -0.16em" }}>
      {[4, 3, 2, 1].map((k) => (
        <span
          key={k}
          style={{
            ...base,
            position: "absolute",
            left: 0,
            top: 0,
            opacity: (Math.min(1, Math.abs(v) / 40) * 0.32 * x.o) / k,
            translate: `${x0 - v * 0.55 * k}px 0px`,
            filter: `blur(${4 + k * 2}px)`,
            transform: "skewX(-8deg)",
          }}
        >
          {children}
        </span>
      ))}
      <span
        style={{
          ...base,
          opacity: x.o,
          translate: `${x0}px ${x.y}px`,
          filter: `blur(${Math.min(14, Math.abs(v) / 14) + x.blur}px) drop-shadow(0 0 22px rgba(255,186,72,0.35)) drop-shadow(0 6px 18px rgba(0,0,0,0.55))`,
          transform: `skewX(${Math.max(-14, v / -8)}deg)`,
        }}
      >
        {children}
      </span>
    </span>
  );
};

/** "BEHIND" with outlined echoes multiplying above and below – the loop. */
export const EchoWord: React.FC<{ at: number; exitAt?: number; size?: number; children: string }> = ({
  at,
  exitAt,
  size = 150,
  children,
}) => {
  const f = useGlobalFrame();
  const p = prog(f, at, 8, overshoot);
  const spread = prog(f, at + 3, 16);
  const x = useExit(exitAt);
  const word: React.CSSProperties = {
    fontFamily: DISPLAY,
    fontWeight: 900,
    fontSize: size,
    lineHeight: 1,
    letterSpacing: "-0.04em",
    display: "block",
  };
  return (
    <div style={{ position: "relative", opacity: f < at ? 0 : x.o, filter: `blur(${x.blur}px)`, translate: `0px ${x.y}px` }}>
      {[1, 2, 3].map((k) => (
        <span
          key={k}
          style={{
            ...word,
            position: "absolute",
            left: 0,
            top: 0,
            color: "transparent",
            WebkitTextStroke: "2px rgba(255,255,255,0.9)",
            opacity: [0, 0.55, 0.3, 0.13][k] * spread,
            translate: `0px ${k * size * 0.8 * spread}px`,
            scale: String(1 - k * 0.035 * spread),
          }}
        >
          {children}
        </span>
      ))}
      <span
        style={{
          ...word,
          position: "relative",
          color: "#FFFFFF",
          scale: String(0.6 + 0.4 * p),
          textShadow: "0 6px 30px rgba(0,0,0,0.55)",
        }}
      >
        {children}
      </span>
    </div>
  );
};

/**
 * Full-frame word blended in DIFFERENCE mode (Premiere "Difference" look):
 * the video is inverted inside the letters. Must be a direct layer over the scene.
 */
export const DifferenceWord: React.FC<{ at: number; exitAt: number; y: number; size?: number; children: string }> = ({
  at,
  exitAt,
  y,
  size = 400,
  children,
}) => {
  const f = useGlobalFrame();
  if (f < at || f > exitAt + 6) return null;
  const p = prog(f, at, 6, overshoot);
  const e = prog(f, exitAt, 6, easeIn);
  const glitchIn = f - at < 4;
  const glitchOut = f >= exitAt;
  const jx = glitchIn || glitchOut ? Math.sin(f * 12.9898) * 22 : 0;
  const flicker = glitchOut ? (f % 2 === 0 ? 0.25 : 1) : 1;
  const style: React.CSSProperties = {
    position: "absolute",
    left: 0,
    right: 0,
    top: y,
    translate: "0 -50%",
    textAlign: "center",
    fontFamily: DISPLAY,
    fontWeight: 900,
    fontSize: size,
    lineHeight: 1,
    letterSpacing: "-0.05em",
    color: "#FFFFFF",
    whiteSpace: "nowrap",
  };
  const drift = (f - at) * -2.2;
  return (
    <AbsoluteFill style={{ mixBlendMode: "difference", opacity: (1 - e) * flicker }}>
      <div
        style={{
          ...style,
          translate: `${jx + drift}px -50%`,
          scale: String(1.45 - 0.45 * p),
          transform: `skewX(${(1 - p) * -14}deg)`,
        }}
      >
        {children}
      </div>
      {(glitchIn || glitchOut) && (
        <div
          style={{
            ...style,
            translate: `${-jx * 1.6 + drift}px -50%`,
            clipPath: `inset(${30 + (f % 3) * 12}% 0 ${40 - (f % 3) * 10}% 0)`,
          }}
        >
          {children}
        </div>
      )}
    </AbsoluteFill>
  );
};

/** White bar wiping in, blended in DIFFERENCE: inverted video inside, word knocked out. */
export const DifferencePill: React.FC<{ at: number; exitAt: number; size?: number; children: string }> = ({
  at,
  exitAt,
  size = 64,
  children,
}) => {
  const f = useGlobalFrame();
  const p = prog(f, at, 8);
  const e = prog(f, exitAt, 8, easeIn);
  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
        mixBlendMode: "difference",
        opacity: f < at ? 0 : 1 - e,
        filter: `blur(${e * 12}px)`,
      }}
    >
      <span
        style={{
          position: "absolute",
          inset: "-0.08em -0.28em -0.12em -0.28em",
          background: "#FFFFFF",
          borderRadius: 6,
          clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`,
        }}
      />
      <span
        style={{
          position: "relative",
          fontFamily: DISPLAY,
          fontWeight: 900,
          fontSize: size,
          lineHeight: 1,
          letterSpacing: "-0.03em",
          color: "#000000",
          textTransform: "uppercase",
          clipPath: `inset(0 ${(1 - prog(f, at + 2, 8)) * 100}% 0 0)`,
          display: "inline-block",
        }}
      >
        {children}
      </span>
    </span>
  );
};

/** Gold bar slashing through its child ("NOT behind" → behind crossed out). */
export const Strike: React.FC<{ at: number; exitAt?: number; children: React.ReactNode }> = ({ at, exitAt, children }) => {
  const f = useGlobalFrame();
  const p = prog(f, at, 7);
  const x = useExit(exitAt);
  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      {children}
      <span
        style={{
          position: "absolute",
          left: "-6%",
          top: "50%",
          height: 9,
          width: `${p * 112}%`,
          borderRadius: 9,
          backgroundImage: GOLD_GRADIENT,
          boxShadow: "0 0 18px rgba(255,186,72,0.6), 0 4px 14px rgba(0,0,0,0.5)",
          rotate: "-5deg",
          opacity: f < at ? 0 : x.o,
          filter: `blur(${x.blur}px)`,
        }}
      />
    </span>
  );
};

export { easeOut };
