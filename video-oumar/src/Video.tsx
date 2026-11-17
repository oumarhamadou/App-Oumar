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
import { Copy, Lang, LangContext, LOCALES } from "./locales";
import { SceneId, Timeline } from "./timeline";

export type VideoProps = {
  lang: Lang;
  signature: string;
  tagline: string;
  musicVolume: number;
};

const Scene: React.FC<{
  id: SceneId;
  timeline: Timeline;
  children: React.ReactNode;
}> = ({ id, timeline, children }) => {
  const s = timeline.scene(id);
  return (
    <Sequence name={id} from={s.from} durationInFrames={s.durationInFrames}>
      {children}
    </Sequence>
  );
};

type Sfx = {
  src: string;
  at: number;
  volume: number;
  durationInFrames?: number;
};

/** Overall level of the sound effects relative to the narration. */
const SFX_GAIN = 1.7;

const typing = (timeline: Timeline, id: SceneId): Sfx => {
  const s = timeline.scene(id);
  const first = s.words[0];
  const last = s.words[s.words.length - 1];
  return {
    src: "sfx/typing.wav",
    at: s.from + first.at,
    volume: 0.32,
    durationInFrames: last.end - first.at + 2,
  };
};

const buildSfx = (timeline: Timeline, copy: Copy): Sfx[] => {
  const { scene, wordAbs } = timeline;
  const menu = copy.prompt.menuWords;
  const bubbles = copy.messages.bubbles;
  const platforms = copy.platforms.platformWords;
  const [, keep2, keep3] = copy.keep.phases;
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
  const stepperReached = stepper.words[copy.stepper.countUntilWord].end;
  return [
    ...whooshAt.map((id) => ({
      src: "sfx/whoosh.wav",
      at: scene(id).from - 4,
      volume: 0.32,
    })),
    {
      src: "sfx/whoosh.wav",
      at: wordAbs("keep", keep2.startWord) - 6,
      volume: 0.32,
    },
    {
      src: "sfx/whoosh.wav",
      at: wordAbs("keep", keep3.startWord) - 6,
      volume: 0.25,
    },
    // Intro emojis
    ...[0, 5, 9, 13].map((f) => ({
      src: "sfx/pop.wav",
      at: f + 1,
      volume: 0.2,
    })),
    // Stepper "+" press
    {
      src: "sfx/mouse-click.wav",
      at: stepper.from + stepperReached - 3,
      volume: 0.45,
    },
    // Typing
    typing(timeline, "years"),
    typing(timeline, "prompt"),
    // Dropdown: click Flash, highlight moves
    { src: "sfx/mouse-click.wav", at: scene("dropdown").from, volume: 0.45 },
    {
      src: "sfx/switch.wav",
      at: wordAbs("dropdown", menu[1]) - 2,
      volume: 0.22,
    },
    {
      src: "sfx/switch.wav",
      at: wordAbs("dropdown", menu[2]) - 2,
      volume: 0.22,
    },
    // Segmented control
    { src: "sfx/switch.wav", at: wordAbs("segmented", 2) - 3, volume: 0.25 },
    { src: "sfx/switch.wav", at: wordAbs("segmented", 4) - 3, volume: 0.25 },
    // Messages
    {
      src: "sfx/pop.wav",
      at: wordAbs("messages", bubbles[0].word) - 4,
      volume: 0.45,
    },
    {
      src: "sfx/pop.wav",
      at: wordAbs("messages", bubbles[1].word) - 4,
      volume: 0.45,
    },
    // Platforms
    {
      src: "sfx/pop.wav",
      at: wordAbs("platforms", copy.platforms.line2.word) + 2,
      volume: 0.35,
    },
    {
      src: "sfx/mouse-click.wav",
      at: wordAbs("platforms", platforms[1]) - 4,
      volume: 0.5,
    },
    {
      src: "sfx/mouse-click.wav",
      at: wordAbs("platforms", platforms[2]) - 4,
      volume: 0.5,
    },
    // Calendar "?"
    {
      src: "sfx/pop.wav",
      at: wordAbs("calendar", copy.calendar.question) - 3,
      volume: 0.45,
    },
  ];
};

export const Video: React.FC<VideoProps> = ({
  lang,
  signature,
  tagline,
  musicVolume,
}) => {
  const { timeline, copy, audio } = LOCALES[lang];
  const outroFrom = timeline.scene("outro").from;
  const total = timeline.totalFrames;
  return (
    <LangContext.Provider value={lang}>
      <AbsoluteFill style={{ backgroundColor: "black" }}>
        <Scene timeline={timeline} id="intro">
          <IntroScene />
        </Scene>
        <Scene timeline={timeline} id="name">
          <NameScene />
        </Scene>
        <Scene timeline={timeline} id="challenge">
          <ChallengeScene />
        </Scene>
        <Scene timeline={timeline} id="stepper">
          <StepperScene />
        </Scene>
        <Scene timeline={timeline} id="years">
          <YearsScene />
        </Scene>
        <Scene timeline={timeline} id="prompt">
          <PromptScene />
        </Scene>
        <Scene timeline={timeline} id="dropdown">
          <DropdownScene />
        </Scene>
        <Scene timeline={timeline} id="segmented">
          <SegmentedScene />
        </Scene>
        <Scene timeline={timeline} id="messages">
          <MessagesScene />
        </Scene>
        <Scene timeline={timeline} id="platforms">
          <PlatformsScene />
        </Scene>
        <Scene timeline={timeline} id="keep">
          <KeepScene />
        </Scene>
        <Scene timeline={timeline} id="client">
          <ClientScene />
        </Scene>
        <Scene timeline={timeline} id="calendar">
          <CalendarScene />
        </Scene>
        <Scene timeline={timeline} id="exciting">
          <ExcitingScene />
        </Scene>
        <Scene timeline={timeline} id="outro">
          <OutroScene signature={signature} tagline={tagline} />
        </Scene>

        <Audio name="Voix off" src={staticFile(audio)} />
        <Audio
          name="Musique"
          src={staticFile("music/fond.mp3")}
          durationInFrames={total}
          volume={(f) =>
            musicVolume *
            interpolate(
              f,
              [0, 12, outroFrom - 6, outroFrom + 10, total - 30, total],
              [0, 0.55, 0.55, 1.25, 1.25, 0],
              CLAMP,
            )
          }
        />
        {buildSfx(timeline, copy).map((s, i) => (
          <Sequence
            key={i}
            name={`SFX ${s.src.replace("sfx/", "")}`}
            from={Math.max(0, s.at)}
            durationInFrames={s.durationInFrames}
          >
            <Audio
              src={staticFile(s.src)}
              volume={Math.min(1, s.volume * SFX_GAIN)}
            />
          </Sequence>
        ))}
      </AbsoluteFill>
    </LangContext.Provider>
  );
};
