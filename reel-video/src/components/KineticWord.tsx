import React from "react";
import { interpolate, interpolateColors, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CLAMP, COLORS, EASE_IN, EASE_OUT } from "../theme";
import { Icon, IconName } from "./Icons";

export type WordProps = {
  text: string;
  appearAt: number;
  accent?: boolean;
  // Selection corners (like a bounding box in an editing app)
  selectFrom?: number;
  selectTo?: number;
  // Premiere-style "Difference" box sweeping over the word
  diffIn?: number;
  diffOut?: number;
  // Dissolve the word into a row of tool icons
  iconsAt?: number;
  icons?: IconName[];
  iconsScatterAt?: number;
  iconSize?: number;
  // Plain exit (blur + scale)
  exitAt?: number;
  exitScale?: number;
};

const Corner: React.FC<{ pos: "tl" | "tr" | "bl" | "br" }> = ({ pos }) => {
  const size = 26;
  const b = `4px solid ${COLORS.white}`;
  const style: React.CSSProperties = {
    position: "absolute",
    width: size,
    height: size,
    borderTop: pos[0] === "t" ? b : undefined,
    borderBottom: pos[0] === "b" ? b : undefined,
    borderLeft: pos[1] === "l" ? b : undefined,
    borderRight: pos[1] === "r" ? b : undefined,
    top: pos[0] === "t" ? 0 : undefined,
    bottom: pos[0] === "b" ? 0 : undefined,
    left: pos[1] === "l" ? 0 : undefined,
    right: pos[1] === "r" ? 0 : undefined,
  };
  return <div style={style} />;
};

export const KineticWord: React.FC<WordProps> = ({
  text,
  appearAt,
  accent,
  selectFrom,
  selectTo,
  diffIn,
  diffOut,
  iconsAt,
  icons,
  iconsScatterAt,
  iconSize = 58,
  exitAt,
  exitScale = 0.55,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = interpolate(frame, [appearAt, appearAt + 12], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const morph = iconsAt !== undefined ? interpolate(frame, [iconsAt, iconsAt + 7], [0, 1], { ...CLAMP, easing: EASE_IN }) : 0;
  const exit = exitAt !== undefined ? interpolate(frame, [exitAt, exitAt + 12], [0, 1], { ...CLAMP, easing: EASE_IN }) : 0;
  const gone = Math.max(morph, exit);

  // Words that receive the Difference box stay white: green under a white
  // difference box would invert to magenta, which is off-palette.
  const color = accent
    ? COLORS.green
    : diffIn !== undefined
      ? COLORS.white
      : interpolateColors(frame, [appearAt + 3, appearAt + 16], [COLORS.green, COLORS.white]);

  const selected = selectFrom !== undefined && selectTo !== undefined && frame >= selectFrom && frame < selectTo;
  const selPop = selectFrom !== undefined ? interpolate(frame, [selectFrom, selectFrom + 6], [1.35, 1], { ...CLAMP, easing: EASE_OUT }) : 1;

  // Difference box: wipes in from the left, wipes out to the right.
  let boxScale = 0;
  let boxOrigin = "left center";
  if (diffIn !== undefined) {
    boxScale = interpolate(frame, [diffIn, diffIn + 9], [0, 1], { ...CLAMP, easing: EASE_OUT });
    if (diffOut !== undefined && frame >= diffOut) {
      boxOrigin = "right center";
      boxScale = interpolate(frame, [diffOut, diffOut + 9], [1, 0], { ...CLAMP, easing: EASE_OUT });
    }
  }

  return (
    <span style={{ position: "relative", display: "inline-block", margin: "0 0.13em" }}>
      <span
        style={{
          display: "inline-block",
          color,
          opacity: enter * (1 - gone),
          translate: `0px ${(1 - enter) * 60 - exit * 30}px`,
          scale: String((0.9 + 0.1 * enter) * (1 - gone * (1 - exitScale))),
          filter: `blur(${(1 - enter) * 14 + gone * 12}px)`,
        }}
      >
        {text}
      </span>

      {selected ? (
        <span
          style={{
            position: "absolute",
            inset: "-6px -20px -2px -20px",
            scale: String(selPop),
            opacity: 1 - gone,
          }}
        >
          <Corner pos="tl" />
          <Corner pos="tr" />
          <Corner pos="bl" />
          <Corner pos="br" />
        </span>
      ) : null}

      {diffIn !== undefined ? (
        <span
          style={{
            position: "absolute",
            inset: "4px -22px 0px -22px",
            borderRadius: 18,
            backgroundColor: COLORS.white,
            mixBlendMode: "difference",
            transformOrigin: boxOrigin,
            scale: `${boxScale} 1`,
            opacity: 1 - gone,
          }}
        />
      ) : null}

      {icons && iconsAt !== undefined
        ? icons.map((name, i) => {
            const start = iconsAt + 2 + i * 2;
            const pop = spring({ frame: frame - start, fps, config: { damping: 11, stiffness: 180, mass: 0.6 } });
            const spread = (i - (icons.length - 1) / 2) * (iconSize * 1.2);
            const scatter =
              iconsScatterAt !== undefined
                ? interpolate(frame, [iconsScatterAt, iconsScatterAt + 18], [0, 1], { ...CLAMP, easing: EASE_IN })
                : 0;
            const dir = (i - (icons.length - 1) / 2) || (i % 2 === 0 ? 0.6 : -0.6);
            return (
              <span
                key={name + i}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  marginLeft: -iconSize / 2,
                  marginTop: -iconSize / 2 + 6,
                  translate: `${spread + dir * scatter * 260}px ${-scatter * 180 * (i % 2 === 0 ? 1 : -1)}px`,
                  scale: String(pop * (1 - scatter * 0.6)),
                  rotate: `${(1 - pop) * -40 + scatter * dir * 60}deg`,
                  opacity: frame < start ? 0 : 1 - scatter,
                }}
              >
                <Icon name={name} size={iconSize} />
              </span>
            );
          })
        : null}
    </span>
  );
};
