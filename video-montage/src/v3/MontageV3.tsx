import React from "react";
import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  interpolate,
  interpolateColors,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Foreground } from "../components/Scene";
import { Block, Line, Phrase } from "../components/Text";
import { CUT, W } from "../lib/constants";
import { easeOut } from "../lib/motion";
import {
  CARD_IN,
  CardFrame,
  GLITCH,
  JUMP_CUTS,
  OUTRO,
  SceneV3,
  WarmFlash,
  WHITE_IN,
  WHITE_OUT,
} from "./SceneV3";
import {
  Bd,
  BgTrack,
  Fade,
  INK,
  PaleWord,
  RedFlicker,
  Trk,
  Wd,
} from "./TypeV3";

/** Version 3 – styled after reference #3 (card on white, black/red typography, warm flash). */
export const MontageV3: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#FAFAF8" }}>
      {/* ───── Video (shrinks into a card twice) + captions living on it ───── */}
      <CardFrame>
        <SceneV3>
          <BgTrack
            text="BEHIND"
            at={W.behind1}
            exitAt={50}
            top={104}
            size={222}
          />
          <Foreground ranges={[[W.behind1, 58]]} />
        </SceneV3>
        <OnVideoCaptions />
      </CardFrame>

      {/* ───── White typographic interlude (black + red) ───── */}
      <WhiteInterlude />

      <WarmFlash at={CUT} />
      <FinalCaptions />
      <SoundV3 />
    </AbsoluteFill>
  );
};

/** Captions placed on the picture – they scale with the card. */
const OnVideoCaptions: React.FC = () => (
  <>
    <Phrase name="1 · You're [BEHIND]" from={0} to={W.because1}>
      <Block x={545} y={700}>
        <Wd at={W.youre1} exitAt={W.because1 - 2} size={52}>
          You’re
        </Wd>
      </Block>
    </Phrase>
    <Phrase name="1b · because you're in a rush." from={W.because1} to={W.and1}>
      <Block x={545} y={705}>
        <Line gap={11}>
          <Wd at={W.because1} exitAt={W.and1 - 4}>
            because
          </Wd>
          <Wd at={W.youre2} exitAt={W.and1 - 4}>
            you’re
          </Wd>
          <Wd at={W.in1} exitAt={W.and1 - 4}>
            in a
          </Wd>
        </Line>
        <Line mt={0}>
          <Bd at={W.rush1} exitAt={W.and1 - 4} size={150}>
            rush.
          </Bd>
        </Line>
      </Block>
    </Phrase>

    <Phrase
      name="2 · and you're in a RUSH (difference, tracking)"
      from={W.and1}
      to={W.because2}
    >
      <Block x={545} y={560}>
        <Trk at={W.rush2} exitAt={W.because2 - 2} size={400} diff from={0.7}>
          RUSH
        </Trk>
      </Block>
      <Block x={545} y={840}>
        <Line gap={11}>
          <Wd at={W.and1} exitAt={W.because2 - 2}>
            and
          </Wd>
          <Wd at={W.youre3} exitAt={W.because2 - 2}>
            you’re
          </Wd>
          <Wd at={W.in2} exitAt={W.because2 - 2}>
            in a
          </Wd>
        </Line>
      </Block>
    </Phrase>

    <Phrase name="3 · because you feel behind," from={W.because2} to={W.and2}>
      <Block x={545} y={735}>
        <Line gap={11}>
          <Wd at={W.because2} exitAt={W.and2 - 3}>
            because
          </Wd>
          <Wd at={W.you1} exitAt={W.and2 - 3}>
            you
          </Wd>
          <Wd at={W.feel1} exitAt={W.and2 - 3}>
            feel
          </Wd>
        </Line>
        <Line mt={2}>
          <Trk
            at={W.behind2}
            exitAt={W.and2 - 3}
            size={150}
            weight={800}
            from={0.5}
          >
            BEHIND,
          </Trk>
        </Line>
      </Block>
    </Phrase>

    {/* inside the card: bigger type so it still reads once scaled down */}
    <Phrase
      name="4 · [card] and you feel BEHIND because"
      from={W.and2}
      to={WHITE_IN}
    >
      <Block x={545} y={690}>
        <Line gap={18}>
          <Wd at={W.and2} exitAt={GLITCH + 2} size={76}>
            and
          </Wd>
          <Wd at={W.you2} exitAt={GLITCH + 2} size={76}>
            you
          </Wd>
          <Wd at={W.feel2} exitAt={GLITCH + 2} size={76}>
            feel
          </Wd>
        </Line>
        <Line mt={4}>
          <Bd at={W.behind3} exitAt={GLITCH + 2} size={230}>
            behind
          </Bd>
        </Line>
        <Line mt={8} ml={360}>
          <Wd at={W.because3} exitAt={GLITCH + 2} size={76}>
            because
          </Wd>
        </Line>
      </Block>
    </Phrase>

    <Phrase
      name="7 · You're NOT behind. (difference)"
      from={W.youre6}
      to={W.youre7}
    >
      <Block x={545} y={842}>
        <Line>
          <Wd at={W.youre6} exitAt={W.youre7 - 6} size={50}>
            You’re
          </Wd>
        </Line>
        <Line mt={-6} gap={18} ml={40}>
          <Trk at={W.not} exitAt={W.youre7 - 6} size={270} diff from={0.8}>
            NOT
          </Trk>
          <Wd
            at={W.behind4}
            exitAt={W.youre7 - 6}
            size={100}
            weight={400}
            rise={22}
          >
            behind.
          </Wd>
        </Line>
      </Block>
    </Phrase>
  </>
);

