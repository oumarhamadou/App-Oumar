import React from "react";
import { Composition, Folder } from "remotion";
import { fontsLoaded } from "./fonts";
import { Lang, LangContext, LOCALES, withLang } from "./locales";
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
import { FPS, HEIGHT, SceneId, WIDTH } from "./timeline";
import { Video } from "./Video";

// Make sure Inter is ready before any frame is captured.
void fontsLoaded;

const SIGNATURE = "@oumar__hamadou";

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

// Scene previews in the Studio: French uses the components as-is (default language),
// Russian wraps them so they read the Russian timings and text.
const RU_SCENES: [SceneId, React.FC][] = SCENE_COMPONENTS.map(([id, C]) => [id, withLang("ru", C, id)]);

const OutroRu: React.FC<{ signature: string; tagline: string }> = (props) => (
  <LangContext.Provider value="ru">
    <OutroScene {...props} />
  </LangContext.Provider>
);

const sceneFolder = (lang: Lang, scenes: [SceneId, React.FC][]) =>
  scenes.map(([id, component]) => (
    <Composition
      key={id}
      id={`${lang}-${id}`}
      component={component}
      durationInFrames={LOCALES[lang].timeline.scene(id).durationInFrames}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  ));

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="VideoOumar-FR"
        component={Video}
        durationInFrames={LOCALES.fr.timeline.totalFrames}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{
          lang: "fr",
          signature: SIGNATURE,
          tagline: LOCALES.fr.copy.tagline,
          musicVolume: 0.45,
        }}
      />
      <Composition
        id="VideoOumar-RU"
        component={Video}
        durationInFrames={LOCALES.ru.timeline.totalFrames}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{
          lang: "ru",
          signature: SIGNATURE,
          tagline: LOCALES.ru.copy.tagline,
          musicVolume: 0.45,
        }}
      />
      <Folder name="Scenes-FR">
        {sceneFolder("fr", SCENE_COMPONENTS)}
        <Composition
          id="fr-outro"
          component={OutroScene}
          durationInFrames={LOCALES.fr.timeline.scene("outro").durationInFrames}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
          defaultProps={{ signature: SIGNATURE, tagline: LOCALES.fr.copy.tagline }}
        />
      </Folder>
      <Folder name="Scenes-RU">
        {sceneFolder("ru", RU_SCENES)}
        <Composition
          id="ru-outro"
          component={OutroRu}
          durationInFrames={LOCALES.ru.timeline.scene("outro").durationInFrames}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
          defaultProps={{ signature: SIGNATURE, tagline: LOCALES.ru.copy.tagline }}
        />
      </Folder>
    </>
  );
};
