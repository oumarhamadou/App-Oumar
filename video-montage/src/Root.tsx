import { Composition } from "remotion";
import { Montage } from "./Montage";
import { MontageV2 } from "./v2/MontageV2";
import { MontageV3 } from "./v3/MontageV3";
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
      {/* Version 3 – reference #3 (card on white, black/red typography, warm flash) */}
      <Composition
        id="MontageV3"
        component={MontageV3}
        durationInFrames={DURATION}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
