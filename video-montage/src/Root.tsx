import { Composition } from "remotion";
import { Montage } from "./Montage";
import { DURATION, FPS, HEIGHT, WIDTH } from "./lib/constants";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Montage"
      component={Montage}
      durationInFrames={DURATION}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};
