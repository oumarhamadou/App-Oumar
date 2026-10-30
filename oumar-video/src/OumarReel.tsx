import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { GridBg } from "./components/GridBg";
import { Profile } from "./profile";
import { S1NewBeginning } from "./scenes/S1NewBeginning";
import { S2Wheel } from "./scenes/S2Wheel";
import { S3Introducing } from "./scenes/S3Introducing";
import { S4Profile } from "./scenes/S4Profile";
import { S5Follow } from "./scenes/S5Follow";

// Edit follows the motion reference beat for beat (see src/timeline.ts):
// white grid intro → drop on the Instagram glyph → green profile card →
// tap on Follow → avatar loop → blue grid reveal.
export const OumarReel: React.FC<{ profile: Profile }> = ({ profile }) => {
  return (
    <AbsoluteFill>
      <GridBg variant="white" />
      <Sequence name="Новое начало" durationInFrames={60}>
        <S1NewBeginning />
      </Sequence>
      <Sequence name="Моушн · Дизайн · Идеи" from={60} durationInFrames={60}>
        <S2Wheel />
      </Sequence>
      <Sequence name="Представляю…" from={120} durationInFrames={104}>
        <S3Introducing />
      </Sequence>
      <Sequence name="Профиль" from={216} durationInFrames={152}>
        <S4Profile profile={profile} />
      </Sequence>
      <Sequence name="Подписка" from={352} durationInFrames={192}>
        <S5Follow profile={profile} />
      </Sequence>
      <Audio src={staticFile("audio/soundtrack.wav")} />
    </AbsoluteFill>
  );
};
