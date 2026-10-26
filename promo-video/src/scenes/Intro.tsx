import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { glide } from "../anim";
import { Avatar } from "../components/Avatar";
import { Mist } from "../components/Backgrounds";
import { InstagramGlyph } from "../components/Icons";
import { GradientLetters, Words } from "../components/Text";
import { Chip, Cursor, LiveDot, PillButton } from "../components/UI";
import { C, DISPLAY, TEXT } from "../theme";
import type { PromoProps } from "../schema";

export const INTRO_DURATION = 236;
export const INTRO_CLICK = 190;

// Every position is laid out by hand so the camera can aim at exact points.
const LAYOUT = {
  landscape: {
    avatar: { size: 420, x: 395, y: 330 },
    status: { x: 605, y: 716 },
    textX: 905,
    align: "flex-start" as const,
    textWidth: 860,
    eyebrowY: 222,
    greetingY: 314,
    nameY: 368,
    roleY: 578,
    buttonY: 662,
    nameSize: 196,
    cursorFrom: [1560, 1180] as [number, number],
    cursorTo: [1135, 714] as [number, number],
    button: { x: 905, y: 662, w: 560 },
  },
  portrait: {
    avatar: { size: 470, x: 305, y: 540 },
    status: { x: 540, y: 980 },
    textX: 80,
    align: "center" as const,
    textWidth: 920,
    eyebrowY: 360,
    greetingY: 1090,
    nameY: 1150,
    roleY: 1372,
    buttonY: 1460,
    nameSize: 210,
    cursorFrom: [960, 2040] as [number, number],
    cursorTo: [560, 1512] as [number, number],
    button: { x: 240, y: 1460, w: 600 },
  },
};

export const Intro: React.FC<PromoProps> = ({
  name,
  role,
  greeting,
  buttonLabel,
  availability,
  experience,
  instagram,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const v = height > width;
  const L = v ? LAYOUT.portrait : LAYOUT.landscape;
  const stage = v ? 1.04 : 1.12;
  const cx = width / 2;
  const cy = height / 2;
  // The button's rectangle on screen, once the stage scale is applied.
  const bx = cx + (L.button.x - cx) * stage;
  const by = cy + (L.button.y - cy) * stage;
  const bw = L.button.w * stage;
  const bh = 96 * stage;
  const avatarCenter = [
    L.avatar.x + L.avatar.size / 2,
    L.avatar.y + L.avatar.size / 2,
  ];

  // Camera: lean in on the portrait, settle back, then the clicked button
  // grows into the next (black) screen.
  const lean = glide(frame, 112, 30) - glide(frame, 156, 26);
  const morph = interpolate(frame, [194, 220], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.7, 0, 0.2, 1),
  });
  const push = glide(frame, 192, 30);
  const textCenter = v
    ? { justifyContent: "center", textAlign: "center" as const }
    : {};

  return (
    <AbsoluteFill style={{ backgroundColor: C.mist }}>
      <AbsoluteFill
        style={{
          transformOrigin: `${bx + bw / 2}px ${by + bh / 2}px`,
          scale: `${1 + push * 0.12}`,
        }}
      >
        <Mist />
        <AbsoluteFill style={{ scale: `${stage}` }}>
          <AbsoluteFill
            style={{
              transformOrigin: `${avatarCenter[0]}px ${avatarCenter[1]}px`,
              scale: `${1 + lean * 0.16}`,
              translate: `${lean * (v ? 0 : 120)}px ${lean * (v ? 60 : 20)}px`,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: L.avatar.x,
                top: L.avatar.y,
              }}
            >
              <Avatar size={L.avatar.size} start={26} />
            </div>

            <Chip
              start={96}
              style={{
                left: L.status.x,
                top: L.status.y,
                marginLeft: -150,
                minWidth: 300,
                justifyContent: "center",
              }}
            >
              <LiveDot size={16} />
              {availability}
            </Chip>

            <div
              style={{
                position: "absolute",
                left: L.textX,
                top: L.eyebrowY,
                width: L.textWidth,
                display: "flex",
                justifyContent: L.align,
                gap: 16,
              }}
            >
              <Chip start={84} style={{ position: "relative" }}>
                <InstagramGlyph size={32} color={C.ink} />
                {instagram}
              </Chip>
              {experience ? (
                <Chip start={92} style={{ position: "relative" }}>
                  <span style={{ fontWeight: 700 }}>★</span>
                  {experience}
                </Chip>
              ) : null}
            </div>

            <div
              style={{
                position: "absolute",
                left: L.textX,
                top: L.greetingY,
                width: L.textWidth,
              }}
            >
              <Words
                text={greeting}
                start={30}
                stagger={4}
                style={{
                  fontFamily: DISPLAY,
                  fontWeight: 500,
                  fontSize: 60,
                  letterSpacing: "-0.025em",
                  color: C.graphite,
                  ...textCenter,
                }}
              />
            </div>

            <div
              style={{
                position: "absolute",
                left: L.textX,
                top: L.nameY,
                width: L.textWidth,
              }}
            >
              <GradientLetters
                text={name}
                start={38}
                stagger={3}
                style={{
                  fontFamily: DISPLAY,
                  fontWeight: 800,
                  fontSize: L.nameSize,
                  lineHeight: 1,
                  letterSpacing: "-0.05em",
                  justifyContent: L.align,
                }}
              />
            </div>

            <div
              style={{
                position: "absolute",
                left: L.textX,
                top: L.roleY,
                width: L.textWidth,
              }}
            >
              <Words
                text={role}
                start={54}
                stagger={4}
                style={{
                  fontFamily: TEXT,
                  fontWeight: 500,
                  fontSize: 46,
                  letterSpacing: "-0.02em",
                  color: C.ink,
                  ...textCenter,
                }}
              />
            </div>

            <div
              style={{
                position: "absolute",
                left: L.textX,
                top: L.buttonY,
                width: L.textWidth,
                display: "flex",
                justifyContent: L.align,
              }}
            >
              <PillButton
                label={buttonLabel}
                start={66}
                pressAt={INTRO_CLICK}
                minWidth={L.button.w}
              />
            </div>
          </AbsoluteFill>

          <AbsoluteFill
            style={{
              opacity: interpolate(frame, [196, 206], [1, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            <Cursor
              from={L.cursorFrom}
              to={L.cursorTo}
              start={156}
              arrive={186}
              clickAt={INTRO_CLICK}
              size={50}
            />
          </AbsoluteFill>
        </AbsoluteFill>
        <div
          style={{
            position: "absolute",
            left: bx * (1 - morph),
            top: by * (1 - morph),
            width: bw + (width - bw) * morph,
            height: bh + (height - bh) * morph,
            borderRadius: (bh / 2) * (1 - morph),
            backgroundColor: C.ink,
            boxShadow: `0 0 ${60 + 140 * morph}px rgba(162,89,255,${0.45 * (1 - morph)})`,
            opacity: interpolate(frame, [194, 199, 222, 230], [0, 1, 1, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        />
        <AbsoluteFill
          style={{
            backgroundColor: C.black,
            opacity: interpolate(frame, [214, 224], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
