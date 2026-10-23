import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { CLAMP, COLORS, EASE_IN, EASE_OUT, fontFamily } from "../theme";

type Props = {
  numeral: string;
  t: number;
  from: number;
  to: number;
  size: number;
};

// Grand chiffre arabe en filigrane derrière chaque condition.
export const Watermark: React.FC<Props> = ({ numeral, t, from, to, size }) => {
  if (t < from - 0.05 || t > to + 0.6) {
    return null;
  }
  const enter = interpolate(t, [from, from + 0.9], [0, 1], {
    ...CLAMP,
    easing: EASE_OUT,
  });
  const leave = interpolate(t, [to, to + 0.5], [0, 1], {
    ...CLAMP,
    easing: EASE_IN,
  });
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        fontFamily,
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1,
        color: COLORS.maroon,
        opacity: 0.035 * enter * (1 - leave),
        scale: 1.18 - 0.18 * enter + 0.06 * leave,
        translate: `0 ${-size * 0.04}px`,
      }}
    >
      {numeral}
    </AbsoluteFill>
  );
};
