import React from "react";
import { Img, interpolate, useCurrentFrame } from "remotion";
import { Copy } from "../i18n";
import { CLAMP, COLORS, EASE_IN_OUT, EASE_OUT } from "../theme";
import { Icon } from "./Icons";

export const CARD_W = 500;
export const CARD_H = 700;

const base: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  borderRadius: 44,
  overflow: "hidden",
};

const Label: React.FC<{ children: React.ReactNode; dark?: boolean; style?: React.CSSProperties }> = ({ children, dark, style }) => (
  <div
    style={{
      position: "absolute",
      left: 34,
      top: 30,
      fontSize: 28,
      fontWeight: 600,
      letterSpacing: "-0.01em",
      color: dark ? "rgba(1,4,12,0.75)" : COLORS.muted,
      ...style,
    }}
  >
    {children}
  </div>
);

export const PhotoCard: React.FC<{ photo: string; name: string; tint?: boolean }> = ({ photo, name, tint }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ ...base, backgroundColor: COLORS.navyMid }}>
      <Img
        src={photo}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          scale: 1.08 + frame * 0.0012,
          filter: tint ? "grayscale(1) contrast(1.15)" : "saturate(1.05)",
        }}
      />
      {tint ? (
        <div style={{ ...base, borderRadius: 0, backgroundColor: COLORS.blue, mixBlendMode: "multiply", opacity: 0.85 }} />
      ) : null}
      <div style={{ ...base, borderRadius: 0, background: "linear-gradient(180deg, rgba(1,4,12,0) 50%, rgba(1,4,12,0.85) 100%)" }} />
      <div style={{ position: "absolute", left: 34, top: 30, display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: 9,
            backgroundColor: tint ? COLORS.white : COLORS.green,
            opacity: Math.floor(frame / 12) % 2 === 0 ? 1 : 0.25,
          }}
        />
        <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: "0.08em", color: COLORS.white }}>REC</div>
      </div>
      <div style={{ position: "absolute", left: 34, bottom: 34, fontSize: 56, fontWeight: 700, letterSpacing: "-0.04em", color: COLORS.white }}>
        {name}
      </div>
    </div>
  );
};

