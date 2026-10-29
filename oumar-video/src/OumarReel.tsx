import { Audio } from "@remotion/media";
import React from "react";
import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  Sequence,
  Series,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { BUBBLES } from "./scenes/S07Clearer";
import { GridBg } from "./components/GridBg";
import { Profile } from "./profile";
import { S01Attention } from "./scenes/S01Attention";
import { S02EverySecond } from "./scenes/S02EverySecond";
import { S03Audience } from "./scenes/S03Audience";
import { S04Countdown } from "./scenes/S04Countdown";
import { S05Losing } from "./scenes/S05Losing";
import { S06Leaders } from "./scenes/S06Leaders";
import { S07Clearer } from "./scenes/S07Clearer";
import { S08Clarity } from "./scenes/S08Clarity";
import { S09NewBeginning } from "./scenes/S09NewBeginning";
import { S10Wheel } from "./scenes/S10Wheel";
import { S11NewPage } from "./scenes/S11NewPage";
import { S12Profile } from "./scenes/S12Profile";
import { S13Finale } from "./scenes/S13Finale";

// Part 1 (frames 0–825): the message, played inside a white-grid card that
// floats on a green grid — then the card opens to full screen at frame 690.
// Part 2 (frames 825–1365): the Instagram page intro, profile card and finale.
const CORE = 825;
const CLARITY_AT = 690;
const BUBBLES_AT = 570;
const PROFILE_AT = 1050;

const Sfx: React.FC<{ at: number; file: string; volume: number }> = ({
  at,
  file,
  volume,
}) => (
  <Sequence from={at} durationInFrames={60} layout="none">
    <Audio src={staticFile(`sfx/${file}.wav`)} volume={volume} />
  </Sequence>
);

export const OumarReel: React.FC<{ profile: Profile }> = ({ profile }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: "#FFFFFF" }}>
      <Sequence name="Message" durationInFrames={CORE}>
        <GridBg variant="green" />
        <Interactive.Div
          name="Card"
          style={{
            position: "absolute",
            left: interpolate(frame, [690, 714], [80, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.83, 0, 0.17, 1),
            }),
            right: interpolate(frame, [690, 714], [80, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.83, 0, 0.17, 1),
            }),
            top: interpolate(frame, [690, 714], [140, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.83, 0, 0.17, 1),
            }),
            bottom: interpolate(frame, [690, 714], [140, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.83, 0, 0.17, 1),
            }),
            borderRadius: interpolate(frame, [690, 714], [64, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.83, 0, 0.17, 1),
            }),
            overflow: "hidden",
            boxShadow: "0 50px 120px rgba(8,90,30,0.30), 0 6px 20px rgba(8,90,30,0.12)",
            translate: interpolate(frame, [0, 26], ["0px 260px", "0px 0px"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
            scale: interpolate(frame, [0, 26], [0.9, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
              output: "perceptual-scale",
            }),
            opacity: interpolate(frame, [0, 10], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <GridBg variant="white" />
          <Series>
            <Series.Sequence name="Внимание — дорого" durationInFrames={90}>
              <S01Attention />
            </Series.Sequence>
            <Series.Sequence name="Каждая секунда" durationInFrames={75}>
              <S02EverySecond />
            </Series.Sequence>
            <Series.Sequence name="Аудитория" durationInFrames={120}>
              <S03Audience />
            </Series.Sequence>
            <Series.Sequence name="3 секунды" durationInFrames={75}>
              <S04Countdown />
            </Series.Sequence>
            <Series.Sequence name="Теряете" durationInFrames={120}>
              <S05Losing />
            </Series.Sequence>
            <Series.Sequence name="Не громче" durationInFrames={90}>
              <S06Leaders />
            </Series.Sequence>
            <Series.Sequence name="Пузыри" durationInFrames={120}>
              <S07Clearer />
            </Series.Sequence>
            <Series.Sequence name="Ясность" durationInFrames={135}>
              <S08Clarity />
            </Series.Sequence>
          </Series>
        </Interactive.Div>
      </Sequence>

      <Sequence name="Instagram" from={CORE} durationInFrames={540}>
        <GridBg variant="white" />
        <Series>
          <Series.Sequence name="Новое начало" durationInFrames={60}>
            <S09NewBeginning />
          </Series.Sequence>
          <Series.Sequence name="Моушн Дизайн Идеи" durationInFrames={75}>
            <S10Wheel />
          </Series.Sequence>
          <Series.Sequence name="Новая страница" durationInFrames={90}>
            <S11NewPage />
          </Series.Sequence>
          <Series.Sequence name="Профиль" durationInFrames={180}>
            <S12Profile profile={profile} />
          </Series.Sequence>
          <Series.Sequence name="Финал" durationInFrames={135}>
            <S13Finale profile={profile} />
          </Series.Sequence>
        </Series>
      </Sequence>

      {/* Sound design */}
      <Sfx at={0} file="whoosh" volume={0.45} />
      <Sfx at={235} file="switch" volume={0.3} />
      {BUBBLES.map((b) => (
        <Sfx key={b.text} at={BUBBLES_AT + b.at} file="switch" volume={0.3} />
      ))}
      <Sfx at={CLARITY_AT} file="whoosh" volume={0.4} />
      <Sfx at={CORE} file="whoosh" volume={0.35} />
      <Sfx at={PROFILE_AT} file="page-turn" volume={0.35} />
      <Sfx at={PROFILE_AT + 115} file="mouse-click" volume={0.6} />
      <Sfx at={PROFILE_AT + 121} file="ding" volume={0.3} />
      <Sfx at={PROFILE_AT + 180 + 38} file="whoosh" volume={0.45} />
    </AbsoluteFill>
  );
};
