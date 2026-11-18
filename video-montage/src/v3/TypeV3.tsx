import React from "react";
import { interpolate } from "remotion";
import { DISPLAY } from "../lib/fonts";
import {
  easeIn,
  easeOut,
  keys,
  overshoot,
  prog,
  useGlobalFrame,
} from "../lib/motion";

// Words appear one frame ahead of the voice (no empty frame between phrases).
// Reference #3 typography: tight neo-grotesque, white on video / black on white,
// uppercase words that "track in", one red accent phrase.
const FONT = DISPLAY; // Inter Tight
const SHADOW = "0 2px 14px rgba(0,0,0,0.4)";
export const INK = "#111111";
export const RED = "#D3122C";

const useExit = (exitAt?: number) => {
  const f = useGlobalFrame();
  if (exitAt === undefined) return { o: 1, b: 0 };
  const e = prog(f, exitAt, 4, easeIn);
  return { o: 1 - e, b: e * 8 };
};

type P = {
  at: number;
  exitAt?: number;
  size?: number;
  color?: string;
  children: React.ReactNode;
};

/** Regular word that settles onto the baseline (white on video by default). */
export const Wd: React.FC<
  P & { weight?: number; rise?: number; shadow?: string }
> = ({
  at,
  exitAt,
  size = 46,
  color = "#fff",
  weight = 500,
  rise = 10,
  shadow,
  children,
}) => {
  const f = useGlobalFrame();
  const p = prog(f, at - 1, 5);
  const x = useExit(exitAt);
  return (
    <span
      style={{
        fontFamily: FONT,
        fontWeight: weight,
        fontSize: size,
        letterSpacing: "-0.04em",
        lineHeight: 1,
        color,
        textShadow: shadow ?? (color === "#fff" ? SHADOW : "none"),
        display: "inline-block",
        opacity: f < at - 1 ? 0 : p * x.o,
        translate: `0px ${(1 - p) * rise}px`,
        filter: `blur(${(1 - p) * 4 + x.b}px)`,
      }}
    >
      {children}
    </span>
  );
};

/** Bold word with a short pop. */
export const Bd: React.FC<P> = ({
  at,
  exitAt,
  size = 124,
  color = "#fff",
  children,
}) => {
  const f = useGlobalFrame();
  const p = prog(f, at - 1, 6, overshoot);
  const x = useExit(exitAt);
  return (
    <span
      style={{
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: size,
        letterSpacing: "-0.05em",
        lineHeight: 0.92,
        color,
        textShadow: color === "#fff" ? SHADOW : "none",
        display: "inline-block",
        opacity: f < at - 1 ? 0 : Math.min(1, p * 1.8) * x.o,
        scale: String(1.12 - 0.12 * p),
        filter: `blur(${Math.max(0, 1 - p) * 8 + x.b}px)`,
      }}
    >
      {children}
    </span>
  );
};

/**
 * Uppercase word that "tracks in" (reference "THINKING."): letters start spread
 * out and translucent, then snap together solid. `diff` blends it in DIFFERENCE.
 */
export const Trk: React.FC<
  P & { diff?: boolean; weight?: number; from?: number; shadow?: string }
> = ({
  at,
  exitAt,
  size = 160,
  color = "#fff",
  diff = false,
  weight = 900,
  from = 0.6,
  shadow,
  children,
}) => {
  const f = useGlobalFrame();
  const p = prog(f, at - 1, 12, easeOut);
  const x = useExit(exitAt);
  const ls = from * (1 - p) - 0.05;
  return (
    <span
      style={{
        fontFamily: FONT,
        fontWeight: weight,
        fontSize: size,
        letterSpacing: `${ls}em`,
        marginRight: `${-ls}em`,
        lineHeight: 0.88,
        color,
        display: "inline-block",
        whiteSpace: "nowrap",
        mixBlendMode: diff ? "difference" : "normal",
        textShadow: shadow ?? (diff || color !== "#fff" ? "none" : SHADOW),
        opacity:
          f < at - 1 ? 0 : (0.3 + 0.7 * p) * Math.min(1, prog(f, at - 1, 2) * 1) * x.o,
        filter: `blur(${(1 - p) * 6 + x.b}px)`,
        scale: String(1 + Math.max(0, f - at) * 0.0012),
      }}
    >
      {children}
    </span>
  );
};

