import React from "react";
import type { Caption } from "@remotion/captions";
import { Video } from "@remotion/media";
import { AbsoluteFill, staticFile } from "remotion";
import { CameraRig, Shake, Shot } from "../components/footage/CameraRig";
import { Finish } from "../components/footage/Finish";
import { Captions } from "../components/text/Captions";
import { kicksFor, TransitionAt, TransitionSpec } from "../components/timeline";
import { ink } from "../theme";

/*
 * The edit for the real footage (public/input.mp4).
 *
 * Workflow: transcribe the footage into public/captions.json, then cut it like
 * the StyleDemo: punch-ins on sentence boundaries (`shots`), gradient
 * transitions on section changes (`transitions`), and <Beat>s for headlines,
 * keyword slams and UI cards placed on the spoken words they illustrate.
 */

const transitions: TransitionSpec[] = [];

const shots: Shot[] = [{ at: 0, scale: 1.0, drift: 0.03 }];

const shakes: Shake[] = [];

export const MainEdit: React.FC<{
  src: string;
  captionsFile: string;
  captions: Caption[];
}> = ({ src, captions }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: ink }}>
      <CameraRig shots={shots} kicks={kicksFor(transitions)} shakes={shakes}>
        <Video
          name="Footage"
          src={staticFile(src)}
          style={{ filter: "contrast(1.06) saturate(1.08)" }}
        />
      </CameraRig>
      <Finish />

      <Captions captions={captions} hide={[]} keywords={[]} />

      {transitions.map((t) => (
        <TransitionAt key={t.at} {...t} />
      ))}
    </AbsoluteFill>
  );
};
