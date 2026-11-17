import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CLAMP, EASE_IN, EASE_IN_OUT, outro, pop, settle } from "../anim";
import { BOX, PromptBox } from "../components/PromptBox";
import { useCopy, useScene } from "../locales";
import { NavyBackground } from "./PromptScene";

/** "Aujourd'hui, j'ai zéro client" — the model menu opens and each item lights up. */
export const DropdownScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { words, durationInFrames } = useScene("dropdown");
  const { text, menu, menuWords } = useCopy().prompt;
  const item = (i: number) => words[menuWords[i]].at - 2;
  const exit = outro(frame, durationInFrames, 9);

  const press = interpolate(frame, [0, 3, 8], [0, 1, 0], CLAMP);
  const open = pop(frame, 3, { damping: 15, stiffness: 200 });
  // Highlight follows the words: Aujourd'hui → j'ai → zéro client.
  const active = settle(frame, item(1), 22) + settle(frame, item(2), 22);
  const menuActive = frame < item(0) ? -1 : active;

  // Camera: from the Flash button down onto the open menu.
  const move = interpolate(frame, [0, 18], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
  const s = 1.25 + 0.25 * move;
  const focusX = BOX.flashCenter.x + move * 45;
  const focusY = BOX.flashCenter.y + move * 95;

  return (
    <AbsoluteFill>
      <NavyBackground glowX={65} />
      <AbsoluteFill
        style={{
          scale: String(s),
          translate: `${-s * (focusX - 540)}px ${-s * (focusY - 540) - exit * 260}px`,
          filter: `blur(${interpolate(exit, [0, 1], [0, 22], { ...CLAMP, easing: EASE_IN })}px)`,
          opacity: 1 - exit * 0.8,
        }}
      >
        <PromptBox
          text={text}
          menuItems={menu}
          typed={text.length}
          highlightWord={-1}
          caretVisible={false}
          flashPressed={press}
          menuOpen={open}
          menuActive={menuActive}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
