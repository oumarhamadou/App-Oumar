import React from "react";
import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  interpolateColors,
  useCurrentFrame,
} from "remotion";
import { Avatar } from "../components/Avatar";
import { Profile, ruNumber, ruPlural } from "../profile";
import { clamp, sans } from "../theme";

// Card geometry is fixed so the camera can land exactly on the Follow button.
// Follow button centre sits at (-208.5, +240) from the card centre; at zoom 1.4
// the camera shifts by (291.9, -336) to bring it to the middle of the frame.
const CARD_W = 920;
const CARD_H = 680;
const PAD = 52;
const BTN_H = 96;

const Glyph: React.FC = () => (
  <svg width={240} height={240} viewBox="0 0 240 240">
    <defs>
      <linearGradient id="glyph" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0%" stopColor="#34C759" />
        <stop offset="100%" stopColor="#0A84FF" />
      </linearGradient>
    </defs>
    <rect x={14} y={14} width={212} height={212} rx={64} fill="none" stroke="url(#glyph)" strokeWidth={22} />
    <circle cx={120} cy={120} r={50} fill="none" stroke="url(#glyph)" strokeWidth={22} />
    <circle cx={176} cy={64} r={14} fill="url(#glyph)" />
  </svg>
);

const Stat: React.FC<{ value: number; label: string }> = ({ value, label }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
    <div
      style={{
        fontSize: 66,
        fontWeight: 700,
        letterSpacing: "-0.04em",
        color: "#1D1D1F",
        fontVariantNumeric: "tabular-nums",
        lineHeight: 1.05,
      }}
    >
      {ruNumber(value)}
    </div>
    <div style={{ fontSize: 34, fontWeight: 500, color: "#86868B", letterSpacing: "-0.01em" }}>
      {label}
    </div>
  </div>
);

export const S12Profile: React.FC<{ profile: Profile }> = ({ profile }) => {
  const frame = useCurrentFrame();
  const count = interpolate(frame, [34, 66], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const followed = interpolate(frame, [120, 127], [0, 1], clamp);
  const press = interpolate(frame, [114, 118, 126], [1, 0.94, 1], clamp);
  const tap = interpolate(frame, [115, 135], [0, 1], clamp);
  const restFade = interpolate(frame, [148, 168], [1, 0], clamp);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", fontFamily: sans }}>
      {/* Instagram-like glyph that opens into the profile card */}
      <Interactive.Div
        name="Glyph"
        style={{
          position: "absolute",
          opacity: interpolate(frame, [0, 6, 18, 30], [0, 1, 1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(frame, [0, 14, 18, 32], [0.3, 1, 1, 2.6], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: [
              Easing.spring({ damping: 11 }),
              Easing.linear,
              Easing.bezier(0.7, 0, 0.84, 0),
            ],
            output: "perceptual-scale",
          }),
          filter: `blur(${interpolate(frame, [18, 32], [0, 18], clamp)}px)`,
        }}
      >
        <Glyph />
      </Interactive.Div>

      {/* Camera */}
      <div
        style={{
          width: CARD_W,
          height: CARD_H,
          scale: `${
            interpolate(frame, [20, 44], [0.82, 1], {
              ...clamp,
              easing: Easing.spring({ damping: 14 }),
            }) *
            interpolate(frame, [82, 110], [1, 1.4], {
              ...clamp,
              easing: Easing.bezier(0.65, 0, 0.35, 1),
            })
          }`,
          translate: `${interpolate(frame, [82, 110], [0, 291.9], {
            ...clamp,
            easing: Easing.bezier(0.65, 0, 0.35, 1),
          })}px ${interpolate(frame, [82, 110], [0, -336], {
            ...clamp,
            easing: Easing.bezier(0.65, 0, 0.35, 1),
          })}px`,
          opacity: interpolate(frame, [20, 30], [0, 1], clamp),
        }}
      >
        {/* Card surface */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 56,
            background: "#FFFFFF",
            border: "2px solid rgba(29,29,31,0.06)",
            boxShadow: "0 40px 100px rgba(0,0,0,0.12), 0 4px 14px rgba(0,0,0,0.05)",
            opacity: restFade,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            padding: PAD,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 40, opacity: restFade }}>
            <Avatar size={190} />
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div
                style={{
                  fontSize: 72,
                  fontWeight: 700,
                  letterSpacing: "-0.045em",
                  color: "#1D1D1F",
                  lineHeight: 1,
                }}
              >
                {profile.name}
              </div>
              <div style={{ fontSize: 36, fontWeight: 500, color: "#86868B" }}>
                Моушн · Дизайн · Идеи
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 34,
              paddingTop: 26,
              borderTop: "2px solid #EFEFF4",
              opacity: restFade,
            }}
          >
            <Stat
              value={profile.posts * count}
              label={ruPlural(profile.posts, "публикация", "публикации", "публикаций")}
            />
            <Stat
              value={profile.followers * count}
              label={ruPlural(profile.followers, "подписчик", "подписчика", "подписчиков")}
            />
            <Stat value={profile.following * count} label="подписки" />
          </div>
          <div
            style={{
              marginTop: 26,
              fontSize: 38,
              fontWeight: 500,
              letterSpacing: "-0.02em",
              color: "#1D1D1F",
              whiteSpace: "nowrap",
              opacity: restFade,
            }}
          >
            {profile.bio}
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ display: "flex", gap: 18, height: BTN_H }}>
            <div
              style={{
                position: "relative",
                flex: 1,
                borderRadius: 22,
                overflow: "hidden",
                background: interpolateColors(followed, [0, 1], ["#0A84FF", "#28B84D"]),
                scale: `${press}`,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#FFFFFF",
                fontSize: 38,
                fontWeight: 600,
                letterSpacing: "-0.02em",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  width: 300,
                  height: 300,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.45)",
                  translate: "-50% -50%",
                  scale: `${tap}`,
                  opacity: tap > 0 ? 1 - tap : 0,
                }}
              />
              <span
                style={{
                  position: "absolute",
                  opacity: 1 - followed,
                  translate: `0px ${-followed * 30}px`,
                }}
              >
                Подписаться
              </span>
              <span
                style={{
                  position: "absolute",
                  opacity: followed,
                  translate: `0px ${(1 - followed) * 30}px`,
                }}
              >
                ✓ Вы подписаны
              </span>
            </div>
            <div
              style={{
                flex: 1,
                borderRadius: 22,
                background: "#EFEFF4",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#1D1D1F",
                fontSize: 38,
                fontWeight: 600,
                letterSpacing: "-0.02em",
                opacity: restFade,
              }}
            >
              Сообщение
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
