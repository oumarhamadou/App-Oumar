import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { GridBg } from "../components/GridBg";
import { Line, Word } from "../components/Reveal";
import { Profile, ruNumber, ruPlural } from "../profile";
import { clamp, easeInOut, easeOut, expoInOut, lerp, sans } from "../theme";
import { AVATAR, CARD, FOLLOW, T, ZOOM, ZOOM_SHIFT } from "../timeline";

// Local frames (scene starts at T.profile = 216):
//   4  glyph appears tiny in the break · 8 drop → glyph pops
//  18  green card grows out of the glyph · 30–70 card content builds
//  72  slow push-in · 104–124 zoom onto Follow · 126–134 tap → "Вы подписаны"
// 136  impact: card floods the screen (hand-off to the follow scene at 152)
const START = T.profile;

const Glyph: React.FC<{ white: number }> = ({ white }) => (
  <svg width={240} height={240} viewBox="0 0 240 240">
    <defs>
      <linearGradient id="glyph" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0%" stopColor="#34C759" />
        <stop offset="100%" stopColor="#0A84FF" />
      </linearGradient>
    </defs>
    {[
      { stroke: "url(#glyph)", opacity: 1 - white },
      { stroke: "#FFFFFF", opacity: white },
    ].map((g) => (
      <g key={g.stroke} opacity={g.opacity}>
        <rect x={14} y={14} width={212} height={212} rx={64} fill="none" stroke={g.stroke} strokeWidth={22} />
        <circle cx={120} cy={120} r={50} fill="none" stroke={g.stroke} strokeWidth={22} />
        <circle cx={176} cy={64} r={14} fill={g.stroke} />
      </g>
    ))}
  </svg>
);

const Stat: React.FC<{ at: number; value: number; label: string }> = ({
  at,
  value,
  label,
}) => {
  const frame = useCurrentFrame();
  const count = interpolate(frame, [at, at + 24], [0, 1], {
    ...clamp,
    easing: easeOut,
  });
  const show = interpolate(frame, [at, at + 10], [0, 1], { ...clamp, easing: easeOut });
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity: show,
        filter: `blur(${(1 - show) * 10}px)`,
        translate: `0px ${(1 - show) * 24}px`,
      }}
    >
      <div
        style={{
          fontSize: 62,
          fontWeight: 800,
          letterSpacing: "-0.045em",
          color: "#0B0B0C",
          fontVariantNumeric: "tabular-nums",
          lineHeight: 1.05,
        }}
      >
        {ruNumber(value * count)}
      </div>
      <div style={{ fontSize: 30, fontWeight: 500, color: "rgba(11,11,12,0.62)" }}>
        {label}
      </div>
    </div>
  );
};

