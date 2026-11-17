import React from "react";
import { AbsoluteFill, interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { CLAMP, EASE_IN_OUT, EASE_OUT, settle } from "../anim";
import { FONT } from "../fonts";
import { useCopy, useScene } from "../locales";

/** "jusqu'à décrocher mon premier client" — one word at a time, then "client" becomes day 15. */
export const ClientScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { words, durationInFrames } = useScene("client");
  const D = durationInFrames;
  const { words: shown, tagWidth } = useCopy().client;
  const last = shown.length - 1;
  const lastWord = shown[last].word;
  const at = (i: number) => words[shown[i].word].at - 2;

  const current = shown.reduce((acc, _, i) => (frame >= at(i) ? i : acc), 0);
  const since = frame - at(current);
  const punch = interpolate(since, [0, 5], [0, 1], { ...CLAMP, easing: EASE_OUT });

  // "client" → purple tag → small blue dot labelled 15.
  const tagIn = settle(frame, words[lastWord].at + 8, 18);
  const morph = interpolate(frame, [words[lastWord].at + 16, D - 2], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
  const w = interpolate(morph, [0, 1], [tagWidth, 160]);
  const h = interpolate(morph, [0, 1], [176, 160]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#F7F7F9", fontFamily: FONT }}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        {current === last ? (
          <div
            style={{
              position: "absolute",
              width: w,
              height: h,
              borderRadius: interpolate(morph, [0, 1], [40, 80]),
              backgroundColor: interpolateColors(morph, [0, 1], ["#8484F8", "#1C1CD9"]),
              opacity: tagIn,
              scale: String(0.85 + 0.15 * tagIn),
              filter: `blur(${(1 - tagIn) * 10 + Math.sin(morph * Math.PI) * 6}px)`,
              boxShadow: `0 20px 50px rgba(40,40,220,${0.3 * morph})`,
            }}
          />
        ) : null}
        <div
          style={{
            position: "relative",
            fontSize: 150,
            fontWeight: 800,
            letterSpacing: "-0.045em",
            color: current === last ? interpolateColors(tagIn, [0, 1], ["#0E1116", "#FFFFFF"]) : "#0E1116",
            scale: String((1.3 - 0.3 * punch) * (current === last ? 1 - 0.75 * morph : 1)),
            filter: `blur(${(1 - punch) * 14 + (current === last ? morph * 18 : 0)}px)`,
            opacity: current === last ? 1 - morph : 1,
          }}
        >
          {shown[current].label}
        </div>
        <div
          style={{
            position: "absolute",
            fontSize: 83,
            fontWeight: 700,
            color: "white",
            letterSpacing: "-0.02em",
            opacity: interpolate(morph, [0.6, 1], [0, 1], CLAMP),
            scale: String(interpolate(morph, [0.6, 1], [0.6, 1], CLAMP)),
          }}
        >
          15
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
