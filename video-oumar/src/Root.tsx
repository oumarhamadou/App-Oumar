import React from "react";
import { Composition, Folder } from "remotion";
import { fontsLoaded } from "./fonts";
import { CalendarScene } from "./scenes/CalendarScene";
import { ChallengeScene } from "./scenes/ChallengeScene";
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
import { FPS, HEIGHT, scene, SceneId, TOTAL_FRAMES, WIDTH } from "./timeline";
import { Video } from "./Video";

// Make sure Inter is ready before any frame is captured.
void fontsLoaded;

const SCENE_COMPONENTS: [SceneId, React.FC][] = [
  ["intro", IntroScene],
  ["name", NameScene],
  ["challenge", ChallengeScene],
  ["stepper", StepperScene],
  ["years", YearsScene],
  ["prompt", PromptScene],
  ["dropdown", DropdownScene],
  ["segmented", SegmentedScene],
  ["messages", MessagesScene],
  ["platforms", PlatformsScene],
  ["keep", KeepScene],
  ["client", ClientScene],
  ["calendar", CalendarScene],
  ["exciting", ExcitingScene],
];

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="VideoOumar"
        component={Video}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{
          signature: "Oumar",
          tagline: "motion designer · jour 1",
          musicVolume: 0.45,
        }}
      />
      <Folder name="Scenes">
        {SCENE_COMPONENTS.map(([id, component]) => (
          <Composition
            key={id}
            id={`scene-${id}`}
            component={component}
            durationInFrames={scene(id).durationInFrames}
            fps={FPS}
            width={WIDTH}
            height={HEIGHT}
          />
        ))}
        <Composition
          id="scene-outro"
          component={OutroScene}
          durationInFrames={scene("outro").durationInFrames}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
          defaultProps={{ signature: "Oumar", tagline: "motion designer · jour 1" }}
        />
      </Folder>
    </>
  );
};
