import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, interpolate, Sequence, staticFile } from "remotion";
import { CLAMP } from "./anim";
import { ChallengeScene } from "./scenes/ChallengeScene";
import { CalendarScene } from "./scenes/CalendarScene";
import { ClientScene } from "./scenes/ClientScene";
import { DropdownScene } from "./scenes/DropdownScene";
import { ExcitingScene } from "./scenes/ExcitingScene";
import { IntroScene } from "./scenes/IntroScene";
import { KeepScene } from "./scenes/KeepScene";
import { MessagesScene } from "./scenes/MessagesScene";
import { NameScene } from "./scenes/NameScene";
import { OutroScene } from "./scenes/OutroScene";
import { PlatformsScene } from "./scenes/PlatformsScene";
import { PromptScene } from "./scenes/PromptScene";
import { SegmentedScene } from "./scenes/SegmentedScene";
import { StepperScene } from "./scenes/StepperScene";
import { YearsScene } from "./scenes/YearsScene";
import { scene, SceneId, TOTAL_FRAMES, wordAbs } from "./timeline";

export type VideoProps = {
  signature: string;
  tagline: string;
  musicVolume: number;
};

const Scene: React.FC<{ id: SceneId; children: React.ReactNode }> = ({ id, children }) => {
  const s = scene(id);
  return (
    <Sequence name={id} from={s.from} durationInFrames={s.durationInFrames}>
      {children}
    </Sequence>
  );
};

type Sfx = { src: string; at: number; volume: number; durationInFrames?: number };

/** Overall level of the sound effects relative to the narration. */
const SFX_GAIN = 1.7;

const typing = (id: SceneId): Sfx => {
  const s = scene(id);
  const first = s.words[0];
  const last = s.words[s.words.length - 1];
  return {
    src: "sfx/typing.wav",
    at: s.from + first.at,
    volume: 0.32,
    durationInFrames: last.end - first.at + 2,
  };
};

const buildSfx = (): Sfx[] => {
  const whooshAt: SceneId[] = [
    "name",
    "challenge",
    "stepper",
    "years",
    "prompt",
    "segmented",
    "messages",
    "platforms",
    "client",
    "calendar",
    "exciting",
    "outro",
  ];
  const stepper = scene("stepper");
  return [
    ...whooshAt.map((id) => ({ src: "sfx/whoosh.wav", at: scene(id).from - 4, volume: 0.32 })),
    { src: "sfx/whoosh.wav", at: wordAbs("keep", 5) - 6, volume: 0.32 },
    { src: "sfx/whoosh.wav", at: wordAbs("keep", 8) - 6, volume: 0.25 },
    // Intro emojis
    ...[0, 5, 9, 13].map((f) => ({ src: "sfx/pop.wav", at: f + 1, volume: 0.2 })),
    // Stepper "+" press
    { src: "sfx/mouse-click.wav", at: stepper.from + stepper.words[2].end - 3, volume: 0.45 },
    // Typing
    typing("years"),
    typing("prompt"),
    // Dropdown: click Flash, highlight moves
    { src: "sfx/mouse-click.wav", at: scene("dropdown").from, volume: 0.45 },
    { src: "sfx/switch.wav", at: wordAbs("dropdown", 1) - 2, volume: 0.22 },
    { src: "sfx/switch.wav", at: wordAbs("dropdown", 2) - 2, volume: 0.22 },
    // Segmented control
    { src: "sfx/switch.wav", at: wordAbs("segmented", 2) - 3, volume: 0.25 },
    { src: "sfx/switch.wav", at: wordAbs("segmented", 4) - 3, volume: 0.25 },
    // Messages
    { src: "sfx/pop.wav", at: wordAbs("messages", 0) - 4, volume: 0.45 },
    { src: "sfx/pop.wav", at: wordAbs("messages", 3) - 4, volume: 0.45 },
    // Platforms
    { src: "sfx/pop.wav", at: wordAbs("platforms", 3) + 6, volume: 0.35 },
    { src: "sfx/mouse-click.wav", at: wordAbs("platforms", 8) - 4, volume: 0.5 },
    { src: "sfx/mouse-click.wav", at: wordAbs("platforms", 10) - 4, volume: 0.5 },
    // Calendar "?"
    { src: "sfx/pop.wav", at: wordAbs("calendar", 10) - 3, volume: 0.45 },
  ];
};

export const Video: React.FC<VideoProps> = ({ signature, tagline, musicVolume }) => {
  const outroFrom = scene("outro").from;
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Scene id="intro">
        <IntroScene />
      </Scene>
      <Scene id="name">
        <NameScene />
      </Scene>
      <Scene id="challenge">
        <ChallengeScene />
      </Scene>
      <Scene id="stepper">
        <StepperScene />
      </Scene>
      <Scene id="years">
        <YearsScene />
      </Scene>
      <Scene id="prompt">
        <PromptScene />
      </Scene>
      <Scene id="dropdown">
        <DropdownScene />
      </Scene>
      <Scene id="segmented">
        <SegmentedScene />
      </Scene>
      <Scene id="messages">
        <MessagesScene />
      </Scene>
      <Scene id="platforms">
        <PlatformsScene />
      </Scene>
      <Scene id="keep">
        <KeepScene />
      </Scene>
      <Scene id="client">
        <ClientScene />
      </Scene>
      <Scene id="calendar">
        <CalendarScene />
      </Scene>
      <Scene id="exciting">
        <ExcitingScene />
      </Scene>
      <Scene id="outro">
        <OutroScene signature={signature} tagline={tagline} />
      </Scene>

      <Audio name="Voix off" src={staticFile("voiceover/voix-oumar.mp3")} />
      <Audio
        name="Musique"
        src={staticFile("music/fond.mp3")}
        durationInFrames={TOTAL_FRAMES}
        volume={(f) =>
          musicVolume *
          interpolate(
            f,
            [0, 12, outroFrom - 6, outroFrom + 10, TOTAL_FRAMES - 30, TOTAL_FRAMES],
            [0, 0.55, 0.55, 1.25, 1.25, 0],
            CLAMP,
          )
        }
      />
      {buildSfx().map((s, i) => (
        <Sequence key={i} name={`SFX ${s.src.replace("sfx/", "")}`} from={Math.max(0, s.at)} durationInFrames={s.durationInFrames}>
          <Audio src={staticFile(s.src)} volume={Math.min(1, s.volume * SFX_GAIN)} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
