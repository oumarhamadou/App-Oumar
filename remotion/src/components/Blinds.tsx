import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { BLINDS } from "../script";
import { CLAMP, COLORS, EASE_IN_OUT } from "../theme";
import { useUnit, useVoiceTime } from "../time";

// Volets verticaux bordeaux : ils se ferment de droite à gauche sur la scène crème
// puis s'ouvrent sur la scène pêche (reprend les bandes noires de la référence).
export const Blinds: React.FC = () => {
  const t = useVoiceTime(BLINDS.start);
  const { portrait } = useUnit();
  const count = portrait ? 6 : 9;
  const stagger = 0.022;
  const half = BLINDS.mid - BLINDS.start - stagger * (count - 1);

  return (
    <AbsoluteFill style={{ flexDirection: "row-reverse" }}>
      {new Array(count).fill(true).map((_, i) => {
        const close = interpolate(
          t,
          [BLINDS.start + i * stagger, BLINDS.start + i * stagger + half],
          [0, 1],
          { ...CLAMP, easing: EASE_IN_OUT },
        );
        const open = interpolate(
          t,
          [
            BLINDS.mid + i * stagger,
            BLINDS.mid +
              i * stagger +
              (BLINDS.end - BLINDS.mid) -
              stagger * (count - 1),
          ],
          [0, 1],
          { ...CLAMP, easing: EASE_IN_OUT },
        );
        const closing = t < BLINDS.mid + i * stagger;
        return (
          <div
            key={i}
            style={{
              flex: 1,
              // Léger recouvrement pour éviter les liserés entre volets.
              marginLeft: -1,
              backgroundColor: COLORS.maroon,
              transformOrigin: closing ? "right center" : "left center",
              scale: `${closing ? close : 1 - open} 1`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
