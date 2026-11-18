import React from "react";
import { AbsoluteFill } from "remotion";
import { BackgroundWord, Finish, Flash, Foreground, LightLeak, Scene } from "./components/Scene";
import { SoundDesign } from "./components/SoundDesign";
import {
  Block,
  Bold,
  DifferencePill,
  DifferenceWord,
  EchoWord,
  Gold,
  Line,
  Phrase,
  RushIn,
  Sans,
  Strike,
} from "./components/Text";
import { CUT, W } from "./lib/constants";

// Frames where a word sits behind the subject (cut-out layer is shown).
const BEHIND_RANGES = [
  [W.behind1, 56],
  [W.season, 250],
] as const;

export const Montage: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* ───────────── The filmed scene (moved by the camera) ───────────── */}
      <Scene>
        <BackgroundWord text="BEHIND" at={W.behind1} exitAt={44} top={104} size={332} spacing={-0.01} />
        <BackgroundWord text="SEASON" at={W.season} exitAt={238} top={124} size={300} spacing={-0.01} />
        <Foreground ranges={BEHIND_RANGES} />
      </Scene>

      {/* ───────────── Difference-blended type (inverts the picture) ───────────── */}
      <Phrase name="DIFF · RUSH" from={W.rush2} to={W.because2 + 10}>
        <DifferenceWord at={W.rush2} exitAt={W.because2} y={505} size={410}>
          RUSH
        </DifferenceWord>
      </Phrase>

      <Flash />
      <LightLeak from={CUT - 9} to={CUT + 18} seed={4} peak={0.6} />
      <LightLeak from={W.early - 4} to={380} seed={9} peak={0.28} hold />

      {/* ───────────── Captions (reference style) ───────────── */}
      <Phrase name="1 · You're behind" from={0} to={52}>
        <Block x={104} y={96} align="flex-start">
          <Sans at={W.youre1} exitAt={42} size={48}>
            You’re
          </Sans>
        </Block>
      </Phrase>

      <Phrase name="2 · because you're in a rush" from={W.because1} to={W.and1 + 2}>
        <Block x={545} y={668}>
          <Line>
            <Sans at={W.because1} exitAt={W.and1 - 6}>because</Sans>
            <Sans at={W.youre2} exitAt={W.and1 - 6}>you’re</Sans>
            <Sans at={W.in1} exitAt={W.and1 - 6}>in a</Sans>
          </Line>
          <Line mt={-14} ml={60}>
            <RushIn at={W.rush1} exitAt={W.and1 - 6} size={178}>
              rush.
            </RushIn>
          </Line>
        </Block>
      </Phrase>

      <Phrase name="3 · and you're in a RUSH" from={W.and1} to={W.because2 + 10}>
        <Block x={545} y={790}>
          <Line>
            <Sans at={W.and1} exitAt={W.because2}>and</Sans>
            <Sans at={W.youre3} exitAt={W.because2}>you’re</Sans>
            <Sans at={W.in2} exitAt={W.because2}>in a</Sans>
          </Line>
        </Block>
      </Phrase>

      <Phrase name="4 · because you feel behind" from={W.because2} to={W.and2 + 12}>
        <Block x={545} y={655}>
          <Line>
            <Sans at={W.because2} exitAt={W.and2 - 2}>because</Sans>
            <Sans at={W.you1} exitAt={W.and2 - 2}>you</Sans>
            <Sans at={W.feel1} exitAt={W.and2 - 2}>feel</Sans>
          </Line>
          <Line mt={-10} ml={-40}>
            <Gold at={W.behind2} exitAt={W.and2 - 2} size={176} breathe={0.0012}>
              behind,
            </Gold>
          </Line>
        </Block>
      </Phrase>

      <Phrase name="5 · and you feel BEHIND because… (loop)" from={W.and2} to={W.youre4 + 4}>
        <Block x={545} y={548}>
          <Line>
            <Sans at={W.and2} exitAt={W.youre4 - 9}>and</Sans>
            <Sans at={W.you2} exitAt={W.youre4 - 9}>you</Sans>
            <Sans at={W.feel2} exitAt={W.youre4 - 9}>feel</Sans>
          </Line>
        </Block>
        <Block x={545} y={690}>
          <Line gap={22} ml={150}>
            <EchoWord at={W.behind3} exitAt={W.youre4 - 9} size={156}>
              BEHIND
            </EchoWord>
            <Sans at={W.because3} exitAt={W.youre4 - 9}>because</Sans>
          </Line>
        </Block>
      </Phrase>

      <Phrase name="6 · you're in a different season" from={W.youre4} to={W.than + 10}>
        <Block x={545} y={660}>
          <Line>
            <Sans at={W.youre4} exitAt={W.than - 4}>you’re</Sans>
            <Sans at={W.in3} exitAt={W.than - 4}>in a</Sans>
          </Line>
          <Line mt={-8} ml={30}>
            <Gold at={W.different} exitAt={W.than - 4} size={172}>
              different
            </Gold>
          </Line>
        </Block>
      </Phrase>

      <Phrase name="7 · than the people you're comparing yourself to." from={W.than} to={W.speechEndA + 12}>
        <Block x={545} y={668}>
          <Line>
            <Sans at={W.than} exitAt={W.speechEndA + 2}>than</Sans>
            <Sans at={W.the} exitAt={W.speechEndA + 2}>the</Sans>
            <Sans at={W.people} exitAt={W.speechEndA + 2}>people</Sans>
          </Line>
          <Line mt={18} gap={22}>
            <Sans at={W.youre5} exitAt={W.speechEndA + 2}>you’re</Sans>
            <DifferencePill at={W.comparing} exitAt={W.speechEndA + 2} size={70}>
              comparing
            </DifferencePill>
          </Line>
          <Line mt={0} ml={70} gap={16}>
            <Gold at={W.yourself} exitAt={W.speechEndA + 2} size={150}>
              yourself
            </Gold>
            <Sans at={W.to} exitAt={W.speechEndA + 2}>to.</Sans>
          </Line>
        </Block>
      </Phrase>

      <Phrase name="8 · You're NOT behind." from={W.youre6} to={W.youre7}>
        <Block x={545} y={808}>
          <Line gap={18}>
            <Sans at={W.youre6} exitAt={W.youre7 - 10} size={52}>
              You’re
            </Sans>
            <Bold at={W.not} exitAt={W.youre7 - 10} size={128}>
              NOT
            </Bold>
          </Line>
          <Line mt={-26} ml={60}>
            <Strike at={W.behind4 + 9} exitAt={W.youre7 - 10}>
              <Gold at={W.behind4} exitAt={W.youre7 - 10} size={158}>
                behind.
              </Gold>
            </Strike>
          </Line>
        </Block>
      </Phrase>

      <Phrase name="9 · You're just early." from={W.youre7} to={381}>
        <Block x={545} y={815}>
          <Line>
            <Sans at={W.youre7} size={52}>You’re</Sans>
            <Sans at={W.just} size={52}>just</Sans>
          </Line>
          <Line mt={-16} ml={20}>
            <Gold at={W.early} size={236} breathe={0.0011}>
              early.
            </Gold>
          </Line>
        </Block>
      </Phrase>

      <Finish />
      <SoundDesign />
    </AbsoluteFill>
  );
};
