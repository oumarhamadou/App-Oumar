import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  Img,
  Interactive,
  interpolate,
  interpolateColors,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { CursorIcon } from "../components/CursorIcon";
import { CheckIcon, PlayIcon, VerifiedBadge } from "../components/Icons";

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const VIDEO_CLIPS = [
  { left: 0, width: 21 },
  { left: 22, width: 29 },
  { left: 52, width: 17 },
  { left: 70, width: 30 },
];
const TITLE_CLIPS = [
  { left: 6, width: 16 },
  { left: 54, width: 22 },
];
const WAVE_BARS = Array.from({ length: 92 }, (_, i) => {
  const v =
    Math.abs(Math.sin(i * 0.55) * 0.6 + Math.sin(i * 1.7) * 0.3) + 0.15;
  return Math.min(1, v);
});

// Editor-style publish window: export progress, then the Publish click.
export const ComposerScene: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [14, 62], [0, 100], {
    ...clamp,
    easing: Easing.bezier(0.45, 0, 0.2, 1),
  });
  const exported = frame >= 63;
  const published = frame >= 90;

  return (
    <AbsoluteFill>
      <Interactive.Div
        name="Composer window"
        style={{
          position: "absolute",
          left: 130,
          top: 200,
          width: 820,
          height: 680,
          borderRadius: 34,
          backgroundColor: "#FFFFFF",
          boxShadow:
            "0 50px 100px -20px rgba(0,0,0,0.18), 0 20px 40px -12px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(0,0,0,0.04)",
          fontFamily: "Inter",
          color: "#1D1D1F",
          overflow: "hidden",
          opacity: interpolate(frame, [0, 12, 126, 146], [0, 1, 1, 0], clamp),
          translate: interpolate(frame, [0, 22, 124, 146], ["0px 90px", "0px 0px", "0px 0px", "0px -30px"], {
            ...clamp,
            easing: [
              Easing.bezier(0.16, 1, 0.3, 1),
              Easing.linear,
              Easing.bezier(0.7, 0, 0.84, 0),
            ],
          }),
          scale: interpolate(frame, [0, 22, 124, 146], [0.9, 1, 1, 0.94], {
            ...clamp,
            easing: [
              Easing.bezier(0.16, 1, 0.3, 1),
              Easing.linear,
              Easing.bezier(0.7, 0, 0.84, 0),
            ],
            output: "perceptual-scale",
          }),
          filter: `blur(${interpolate(frame, [0, 14, 128, 146], [10, 0, 0, 12], clamp)}px)`,
        }}
      >
        {/* Title bar */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            right: 0,
            height: 64,
            borderBottom: "1px solid #EDEDF0",
            display: "flex",
            alignItems: "center",
            padding: "0 24px",
          }}
        >
          {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
            <div
              key={c}
              style={{
                width: 15,
                height: 15,
                borderRadius: "50%",
                backgroundColor: c,
                marginRight: 9,
              }}
            />
          ))}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              textAlign: "center",
              fontSize: 22,
              fontWeight: 600,
            }}
          >
            Новая публикация
          </div>
        </div>

        {/* Author row */}
        <div
          style={{
            position: "absolute",
            left: 28,
            right: 28,
            top: 88,
            height: 64,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <Img
            name="Oumar avatar"
            src={staticFile("img/oumar-avatar.jpg")}
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 27,
                fontWeight: 600,
              }}
            >
              Oumar <VerifiedBadge size={24} />
            </div>
            <div style={{ fontSize: 20, color: "#86868B", marginTop: 2 }}>
              Видеомонтажёр
            </div>
          </div>
          <div
            style={{
              fontSize: 19,
              fontWeight: 500,
              color: "#1D1D1F",
              backgroundColor: "#F2F2F7",
              padding: "10px 18px",
              borderRadius: 999,
            }}
          >
            Для всех
          </div>
        </div>

        {/* Preview */}
        <div
          style={{
            position: "absolute",
            left: 28,
            top: 172,
            width: 764,
            height: 268,
            borderRadius: 22,
            overflow: "hidden",
            background:
              "linear-gradient(135deg, #0A84FF 0%, #5E5CE6 48%, #BF5AF2 100%)",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: 520,
              height: 520,
              borderRadius: "50%",
              left: interpolate(frame, [0, 150], [-120, 420]),
              top: -180,
              background:
                "radial-gradient(circle, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 65%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 20,
              top: 18,
              fontSize: 17,
              fontWeight: 600,
              color: "#fff",
              backgroundColor: "rgba(0,0,0,0.22)",
              padding: "7px 14px",
              borderRadius: 999,
            }}
          >
            4K · 0:24
          </div>
          <div
            style={{
              position: "absolute",
              left: 382 - 46,
              top: 134 - 46,
              width: 92,
              height: 92,
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.22)",
              boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,0.55)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              paddingLeft: 4,
            }}
          >
            <PlayIcon size={40} />
          </div>
          <div
            style={{
              position: "absolute",
              left: 24,
              bottom: 20,
              color: "#fff",
            }}
          >
            <div
              style={{
                fontFamily: "Inter Display",
                fontSize: 44,
                fontWeight: 700,
                letterSpacing: "-0.03em",
                lineHeight: 1,
              }}
            >
              Шоурил
            </div>
            <div
              style={{
                fontSize: 19,
                fontWeight: 500,
                opacity: 0.85,
                marginTop: 8,
              }}
            >
              Монтаж · Моушн · Цвет
            </div>
          </div>
        </div>

        {/* Editing timeline */}
        <div
          style={{
            position: "absolute",
            left: 28,
            top: 458,
            width: 764,
            height: 100,
            borderRadius: 16,
            backgroundColor: "#F5F5F7",
          }}
        >
          <div style={{ position: "absolute", left: 16, right: 16, top: 14, height: 20 }}>
            {VIDEO_CLIPS.map((c, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${c.left}%`,
                  width: `${c.width}%`,
                  top: 0,
                  bottom: 0,
                  borderRadius: 6,
                  background:
                    "repeating-linear-gradient(90deg, #0A84FF 0px, #0A84FF 34px, #3B9BFF 34px, #3B9BFF 36px)",
                }}
              />
            ))}
          </div>
          <div style={{ position: "absolute", left: 16, right: 16, top: 40, height: 20 }}>
            {TITLE_CLIPS.map((c, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${c.left}%`,
                  width: `${c.width}%`,
                  top: 0,
                  bottom: 0,
                  borderRadius: 6,
                  backgroundColor: "#BF5AF2",
                }}
              />
            ))}
          </div>
          <div
            style={{
              position: "absolute",
              left: 16,
              right: 16,
              top: 66,
              height: 20,
              borderRadius: 6,
              backgroundColor: "rgba(52,199,89,0.16)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 6px",
            }}
          >
            {WAVE_BARS.map((v, i) => (
              <div
                key={i}
                style={{
                  width: 3,
                  height: `${v * 100}%`,
                  borderRadius: 2,
                  backgroundColor: "#34C759",
                }}
              />
            ))}
          </div>
          {/* Playhead */}
          <div
            style={{
              position: "absolute",
              top: 6,
              bottom: 6,
              width: 3,
              borderRadius: 2,
              backgroundColor: "#FF375F",
              left: 16 + (progress / 100) * 729,
              boxShadow: "0 0 0 2px rgba(255,255,255,0.8)",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: -6,
                top: -6,
                width: 15,
                height: 10,
                borderRadius: 3,
                backgroundColor: "#FF375F",
              }}
            />
          </div>
        </div>

        {/* Export status */}
        <div
          style={{
            position: "absolute",
            left: 28,
            top: 586,
            width: 380,
            height: 60,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: 20,
              fontWeight: 500,
              color: exported ? "#1D1D1F" : "#6E6E73",
            }}
          >
            {exported ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    backgroundColor: "#34C759",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    scale: interpolate(frame, [63, 72], [0.4, 1], {
                      ...clamp,
                      easing: Easing.bezier(0.34, 1.56, 0.64, 1),
                    }),
                  }}
                >
                  <CheckIcon size={18} />
                </div>
                Готово к публикации
              </div>
            ) : (
              <div>Экспорт · 4K</div>
            )}
            <div style={{ fontVariantNumeric: "tabular-nums", color: "#6E6E73" }}>
              {Math.round(progress)}%
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              height: 8,
              borderRadius: 8,
              backgroundColor: "#E8E8ED",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                borderRadius: 8,
                background: exported
                  ? "#34C759"
                  : "linear-gradient(90deg, #0A84FF, #5E5CE6)",
              }}
            />
          </div>
        </div>

        {/* Publish button */}
        <div
          style={{
            position: "absolute",
            left: 544,
            top: 584,
            width: 248,
            height: 64,
            borderRadius: 999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
            fontSize: 23,
            fontWeight: 600,
            color: "#FFFFFF",
            backgroundColor: interpolateColors(frame, [88, 96], ["#0071E3", "#34C759"]),
            boxShadow: published
              ? "0 12px 30px -8px rgba(52,199,89,0.55)"
              : "0 12px 30px -8px rgba(0,113,227,0.55)",
            scale: interpolate(frame, [86, 90, 98], [1, 0.93, 1], {
              ...clamp,
              easing: Easing.bezier(0.34, 1.56, 0.64, 1),
            }),
          }}
        >
          {published ? (
            <>
              <CheckIcon size={24} />
              Опубликовано
            </>
          ) : (
            "Опубликовать"
          )}
        </div>
      </Interactive.Div>

      {/* Click ripple, Apple Intelligence colours */}
      {[0, 7].map((delay) => (
        <div
          key={delay}
          style={{
            position: "absolute",
            left: 798,
            top: 816,
            width: 1,
            height: 1,
            opacity: interpolate(frame, [88 + delay, 92 + delay, 122 + delay], [0, delay ? 0.5 : 0.9, 0], clamp),
          }}
        >
          <div
            style={{
              position: "absolute",
              width: interpolate(frame, [88 + delay, 122 + delay], [90, 620], {
                ...clamp,
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              }),
              aspectRatio: "1",
              translate: "-50% -50%",
              borderRadius: "50%",
              background:
                "conic-gradient(from 200deg, #0A84FF, #BF5AF2, #FF375F, #FF9F0A, #64D2FF, #0A84FF)",
              WebkitMask:
                "radial-gradient(farthest-side, transparent calc(100% - 7px), #000 calc(100% - 6px))",
              mask: "radial-gradient(farthest-side, transparent calc(100% - 7px), #000 calc(100% - 6px))",
            }}
          />
        </div>
      ))}

      <Interactive.Div
        name="Cursor"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          opacity: interpolate(frame, [46, 52, 118, 130], [0, 1, 1, 0], clamp),
          translate: interpolate(frame, [46, 82, 100, 126], ["990px 1110px", "807px 822px", "807px 822px", "870px 900px"], {
            ...clamp,
            easing: Easing.bezier(0.65, 0, 0.35, 1),
          }),
          scale: interpolate(frame, [85, 88, 93], [1, 0.84, 1], clamp),
          transformOrigin: "5px 4px",
        }}
      >
        <CursorIcon />
      </Interactive.Div>

      <Audio name="SFX window in" src={staticFile("sfx/pop.wav")} from={2} volume={0.45} />
      <Audio name="SFX export done" src={staticFile("sfx/pop-high.wav")} from={63} volume={0.35} />
      <Audio name="SFX click" src={staticFile("sfx/click.wav")} from={87} volume={0.9} />
      <Audio name="SFX published" src={staticFile("sfx/success.wav")} from={89} volume={0.5} />
      <Audio name="SFX whoosh out" src={staticFile("sfx/whoosh.wav")} from={124} volume={0.3} />
    </AbsoluteFill>
  );
};