/** Red accent phrase that flickers in (reference "and failed"). */
export const RedFlicker: React.FC<P & { weight?: number }> = ({
  at,
  exitAt,
  size = 140,
  weight = 400,
  children,
}) => {
  const f = useGlobalFrame();
  const x = useExit(exitAt);
  const o =
    f < at - 1
      ? 0
      : keys(f, [
          [at - 1, 0],
          [at + 1, 1],
          [at + 3, 0.32],
          [at + 5, 0.8],
          [at + 7, 0.45],
          [at + 9, 1],
        ]);
  return (
    <span
      style={{
        fontFamily: FONT,
        fontWeight: weight,
        fontSize: size,
        letterSpacing: "-0.045em",
        lineHeight: 0.95,
        color: RED,
        display: "inline-block",
        opacity: o * x.o,
        filter: `blur(${x.b}px)`,
      }}
    >
      {children}
    </span>
  );
};

/** Large light word that greys out before leaving (reference "tried"). */
export const Fade: React.FC<P & { greyFrom: number }> = ({
  at,
  exitAt,
  size = 190,
  greyFrom,
  children,
}) => {
  const f = useGlobalFrame();
  const p = prog(f, at - 1, 5);
  const x = useExit(exitAt);
  const g = interpolate(f, [greyFrom, greyFrom + 8], [0.92, 0.32], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <span
      style={{
        fontFamily: FONT,
        fontWeight: 400,
        fontSize: size,
        letterSpacing: "-0.05em",
        lineHeight: 0.95,
        color: `rgba(17,17,17,${g})`,
        display: "inline-block",
        opacity: f < at - 1 ? 0 : p * x.o,
        translate: `0px ${(1 - p) * 16}px`,
      }}
    >
      {children}
    </span>
  );
};

/** Huge pale word in the background of the white interlude. */
export const PaleWord: React.FC<{
  at: number;
  exitAt: number;
  size: number;
  y: number;
  children: string;
}> = ({ at, exitAt, size, y, children }) => {
  const f = useGlobalFrame();
  if (f < at || f > exitAt + 6) return null;
  const p = prog(f, at, 16, easeOut);
  const e = prog(f, exitAt, 6, easeIn);
  const ls = 0.35 * (1 - p) - 0.05;
  return (
    <div
      style={{
        position: "absolute",
        left: -400,
        right: -400,
        top: y,
        translate: "0 -50%",
        textAlign: "center",
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: size,
        lineHeight: 1,
        letterSpacing: `${ls}em`,
        color: "#EDEDEB",
        opacity: p * (1 - e),
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </div>
  );
};

/** Background word inside the scene (behind the person) that tracks in. */
export const BgTrack: React.FC<{
  text: string;
  at: number;
  exitAt: number;
  top: number;
  size: number;
}> = ({ text, at, exitAt, top, size }) => {
  const f = useGlobalFrame();
  if (f < at || f > exitAt + 8) return null;
  const p = prog(f, at, 14, easeOut);
  const e = prog(f, exitAt, 7, easeIn);
  const ls = 0.45 * (1 - p) - 0.05;
  return (
    <div
      style={{
        position: "absolute",
        left: -500,
        right: -500,
        top,
        textAlign: "center",
        whiteSpace: "nowrap",
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: size,
        lineHeight: 1,
        letterSpacing: `${ls}em`,
        color: "#fff",
        opacity: (0.3 + 0.7 * p) * (1 - e),
        filter: `blur(${(1 - p) * 8 + e * 12}px) drop-shadow(0 12px 40px rgba(0,0,0,0.3))`,
      }}
    >
      {text}
    </div>
  );
};
