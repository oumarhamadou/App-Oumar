import { Composition } from "remotion";
import { Montage } from "./Montage";
import { MontageV2 } from "./v2/MontageV2";
import { DURATION, FPS, HEIGHT, WIDTH } from "./lib/constants";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Version 1 – reference #1 (gold serif, words behind, difference) */}
      <Composition
        id="Montage"
        component={Montage}
        durationInFrames={DURATION}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      {/* Version 2 – reference #2 (clean grotesque, jump cuts, prism light sweep) */}
      <Composition
        id="MontageV2"
        component={MontageV2}
        durationInFrames={DURATION}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
