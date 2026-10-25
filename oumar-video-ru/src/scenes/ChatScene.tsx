import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { PersonGlyph } from "../components/Icons";

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const TypingDots: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", gap: 9, alignItems: "center", height: "100%" }}>
      {[0, 1, 2].map((i) => {
        const wave = Math.max(0, Math.sin(frame * 0.38 - i * 0.9));
        return (
          <div
            key={i}
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              backgroundColor: "#8E8E93",
              opacity: 0.45 + wave * 0.55,
              translate: `0px ${-wave * 7}px`,
            }}
          />
        );
      })}
    </div>
  );
};

const Avatar: React.FC<{ size: number }> = ({ size }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: "linear-gradient(180deg, #C7C7CC 0%, #A1A1A6 100%)",
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-end",
      overflow: "hidden",
      flexShrink: 0,
    }}
  >
    <PersonGlyph size={size * 0.9} />
  </div>
);

// iMessage-style chat: "Smooth, bro!" and "Let's work together!".
export const ChatScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ fontFamily: "Inter", color: "#1D1D1F" }}>
      <Interactive.Div
        name="Chat window"
        style={{
          position: "absolute",
          left: 160,
          top: 260,
          width: 760,
          height: 560,
          borderRadius: 36,
          backgroundColor: "#FFFFFF",
          overflow: "hidden",
          boxShadow:
            "0 50px 100px -20px rgba(0,0,0,0.18), 0 20px 40px -12px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(0,0,0,0.04)",
          transformOrigin: "320px 343px",
          opacity: interpolate(frame, [0, 10, 146, 160], [0, 1, 1, 0], clamp),
          scale: interpolate(frame, [0, 20, 128, 162], [1.12, 1, 1, 2.4], {
            ...clamp,
            easing: [
              Easing.bezier(0.16, 1, 0.3, 1),
              Easing.linear,
              Easing.bezier(0.7, 0, 0.84, 0),
            ],
            output: "perceptual-scale",
          }),
          filter: `blur(${interpolate(frame, [0, 12, 140, 160], [10, 0, 0, 10], clamp)}px)`,
        }}
      >
        {/* Header */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            height: 100,
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "0 26px",
            borderBottom: "1px solid #EDEDF0",
            backgroundColor: "rgba(249,249,251,0.9)",
          }}
        >
          <svg width={18} height={30} viewBox="0 0 12 20">
            <path d="M10 2L2 10l8 8" fill="none" stroke="#0071E3" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <Avatar size={58} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 26, fontWeight: 600 }}>Новый клиент</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 19, color: "#86868B", marginTop: 2 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#34C759" }} />
              в сети
            </div>
          </div>
          <svg width={38} height={38} viewBox="0 0 24 24">
            <rect x={2} y={6.5} width={13.5} height={11} rx={2.5} fill="none" stroke="#0071E3" strokeWidth={1.8} />
            <path d="M15.5 10.5l5-3v9l-5-3z" fill="none" stroke="#0071E3" strokeWidth={1.8} strokeLinejoin="round" />
          </svg>
          <svg width={32} height={32} viewBox="0 0 24 24" style={{ marginLeft: 14 }}>
            <path
              d="M6.6 3.5l2.3-.4 1.6 4-1.9 1.4a11.5 11.5 0 006.9 6.9l1.4-1.9 4 1.6-.4 2.3c-.2 1.1-1.2 1.9-2.3 1.8C9.6 18.7 5.3 14.4 4.8 5.8c-.1-1.1.7-2.1 1.8-2.3z"
              fill="none"
              stroke="#0071E3"
              strokeWidth={1.8}
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 114,
            textAlign: "center",
            fontSize: 18,
            fontWeight: 500,
            color: "#86868B",
          }}
        >
          Сегодня, 14:32
        </div>

        {/* Sender avatar follows the latest message */}
        <div
          style={{
            position: "absolute",
            left: 26,
            top: 234,
            opacity: interpolate(frame, [12, 18], [0, 1], clamp),
            scale: interpolate(frame, [12, 22], [0.4, 1], {
              ...clamp,
              easing: Easing.bezier(0.34, 1.56, 0.64, 1),
            }),
            translate: interpolate(frame, [64, 76], ["0px 0px", "0px 96px"], {
              ...clamp,
              easing: Easing.bezier(0.65, 0, 0.35, 1),
            }),
          }}
        >
          <Avatar size={48} />
        </div>

        {/* Row 1 */}
        <div style={{ position: "absolute", left: 90, top: 210, height: 74 }}>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              height: 74,
              padding: "0 26px",
              borderRadius: 30,
              borderBottomLeftRadius: 10,
              backgroundColor: "#E9E9EB",
              transformOrigin: "left bottom",
              opacity: interpolate(frame, [14, 18, 40, 44], [0, 1, 1, 0], clamp),
              scale: interpolate(frame, [14, 24, 40, 46], [0.5, 1, 1, 0.7], {
                ...clamp,
                easing: Easing.bezier(0.34, 1.56, 0.64, 1),
              }),
            }}
          >
            <TypingDots />
          </div>
          <Interactive.Div
            name="Message 1"
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              height: 74,
              display: "flex",
              alignItems: "center",
              whiteSpace: "nowrap",
              padding: "0 28px",
              borderRadius: 30,
              borderBottomLeftRadius: 10,
              backgroundColor: "#E9E9EB",
              fontSize: 30,
              fontWeight: 500,
              transformOrigin: "left bottom",
              opacity: interpolate(frame, [42, 46], [0, 1], clamp),
              scale: interpolate(frame, [42, 54], [0.6, 1], {
                ...clamp,
                easing: Easing.bezier(0.34, 1.56, 0.64, 1),
              }),
            }}
          >
            Как плавно, бро!
          </Interactive.Div>
          <Interactive.Div
            name="Tag Признание"
            style={{
              position: "absolute",
              left: 250,
              top: -26,
              whiteSpace: "nowrap",
              fontSize: 22,
              fontWeight: 600,
              color: "#1F9D43",
              backgroundColor: "rgba(52,199,89,0.14)",
              padding: "8px 16px",
              borderRadius: 999,
              opacity: interpolate(frame, [50, 56, 86, 98], [0, 1, 1, 0], clamp),
              translate: interpolate(frame, [50, 98], ["0px 8px", "0px -24px"], {
                ...clamp,
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              }),
            }}
          >
            + Признание
          </Interactive.Div>
        </div>

        {/* Row 2 */}
        <div style={{ position: "absolute", left: 90, top: 306, height: 74 }}>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              height: 74,
              padding: "0 26px",
              borderRadius: 30,
              borderBottomLeftRadius: 10,
              backgroundColor: "#E9E9EB",
              transformOrigin: "left bottom",
              opacity: interpolate(frame, [66, 70, 92, 96], [0, 1, 1, 0], clamp),
              scale: interpolate(frame, [66, 76, 92, 98], [0.5, 1, 1, 0.7], {
                ...clamp,
                easing: Easing.bezier(0.34, 1.56, 0.64, 1),
              }),
            }}
          >
            <TypingDots />
          </div>
          <Interactive.Div
            name="Message 2"
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              height: 74,
              display: "flex",
              alignItems: "center",
              whiteSpace: "nowrap",
              padding: "0 28px",
              borderRadius: 30,
              borderBottomLeftRadius: 10,
              backgroundColor: "#E9E9EB",
              fontSize: 30,
              fontWeight: 500,
              transformOrigin: "left bottom",
              opacity: interpolate(frame, [94, 98], [0, 1], clamp),
              scale: interpolate(frame, [94, 106], [0.6, 1], {
                ...clamp,
                easing: Easing.bezier(0.34, 1.56, 0.64, 1),
              }),
            }}
          >
            Давай поработаем вместе!
          </Interactive.Div>
          <Interactive.Div
            name="Tag Возможность"
            style={{
              position: "absolute",
              left: 380,
              top: -26,
              whiteSpace: "nowrap",
              fontSize: 22,
              fontWeight: 600,
              color: "#0071E3",
              backgroundColor: "rgba(0,113,227,0.12)",
              padding: "8px 16px",
              borderRadius: 999,
              opacity: interpolate(frame, [102, 108, 134, 146], [0, 1, 1, 0], clamp),
              translate: interpolate(frame, [102, 150], ["0px 8px", "0px -24px"], {
                ...clamp,
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              }),
            }}
          >
            + Возможность
          </Interactive.Div>
        </div>

        {/* Input bar */}
        <div
          style={{
            position: "absolute",
            left: 24,
            right: 24,
            bottom: 22,
            height: 60,
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              backgroundColor: "#F2F2F7",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 34,
              fontWeight: 400,
              color: "#8E8E93",
              flexShrink: 0,
            }}
          >
            +
          </div>
          <div
            style={{
              flex: 1,
              height: 56,
              borderRadius: 999,
              boxShadow: "inset 0 0 0 1.5px #D2D2D7",
              display: "flex",
              alignItems: "center",
              padding: "0 22px",
              fontSize: 22,
              color: "#AEAEB2",
            }}
          >
            Сообщение
          </div>
        </div>
      </Interactive.Div>

      <Audio name="SFX window in" src={staticFile("sfx/pop.wav")} from={2} volume={0.3} />
      <Audio name="SFX typing" src={staticFile("sfx/tick.wav")} from={16} volume={0.25} />
      <Audio name="SFX message 1" src={staticFile("sfx/pop-high.wav")} from={42} volume={0.5} />
      <Audio name="SFX tag 1" src={staticFile("sfx/sparkle.wav")} from={50} volume={0.22} />
      <Audio name="SFX typing 2" src={staticFile("sfx/tick.wav")} from={68} volume={0.25} />
      <Audio name="SFX message 2" src={staticFile("sfx/pop-high.wav")} from={94} volume={0.5} />
      <Audio name="SFX tag 2" src={staticFile("sfx/sparkle.wav")} from={102} volume={0.22} />
      <Audio name="SFX zoom" src={staticFile("sfx/whoosh-rev.wav")} from={130} volume={0.3} />
    </AbsoluteFill>
  );
};