export const TimelineCard: React.FC<{ copy: Copy }> = ({ copy }) => {
  const frame = useCurrentFrame();
  const head = interpolate(frame % 90, [0, 89], [40, CARD_W - 50]);
  const tracks = [
    [
      { x: 30, w: 150, c: COLORS.blue },
      { x: 190, w: 120, c: COLORS.blue },
      { x: 320, w: 110, c: COLORS.blue },
    ],
    [
      { x: 70, w: 200, c: COLORS.green },
      { x: 280, w: 140, c: COLORS.green },
    ],
    [
      { x: 30, w: 90, c: "rgba(245,245,247,0.85)" },
      { x: 130, w: 170, c: "rgba(245,245,247,0.85)" },
    ],
    [{ x: 30, w: CARD_W - 60, c: "rgba(48,209,88,0.35)" }],
  ];
  return (
    <div style={{ ...base, backgroundColor: "#0A1430", border: "2px solid rgba(245,245,247,0.1)" }}>
      <Label>{copy.cards.timeline}</Label>
      <div style={{ position: "absolute", left: 30, right: 30, top: 100, height: 26, display: "flex", justifyContent: "space-between" }}>
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i} style={{ width: 2, height: i % 2 === 0 ? 22 : 12, backgroundColor: COLORS.faint }} />
        ))}
      </div>
      {tracks.map((tr, ti) => (
        <div key={ti} style={{ position: "absolute", left: 0, right: 0, top: 150 + ti * 110, height: 84 }}>
          {tr.map((c, ci) => (
            <div
              key={ci}
              style={{
                position: "absolute",
                left: c.x,
                width: c.w,
                top: 0,
                bottom: 0,
                borderRadius: 14,
                backgroundColor: c.c,
                opacity: 0.92,
              }}
            >
              {ti === 3 ? (
                <div style={{ position: "absolute", inset: "14px 16px", display: "flex", alignItems: "center", gap: 5 }}>
                  {Array.from({ length: 34 }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        height: `${30 + Math.abs(Math.sin(i * 1.7 + frame / 6)) * 70}%`,
                        borderRadius: 3,
                        backgroundColor: COLORS.green,
                      }}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ))}
      <div style={{ position: "absolute", left: head, top: 96, bottom: 40, width: 4, backgroundColor: COLORS.white, borderRadius: 2 }}>
        <div style={{ position: "absolute", left: -12, top: -10, width: 28, height: 28 }}>
          <Icon name="keyframe" size={28} />
        </div>
      </div>
    </div>
  );
};

export const GrowthCard: React.FC<{ copy: Copy }> = ({ copy }) => {
  const frame = useCurrentFrame();
  const grow = interpolate(frame, [10, 60], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const value = Math.round(248 * grow);
  const bars = [0.28, 0.4, 0.36, 0.55, 0.7, 0.92];
  return (
    <div style={{ ...base, backgroundColor: COLORS.white }}>
      <Label dark>{copy.cards.growth}</Label>
      <div style={{ position: "absolute", left: 30, top: 80, fontSize: 104, fontWeight: 700, letterSpacing: "-0.05em", color: COLORS.ink }}>
        +{value}%
      </div>
      <div style={{ position: "absolute", left: 36, top: 214, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 0, height: 0, borderLeft: "14px solid transparent", borderRight: "14px solid transparent", borderBottom: `22px solid ${COLORS.green}` }} />
        <div style={{ fontSize: 28, fontWeight: 600, color: "#1E9E45" }}>SaaS</div>
      </div>
      <div style={{ position: "absolute", left: 30, right: 30, bottom: 34, height: 300, display: "flex", alignItems: "flex-end", gap: 16 }}>
        {bars.map((b, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: `${b * 100 * interpolate(frame, [8 + i * 4, 40 + i * 4], [0.08, 1], { ...CLAMP, easing: EASE_OUT })}%`,
              borderRadius: 14,
              backgroundColor: i === bars.length - 1 ? COLORS.green : COLORS.blue,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export const ReelsCard: React.FC<{ copy: Copy }> = ({ copy }) => {
  const frame = useCurrentFrame();
  const progress = (frame % 100) / 100;
  return (
    <div
      style={{
        ...base,
        background: `radial-gradient(380px 380px at 30% 75%, rgba(48,209,88,0.65), rgba(48,209,88,0) 70%), linear-gradient(160deg, #0B3F9E, #030B22)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "45%",
          width: 140,
          height: 140,
          margin: "-70px 0 0 -70px",
          borderRadius: 70,
          backgroundColor: "rgba(245,245,247,0.18)",
          border: "2px solid rgba(245,245,247,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          scale: 1 + Math.sin(frame / 6) * 0.04,
        }}
      >
        <div style={{ marginLeft: 8 }}>
          <Icon name="play" size={64} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 34, bottom: 92, display: "flex", alignItems: "center", gap: 10, fontSize: 34, fontWeight: 700, color: COLORS.white }}>
        <Icon name="play" size={30} />
        1,2M <span style={{ fontWeight: 500, opacity: 0.75, fontSize: 28 }}>{copy.cards.views}</span>
      </div>
      <div style={{ position: "absolute", left: 34, right: 34, bottom: 52, height: 8, borderRadius: 4, backgroundColor: "rgba(245,245,247,0.25)" }}>
        <div style={{ width: `${progress * 100}%`, height: "100%", borderRadius: 4, backgroundColor: COLORS.white }} />
      </div>
      <div style={{ position: "absolute", right: 30, top: 34, display: "flex", flexDirection: "column", gap: 26, alignItems: "center" }}>
        {["sparkle", "layers", "undo"].map((n) => (
          <Icon key={n} name={n as "sparkle"} size={36} />
        ))}
      </div>
    </div>
  );
};

export const CaptionsCard: React.FC<{ copy: Copy; photo: string }> = ({ copy, photo }) => {
  const frame = useCurrentFrame();
  const words = copy.cards.captions;
  const active = Math.floor(frame / 10) % words.length;
  return (
    <div style={{ ...base, backgroundColor: COLORS.ink }}>
      <Img src={photo} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", filter: "blur(6px) brightness(0.45)", scale: 1.15 }} />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 190,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 14,
          fontSize: 64,
          fontWeight: 800,
          letterSpacing: "-0.03em",
          color: COLORS.white,
        }}
      >
        {words.map((w, i) => (
          <div
            key={w}
            style={{
              padding: "2px 18px",
              borderRadius: 14,
              backgroundColor: i === active ? COLORS.green : "transparent",
              color: i === active ? COLORS.ink : COLORS.white,
              scale: i === active ? 1.06 : 1,
            }}
          >
            {w}
          </div>
        ))}
      </div>
      <Label style={{ top: 30 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
          <Icon name="text" size={28} color={COLORS.muted} /> Captions
        </span>
      </Label>
    </div>
  );
};

export const UICard: React.FC<{ copy: Copy }> = ({ copy }) => {
  const frame = useCurrentFrame();
  const on = interpolate(frame % 60, [10, 18, 40, 48], [0, 1, 1, 0], { ...CLAMP, easing: EASE_IN_OUT });
  const slide = 0.25 + 0.6 * (0.5 + 0.5 * Math.sin(frame / 14));
  return (
    <div style={{ ...base, backgroundColor: "#E9ECF2" }}>
      <div style={{ position: "absolute", left: 30, right: 30, top: 34, height: 220, borderRadius: 30, backgroundColor: COLORS.white, boxShadow: "0 10px 30px rgba(1,4,12,0.08)" }}>
        <div style={{ position: "absolute", left: 30, top: 36, fontSize: 32, fontWeight: 600, color: COLORS.ink }}>{copy.cards.toggle}</div>
        <div style={{ position: "absolute", right: 30, top: 28, width: 104, height: 60, borderRadius: 30, backgroundColor: on > 0.5 ? COLORS.green : "#C7CBD3" }}>
          <div
            style={{
              position: "absolute",
              top: 5,
              left: 5 + on * 44,
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: COLORS.white,
              boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
            }}
          />
        </div>
        <div style={{ position: "absolute", left: 30, right: 30, top: 140, height: 10, borderRadius: 5, backgroundColor: "#DADDE3" }}>
          <div style={{ width: `${slide * 100}%`, height: "100%", borderRadius: 5, backgroundColor: COLORS.blue }} />
          <div style={{ position: "absolute", left: `${slide * 100}%`, top: -14, width: 38, height: 38, marginLeft: -19, borderRadius: 19, backgroundColor: COLORS.white, boxShadow: "0 2px 8px rgba(0,0,0,0.25)" }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 30, right: 30, top: 284, display: "flex", gap: 18 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ flex: 1, height: 130, borderRadius: 24, backgroundColor: i === 1 ? COLORS.ink : COLORS.white, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name={(["square", "keyframe", "triangle"] as const)[i]} size={46} color={i === 1 ? COLORS.green : COLORS.ink} />
          </div>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: 30,
          right: 30,
          bottom: 40,
          height: 110,
          borderRadius: 55,
          backgroundColor: COLORS.blue,
          color: COLORS.white,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 36,
          fontWeight: 600,
          scale: 1 - Math.max(0, Math.sin(frame / 9)) * 0.03,
        }}
      >
        {copy.cards.cta}
      </div>
    </div>
  );
};

export const SoundCard: React.FC<{ copy: Copy }> = ({ copy }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ ...base, backgroundColor: COLORS.green }}>
      <Label dark>{copy.cards.sound}</Label>
      <div style={{ position: "absolute", left: 30, right: 30, top: 140, bottom: 140, display: "flex", alignItems: "center", gap: 7 }}>
        {Array.from({ length: 26 }).map((_, i) => {
          const h = 0.18 + 0.82 * Math.abs(Math.sin(i * 0.9 + frame / 5) * Math.cos(i * 0.31 - frame / 11));
          return <div key={i} style={{ flex: 1, height: `${h * 100}%`, borderRadius: 8, backgroundColor: COLORS.ink }} />;
        })}
      </div>
      <div style={{ position: "absolute", left: 34, bottom: 40, display: "flex", gap: 22 }}>
        <Icon name="undo" size={40} color={COLORS.ink} />
        <Icon name="play" size={40} color={COLORS.ink} />
        <Icon name="wave" size={40} color={COLORS.ink} />
      </div>
    </div>
  );
};

export const KeyframesCard: React.FC<{ copy: Copy }> = ({ copy }) => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [5, 55], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const len = 900;
  return (
    <div style={{ ...base, backgroundColor: "#06102A", border: "2px solid rgba(245,245,247,0.1)" }}>
      <Label>{copy.cards.keyframes}</Label>
      <svg width={CARD_W} height={CARD_H} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={i} x1={30} x2={CARD_W - 30} y1={130 + i * 60} y2={130 + i * 60} stroke="rgba(245,245,247,0.08)" strokeWidth={2} />
        ))}
        <path
          d="M40 520 C 200 520, 190 160, 420 150"
          fill="none"
          stroke={COLORS.green}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={len}
          strokeDashoffset={len * (1 - draw)}
        />
        <line x1={40} y1={520} x2={200} y2={520} stroke={COLORS.muted} strokeWidth={3} />
        <line x1={420} y1={150} x2={260} y2={150} stroke={COLORS.muted} strokeWidth={3} />
        <circle cx={200} cy={520} r={12} fill={COLORS.white} />
        <circle cx={260} cy={150} r={12} fill={COLORS.white} />
        <rect x={26} y={506} width={28} height={28} fill={COLORS.white} transform="rotate(45 40 520)" />
        <rect x={406} y={136} width={28} height={28} fill={COLORS.white} transform="rotate(45 420 150)" />
      </svg>
      <div style={{ position: "absolute", left: 34, bottom: 36, fontSize: 30, fontWeight: 600, color: COLORS.white, fontFamily: "monospace" }}>
        cubic-bezier(.16,1,.3,1)
      </div>
    </div>
  );
};

export const BigTypeCard: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{ ...base, backgroundColor: COLORS.blue }}>
      <div style={{ position: "absolute", left: 30, top: 60, fontSize: 250, fontWeight: 800, letterSpacing: "-0.07em", lineHeight: 0.9, color: COLORS.white }}>
        4K
      </div>
      <div style={{ position: "absolute", left: 36, top: 300, fontSize: 64, fontWeight: 700, letterSpacing: "-0.04em", color: COLORS.ink }}>60 fps</div>
      <div style={{ position: "absolute", right: 36, bottom: 40, rotate: `${frame * 3}deg` }}>
        <Icon name="sparkle" size={86} color={COLORS.white} />
      </div>
      <div style={{ position: "absolute", left: 36, bottom: 46, display: "flex", gap: 16 }}>
        <Icon name="scissors" size={44} color={COLORS.ink} />
        <Icon name="magnet" size={44} color={COLORS.ink} />
        <Icon name="crop" size={44} color={COLORS.ink} />
      </div>
    </div>
  );
};
