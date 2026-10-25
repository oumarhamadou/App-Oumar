import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { CursorIcon } from "../components/CursorIcon";
import { PersonGlyph, Sparkle } from "../components/Icons";

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const CHART_W = 724;
const CHART_H = 132;
const POINTS = [10, 16, 13, 27, 38, 62, 100];
const DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

const chartPath = (() => {
  const pts = POINTS.map((v, i) => [
    (i / (POINTS.length - 1)) * CHART_W,
    CHART_H - (v / 100) * (CHART_H - 14) - 6,
  ]);
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[Math.max(0, i - 1)];
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[i + 1];
    const [x3, y3] = pts[Math.min(pts.length - 1, i + 2)];
    d += ` C ${x1 + (x2 - x0) / 6} ${y1 + (y2 - y0) / 6}, ${x2 - (x3 - x1) / 6} ${y2 - (y3 - y1) / 6}, ${x2} ${y2}`;
  }
  return { line: d, area: `${d} L ${CHART_W} ${CHART_H} L 0 ${CHART_H} Z`, end: pts[pts.length - 1] };
})();

// Followers notification + growth card, then "And also this!" and a new message.
export const NotificationsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const chart = interpolate(frame, [22, 74], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.45, 0, 0.2, 1),
  });
  const followers = Math.round(
    interpolate(frame, [22, 74], [0, 2480], {
      ...clamp,
      easing: Easing.bezier(0.2, 0.6, 0.2, 1),
    }),
  );

  return (
    <AbsoluteFill style={{ fontFamily: "Inter", color: "#1D1D1F" }}>
      {/* Sparkles */}
      <Interactive.Div
        name="Sparkles"
        style={{
          position: "absolute",
          left: 104,
          top: 168,
          width: 90,
          height: 80,
          opacity: interpolate(frame, [6, 10, 40, 56], [0, 1, 1, 0], clamp),
          scale: interpolate(frame, [6, 20], [0.2, 1], {
            ...clamp,
            easing: Easing.bezier(0.34, 1.56, 0.64, 1),
            output: "perceptual-scale",
          }),
          rotate: interpolate(frame, [6, 56], ["-30deg", "20deg"], clamp),
        }}
      >
        <div style={{ position: "absolute", left: 0, top: 30 }}>
          <Sparkle size={40} color="#0A84FF" />
        </div>
        <div style={{ position: "absolute", left: 44, top: 6 }}>
          <Sparkle size={22} color="#BF5AF2" />
        </div>
        <div style={{ position: "absolute", left: 70, top: 40 }}>
          <Sparkle size={14} color="#64D2FF" />
        </div>
      </Interactive.Div>

      {/* Growth analytics card */}
      <Interactive.Div
        name="Analytics card"
        style={{
          position: "absolute",
          left: 150,
          top: 390,
          width: 780,
          height: 356,
          borderRadius: 32,
          backgroundColor: "#FFFFFF",
          boxShadow:
            "0 40px 80px -24px rgba(0,0,0,0.16), inset 0 0 0 1px rgba(0,0,0,0.04)",
          opacity: interpolate(frame, [16, 28, 84, 98], [0, 1, 1, 0], clamp),
          translate: interpolate(frame, [16, 36, 84, 100], ["0px 70px", "0px 0px", "0px 0px", "0px 80px"], {
            ...clamp,
            easing: [
              Easing.bezier(0.16, 1, 0.3, 1),
              Easing.linear,
              Easing.bezier(0.7, 0, 0.84, 0),
            ],
          }),
          filter: `blur(${interpolate(frame, [16, 28, 86, 100], [8, 0, 0, 10], clamp)}px)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 28,
            right: 28,
            top: 26,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: 22, fontWeight: 500, color: "#6E6E73" }}>
            Подписчики
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 500,
              color: "#1D1D1F",
              backgroundColor: "#F2F2F7",
              padding: "8px 16px",
              borderRadius: 999,
            }}
          >
            7 дней
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 28,
            top: 66,
            display: "flex",
            alignItems: "center",
            gap: 18,
          }}
        >
          <div
            style={{
              fontFamily: "Inter Display",
              fontSize: 72,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            +{followers.toLocaleString("ru-RU")}
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 600,
              color: "#1F9D43",
              backgroundColor: "rgba(52,199,89,0.14)",
              padding: "8px 14px",
              borderRadius: 999,
              opacity: interpolate(frame, [60, 66], [0, 1], clamp),
              scale: interpolate(frame, [60, 72], [0.5, 1], {
                ...clamp,
                easing: Easing.bezier(0.34, 1.56, 0.64, 1),
              }),
            }}
          >
            ↑ 312%
          </div>
        </div>
        <svg
          width={CHART_W}
          height={CHART_H}
          style={{ position: "absolute", left: 28, top: 170, overflow: "visible" }}
        >
          <defs>
            <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0A84FF" stopOpacity={0.28} />
              <stop offset="100%" stopColor="#0A84FF" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="stroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#64D2FF" />
              <stop offset="60%" stopColor="#0A84FF" />
              <stop offset="100%" stopColor="#5E5CE6" />
            </linearGradient>
            <clipPath id="reveal">
              <rect x={0} y={-20} width={chart * CHART_W} height={CHART_H + 40} />
            </clipPath>
          </defs>
          {[0.25, 0.5, 0.75].map((g) => (
            <line
              key={g}
              x1={0}
              x2={CHART_W}
              y1={CHART_H * g}
              y2={CHART_H * g}
              stroke="#E5E5EA"
              strokeDasharray="4 8"
            />
          ))}
          <path d={chartPath.area} fill="url(#area)" clipPath="url(#reveal)" />
          <path
            d={chartPath.line}
            fill="none"
            stroke="url(#stroke)"
            strokeWidth={5}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - chart}
          />
          <circle
            cx={chartPath.end[0]}
            cy={chartPath.end[1]}
            r={interpolate(frame, [72, 80, 96], [0, 22, 14], clamp)}
            fill="rgba(10,132,255,0.18)"
          />
          <circle
            cx={chartPath.end[0]}
            cy={chartPath.end[1]}
            r={interpolate(frame, [72, 80], [0, 8], {
              ...clamp,
              easing: Easing.bezier(0.34, 1.56, 0.64, 1),
            })}
            fill="#0A84FF"
            stroke="#fff"
            strokeWidth={3}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            left: 28,
            right: 28,
            top: 316,
            display: "flex",
            justifyContent: "space-between",
            fontSize: 16,
            fontWeight: 500,
            color: "#86868B",
          }}
        >
          {DAYS.map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>
      </Interactive.Div>

      {/* "And also this!" */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 396,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 26,
          fontFamily: "Inter Display",
          fontSize: 76,
          fontWeight: 600,
          letterSpacing: "-0.03em",
          opacity: interpolate(frame, [150, 158, 160, 176], [1, 0.32, 0.32, 0], clamp),
        }}
      >
        <Interactive.Div
          name="Word А"
          style={{
            opacity: interpolate(frame, [94, 98], [0, 1], clamp),
            scale: interpolate(frame, [94, 106], [0, 1], {
              ...clamp,
              easing: Easing.bezier(0.34, 1.56, 0.64, 1),
            }),
            rotate: interpolate(frame, [94, 106], ["-24deg", "-8deg"], clamp),
            translate: "0px 8px",
          }}
        >
          А
        </Interactive.Div>
        <Interactive.Div
          name="Word ещё"
          style={{
            opacity: interpolate(frame, [99, 103], [0, 1], clamp),
            scale: interpolate(frame, [99, 111], [0, 1], {
              ...clamp,
              easing: Easing.bezier(0.34, 1.56, 0.64, 1),
            }),
            rotate: interpolate(frame, [99, 111], ["18deg", "4deg"], clamp),
            translate: "0px -18px",
          }}
        >
          ещё
        </Interactive.Div>
        <Interactive.Div
          name="Word вот это!"
          style={{
            opacity: interpolate(frame, [104, 108], [0, 1], clamp),
            scale: interpolate(frame, [104, 116], [0, 1], {
              ...clamp,
              easing: Easing.bezier(0.34, 1.56, 0.64, 1),
            }),
            rotate: interpolate(frame, [104, 116], ["-16deg", "-4deg"], clamp),
            translate: "0px 6px",
            color: "#0071E3",
          }}
        >
          вот это!
        </Interactive.Div>
      </div>

      {/* Notification banner */}
      <Interactive.Div
        name="Notification banner"
        style={{
          position: "absolute",
          left: 150,
          width: 780,
          height: 124,
          top: interpolate(frame, [84, 108], [230, 532], {
            ...clamp,
            easing: Easing.bezier(0.65, 0, 0.35, 1),
          }),
          borderRadius: 32,
          backgroundColor: "rgba(255,255,255,0.92)",
          boxShadow:
            "0 30px 60px -18px rgba(0,0,0,0.18), inset 0 0 0 1px rgba(0,0,0,0.04)",
          opacity: interpolate(frame, [0, 8, 160, 176], [0, 1, 1, 0], clamp),
          translate: interpolate(frame, [0, 18], ["0px -70px", "0px 0px"], {
            ...clamp,
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          scale: interpolate(frame, [0, 18, 116, 121, 128, 146, 150, 156, 160, 178], [0.92, 1, 1, 0.97, 1, 1, 0.97, 1, 1, 1.3], {
            ...clamp,
            easing: Easing.bezier(0.33, 1, 0.68, 1),
            output: "perceptual-scale",
          }),
          filter: `blur(${interpolate(frame, [160, 178], [0, 14], clamp)}px)`,
        }}
      >
        {/* A — new followers */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            gap: 20,
            padding: "0 26px",
            opacity: interpolate(frame, [116, 124], [1, 0], clamp),
            translate: interpolate(frame, [116, 126], ["0px 0px", "0px -18px"], clamp),
            filter: `blur(${interpolate(frame, [116, 126], [0, 6], clamp)}px)`,
          }}
        >
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: 20,
              background: "linear-gradient(135deg, #FF9F0A 0%, #FF375F 55%, #BF5AF2 100%)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <PersonGlyph size={46} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div style={{ fontSize: 26, fontWeight: 700 }}>Новые подписчики</div>
              <div style={{ fontSize: 19, color: "#86868B" }}>сейчас</div>
            </div>
            <div style={{ fontSize: 22, color: "#6E6E73", marginTop: 4 }}>
              подписались на вас благодаря вашему видео
            </div>
          </div>
        </div>

        {/* B — new message */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            gap: 20,
            padding: "0 26px",
            opacity: interpolate(frame, [118, 126], [0, 1], clamp),
            translate: interpolate(frame, [118, 128], ["0px 18px", "0px 0px"], {
              ...clamp,
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        >
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: 20,
              background: "linear-gradient(135deg, #64D2FF 0%, #0A84FF 100%)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <svg width={44} height={44} viewBox="0 0 24 24">
              <path
                d="M12 3.5c-5 0-9 3.3-9 7.5 0 2.4 1.3 4.5 3.4 5.9L5.6 20.5l4.1-2.2c.7.1 1.5.2 2.3.2 5 0 9-3.4 9-7.5s-4-7.5-9-7.5z"
                fill="#fff"
              />
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div style={{ fontSize: 26, fontWeight: 700 }}>Новое сообщение</div>
              <div style={{ fontSize: 19, color: "#86868B" }}>сейчас</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
              <div style={{ fontSize: 22, color: "#6E6E73" }}>Привет, Oumar!</div>
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  backgroundColor: "#0A84FF",
                  scale: interpolate(frame, [124, 132], [0, 1], {
                    ...clamp,
                    easing: Easing.bezier(0.34, 1.56, 0.64, 1),
                  }),
                }}
              />
            </div>
          </div>
        </div>
      </Interactive.Div>

      <Interactive.Div
        name="Cursor"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          opacity: interpolate(frame, [36, 44, 160, 172], [0, 1, 1, 0], clamp),
          translate: interpolate(frame, [36, 66, 120, 144, 164], ["1000px 520px", "862px 322px", "862px 322px", "575px 600px", "600px 640px"], {
            ...clamp,
            easing: Easing.bezier(0.65, 0, 0.35, 1),
          }),
          scale: interpolate(frame, [145, 148, 153], [1, 0.84, 1], clamp),
          transformOrigin: "5px 4px",
        }}
      >
        <CursorIcon />
      </Interactive.Div>

      <Audio name="SFX notification" src={staticFile("sfx/notification.wav")} from={3} volume={0.55} />
      <Audio name="SFX sparkle" src={staticFile("sfx/sparkle.wav")} from={8} volume={0.3} />
      <Audio name="SFX card in" src={staticFile("sfx/pop-high.wav")} from={20} volume={0.25} />
      <Audio name="SFX growth pill" src={staticFile("sfx/pop.wav")} from={61} volume={0.25} />
      <Audio name="SFX word 1" src={staticFile("sfx/pop.wav")} from={94} volume={0.4} />
      <Audio name="SFX word 2" src={staticFile("sfx/pop.wav")} from={99} volume={0.4} />
      <Audio name="SFX word 3" src={staticFile("sfx/pop-high.wav")} from={104} volume={0.45} />
      <Audio name="SFX message" src={staticFile("sfx/message.wav")} from={118} volume={0.5} />
      <Audio name="SFX click" src={staticFile("sfx/click.wav")} from={146} volume={0.9} />
      <Audio name="SFX whoosh" src={staticFile("sfx/whoosh.wav")} from={158} volume={0.3} />
    </AbsoluteFill>
  );
};
