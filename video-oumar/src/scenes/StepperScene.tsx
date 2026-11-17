import React from "react";
import { AbsoluteFill, interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { CLAMP, EASE_IN, EASE_OUT, outro, pop, reveal, settle } from "../anim";
import { MinusIcon, PlusIcon } from "../components/shapes";
import { FONT } from "../fonts";
import { scene } from "../timeline";

const formatAmount = (n: number) =>
  String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

/** "gagner mille dollars grâce au montage vidéo" — an amount stepper counting to 1 000 $. */
export const StepperScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { words, durationInFrames } = scene("stepper");
  const exit = outro(frame, durationInFrames, 8);

  const enter = pop(frame, 0, { damping: 15, stiffness: 150 });
  // Count up while "gagner mille dollars" is spoken.
  const amount = interpolate(frame, [words[0].at, words[2].end], [0, 1000], {
    ...CLAMP,
    easing: EASE_OUT,
  });
  const reached = settle(frame, words[2].end - 2, 18);
  const plusPress = interpolate(
    frame,
    [words[2].end - 4, words[2].end, words[2].end + 5],
    [1, 0.78, 1],
    CLAMP,
  );
  // Card expands when "montage vidéo" is spoken.
  const expand = pop(frame, words[5].at - 3, { damping: 16, stiffness: 140 });
  const width = 540 + 120 * expand;
  const height = 190 + 250 * expand;
  const blue = interpolateColors(reached, [0, 1], ["#9AA1AD", "#1F7BFF"]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#F5F6F8", fontFamily: FONT }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(46,128,255,0.38) 0%, rgba(46,128,255,0.12) 30%, rgba(245,246,248,0) 55%)",
          opacity: expand,
          scale: String(0.7 + 0.3 * expand),
        }}
      />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          scale: String((0.55 + 0.45 * enter) * (1 + exit * 0.5)),
          filter: `blur(${(1 - Math.min(1, enter)) * 14 + exit * 18}px)`,
          opacity: interpolate(exit, [0, 1], [1, 0], { ...CLAMP, easing: EASE_IN }),
        }}
      >
        <div
          style={{
            position: "relative",
            width,
            height,
            borderRadius: 64,
            backgroundColor: "white",
            boxShadow: `0 30px 90px rgba(31,123,255,${0.12 + 0.3 * expand}), 0 8px 24px rgba(20,30,60,0.08)`,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 50,
              left: 0,
              right: 0,
              textAlign: "center",
              fontSize: 50,
              fontWeight: 700,
              color: "#111",
              letterSpacing: "-0.03em",
              ...reveal(expand, { distance: 20 }),
            }}
          >
            montage vidéo
          </div>
          <div
            style={{
              position: "absolute",
              left: 40,
              right: 40,
              top: height / 2 - 60 + 14 * expand,
              height: 120,
              borderRadius: 34,
              backgroundColor: blue,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 34px",
              color: "white",
              boxShadow: `0 14px 40px rgba(31,123,255,${0.35 * reached})`,
            }}
          >
            <MinusIcon size={48} color="white" stroke={3.2} />
            <div
              style={{
                fontSize: 74,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {formatAmount(amount)} $
            </div>
            <div style={{ scale: String(plusPress), display: "flex" }}>
              <PlusIcon size={48} color="white" stroke={3.2} />
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              left: 64,
              right: 64,
              bottom: 44,
              display: "flex",
              justifyContent: "space-between",
              fontSize: 34,
              fontWeight: 600,
              color: "#8A919E",
              ...reveal(expand, { distance: -20 }),
            }}
          >
            <span>0 $</span>
            <span>1&nbsp;000 $</span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
