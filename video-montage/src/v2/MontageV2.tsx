import React from "react";
import { AbsoluteFill } from "remotion";
import { Foreground } from "../components/Scene";
import { Block, Line, Phrase } from "../components/Text";
import { CUT, W } from "../lib/constants";
import { PrismSweep, SceneV2, SoftVignette } from "./SceneV2";
import { SoundV2 } from "./SoundV2";
import { BgWord, Diff, Heavy, Lum, Rise, Sm, Wipe } from "./Type";

// Frames where a word sits behind the subject (cut-out layer is shown).
const BEHIND_RANGES = [
  [W.behind1, 58],
  [W.season, 230],
] as const;

/** Version 2 – styled after reference #2 (clean grotesque, jump cuts, prism light sweep). */
export const MontageV2: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <SceneV2>
        <BgWord text="BEHIND" at={W.behind1} exitAt={50} top={102} size={225} />
        <BgWord text="SEASON" at={W.season} exitAt={221} top={102} size={214} />
        <Foreground ranges={BEHIND_RANGES} />
      </SceneV2>
      <SoftVignette />

      {/* ── 1 · Hook (tight) ── */}
      <Phrase name="1 · You're [BEHIND]" from={0} to={W.because1}>
        <Block x={545} y={700}>
          <Sm at={W.youre1} exitAt={W.because1 - 2} size={50}>You’re</Sm>
        </Block>
      </Phrase>
      <Phrase name="1b · because you're in a rush." from={W.because1} to={W.and1}>
        <Block x={545} y={700}>
          <Line gap={11}>
            <Sm at={W.because1} exitAt={W.and1 - 4}>because</Sm>
            <Sm at={W.youre2} exitAt={W.and1 - 4}>you’re</Sm>
            <Sm at={W.in1} exitAt={W.and1 - 4}>in a</Sm>
          </Line>
          <Line mt={-2}>
            <Rise at={W.rush1} exitAt={W.and1 - 4} size={150}>rush.</Rise>
          </Line>
        </Block>
      </Phrase>

      {/* ── 2 · Wide + difference RUSH ── */}
      <Phrase name="2 · and you're in a RUSH (difference)" from={W.and1} to={W.because2 + 4}>
        <Block x={545} y={560}>
          <Diff at={W.rush2} exitAt={W.because2 - 1} size={430}>RUSH</Diff>
        </Block>
        <Block x={545} y={838}>
          <Line gap={11}>
            <Sm at={W.and1} exitAt={W.because2 - 1}>and</Sm>
            <Sm at={W.youre3} exitAt={W.because2 - 1}>you’re</Sm>
            <Sm at={W.in2} exitAt={W.because2 - 1}>in a</Sm>
          </Line>
        </Block>
      </Phrase>

      {/* ── 3 · Tight ── */}
      <Phrase name="3 · because you feel behind," from={W.because2} to={W.and2}>
        <Block x={545} y={735}>
          <Line gap={11}>
            <Sm at={W.because2} exitAt={W.and2 - 3}>because</Sm>
            <Sm at={W.you1} exitAt={W.and2 - 3}>you</Sm>
            <Sm at={W.feel1} exitAt={W.and2 - 3}>feel</Sm>
          </Line>
          <Line mt={-4}>
            <Lum at={W.behind2} exitAt={W.and2 - 3} size={136}>behind,</Lum>
          </Line>
        </Block>
      </Phrase>

      {/* ── 4 · Wide ── */}
      <Phrase name="4 · and you feel BEHIND because" from={W.and2} to={W.youre4}>
        <Block x={545} y={660}>
          <Line gap={11}>
            <Sm at={W.and2} exitAt={W.youre4 - 4}>and</Sm>
            <Sm at={W.you2} exitAt={W.youre4 - 4}>you</Sm>
            <Sm at={W.feel2} exitAt={W.youre4 - 4}>feel</Sm>
          </Line>
          <Line mt={0}>
            <Heavy at={W.behind3} exitAt={W.youre4 - 4} size={170}>BEHIND</Heavy>
          </Line>
          <Line mt={6} ml={330}>
            <Sm at={W.because3} exitAt={W.youre4 - 4} size={46}>because</Sm>
          </Line>
        </Block>
      </Phrase>

      {/* ── 5 · Medium + SEASON behind ── */}
      <Phrase name="5 · you're in a different [SEASON]" from={W.youre4} to={W.than}>
        <Block x={545} y={745}>
          <Line gap={11}>
            <Sm at={W.youre4} exitAt={W.than - 3}>you’re</Sm>
            <Sm at={W.in3} exitAt={W.than - 3}>in a</Sm>
          </Line>
          <Line mt={-4}>
            <Wipe at={W.different} exitAt={W.than - 3} size={140}>different</Wipe>
          </Line>
        </Block>
      </Phrase>
      <Phrase name="6 · than the people" from={W.than} to={W.youre5}>
        <Block x={545} y={745}>
          <Line gap={11}>
            <Sm at={W.than} exitAt={W.youre5 - 3} size={54}>than</Sm>
            <Sm at={W.the} exitAt={W.youre5 - 3} size={54}>the</Sm>
            <Sm at={W.people} exitAt={W.youre5 - 3} size={54} weight={700}>people</Sm>
          </Line>
        </Block>
      </Phrase>

      {/* ── 6b · Tight + difference COMPARING ── */}
      <Phrase name="6b · you're COMPARING yourself to." from={W.youre5} to={W.speechEndA + 6}>
        <Block x={545} y={745}>
          <Line>
            <Sm at={W.youre5} exitAt={W.speechEndA}>you’re</Sm>
          </Line>
          <Line mt={6}>
            <Diff at={W.comparing} exitAt={W.speechEndA} size={176}>COMPARING</Diff>
          </Line>
          <Line mt={4} gap={14} ml={60}>
            <Heavy at={W.yourself} exitAt={W.speechEndA} size={112}>yourself</Heavy>
            <Sm at={W.to} exitAt={W.speechEndA}>to.</Sm>
          </Line>
        </Block>
      </Phrase>

      {/* ── 7 · Close-up + difference NOT ── */}
      <Phrase name="7 · You're NOT behind." from={W.youre6} to={W.youre7}>
        <Block x={545} y={842}>
          <Line>
            <Sm at={W.youre6} exitAt={W.youre7 - 6} size={50}>You’re</Sm>
          </Line>
          <Line mt={-8} gap={16} ml={40}>
            <Diff at={W.not} exitAt={W.youre7 - 6} size={270}>NOT</Diff>
            <Lum at={W.behind4} exitAt={W.youre7 - 6} size={104}>behind.</Lum>
          </Line>
        </Block>
      </Phrase>

      {/* ── 8 · Final punch-in ── */}
      <Phrase name="8 · You're just early." from={W.youre7} to={381}>
        <Block x={545} y={805}>
          <Line gap={11}>
            <Sm at={W.youre7} size={50}>You’re</Sm>
            <Sm at={W.just} size={50}>just</Sm>
          </Line>
          <Line mt={-2}>
            <Rise at={W.early} size={210}>early.</Rise>
          </Line>
        </Block>
      </Phrase>

      <PrismSweep at={CUT} />
      <SoundV2 />
    </AbsoluteFill>
  );
};
