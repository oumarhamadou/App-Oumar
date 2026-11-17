import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { activeWord, CLAMP, EASE_IN_OUT, EASE_OUT, ramp, typedCount } from "../anim";
import { BOX, PROMPT_TEXT, PromptBox } from "../components/PromptBox";
import { scene } from "../timeline";

export const NavyBackground: React.FC<{ glowX?: number }> = ({ glowX = 50 }) => (
  <>
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #010208 0%, #030A1C 55%, #071B44 100%)" }} />
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 70% 45% at ${glowX}% 100%, rgba(36,96,230,0.55) 0%, rgba(20,60,160,0.2) 45%, rgba(0,0,0,0) 75%)`,
      }}
    />
  </>
);

/** "je fais ce que j'aime le plus : monter des vidéos" — typed into an AI prompt box. */
export const PromptScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { words, durationInFrames } = scene("prompt");
  const D = durationInFrames;
  const typed = typedCount(PROMPT_TEXT, words, frame);
  const speaking = activeWord(words, frame);
  const lastEnd = words[words.length - 1].end;
  const highlight = frame <= lastEnd + 4 ? speaking : -1;

  const enter = ramp(frame, 0, 14);
  // Camera: settle in, then glide towards the "Flash" button for the next scene.
  const toFlash = interpolate(frame, [D - 16, D], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
  const s = interpolate(enter, [0, 1], [1.18, 1]) + toFlash * 0.25;
  const focusX = 540 + toFlash * (BOX.flashCenter.x - 540);
  const focusY = 560 + toFlash * (BOX.flashCenter.y - 560);

  return (
    <AbsoluteFill>
      <NavyBackground />
      <AbsoluteFill
        style={{
          scale: String(s),
          translate: `${-s * (focusX - 540)}px ${-s * (focusY - 540) + (1 - enter) * 60}px`,
          filter: `blur(${interpolate(frame, [0, 8], [12, 0], { ...CLAMP, easing: EASE_OUT })}px)`,
          opacity: interpolate(frame, [0, 6], [0, 1], CLAMP),
        }}
      >
        <PromptBox
          typed={typed}
          highlightWord={highlight}
          caretVisible={frame < lastEnd || Math.floor(frame / 8) % 2 === 0}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
