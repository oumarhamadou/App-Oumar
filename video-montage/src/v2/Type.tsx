import React from "react";
import { DISPLAY } from "../lib/fonts";
import { easeIn, easeOut, overshoot, prog, useGlobalFrame } from "../lib/motion";

// Reference #2 typography: one tight neo-grotesque in two weights,
// clean white, soft shadow, words appended one by one.
const FONT = DISPLAY; // Inter Tight
const SHADOW = "0 2px 14px rgba(0,0,0,0.38)";

const useExit = (exitAt?: number) => {
  const f = useGlobalFrame();
  if (exitAt === undefined) return { o: 1, b: 0 };
  const e = prog(f, exitAt, 4, easeIn);
  return { o: 1 - e, b: e * 9 };
};

type P = { at: number; exitAt?: number; size?: number; children: React.ReactNode };

/** Small caption word (snappy fade + tiny lift). */
export const Sm: React.FC<P & { weight?: number }> = ({ at, exitAt, size = 44, weight = 500, children }) => {
  const f = useGlobalFrame();
  const p = prog(f, at, 4);
  const x = useExit(exitAt);
  return (
    <span
      style={{
        fontFamily: FONT,
        fontWeight: weight,
        fontSize: size,
        letterSpacing: "-0.035em",
        lineHeight: 1,
        color: "#fff",
        textShadow: SHADOW,
        display: "inline-block",
        opacity: f < at ? 0 : p * x.o,
        filter: `blur(${(1 - p) * 5 + x.b}px)`,
        translate: `0px ${(1 - p) * 6}px`,
      }}
    >
      {children}
    </span>
  );
};

/** Extra-bold key word that pops in. */
export const Heavy: React.FC<P> = ({ at, exitAt, size = 132, children }) => {
  const f = useGlobalFrame();
  const p = prog(f, at, 6, overshoot);
  const x = useExit(exitAt);
  return (
    <span
      style={{
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: size,
        letterSpacing: "-0.05em",
        lineHeight: 0.92,
        color: "#fff",
        textShadow: SHADOW,
        display: "inline-block",
        opacity: f < at ? 0 : Math.min(1, p * 1.8) * x.o,
        scale: String(1.16 - 0.16 * p),
        filter: `blur(${Math.max(0, 1 - p) * 9 + x.b}px)`,
      }}
    >
      {children}
    </span>
  );
};

/** Extra-bold word rising from below with a vertical motion blur ("wanna do"). */
export const Rise: React.FC<P> = ({ at, exitAt, size = 132, children }) => {
  const f = useGlobalFrame();
  const p = prog(f, at, 8);
  const x = useExit(exitAt);
  return (
    <span
      style={{
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: size,
        letterSpacing: "-0.05em",
        lineHeight: 0.92,
        color: "#fff",
        textShadow: SHADOW,
        display: "inline-block",
        transformOrigin: "50% 100%",
        opacity: f < at ? 0 : Math.min(1, p * 1.6) * x.o,
        translate: `0px ${(1 - p) * 52}px`,
        scale: `1 ${1 + (1 - p) * 0.6}`,
        filter: `blur(${(1 - p) * 8 + x.b}px)`,
      }}
    >
      {children}
    </span>
  );
};

/** Light-weight word that brightens from grey to white ("better version"). */
export const Lum: React.FC<P> = ({ at, exitAt, size = 124, children }) => {
  const f = useGlobalFrame();
  const p = prog(f, at, 10);
  const x = useExit(exitAt);
  return (
    <span
      style={{
        fontFamily: FONT,
        fontWeight: 400,
        fontSize: size,
        letterSpacing: "-0.045em",
        lineHeight: 0.95,
        color: `rgba(255,255,255,${0.32 + 0.68 * p})`,
        textShadow: SHADOW,
        display: "inline-block",
        opacity: f < at ? 0 : Math.min(1, prog(f, at, 2) * 1) * x.o,
        filter: `blur(${(1 - p) * 3 + x.b}px)`,
      }}
    >
      {children}
    </span>
  );
};

/** Word revealed by a soft horizontal blur wipe, left → right ("your family will see a"). */
export const Wipe: React.FC<P & { weight?: number }> = ({ at, exitAt, size = 124, weight = 400, children }) => {
  const f = useGlobalFrame();
  const p = prog(f, at, 9, easeOut);
  const x = useExit(exitAt);
  const edge = -30 + p * 160;
  const mask = `linear-gradient(90deg, #000 ${edge - 30}%, transparent ${edge}%)`;
  return (
    <span
      style={{
        fontFamily: FONT,
        fontWeight: weight,
        fontSize: size,
        letterSpacing: "-0.045em",
        lineHeight: 0.95,
        color: "#fff",
        textShadow: SHADOW,
        display: "inline-block",
        WebkitMaskImage: mask,
        maskImage: mask,
        opacity: f < at ? 0 : x.o,
        filter: `blur(${(1 - p) * 7 + x.b}px)`,
        translate: `${(1 - p) * -18}px 0px`,
      }}
    >
      {children}
    </span>
  );
};

/**
 * Word blended in DIFFERENCE mode (Premiere Pro look): the picture is inverted
 * inside the letters. Must not sit inside a transformed/filtered ancestor.
 */
export const Diff: React.FC<P> = ({ at, exitAt, size = 300, children }) => {
  const f = useGlobalFrame();
  const p = prog(f, at, 7);
  const x = useExit(exitAt);
  return (
    <span
      style={{
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: size,
        letterSpacing: "-0.055em",
        lineHeight: 0.86,
        color: "#fff",
        display: "inline-block",
        mixBlendMode: "difference",
        opacity: f < at ? 0 : Math.min(1, p * 2) * x.o,
        scale: `${(1.22 - 0.22 * p) * (1 + Math.max(0, f - at) * 0.0016)} ${1 + Math.max(0, f - at) * 0.0016}`,
        filter: `blur(${(1 - p) * 14 + x.b}px)`,
      }}
    >
      {children}
    </span>
  );
};

/** Huge word living inside the scene, behind the person (cut-out laid over it). */
export const BgWord: React.FC<{ text: string; at: number; exitAt: number; top: number; size: number }> = ({
  text,
  at,
  exitAt,
  top,
  size,
}) => {
  const f = useGlobalFrame();
  if (f < at || f > exitAt + 8) return null;
  const p = prog(f, at, 9);
  const e = prog(f, exitAt, 7, easeIn);
  return (
    <div
      style={{
        position: "absolute",
        left: -300,
        right: -300,
        top,
        textAlign: "center",
        whiteSpace: "nowrap",
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: size,
        lineHeight: 1,
        letterSpacing: "-0.05em",
        color: "#fff",
        opacity: Math.min(1, p * 1.5) * (1 - e) * 0.97,
        filter: `blur(${(1 - p) * 18 + e * 14}px) drop-shadow(0 12px 40px rgba(0,0,0,0.3))`,
        scale: String((1.1 - 0.1 * p) * (1 + (f - at) * 0.0012)),
      }}
    >
      {text}
    </div>
  );
};
