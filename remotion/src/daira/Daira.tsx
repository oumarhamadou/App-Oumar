import { Audio } from "@remotion/media";
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Blinds } from "../components/Blinds";
import { LogoOutro } from "../components/LogoOutro";
import { StoryScene, type SceneSpec } from "../components/StoryScene";
import { Texture } from "../components/Texture";
import { CLAMP, COLORS } from "../theme";
import { span, useUnit, voiceToFrame } from "../time";
import { CircleMotif, ShrinkingRing } from "./decor";
import {
  BLINDS_1,
  BLINDS_2,
  CIRCLE,
  COMPENSATION,
  FRIENDS,
  HIJRA,
  INTRO,
  LOGO,
  NUMBERS,
  PROVERB,
  VOICE,
} from "./script";

const FadeFromBlack: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.black,
        opacity: interpolate(
          frame,
          [0, voiceToFrame(0.05, fps)],
          [1, 0],
          CLAMP,
        ),
      }}
    />
  );
};

const Scene: React.FC<{
  name: string;
  spec: SceneSpec;
  decor?: (t: number) => React.ReactNode;
}> = ({ name, spec, decor }) => {
  const { fps } = useVideoConfig();
  return (
    <Sequence
      name={name}
      from={voiceToFrame(spec.start, fps)}
      durationInFrames={span(spec.start, spec.end, fps)}
    >
      <StoryScene spec={spec} decor={decor} />
    </Sequence>
  );
};

export const Daira: React.FC = () => {
  const { fps } = useVideoConfig();
  const { u, portrait } = useUnit();
  const at = (s: number) => voiceToFrame(s, fps);
  const fadeOut = (VOICE.duration - 0.2) * fps;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.black }}>
      {/* Uniquement le son d'origine : aucune musique ajoutée. */}
      <Audio
        name="Voix d'origine"
        src={staticFile(VOICE.file)}
        from={at(0)}
        volume={(f) =>
          interpolate(f, [fadeOut, VOICE.duration * fps], [1, 0], CLAMP)
        }
      />
      {/* Ordre d'empilement = ordre des transitions. */}
      <Scene
        name="Accroche"
        spec={INTRO}
        decor={(t) => <ShrinkingRing t={t} u={u} />}
      />
      <Scene name="Les chiffres" spec={NUMBERS} />
      <Scene name="Le proverbe" spec={PROVERB} />
      <Scene name="L'ami fidèle" spec={FRIENDS} />
      <Scene
        name="Petit cercle sincère"
        spec={CIRCLE}
        decor={(t) => <CircleMotif t={t} u={u} portrait={portrait} />}
      />
      <Scene name="La compensation" spec={COMPENSATION} />
      <Scene name="L'Hégire" spec={HIJRA} />
      <Sequence
        name="Volets 1"
        from={at(BLINDS_1.start)}
        durationInFrames={span(BLINDS_1.start, BLINDS_1.end, fps)}
      >
        <Blinds {...BLINDS_1} />
      </Sequence>
      <Sequence
        name="Volets 2"
        from={at(BLINDS_2.start)}
        durationInFrames={span(BLINDS_2.start, BLINDS_2.end, fps)}
      >
        <Blinds {...BLINDS_2} />
      </Sequence>
      <Sequence
        name="Logo Inspi Story"
        from={at(LOGO.start)}
        durationInFrames={span(LOGO.start, LOGO.end, fps)}
      >
        <LogoOutro start={LOGO.start} end={LOGO.end} />
      </Sequence>
      <Texture />
      {/* Ouverture au noir. */}
      <Sequence name="Ouverture" durationInFrames={at(0.1)}>
        <FadeFromBlack />
      </Sequence>
    </AbsoluteFill>
  );
};
