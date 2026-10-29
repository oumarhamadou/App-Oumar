import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  interpolateColors,
  useCurrentFrame,
} from "remotion";
import { Avatar } from "../components/Avatar";
import { GridBg } from "../components/GridBg";
import { Reveal } from "../components/Reveal";
import { Profile } from "../profile";
import { clamp, sans } from "../theme";

// Pill continues from the zoomed Follow button of the profile scene (1.4×).
const PILL_W = 559;
const PILL_H = 134;
const expand = Easing.bezier(0.83, 0, 0.17, 1);

export const S13Finale: React.FC<{ profile: Profile }> = ({ profile }) => {
  const frame = useCurrentFrame();
  const grow = interpolate(frame, [40, 66], [0, 1], { ...clamp, easing: expand });
  const toName = interpolate(frame, [20, 28], [0, 1], clamp);
  const drop = interpolate(frame, [4, 26], [0, 1], {
    ...clamp,
    easing: Easing.spring({ damping: 11, stiffness: 120 }),
  });

  const w = PILL_W + 60 * toName + (1080 - PILL_W - 60) * grow;
  const h = PILL_H + (1920 - PILL_H) * grow;
  const radius = interpolate(frame, [0, 8], [31, 67], clamp) * (1 - grow);

  // Avatar: drops into the pill, then rises to the top of the final card.
  const pillLeft = 540 - w / 2;
  const avSize = 112 + (300 - 112) * grow;
  const avX = (pillLeft + 11 + 56) * (1 - grow) + 540 * grow;
  const avY = (-200 + (960 + 200) * drop) * (1 - grow) + 640 * grow;

  return (
    <AbsoluteFill style={{ fontFamily: sans }}>
      <div
        style={{
          position: "absolute",
          left: 540 - w / 2,
          top: 960 - h / 2,
          width: w,
          height: h,
          borderRadius: radius,
          overflow: "hidden",
          background: interpolateColors(toName, [0, 1], ["#28B84D", "#0A84FF"]),
          boxShadow: `0 ${20 * toName * (1 - grow)}px ${50 * toName * (1 - grow)}px rgba(10,132,255,0.3)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: -(540 - w / 2),
            top: -(960 - h / 2),
            width: 1080,
            height: 1920,
            opacity: grow,
          }}
        >
          <GridBg variant="blue" />
        </div>
      </div>

      {/* Pill label: "Вы подписаны" → name */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 960 - 40,
          height: 80,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#FFFFFF",
          fontSize: 53,
          fontWeight: 600,
          letterSpacing: "-0.02em",
          opacity: 1 - toName,
        }}
      >
        ✓ Вы подписаны
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 860 - 60 * grow,
          height: 200,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          translate: `${48 * (1 - grow)}px 0px`,
          color: "#FFFFFF",
          fontSize: 56 + (150 - 56) * grow,
          fontWeight: 700,
          letterSpacing: "-0.045em",
          opacity: toName,
        }}
      >
        {profile.name}
      </div>

      <div
        style={{
          position: "absolute",
          left: avX - avSize / 2,
          top: avY - avSize / 2,
          opacity: interpolate(frame, [4, 8], [0, 1], clamp),
        }}
      >
        <Avatar size={avSize} ring={false} border={Math.max(5, avSize * 0.03)} />
      </div>

      {/* Final words */}
      <AbsoluteFill
        style={{
          top: 1080,
          alignItems: "center",
          color: "#FFFFFF",
          textAlign: "center",
          scale: `${interpolate(frame, [70, 135], [1, 1.03], clamp)}`,
        }}
      >
        <Reveal delay={66} dy={30}>
          <div style={{ fontSize: 60, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1.2 }}>
            Ты становишься тем,
            <br />
            что повторяешь ⚡
          </div>
        </Reveal>
        <Reveal delay={78} dy={30}>
          <div
            style={{
              marginTop: 56,
              padding: "20px 44px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.18)",
              border: "2px solid rgba(255,255,255,0.35)",
              fontSize: 40,
              fontWeight: 600,
              letterSpacing: "-0.01em",
            }}
          >
            Моушн · Дизайн · Идеи
          </div>
        </Reveal>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
