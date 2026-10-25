import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  Img,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { VerifiedBadge } from "../components/Icons";

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const NAME = "Oumar";
const SKILLS = [
  { label: "Монтаж", color: "#0A84FF" },
  { label: "Моушн-дизайн", color: "#BF5AF2" },
  { label: "UI-анимация", color: "#FF9F0A" },
];

// Editor credit: Oumar's photo, name and role.
export const EndCardScene: React.FC = () => {
  const frame = useCurrentFrame();
  const spin = frame * 2.2;

  return (
    <AbsoluteFill style={{ fontFamily: "Inter", color: "#1D1D1F" }}>
      {/* Glow */}
      <div
        style={{
          position: "absolute",
          left: 540 - 210,
          top: 330 - 210,
          width: 420,
          height: 420,
          borderRadius: "50%",
          background: `conic-gradient(from ${spin}deg, #0A84FF, #BF5AF2, #FF375F, #FF9F0A, #64D2FF, #0A84FF)`,
          filter: "blur(60px)",
          opacity: interpolate(frame, [0, 24], [0, 0.55], clamp),
          scale: interpolate(frame, [0, 30], [0.5, 1], {
            ...clamp,
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      />

      {/* Avatar with gradient ring */}
      <Interactive.Div
        name="Avatar"
        style={{
          position: "absolute",
          left: 540 - 158,
          top: 330 - 158,
          width: 316,
          height: 316,
          borderRadius: "50%",
          padding: 8,
          background: `conic-gradient(from ${spin}deg, #0A84FF, #BF5AF2, #FF375F, #FF9F0A, #64D2FF, #0A84FF)`,
          opacity: interpolate(frame, [0, 8], [0, 1], clamp),
          scale: interpolate(frame, [0, 22], [0.6, 1], {
            ...clamp,
            easing: Easing.bezier(0.34, 1.4, 0.64, 1),
            output: "perceptual-scale",
          }),
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            padding: 7,
            backgroundColor: "#F5F5F7",
          }}
        >
          <Img
            name="Oumar photo"
            src={staticFile("img/oumar-avatar.jpg")}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        </div>
      </Interactive.Div>

      {/* Name */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 520,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 18,
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "Inter Display",
            fontSize: 128,
            fontWeight: 700,
            letterSpacing: "-0.045em",
            lineHeight: 1,
            overflow: "hidden",
            paddingBottom: 10,
          }}
        >
          {NAME.split("").map((ch, i) => (
            <div
              key={i}
              style={{
                translate: `0px ${interpolate(frame, [12 + i * 2, 30 + i * 2], [110, 0], {
                  ...clamp,
                  easing: Easing.bezier(0.16, 1, 0.3, 1),
                })}%`,
                opacity: interpolate(frame, [12 + i * 2, 20 + i * 2], [0, 1], clamp),
              }}
            >
              {ch}
            </div>
          ))}
        </div>
        <div
          style={{
            scale: interpolate(frame, [30, 42], [0, 1], {
              ...clamp,
              easing: Easing.bezier(0.34, 1.56, 0.64, 1),
            }),
          }}
        >
          <VerifiedBadge size={58} />
        </div>
      </div>

      {/* Role */}
      <Interactive.Div
        name="Role"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 676,
          textAlign: "center",
          fontFamily: "Inter Display",
          fontSize: 50,
          fontWeight: 600,
          letterSpacing: "-0.02em",
          background: "linear-gradient(90deg, #0A84FF 0%, #5E5CE6 45%, #BF5AF2 75%, #FF375F 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          opacity: interpolate(frame, [26, 38], [0, 1], clamp),
          translate: interpolate(frame, [26, 44], ["0px 24px", "0px 0px"], {
            ...clamp,
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          filter: `blur(${interpolate(frame, [26, 38], [8, 0], clamp)}px)`,
        }}
      >
        Видеомонтажёр
      </Interactive.Div>

      {/* Skills */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 772,
          display: "flex",
          justifyContent: "center",
          gap: 14,
        }}
      >
        {SKILLS.map((s, i) => (
          <div
            key={s.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: 24,
              fontWeight: 500,
              backgroundColor: "#FFFFFF",
              padding: "14px 24px",
              borderRadius: 999,
              boxShadow: "0 10px 24px -12px rgba(0,0,0,0.18), inset 0 0 0 1px rgba(0,0,0,0.06)",
              opacity: interpolate(frame, [40 + i * 6, 46 + i * 6], [0, 1], clamp),
              scale: interpolate(frame, [40 + i * 6, 52 + i * 6], [0.5, 1], {
                ...clamp,
                easing: Easing.bezier(0.34, 1.56, 0.64, 1),
              }),
            }}
          >
            <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: s.color }} />
            {s.label}
          </div>
        ))}
      </div>

      {/* Credit */}
      <Interactive.Div
        name="Credit"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 900,
          textAlign: "center",
          fontSize: 24,
          fontWeight: 500,
          color: "#86868B",
          letterSpacing: "0.01em",
          opacity: interpolate(frame, [64, 78], [0, 1], clamp),
          translate: interpolate(frame, [64, 80], ["0px 14px", "0px 0px"], {
            ...clamp,
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        Монтаж и анимация — Oumar
      </Interactive.Div>

      <Audio name="SFX impact" src={staticFile("sfx/impact.wav")} from={0} volume={0.45} />
      <Audio name="SFX shimmer" src={staticFile("sfx/sparkle.wav")} from={14} volume={0.25} />
      <Audio name="SFX chip 1" src={staticFile("sfx/pop.wav")} from={40} volume={0.3} />
      <Audio name="SFX chip 2" src={staticFile("sfx/pop.wav")} from={46} volume={0.3} />
      <Audio name="SFX chip 3" src={staticFile("sfx/pop-high.wav")} from={52} volume={0.3} />
    </AbsoluteFill>
  );
};
