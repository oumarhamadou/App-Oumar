import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { SelectionText } from "../components/SelectionText";

// "What happens after…" — the hook, with an iOS text selection.
export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{ justifyContent: "center", alignItems: "center" }}
    >
      <Interactive.Div
        name="Hook title"
        style={{
          fontFamily: "Inter Display",
          fontWeight: 600,
          letterSpacing: "-0.035em",
          color: "#1D1D1F",
          textAlign: "center",
          opacity: interpolate(frame, [0, 10, 64, 78], [0, 1, 1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(frame, [0, 16], ["0px 40px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          scale: interpolate(frame, [0, 16, 58, 78], [0.96, 1, 1.03, 0.72], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: [
              Easing.bezier(0.16, 1, 0.3, 1),
              Easing.linear,
              Easing.bezier(0.7, 0, 0.84, 0),
            ],
            output: "perceptual-scale",
          }),
          rotate: interpolate(frame, [58, 78], ["0deg", "-9deg"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.7, 0, 0.84, 0),
          }),
          filter: `blur(${interpolate(frame, [0, 12, 64, 78], [12, 0, 0, 16], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}px)`,
        }}
      >
        <SelectionText
          lines={["Что происходит", "после…"]}
          fontSize={112}
          caretFrom={6}
          selectFrom={16}
          selectTo={42}
        />
      </Interactive.Div>

      <Audio name="SFX select" src={staticFile("sfx/select.wav")} from={16} volume={0.5} />
      <Audio name="SFX whoosh out" src={staticFile("sfx/whoosh-rev.wav")} from={60} volume={0.3} />
    </AbsoluteFill>
  );
};
