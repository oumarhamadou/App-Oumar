import { Easing, interpolate, useCurrentFrame } from "remotion";

type Props = {
  lines: string[];
  fontSize: number;
  caretFrom: number;
  selectFrom: number;
  selectTo: number;
};

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

// Multi-line headline with an iOS-style text selection sweeping across it.
export const SelectionText: React.FC<Props> = ({
  lines,
  fontSize,
  caretFrom,
  selectFrom,
  selectTo,
}) => {
  const frame = useCurrentFrame();
  const total = lines.reduce((sum, line) => sum + line.length, 0);
  const progress = interpolate(frame, [selectFrom, selectTo], [0, total], {
    ...clamp,
    easing: Easing.bezier(0.65, 0, 0.35, 1),
  });

  let consumed = 0;
  const lineProgress = lines.map((line) => {
    const p = Math.min(1, Math.max(0, (progress - consumed) / line.length));
    consumed += line.length;
    return p;
  });
  const activeLine = Math.max(
    0,
    lineProgress.reduce((last, p, i) => (p > 0 ? i : last), 0),
  );

  const handleScale = interpolate(frame, [selectFrom - 2, selectFrom + 6], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.34, 1.56, 0.64, 1),
  });
  const caretOn =
    frame >= caretFrom &&
    frame < selectFrom &&
    Math.floor((frame - caretFrom) / 7) % 2 === 0;

  const knob = Math.round(fontSize * 0.17);
  const bar = Math.max(4, Math.round(fontSize * 0.04));

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontSize,
        lineHeight: 1.12,
      }}
    >
      {lines.map((line, i) => (
        <div key={i} style={{ position: "relative", display: "inline-block" }}>
          <div
            style={{
              position: "absolute",
              left: -8,
              top: "8%",
              bottom: "2%",
              width: `calc(${lineProgress[i] * 100}% + ${lineProgress[i] > 0 ? 16 : 0}px)`,
              backgroundColor: "rgba(0,113,227,0.18)",
              borderRadius: 8,
            }}
          />
          <span style={{ position: "relative" }}>{line}</span>

          {i === 0 && caretOn ? (
            <div
              style={{
                position: "absolute",
                left: -8,
                top: "10%",
                bottom: "4%",
                width: bar,
                borderRadius: bar,
                backgroundColor: "#0071E3",
              }}
            />
          ) : null}

          {i === 0 ? (
            <div
              style={{
                position: "absolute",
                left: -8 - bar / 2,
                top: "8%",
                bottom: "2%",
                width: bar,
                backgroundColor: "#0071E3",
                borderRadius: bar,
                scale: `1 ${handleScale}`,
                transformOrigin: "top",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  width: knob,
                  height: knob,
                  borderRadius: "50%",
                  backgroundColor: "#0071E3",
                  left: bar / 2 - knob / 2,
                  top: -knob + 2,
                  scale: handleScale,
                }}
              />
            </div>
          ) : null}

          {i === activeLine ? (
            <div
              style={{
                position: "absolute",
                left: `calc(${lineProgress[i] * 100}% + ${lineProgress[i] > 0 ? 8 : -8}px)`,
                marginLeft: -bar / 2,
                top: "8%",
                bottom: "2%",
                width: bar,
                backgroundColor: "#0071E3",
                borderRadius: bar,
                scale: `1 ${handleScale}`,
                transformOrigin: "bottom",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  width: knob,
                  height: knob,
                  borderRadius: "50%",
                  backgroundColor: "#0071E3",
                  left: bar / 2 - knob / 2,
                  bottom: -knob + 2,
                  scale: handleScale,
                }}
              />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
};
