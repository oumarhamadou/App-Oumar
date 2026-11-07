import React from "react";
import { AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MacCursor, TelegramGlyph } from "../components/Icons";
import { KineticWord } from "../components/KineticWord";
import { COPY, LangProps } from "../i18n";
import { CLAMP, COLORS, EASE_IN, EASE_IN_OUT, EASE_OUT, fontFamily } from "../theme";
import { outroTiming as T } from "../timings";

const AV_Y = 640;
const AV_D = 420;
const DOT = 96;
const NAME_Y = 985;
const HANDLE_Y = 1100;
const SUB_Y = 1160;
const BTN_Y = 1282;
const CTA_Y = 1402;
const LINK_Y = 1484;

const fadeUp = (frame: number, at: number) => ({
  opacity: interpolate(frame, [at, at + 10], [0, 1], CLAMP),
  translate: `0px ${interpolate(frame, [at, at + 14], [36, 0], { ...CLAMP, easing: EASE_OUT })}px`,
  filter: `blur(${interpolate(frame, [at, at + 10], [10, 0], CLAMP)}px)`,
});

export const OutroScene: React.FC<LangProps> = ({ lang }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const copy = COPY[lang];

  // ---- Three dots choreography (outline / target / filled) ----
  const turns = [-35, -55, -110];
  let angle = 0;
  T.turns.forEach((at, i) => {
    angle += turns[i] * spring({ frame: frame - at, fps, config: { damping: 14, stiffness: 160 } });
  });
  const merge = interpolate(frame, [T.merge, T.reveal], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
  const spacing = 150 * (1 - merge);
  const grow = spring({ frame: frame - (T.reveal - 4), fps, config: { damping: 15, stiffness: 120 } });
  const filledD = DOT + (AV_D - DOT) * grow;
  const photoIn = interpolate(frame, [T.reveal - 2, T.reveal + 12], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const ripple = interpolate(frame, [T.reveal, T.reveal + 24], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const ringIn = interpolate(frame, [T.reveal + 6, T.reveal + 20], [0, 1], { ...CLAMP, easing: EASE_OUT });

  const pos = (slot: number) => {
    const a = (angle * Math.PI) / 180;
    const d = (slot - 1) * spacing;
    return { x: 540 + Math.cos(a) * d, y: AV_Y + Math.sin(a) * d };
  };
  const pop = (i: number) => spring({ frame: frame - T.dots[i], fps, config: { damping: 10, stiffness: 200, mass: 0.6 } });

  // ---- Follow button + cursor ----
  const btnIn = spring({ frame: frame - T.button, fps, config: { damping: 13, stiffness: 160 } });
  const clicked = frame >= T.click;
  const press = interpolate(frame, [T.click - 2, T.click, T.click + 6], [1, 0.9, 1], { ...CLAMP, easing: EASE_OUT });
  const clickRipple = interpolate(frame, [T.click, T.click + 14], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const cursorT = interpolate(frame, [T.cursorIn[0], T.cursorIn[1]], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
  const cursorLeave = interpolate(frame, [T.click + 12, T.click + 26], [0, 1], { ...CLAMP, easing: EASE_IN });
  const cx = interpolate(cursorT, [0, 1], [1040, 660]) + cursorLeave * 240;
  const cy = interpolate(cursorT, [0, 1], [1760, BTN_Y + 6]) - Math.sin(cursorT * Math.PI) * 120 + cursorLeave * 200;
  const cursorScale = interpolate(frame, [T.click - 2, T.click, T.click + 5], [1, 0.82, 1], CLAMP);

  // ---- End: everything melts back into the background (loop-friendly) ----
  const out = interpolate(frame, [T.fadeOut[0], T.fadeOut[1]], [0, 1], { ...CLAMP, easing: EASE_IN });

  return (
    <AbsoluteFill
      style={{
        fontFamily,
        color: COLORS.white,
        opacity: 1 - out,
        filter: `blur(${out * 14}px)`,
        scale: 1 - out * 0.05,
      }}
    >
      {/* Ripple + gradient ring around the avatar */}
      <div
        style={{
          position: "absolute",
          left: 540 - AV_D / 2,
          top: AV_Y - AV_D / 2,
          width: AV_D,
          height: AV_D,
          borderRadius: "50%",
          border: `6px solid ${COLORS.green}`,
          scale: 1 + ripple * 0.9,
          opacity: (1 - ripple) * (frame >= T.reveal ? 0.8 : 0),
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 540 - AV_D / 2 - 22,
          top: AV_Y - AV_D / 2 - 22,
          width: AV_D + 44,
          height: AV_D + 44,
          borderRadius: "50%",
          background: `conic-gradient(from ${frame * 2}deg, ${COLORS.green}, ${COLORS.blue}, ${COLORS.white}, ${COLORS.green})`,
          WebkitMaskImage: "radial-gradient(circle, transparent 66.5%, #000 67.5%)",
          maskImage: "radial-gradient(circle, transparent 66.5%, #000 67.5%)",
          opacity: ringIn,
          scale: 0.85 + ringIn * 0.15,
        }}
      />

      {/* Outline dot (slot 0) */}
      {(() => {
        const p = pos(0);
        const d = DOT + merge * (AV_D + 150 - DOT);
        return (
          <div
            style={{
              position: "absolute",
              left: p.x - d / 2,
              top: p.y - d / 2,
              width: d,
              height: d,
              borderRadius: "50%",
              border: `${10 - merge * 7}px solid ${COLORS.white}`,
              scale: pop(0),
              opacity: 1 - merge * 0.85 - ringIn * 0.15,
            }}
          />
        );
      })()}
      {/* Target dot (slot 1) */}
      {(() => {
        const p = pos(1);
        const d = DOT + merge * (AV_D + 260 - DOT);
        return (
          <div
            style={{
              position: "absolute",
              left: p.x - d / 2,
              top: p.y - d / 2,
              width: d,
              height: d,
              borderRadius: "50%",
              border: `${30 - merge * 28}px solid ${COLORS.white}`,
              scale: pop(1),
              opacity: 1 - merge * 0.9 - ringIn * 0.1,
            }}
          />
        );
      })()}
      {/* Filled dot (slot 2) -> becomes the profile photo */}
      {(() => {
        const p = pos(2);
        return (
          <div
            style={{
              position: "absolute",
              left: p.x - AV_D / 2,
              top: p.y - AV_D / 2,
              width: AV_D,
              height: AV_D,
              borderRadius: "50%",
              overflow: "hidden",
              backgroundColor: COLORS.white,
              scale: (filledD / AV_D) * pop(2),
            }}
          >
            <Img
              src={copy.photo}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: photoIn,
                scale: 1.3 - photoIn * 0.3 + Math.max(0, frame - T.reveal) * 0.0008,
              }}
            />
          </div>
        );
      })()}

      {/* Name with a Difference sweep */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: NAME_Y - 90,
          height: 180,
          lineHeight: "180px",
          textAlign: "center",
          fontSize: 150,
          fontWeight: 700,
          letterSpacing: "-0.05em",
        }}
      >
        <KineticWord text={copy.name} appearAt={T.nameDiffIn + 2} diffIn={T.nameDiffIn} diffOut={T.nameDiffOut} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: HANDLE_Y - 30,
          textAlign: "center",
          fontSize: 44,
          fontWeight: 600,
          color: COLORS.green,
          letterSpacing: "-0.01em",
          ...fadeUp(frame, T.handle),
        }}
      >
        {copy.handle}
      </div>
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top: SUB_Y - 30,
          textAlign: "center",
          fontSize: 44,
          fontWeight: 500,
          color: "rgba(245,245,247,0.85)",
          letterSpacing: "-0.02em",
          ...fadeUp(frame, T.subtitle),
        }}
      >
        {copy.subtitle}
      </div>

      {/* Follow button */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: BTN_Y - 52,
          display: "flex",
          justifyContent: "center",
          opacity: Math.min(1, btnIn * 1.4),
          scale: btnIn * press,
        }}
      >
        <div
          style={{
            position: "relative",
            height: 104,
            padding: "0 64px",
            borderRadius: 52,
            display: "flex",
            alignItems: "center",
            gap: 18,
            fontSize: 44,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            overflow: "hidden",
            isolation: "isolate",
            backgroundColor: clicked ? "rgba(245,245,247,0.1)" : COLORS.white,
            border: clicked ? "3px solid rgba(245,245,247,0.45)" : "3px solid transparent",
            color: clicked ? COLORS.white : COLORS.ink,
          }}
        >
          {clicked ? (
            <svg width="40" height="40" viewBox="0 0 24 24">
              <path d="M4.5 12.5 9.5 17.5 19.5 6.5" fill="none" stroke={COLORS.green} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="36" height="36" viewBox="0 0 24 24">
              <path d="M12 4v16M4 12h16" stroke={COLORS.ink} strokeWidth="3" strokeLinecap="round" />
            </svg>
          )}
          {clicked ? copy.following : copy.follow}
          <div
            style={{
              position: "absolute",
              left: "62%",
              top: "50%",
              width: 900,
              height: 900,
              margin: "-450px 0 0 -450px",
              borderRadius: "50%",
              backgroundColor: COLORS.white,
              mixBlendMode: "difference",
              scale: clickRipple,
              opacity: clicked ? 1 - clickRipple : 0,
            }}
          />
        </div>
      </div>

      {/* CTA */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: CTA_Y - 30,
          textAlign: "center",
          fontSize: 46,
          fontWeight: 500,
          color: COLORS.muted,
          letterSpacing: "-0.02em",
          ...fadeUp(frame, T.ctaLine),
        }}
      >
        {copy.ctaLine}
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: LINK_Y - 50,
          display: "flex",
          justifyContent: "center",
          ...fadeUp(frame, T.link),
        }}
      >
        <div
          style={{
            height: 100,
            padding: "0 44px 0 30px",
            borderRadius: 50,
            display: "flex",
            alignItems: "center",
            gap: 20,
            backgroundColor: "rgba(245,245,247,0.08)",
            border: "2px solid rgba(245,245,247,0.22)",
            fontSize: 48,
            fontWeight: 600,
            letterSpacing: "-0.02em",
          }}
        >
          <div style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: COLORS.blue, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <TelegramGlyph size={38} />
          </div>
          <span style={{ fontSize: 48 }}>
            <KineticWord text={copy.link} appearAt={T.link} diffIn={T.linkDiffIn} diffOut={T.linkDiffOut} />
          </span>
        </div>
      </div>

      {/* Cursor */}
      <div
        style={{
          position: "absolute",
          left: cx,
          top: cy,
          opacity: interpolate(frame, [T.cursorIn[0], T.cursorIn[0] + 6], [0, 1], CLAMP) * (1 - cursorLeave),
          scale: cursorScale,
          transformOrigin: "top left",
          filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.4))",
        }}
      >
        <MacCursor size={84} />
      </div>
    </AbsoluteFill>
  );
};
