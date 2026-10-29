import React from "react";
import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { Reveal } from "../components/Reveal";
import { clamp, easeOut, sans } from "../theme";

const Bracket: React.FC<{ rotate: number; size: number }> = ({
  rotate,
  size,
}) => (
  <div
    style={{
      position: "absolute",
      left: "50%",
      top: "50%",
      width: size,
      height: size,
      translate: "-50% -50%",
      rotate: `${rotate}deg`,
    }}
  >
    <svg
      width={80}
      height={80}
      viewBox="0 0 80 80"
      style={{ position: "absolute", left: 0, top: 0 }}
    >
      <path
        d="M 8 72 L 8 30 Q 8 8 30 8 L 72 8"
        fill="none"
        stroke="#34C759"
        strokeWidth={13}
        strokeLinecap="round"
      />
    </svg>
  </div>
);

const People: React.FC = () => (
  <svg width={220} height={180} viewBox="0 0 220 180">
    <circle cx={50} cy={62} r={24} fill="#7FDD98" />
    <path d="M 8 150 Q 8 102 50 102 Q 80 102 88 128 L 88 150 Z" fill="#7FDD98" />
    <circle cx={170} cy={62} r={24} fill="#7FDD98" />
    <path d="M 212 150 Q 212 102 170 102 Q 140 102 132 128 L 132 150 Z" fill="#7FDD98" />
    <circle cx={110} cy={52} r={34} fill="#1FAE48" />
    <path d="M 46 168 Q 46 100 110 100 Q 174 100 174 168 Z" fill="#1FAE48" />
  </svg>
);

const ReviewCard: React.FC<{
  x: number;
  y: number;
  rotate: number;
  delay: number;
  hue: "blue" | "green";
}> = ({ x, y, rotate, delay, hue }) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [delay, delay + 16], [0, 1], {
    ...clamp,
    easing: Easing.spring({ damping: 14 }),
  });
  const float = Math.sin((frame + delay * 3) / 14) * 8;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 330,
        padding: 24,
        borderRadius: 28,
        background: "#FFFFFF",
        boxShadow:
          "0 24px 60px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)",
        opacity: interpolate(frame, [delay, delay + 8], [0, 1], clamp),
        scale: `${0.6 + 0.4 * enter}`,
        rotate: `${rotate}deg`,
        translate: `0px ${float + (1 - enter) * 60}px`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            background:
              hue === "blue"
                ? "linear-gradient(135deg, #64D2FF, #0A84FF)"
                : "linear-gradient(135deg, #A6F0B8, #34C759)",
          }}
        />
        <div>
          <div
            style={{ width: 130, height: 16, borderRadius: 8, background: "#1D1D1F" }}
          />
          <div
            style={{
              marginTop: 10,
              color: hue === "blue" ? "#0A84FF" : "#34C759",
              fontSize: 24,
              letterSpacing: 2,
            }}
          >
            ★★★★★
          </div>
        </div>
      </div>
      <div
        style={{ marginTop: 18, height: 12, borderRadius: 6, background: "#E5E5EA" }}
      />
      <div
        style={{
          marginTop: 10,
          width: "70%",
          height: 12,
          borderRadius: 6,
          background: "#E5E5EA",
        }}
      />
    </div>
  );
};

// "Ваша аудитория пытается понять ваше сообщение"
// (Your audience is trying to understand your message)
export const S03Audience: React.FC = () => {
  const frame = useCurrentFrame();
  const bracketSize = interpolate(frame, [0, 20], [460, 320], {
    ...clamp,
    easing: easeOut,
  });

  return (
    <AbsoluteFill style={{ fontFamily: sans }}>
      {/* Part A: Face-ID style scan of the audience */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          opacity: interpolate(frame, [48, 58], [1, 0], clamp),
          filter: `blur(${interpolate(frame, [48, 58], [0, 20], clamp)}px)`,
          translate: `0px ${interpolate(frame, [48, 58], [0, -80], clamp)}px`,
        }}
      >
        <div
          style={{
            position: "relative",
            width: 460,
            height: 460,
            opacity: interpolate(frame, [0, 8], [0, 1], clamp),
          }}
        >
          {[0, 90, 180, 270].map((r) => (
            <Bracket key={r} rotate={r} size={bracketSize} />
          ))}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              scale: `${interpolate(frame, [8, 24], [0.4, 1], {
                ...clamp,
                easing: Easing.spring({ damping: 12 }),
              })}`,
              opacity: interpolate(frame, [8, 14], [0, 1], clamp),
            }}
          >
            <People />
          </div>
        </div>
        <Reveal delay={14} dy={40}>
          <div
            style={{
              marginTop: 50,
              fontSize: 92,
              fontWeight: 700,
              letterSpacing: "-0.045em",
              color: "#1D1D1F",
            }}
          >
            Ваша аудитория
          </div>
        </Reveal>
      </AbsoluteFill>

      {/* Part B: trying to understand your message */}
      <AbsoluteFill
        style={{
          opacity: interpolate(frame, [106, 118], [1, 0], clamp),
          filter: `blur(${interpolate(frame, [106, 118], [0, 16], clamp)}px)`,
        }}
      >
        <ReviewCard x={40} y={210} rotate={-7} delay={74} hue="blue" />
        <ReviewCard x={560} y={330} rotate={6} delay={80} hue="green" />
        <ReviewCard x={70} y={1180} rotate={5} delay={86} hue="green" />
        <ReviewCard x={540} y={1260} rotate={-5} delay={92} hue="blue" />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          opacity: interpolate(frame, [108, 120], [1, 0], clamp),
          filter: `blur(${interpolate(frame, [108, 120], [0, 22], clamp)}px)`,
        }}
      >
        <div style={{ display: "flex", gap: 22 }}>
          <Reveal delay={54} dx={40} dy={0}>
            <span style={{ fontSize: 92, fontWeight: 700, letterSpacing: "-0.045em", color: "#1D1D1F" }}>
              Пытается
            </span>
          </Reveal>
          <Reveal delay={60} dx={40} dy={0}>
            <span style={{ fontSize: 92, fontWeight: 700, letterSpacing: "-0.045em", color: "#1D1D1F" }}>
              понять
            </span>
          </Reveal>
        </div>
        <Reveal delay={66} dy={20}>
          <div style={{ fontSize: 48, fontWeight: 500, color: "#86868B", margin: "8px 0 18px" }}>
            ваше
          </div>
        </Reveal>
        <Interactive.Div
          name="Message chip"
          style={{
            padding: "10px 44px 22px",
            borderRadius: 36,
            background: "#1FAE48",
            boxShadow: "0 20px 50px rgba(31,174,72,0.35)",
            color: "#FFFFFF",
            fontSize: 112,
            fontWeight: 800,
            letterSpacing: "-0.04em",
            opacity: interpolate(frame, [70, 76], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            scale: interpolate(frame, [70, 88], [0.5, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.spring({ damping: 11 }),
              output: "perceptual-scale",
            }),
            rotate: interpolate(frame, [70, 88], ["-6deg", "0deg"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.spring({ damping: 11 }),
            }),
          }}
        >
          сообщение
        </Interactive.Div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
