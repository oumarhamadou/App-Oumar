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

// "Let's work together!" — big type with the selection sweep, mirroring the hook.
export const PhraseScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <Interactive.Div
        name="Phrase"
        style={{
          fontFamily: "Inter Display",
          fontWeight: 600,
          letterSpacing: "-0.035em",
          color: "#1D1D1F",
          textAlign: "center",
          opacity: interpolate(frame, [0, 8, 56, 70], [0, 1, 1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(frame, [0, 16, 52, 70], [1.25, 1, 1.02, 0.86], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: [
              Easing.bezier(0.16, 1, 0.3, 1),
              Easing.linear,
              Easing.bezier(0.7, 0, 0.84, 0),
            ],
            output: "perceptual-scale",
          }),
          filter: `blur(${interpolate(frame, [0, 12, 58, 70], [14, 0, 0, 12], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}px)`,
        }}
      >
        <SelectionText
          lines={["Давай", "поработаем", "вместе!"]}
          fontSize={116}
          caretFrom={6}
          selectFrom={12}
          selectTo={40}
        />
      </Interactive.Div>

      <Audio name="SFX select" src={staticFile("sfx/select.wav")} from={12} volume={0.5} />
    </AbsoluteFill>
  );
};