/** Black-on-white typography while the voice keeps going (reference #3 interlude). */
const WhiteInterlude: React.FC = () => {
  const f = useCurrentFrame();
  // not wrapped in a <Sequence>: the phrases below use absolute frames
  if (f < WHITE_IN || f >= WHITE_OUT) return null;
  return (
    <AbsoluteFill style={{ backgroundColor: "#FAFAF8" }}>
      <Phrase name="W1 · you're in a different" from={WHITE_IN} to={W.season}>
        <Block x={545} y={520}>
          <Line gap={14}>
            <Wd
              at={W.youre4}
              exitAt={W.season - 2}
              size={62}
              color={INK}
              weight={400}
            >
              you’re
            </Wd>
            <Wd
              at={W.in3}
              exitAt={W.season - 2}
              size={62}
              color={INK}
              weight={400}
            >
              in a
            </Wd>
          </Line>
          <Line mt={6}>
            <Bd at={W.different} exitAt={W.season - 2} size={150} color={INK}>
              different
            </Bd>
          </Line>
        </Block>
      </Phrase>

      <Phrase name="W2 · [SEASON] season." from={W.season} to={W.youre5}>
        <PaleWord at={W.season} exitAt={W.youre5 - 4} size={330} y={540}>
          SEASON
        </PaleWord>
        <Block x={545} y={540}>
          <Fade
            at={W.season}
            exitAt={W.than - 2}
            size={200}
            greyFrom={W.season + 3}
          >
            season.
          </Fade>
        </Block>
        <Block x={545} y={540}>
          <Line gap={18}>
            <Wd
              at={W.than}
              exitAt={W.youre5 - 2}
              size={96}
              color={INK}
              weight={800}
              rise={26}
            >
              than
            </Wd>
            <Wd
              at={W.the}
              exitAt={W.youre5 - 2}
              size={96}
              color={INK}
              weight={800}
              rise={26}
            >
              the
            </Wd>
            <Wd
              at={W.people}
              exitAt={W.youre5 - 2}
              size={96}
              color={INK}
              weight={800}
              rise={26}
            >
              people
            </Wd>
          </Line>
        </Block>
      </Phrase>

      <Phrase
        name="W3 · you're comparing yourself to."
        from={W.youre5}
        to={WHITE_OUT}
      >
        <Block x={545} y={540}>
          <Line>
            <Wd at={W.youre5} size={62} color={INK} weight={400}>
              you’re
            </Wd>
          </Line>
          <Line mt={8}>
            <RedFlicker at={W.comparing} size={150}>
              comparing
            </RedFlicker>
          </Line>
          <Line mt={4} gap={16} ml={70}>
            <RedFlicker at={W.yourself} size={150} weight={700}>
              yourself
            </RedFlicker>
            <Wd at={W.to} size={62} color={INK} weight={400}>
              to.
            </Wd>
          </Line>
        </Block>
      </Phrase>
    </AbsoluteFill>
  );
};

