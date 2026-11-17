import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CLAMP, EASE_IN, EASE_IN_OUT, outro, pop, ramp, reveal } from "../anim";
import { Platform, PlatformLogo } from "../components/PlatformLogo";
import { ChevronIcon, Cursor } from "../components/shapes";
import { FONT } from "../fonts";
import { useCopy, useScene } from "../locales";

const PLATFORMS: { id: Platform; label: string }[] = [
  { id: "instagram", label: "Instagram" },
  { id: "x", label: "X" },
  { id: "youtube", label: "YouTube" },
];

const CAROUSEL_Y = 600;
const ARROW_OFFSET = 255;

/** "Alors, à partir d'aujourd'hui, je publie sur Instagram, X et YouTube." */
export const PlatformsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { words, durationInFrames } = useScene("platforms");
  const { prefix, line1, line2, badge, title, platformWords } = useCopy().platforms;
  const [wInstagram, wX, wYoutube] = platformWords;
  const titleStart = words[title[0].word].at;
  const tileAt = words[title[title.length - 1].word].at;
  const exit = outro(frame, durationInFrames, 8);

  // Part 1 — "À partir d'aujourd'hui" + "Jour 1".
  const partOneOut = ramp(frame, titleStart - 3, titleStart + 3, EASE_IN);
  // Part 2 — "Je publie sur" + carousel.
  const switchToX = words[wX].at - 2;
  const switchToYoutube = words[wYoutube].at - 2;
  const swap = (at: number) => Math.min(1, pop(frame, at, { damping: 20, stiffness: 280, mass: 0.6 }));
  const contentIn = [pop(frame, words[wInstagram].at - 4), swap(switchToX), swap(switchToYoutube)];
  const contentOut = [swap(switchToX), swap(switchToYoutube), 0];
  const tile = pop(frame, tileAt - 3, { damping: 14, stiffness: 160 });

  const cursorIn = ramp(frame, words[wInstagram].at - 2, words[wInstagram].at + 6);
  const cursorTravel = interpolate(frame, [words[wInstagram].at, switchToX - 5], [0, 1], {
    ...CLAMP,
    easing: EASE_IN_OUT,
  });
  const click = (at: number) => interpolate(frame, [at - 4, at - 1, at + 4], [0, 1, 0], CLAMP);
  const clicking = Math.max(click(switchToX), click(switchToYoutube));
  const arrowX = 540 + ARROW_OFFSET;

  return (
    <AbsoluteFill
      style={{
        fontFamily: FONT,
        background: "linear-gradient(180deg, #F9FBFF 0%, #E3EEFC 50%, #BBD6F6 100%)",
      }}
    >
      <AbsoluteFill
        style={{
          scale: String(1 + exit * 0.35),
          filter: `blur(${interpolate(exit, [0, 1], [0, 18], { ...CLAMP, easing: EASE_IN })}px)`,
          opacity: 1 - exit,
        }}
      >
        {/* Part 1 */}
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            translate: `0px ${-partOneOut * 160}px`,
            filter: `blur(${partOneOut * 16}px)`,
            opacity: 1 - partOneOut,
          }}
        >
          <div
            style={{
              fontSize: 52,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "#6B7383",
              marginBottom: 6,
              ...reveal(pop(frame, words[prefix.word].at - 3)),
            }}
          >
            {prefix.label}
          </div>
          <div style={{ fontSize: 96, fontWeight: 800, letterSpacing: "-0.04em", color: "#0E1116" }}>
            <span style={{ display: "inline-block", ...reveal(pop(frame, words[line1.word].at - 3)) }}>{line1.label}</span>
          </div>
          <div style={{ fontSize: 96, fontWeight: 800, letterSpacing: "-0.04em", color: "#0E1116", marginTop: -4 }}>
            <span style={{ display: "inline-block", ...reveal(pop(frame, words[line2.word].at - 3)) }}>{line2.label}</span>
          </div>
          <div
            style={{
              marginTop: 34,
              padding: "14px 34px",
              borderRadius: 999,
              backgroundColor: "#1F7BFF",
              color: "white",
              fontSize: 40,
              fontWeight: 700,
              boxShadow: "0 12px 30px rgba(31,123,255,0.35)",
              ...reveal(pop(frame, words[line2.word].at + 2, { damping: 11 }), { fromScale: 0.4 }),
            }}
          >
            {badge}
          </div>
        </AbsoluteFill>

        {/* Part 2 */}
        <div
          style={{
            position: "absolute",
            top: 210,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            gap: 22,
            fontSize: 88,
            fontWeight: 800,
            letterSpacing: "-0.04em",
            color: "#0E1116",
          }}
        >
          {title.map(({ label, word }) => (
            <span key={label} style={{ display: "inline-block", ...reveal(pop(frame, words[word].at - 3)) }}>
              {label}
            </span>
          ))}
        </div>
        <div
          style={{
            position: "absolute",
            left: 540 - 140,
            top: CAROUSEL_Y - 140,
            width: 280,
            height: 280,
            borderRadius: 70,
            background: "linear-gradient(180deg, #FFFFFF, #F3F5F9)",
            boxShadow: "0 30px 70px rgba(40,90,170,0.22), inset 0 1px 0 white",
            overflow: "hidden",
            ...reveal(tile, { distance: 60 }),
          }}
        >
          {PLATFORMS.map((p, i) => {
            const inP = contentIn[i];
            const outP = contentOut[i];
            return (
              <div
                key={p.id}
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  translate: `${(1 - inP) * 200 - outP * 200}px 0px`,
                  opacity: Math.min(1, Math.max(0, inP) * 1.5) * (1 - outP),
                  filter: `blur(${Math.max(0, 1 - inP) * 10 + outP * 10}px)`,
                }}
              >
                <PlatformLogo platform={p.id} size={160} />
              </div>
            );
          })}
        </div>
        {[-1, 1].map((dir) => (
          <div
            key={dir}
            style={{
              position: "absolute",
              left: 540 + dir * ARROW_OFFSET - 36,
              top: CAROUSEL_Y - 36,
              width: 72,
              height: 72,
              borderRadius: 999,
              backgroundColor: "#2F80FF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 10px 24px rgba(47,128,255,0.4)",
              ...reveal(pop(frame, tileAt + 2 + (dir + 1) * 2), { fromScale: 0.3 }),
              scale: String(
                Math.max(0, pop(frame, tileAt + 2 + (dir + 1) * 2)) * (dir === 1 ? 1 - clicking * 0.15 : 1),
              ),
            }}
          >
            <ChevronIcon size={40} color="white" direction={dir === 1 ? "right" : "left"} stroke={3} />
          </div>
        ))}
        <div style={{ position: "absolute", left: 0, right: 0, top: CAROUSEL_Y + 190, height: 70 }}>
          {PLATFORMS.map((p, i) => (
            <div
              key={p.id}
              style={{
                position: "absolute",
                inset: 0,
                textAlign: "center",
                fontSize: 50,
                fontWeight: 700,
                color: "#0E1116",
                letterSpacing: "-0.02em",
                translate: `${(1 - contentIn[i]) * 120 - contentOut[i] * 120}px 0px`,
                opacity: Math.min(1, Math.max(0, contentIn[i]) * 1.5) * (1 - contentOut[i]),
                filter: `blur(${Math.max(0, 1 - contentIn[i]) * 8 + contentOut[i] * 8}px)`,
              }}
            >
              {p.label}
            </div>
          ))}
        </div>
        <div
          style={{
            position: "absolute",
            left: interpolate(cursorTravel, [0, 1], [880, arrowX + 4]),
            top: interpolate(cursorTravel, [0, 1], [930, CAROUSEL_Y + 8]),
            opacity: cursorIn,
            scale: String(1 - clicking * 0.18),
            transformOrigin: "0% 0%",
            filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.25))",
          }}
        >
          <Cursor size={52} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