export const S4Profile: React.FC<{ profile: Profile }> = ({ profile }) => {
  const frame = useCurrentFrame();

  // Camera
  const push = interpolate(frame, [72, 104], [1, 1.08], { ...clamp, easing: easeInOut });
  const zoom = interpolate(frame, [104, 124], [0, 1], { ...clamp, easing: expoInOut });
  const s = push + (ZOOM - 1.08) * zoom;
  const tx = ZOOM_SHIFT.x * zoom;
  const ty = ZOOM_SHIFT.y * zoom;

  // Card surface: grows out of the glyph, follows the camera, then floods.
  const grow = interpolate(frame, [18, 32], [0, 1], {
    ...clamp,
    easing: Easing.spring({ damping: 15, stiffness: 150 }),
  });
  const flood = interpolate(frame, [136, 152], [0, 1], { ...clamp, easing: expoInOut });
  const w0 = lerp(220, CARD.w, grow) * s;
  const h0 = lerp(220, CARD.h, grow) * s;
  const left = lerp(540 + tx - w0 / 2, 0, flood);
  const top = lerp(960 + ty - h0 / 2, 0, flood);
  const width = lerp(w0, 1080, flood);
  const height = lerp(h0, 1920, flood);
  const radius = lerp(lerp(64, CARD.r, grow) * s, 0, flood);

  // Tap on Follow
  const press = interpolate(frame, [126, 129, 134], [1, 0.93, 1], clamp);
  const followed = interpolate(frame, [128, 134], [0, 1], { ...clamp, easing: easeOut });
  const fadeRest = interpolate(frame, [136, 144], [1, 0], clamp);
  const followIn = interpolate(frame, [60, 72], [0, 1], { ...clamp, easing: easeOut });
  const messageIn = interpolate(frame, [66, 78], [0, 1], { ...clamp, easing: easeOut });
  const avatarIn = interpolate(frame, [34, 48], [0, 1], {
    ...clamp,
    easing: Easing.spring({ damping: 12, stiffness: 140 }),
  });

  return (
    <AbsoluteFill style={{ fontFamily: sans }}>
      {/* Card surface: a window onto a screen-fixed green grid */}
      <div
        style={{
          position: "absolute",
          left,
          top,
          width,
          height,
          borderRadius: radius,
          overflow: "hidden",
          opacity: interpolate(frame, [18, 20], [0, 1], clamp),
          boxShadow: `0 ${40 * (1 - flood)}px ${110 * (1 - flood)}px rgba(10,80,30,${0.28 * (1 - flood)})`,
        }}
      >
        <div style={{ position: "absolute", left: -left, top: -top, width: 1080, height: 1920 }}>
          <GridBg variant="green" frameOffset={START} />
        </div>
      </div>

      {/* Glyph: appears in the break, pops on the drop, then lifts away */}
      <div
        style={{
          position: "absolute",
          left: 540 - 120,
          top: 960 - 120,
          opacity:
            interpolate(frame, [4, 6], [0, 1], clamp) *
            interpolate(frame, [24, 34], [1, 0], clamp),
          scale: `${
            interpolate(frame, [4, 8, 18], [0.12, 0.22, 1], {
              ...clamp,
              easing: [Easing.linear, Easing.spring({ damping: 9, stiffness: 160 })],
            }) * interpolate(frame, [22, 34], [1, 0.35], { ...clamp, easing: easeInOut })
          }`,
          translate: `0px ${interpolate(frame, [22, 34], [0, -260], { ...clamp, easing: easeInOut })}px`,
          filter: `blur(${interpolate(frame, [26, 34], [0, 10], clamp)}px)`,
        }}
      >
        <Glyph white={interpolate(frame, [18, 24], [0, 1], clamp)} />
      </div>

      {/* Card content, in card space, moved by the camera */}
      <div
        style={{
          position: "absolute",
          left: 540 - CARD.w / 2,
          top: 960 - CARD.h / 2,
          width: CARD.w,
          height: CARD.h,
          scale: `${s}`,
          translate: `${tx}px ${ty}px`,
        }}
      >
        <div style={{ opacity: fadeRest }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 30 }}>
            <Line at={30}>
              <Word
                at={30}
                space={false}
                tint="#FFFFFF"
                style={{ fontSize: 56, fontWeight: 800, letterSpacing: "-0.045em", color: "#0B0B0C" }}
              >
                {profile.name}
              </Word>
            </Line>
          </div>
          <div
            style={{
              position: "absolute",
              left: AVATAR.left + AVATAR.size + 24,
              right: 40,
              top: AVATAR.top,
              height: AVATAR.size,
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <Stat
              at={40}
              value={profile.posts}
              label={ruPlural(profile.posts, "публикация", "публикации", "публикаций")}
            />
            <Stat
              at={44}
              value={profile.followers}
              label={ruPlural(profile.followers, "подписчик", "подписчика", "подписчиков")}
            />
            <Stat at={48} value={profile.following} label="подписки" />
          </div>
          <div style={{ position: "absolute", left: AVATAR.left, top: 344, fontSize: 38, fontWeight: 500, letterSpacing: "-0.02em" }}>
            {profile.bio.split(" ").map((word, i, all) => (
              <Word key={i} at={54 + i * 2} tint="#FFFFFF" space={i < all.length - 1} style={{ color: "#0B0B0C" }}>
                {word}
              </Word>
            ))}
          </div>
          {/* Message button */}
          <div
            style={{
              position: "absolute",
              left: FOLLOW.left + FOLLOW.w + 16,
              top: FOLLOW.top,
              width: FOLLOW.w,
              height: FOLLOW.h,
              borderRadius: FOLLOW.r,
              background: "rgba(255,255,255,0.92)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: FOLLOW.font,
              fontWeight: 600,
              color: "#0B0B0C",
              letterSpacing: "-0.02em",
              opacity: messageIn,
              clipPath: `inset(0 ${(1 - messageIn) * 100}% 0 0 round ${FOLLOW.r}px)`,
            }}
          >
            Сообщение
          </div>
        </div>

        {/* Avatar (handed to the follow scene at local frame 144) */}
        <div
          style={{
            position: "absolute",
            left: AVATAR.left,
            top: AVATAR.top,
            width: AVATAR.size,
            height: AVATAR.size,
            borderRadius: "50%",
            padding: 7,
            background: "#FFFFFF",
            boxShadow: "0 12px 30px rgba(0,60,20,0.25)",
            opacity: frame < 144 ? interpolate(frame, [34, 40], [0, 1], clamp) : 0,
            scale: `${0.4 + 0.6 * avatarIn}`,
            filter: `blur(${interpolate(frame, [34, 44], [12, 0], clamp)}px)`,
          }}
        >
          <Img
            src={staticFile("avatar.jpg")}
            style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", display: "block" }}
          />
        </div>

        {/* Follow button (handed to the follow scene at local frame 136) */}
        <div
          style={{
            position: "absolute",
            left: FOLLOW.left,
            top: FOLLOW.top,
            width: FOLLOW.w,
            height: FOLLOW.h,
            borderRadius: FOLLOW.r,
            background: "#0A84FF",
            overflow: "hidden",
            display: frame < 136 ? "block" : "none",
            opacity: followIn,
            clipPath: `inset(0 ${(1 - followIn) * 100}% 0 0 round ${FOLLOW.r}px)`,
            scale: `${press}`,
            color: "#FFFFFF",
            fontSize: FOLLOW.font,
            fontWeight: 600,
            letterSpacing: "-0.02em",
          }}
        >
          <div style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "center", alignItems: "center", opacity: 1 - followed, translate: `0px ${-followed * 26}px` }}>
            Подписаться
          </div>
          <div style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "center", alignItems: "center", opacity: followed, translate: `0px ${(1 - followed) * 26}px` }}>
            ✓ Вы подписаны
          </div>
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 260,
              height: 260,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.5)",
              translate: "-50% -50%",
              scale: `${interpolate(frame, [126, 134], [0, 1.6], clamp)}`,
              opacity: interpolate(frame, [126, 134], [1, 0], clamp) * (frame >= 126 ? 1 : 0),
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
