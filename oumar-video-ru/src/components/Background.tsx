import { AbsoluteFill, useCurrentFrame } from "remotion";

// Apple-style light canvas with slow, soft colour fields.
export const Background: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: "#F5F5F7", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          width: 1100,
          height: 1100,
          left: -380,
          top: -420,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(10,132,255,0.16) 0%, rgba(10,132,255,0) 62%)",
          translate: `${Math.sin(frame / 80) * 50}px ${Math.cos(frame / 95) * 40}px`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1000,
          height: 1000,
          right: -380,
          bottom: -380,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(191,90,242,0.14) 0%, rgba(191,90,242,0) 62%)",
          translate: `${Math.cos(frame / 70) * 50}px ${Math.sin(frame / 85) * 40}px`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 760,
          height: 760,
          left: -260,
          bottom: -300,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,55,95,0.08) 0%, rgba(255,55,95,0) 62%)",
          translate: `${Math.sin(frame / 60) * 40}px ${Math.cos(frame / 75) * 30}px`,
        }}
      />
    </AbsoluteFill>
  );
};
