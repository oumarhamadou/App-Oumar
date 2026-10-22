import "./theme";
import type { Caption } from "@remotion/captions";
import { CalculateMetadataFunction, Composition, staticFile } from "remotion";
import { MainEdit } from "./edits/MainEdit";
import { StyleDemo } from "./edits/StyleDemo";
import { getVideoMeta } from "./lib/video-meta";
import { StandIn } from "./StandIn";

type FootageProps = { src: string };
type MainProps = { src: string; captionsFile: string; captions: Caption[] };

// The edit always inherits the footage's own size, fps and length, so the
// reel keeps its original format.
const matchFootage: CalculateMetadataFunction<FootageProps> = async ({ props }) => {
  const meta = await getVideoMeta(staticFile(props.src));
  return {
    width: meta.width,
    height: meta.height,
    fps: meta.fps,
    durationInFrames: Math.floor(meta.durationInSeconds * meta.fps),
  };
};

const matchFootageWithCaptions: CalculateMetadataFunction<MainProps> = async ({
  props,
  abortSignal,
}) => {
  const meta = await getVideoMeta(staticFile(props.src));
  let captions: Caption[] = [];
  const res = await fetch(staticFile(props.captionsFile), { signal: abortSignal });
  if (res.ok) captions = await res.json();
  return {
    width: meta.width,
    height: meta.height,
    fps: meta.fps,
    durationInFrames: Math.floor(meta.durationInSeconds * meta.fps),
    props: { ...props, captions },
    defaultOutName: "reel-edited",
  };
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Reel"
        component={MainEdit}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ src: "input.mp4", captionsFile: "captions.json", captions: [] }}
        calculateMetadata={matchFootageWithCaptions}
      />
      <Composition
        id="StyleDemo"
        component={StyleDemo}
        durationInFrames={480}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ src: "standin.mp4" }}
        calculateMetadata={matchFootage}
      />
      <Composition
        id="StandIn"
        component={StandIn}
        durationInFrames={480}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
