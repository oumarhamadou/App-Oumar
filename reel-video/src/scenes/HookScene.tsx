import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { KineticWord } from "../components/KineticWord";
import { IconName } from "../components/Icons";
import { COPY, LangProps } from "../i18n";
import { useLayout } from "../layout";
import { CLAMP, EASE_IN, fontFamily } from "../theme";
import { hookTiming } from "../timings";

const ICON_ROWS: IconName[][] = [
  ["pen", "move", "cursor"],
  ["scissors", "keyframe", "text"],
  ["square", "triangle", "search"],
  ["magnet", "crop", "play"],
  ["wave", "layers", "undo"],
];

export const LINE_GAP = 150;
export const FONT_SIZE = 128;

export const HookScene: React.FC<LangProps> = ({ lang }) => {
  const frame = useCurrentFrame();
  const { wide, cy } = useLayout();
  const copy = COPY[lang];
  const lines = wide ? copy.hookWide : copy.hook;
  const words = lines.flat();
  const n = words.length;
  const t = hookTiming(n);
  const lineTop = (i: number) => cy + (i - (lines.length - 1) / 2) * LINE_GAP;

  // The last (inverted) word punches toward the camera to hand over to the next scene.
  const punch = interpolate(frame, [t.lastExit, t.lastExit + 16], [0, 1], { ...CLAMP, easing: EASE_IN });

  let k = -1;
  return (
    <AbsoluteFill style={{ fontFamily, fontSize: FONT_SIZE, fontWeight: 600, letterSpacing: "-0.04em" }}>
      {lines.map((line, li) => (
        <div
          key={li}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: lineTop(li) - LINE_GAP / 2,
            height: LINE_GAP,
            lineHeight: `${LINE_GAP}px`,
            textAlign: "center",
            whiteSpace: "nowrap",
          }}
        >
          {line.map((w) => {
            k += 1;
            const idx = k;
            const isLast = idx === n - 1;
            if (isLast) {
              return (
                <span
                  key={idx}
                  style={{
                    display: "inline-block",
                    scale: 1 + punch * 1.6,
                    opacity: 1 - punch,
                    filter: `blur(${punch * 18}px)`,
                  }}
                >
                  <KineticWord
                    text={w}
                    appearAt={t.appear(idx)}
                    selectFrom={t.appear(idx) + 2}
                    selectTo={t.diffIn}
                    diffIn={t.diffIn}
                    diffOut={t.diffOut}
                  />
                </span>
              );
            }
            return (
              <KineticWord
                key={idx}
                text={w}
                accent={w === copy.hookAccent}
                appearAt={t.appear(idx)}
                selectFrom={t.appear(idx) + 2}
                selectTo={t.appear(idx + 1) + 2}
                iconsAt={t.iconsAt(idx)}
                icons={ICON_ROWS[idx % ICON_ROWS.length]}
                iconsScatterAt={t.scatterAt + idx * 2}
              />
            );
          })}
        </div>
      ))}
    </AbsoluteFill>
  );
};