/** "You're just early." – white on the video, turning black as the outro card shrinks. */
const FinalCaptions: React.FC = () => {
  const f = useCurrentFrame();
  if (f < W.youre7) return null;
  const color = interpolateColors(f, [OUTRO, OUTRO + 9], ["#FFFFFF", INK]);
  const y = interpolate(f, [OUTRO, OUTRO + 11], [790, 878], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const small = interpolate(f, [OUTRO, OUTRO + 11], [1, 0.62], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const shadow = `0 2px 14px rgba(0,0,0,${interpolate(f, [OUTRO, OUTRO + 6], [0.4, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`;
  return (
    <Phrase name="8 · You're just early. (outro)" from={W.youre7} to={381}>
      <Block x={545} y={y}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            scale: String(small),
          }}
        >
          <Line gap={12}>
            <Wd at={W.youre7} size={54} color={color} shadow={shadow}>
              You’re
            </Wd>
            <Wd at={W.just} size={54} color={color} shadow={shadow}>
              just
            </Wd>
          </Line>
          <Line mt={0}>
            <Trk
              at={W.early}
              size={220}
              color={color}
              weight={800}
              from={0.5}
              shadow={shadow}
            >
              early.
            </Trk>
          </Line>
        </div>
      </Block>
    </Phrase>
  );
};

// ───── Sound: no music; very quiet hits on text animations + transitions ─────
const T = 0.035; // word tick
const HITS: readonly (readonly [number, string, number])[] = [
  // hook
  [W.behind1 - 2, "whoosh", 0.08],
  [W.behind1, "boom", 0.06],
  [W.because1, "tick1", T],
  [W.youre2, "tick2", T],
  [W.in1, "tick3", T],
  [W.rush1, "pop", 0.06],
  // RUSH difference
  ...JUMP_CUTS.map((c) => [c - 5, "whoosh_fast", 0.05] as const),
  [W.and1 + 1, "tick4", T],
  [W.youre3, "tick1", T],
  [W.in2, "tick2", T],
  [W.rush2 - 2, "swipe", 0.06],
  [W.rush2 + 1, "glitch", 0.05],
  // because you feel BEHIND,
  [W.you1, "tick3", T],
  [W.feel1, "tick4", T],
  [W.behind2, "swipe", 0.05],
  // card
  [CARD_IN - 3, "whoosh", 0.08],
  [W.you2, "tick1", T],
  [W.behind3, "pop", 0.06],
  [W.because3, "tick2", T],
  [GLITCH, "glitch", 0.08],
  // white interlude
  [W.youre4, "tick3", T],
  [W.in3, "tick4", T],
  [W.different, "pop", 0.05],
  [W.season, "swell", 0.04],
  [W.than, "tick1", T],
  [W.people, "tick2", T],
  [W.youre5, "tick3", T],
  [W.comparing, "glitch", 0.035],
  [W.yourself, "tick4", 0.04],
  // back to video + warm flash into the close-up
  [WHITE_OUT - 4, "whoosh_fast", 0.06],
  [CUT - 26, "riser", 0.05],
  [CUT - 11, "whoosh", 0.08],
  [CUT - 2, "shimmer", 0.05],
  [CUT - 1, "drop", 0.07],
  // You're NOT behind.
  [W.youre6, "tick1", T],
  [W.not - 1, "swipe", 0.05],
  [W.behind4, "tick2", T],
  // You're just early. + outro card
  [W.youre7 + 1, "tick3", T],
  [W.just, "tick4", T],
  [W.early, "shimmer", 0.06],
  [OUTRO - 3, "whoosh", 0.07],
];

const SoundV3: React.FC = () => (
  <>
    {HITS.map(([frame, sfx, volume], i) => (
      <Sequence
        key={i}
        name={`SFX ${sfx}`}
        from={Math.max(0, frame)}
        layout="none"
      >
        <Audio src={staticFile(`sfx/${sfx}.wav`)} volume={volume} />
      </Sequence>
    ))}
  </>
);
