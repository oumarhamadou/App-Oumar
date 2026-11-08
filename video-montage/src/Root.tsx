import { Composition } from "remotion";
import { Montage } from "./edit/Montage";
import { DURATION, FPS, HEIGHT, WIDTH } from "./edit/script";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Montage"
      component={Montage}
      durationInFrames={DURATION}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={{ cutout: true, sfx: true }}
    />
  );
};
