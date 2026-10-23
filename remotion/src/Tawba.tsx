import { Audio } from "@remotion/media";
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  staticFile,
  useVideoConfig,
} from "remotion";
import { Blinds } from "./components/Blinds";
import { Texture } from "./components/Texture";
import { ConditionsScene } from "./scenes/ConditionsScene";
import { FourthScene } from "./scenes/FourthScene";
import { IntroScene } from "./scenes/IntroScene";
import { OutroScene } from "./scenes/OutroScene";
import { RightsScene } from "./scenes/RightsScene";
import {
  BLINDS,
  CONDITIONS_SCENE,
  FOURTH,
  INTRO,
  OUTRO,
  RIGHTS,
  VOICE,
} from "./script";
import { CLAMP, COLORS } from "./theme";
import { voiceToFrame } from "./time";

// Nombre d'images entre deux instants de la voix.
export const span = (start: number, end: number, fps: number) =>
  voiceToFrame(end, fps) - voiceToFrame(start, fps);

export const Tawba: React.FC = () => {
  const { fps } = useVideoConfig();
  const at = (s: number) => voiceToFrame(s, fps);
  const fadeOut = (VOICE.duration - 0.22) * fps;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.black }}>
      <Audio
        name="Voix"
        src={staticFile(VOICE.file)}
        from={at(0)}
        volume={(f) =>
          interpolate(f, [fadeOut, VOICE.duration * fps], [1, 0], CLAMP)
        }
      />
      {/* Ordre d'empilement = ordre des transitions : la scène entrante passe au-dessus. */}
      <Sequence
        name="Intro"
        from={at(INTRO.start)}
        durationInFrames={span(INTRO.start, INTRO.end, fps)}
      >
        <IntroScene />
      </Sequence>
      <Sequence
        name="Conditions"
        from={at(CONDITIONS_SCENE.start)}
        durationInFrames={span(
          CONDITIONS_SCENE.start,
          CONDITIONS_SCENE.end,
          fps,
        )}
      >
        <ConditionsScene />
      </Sequence>
      <Sequence
        name="Quatrième condition"
        from={at(FOURTH.start)}
        durationInFrames={span(FOURTH.start, FOURTH.end, fps)}
      >
        <FourthScene />
      </Sequence>
      <Sequence
        name="Droits d'autrui"
        from={at(RIGHTS.start)}
        durationInFrames={span(RIGHTS.start, RIGHTS.end, fps)}
      >
        <RightsScene />
      </Sequence>
      <Sequence
        name="Récapitulatif"
        from={at(OUTRO.start)}
        durationInFrames={span(OUTRO.start, OUTRO.end, fps)}
      >
        <OutroScene />
      </Sequence>
      <Sequence
        name="Volets"
        from={at(BLINDS.start)}
        durationInFrames={span(BLINDS.start, BLINDS.end, fps)}
      >
        <Blinds />
      </Sequence>
      <Texture />
    </AbsoluteFill>
  );
};
