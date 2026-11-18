import React from "react";
import { Video } from "@remotion/media";
import { chromaticAberration } from "@remotion/effects/chromatic-aberration";
import { lightLeak } from "@remotion/effects/light-leak";
import { zoomBlur } from "@remotion/effects/zoom-blur";
import { AbsoluteFill, Img, interpolate, random, Solid, staticFile, useCurrentFrame } from "remotion";
import { CREAM_GRADIENT, CUT, HEIGHT, W, WIDTH } from "../lib/constants";
import { SERIF } from "../lib/fonts";
import { easeIn, easeOut, jitter, keys, overshoot, prog } from "../lib/motion";

/** Camera: punch-ins on key words, a slow push, and the zoom-through into the close-up. */
export const useCamera = (f: number) => {
  const wide = f < CUT;
  const scale = wide
    ? keys(f, [
        [0, 1.17],
        [W.behind1 + 12, 1.0, easeOut],
        [W.rush1, 1.02],
        [W.rush1 + 3, 1.075, easeOut],
        [W.rush1 + 18, 1.035, easeOut],
        [W.rush2, 1.04],
        [W.rush2 + 3, 1.11, easeOut],
        [W.rush2 + 16, 1.05, easeOut],
        [W.behind3, 1.05],
        [W.behind3 + 3, 1.09, easeOut],
        [W.behind3 + 16, 1.055, easeOut],
        [W.season, 1.06],
        [W.season + 4, 1.085, easeOut],
        [W.speechEndA, 1.1],
        [CUT - 1, 1.42, easeIn],
      ])
    : keys(f, [
        [CUT, 1.24],
        [CUT + 11, 1.0, easeOut],
        [W.behind4, 1.01],
        [W.behind4 + 4, 1.05, easeOut],
        [W.behind4 + 20, 1.03, easeOut],
        [W.early, 1.035],
        [W.early + 4, 1.075, easeOut],
        [W.early + 30, 1.06, easeOut],
        [380, 1.085],
      ]);
  const shake =
    jitter(f, W.behind1, 12, 7, "a") +
    jitter(f, W.rush2, 12, 10, "b") +
    jitter(f, CUT, 10, 12, "c") +
    jitter(f, W.behind4, 10, 6, "d") +
    jitter(f, W.season, 8, 5, "e");
  const shakeY =
    jitter(f, W.behind1, 12, 5, "ay") + jitter(f, W.rush2, 12, 7, "by") + jitter(f, CUT, 10, 9, "cy");
  // Zoom-blur + RGB split into and out of the cut
  const zoom = f < CUT ? interpolate(f, [CUT - 12, CUT - 1], [0, 70], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeIn }) : interpolate(f, [CUT, CUT + 9], [60, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
  const chroma =
    (f < CUT
      ? interpolate(f, [CUT - 8, CUT - 1], [0, 14], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
      : interpolate(f, [CUT, CUT + 8], [14, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })) +
    interpolate(f, [W.rush2, W.rush2 + 6], [10, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * (f >= W.rush2 ? 1 : 0);
  return {
    scale,
    x: shake,
    y: shakeY,
    origin: wide ? "500px 330px" : "575px 380px",
    zoom,
    chroma,
  };
};

/** Huge editorial word placed inside the scene, behind the person. */
export const BackgroundWord: React.FC<{
  text: string;
  at: number;
  exitAt: number;
  top: number;
  size: number;
  spacing?: number;
  mode?: "zoom" | "spread";
}> = ({ text, at, exitAt, top, size, spacing = 0, mode = "zoom" }) => {
  const f = useCurrentFrame();
  if (f < at || f > exitAt + 10) return null;
  const p = prog(f, at, mode === "zoom" ? 14 : 18);
  const e = prog(f, exitAt, 10, easeIn);
  const ls = mode === "spread" ? spacing - (1 - p) * 0.35 : spacing;
  return (
    <div
      style={{
        position: "absolute",
        left: -200,
        right: -200,
        top,
        textAlign: "center",
        whiteSpace: "nowrap",
        fontFamily: SERIF,
        fontWeight: 400,
        fontSize: size,
        lineHeight: 1,
        letterSpacing: `${ls}em`,
        marginRight: `-${ls}em`,
        backgroundImage: CREAM_GRADIENT,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
        opacity: Math.min(1, p * 1.4) * (1 - e) * 0.96,
        filter: `blur(${(1 - p) * 22 + e * 18}px) drop-shadow(0 10px 40px rgba(0,0,0,0.35))`,
        scale: String((mode === "zoom" ? 1.28 - 0.28 * p : 1) * (1 + (f - at) * 0.0012)),
      }}
    >
      {text}
    </div>
  );
};

/** Person + mic cut-out (RMBG-1.4 matte), re-laid over the background words. */
export const Foreground: React.FC<{ ranges: readonly (readonly [number, number])[] }> = ({ ranges }) => {
  const f = useCurrentFrame();
  if (!ranges.some(([a, b]) => f >= a && f <= b)) return null;
  return (
    <Img
      name="Subject cut-out"
      src={staticFile(`fg/${String(f).padStart(4, "0")}.webp`)}
      style={{ position: "absolute", left: 0, top: 0, width: WIDTH, height: HEIGHT }}
    />
  );
};

/** The filmed scene: video + background words + subject, all moved by the camera. */
export const Scene: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const cam = useCamera(f);
  const grade =
    f < CUT
      ? interpolate(f, [W.speechEndA, CUT - 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
      : 0;
  return (
    <AbsoluteFill
      style={{
        transformOrigin: cam.origin,
        scale: String(cam.scale),
        translate: `${cam.x}px ${cam.y}px`,
        filter: `contrast(${1.07 + grade * 0.08}) saturate(${1.06 - grade * 0.35}) brightness(${0.99 - grade * 0.12})`,
      }}
    >
      <Video
        name="Source"
        src={staticFile("source.mp4")}
        volume={0.86} // headroom so voice + SFX never clip
        style={{ width: WIDTH, height: HEIGHT }}
        effects={[
          zoomBlur({ amount: cam.zoom, center: f < CUT ? [0.46, 0.3] : [0.53, 0.35], samples: 28, disabled: cam.zoom < 0.5 }),
          chromaticAberration({ amount: cam.chroma, angle: 0, disabled: cam.chroma < 0.3 }),
        ]}
      />
      {children}
    </AbsoluteFill>
  );
};

/** White flash on the cut. */
export const Flash: React.FC = () => {
  const f = useCurrentFrame();
  const o = interpolate(f, [CUT - 3, CUT, CUT + 6], [0, 0.85, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const o2 = interpolate(f, [W.rush2, W.rush2 + 1, W.rush2 + 4], [0, 0.35, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (o + o2 <= 0) return null;
  return <AbsoluteFill style={{ background: "#FFF6E6", opacity: o + o2 }} />;
};

/** Warm light leak, screened over the picture. */
export const LightLeak: React.FC<{ from: number; to: number; seed: number; peak?: number; hold?: boolean }> = ({
  from,
  to,
  seed,
  peak = 0.8,
  hold = false,
}) => {
  const f = useCurrentFrame();
  if (f < from || f > to) return null;
  const progress = interpolate(f, [from, to], [0, hold ? 0.5 : 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ mixBlendMode: "screen", opacity: peak }}>
      <Solid width={WIDTH} height={HEIGHT} color="#000000" effects={[lightLeak({ progress, seed, hueShift: 0 })]} />
    </AbsoluteFill>
  );
};

/** Film grain + vignette for the premium finish. */
export const Finish: React.FC = () => {
  const f = useCurrentFrame();
  const seed = Math.floor(random(`g${f}`) * 1000);
  return (
    <>
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse 75% 70% at 50% 42%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.5) 100%)",
        }}
      />
      <AbsoluteFill style={{ mixBlendMode: "overlay", opacity: 0.16 }}>
        <svg width={WIDTH} height={HEIGHT}>
          <filter id={`grain${f}`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={seed} stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter={`url(#grain${f})`} />
        </svg>
      </AbsoluteFill>
    </>
  );
};

export { overshoot };
