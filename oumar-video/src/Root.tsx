import { Composition, Folder } from "remotion";
import { OumarReel } from "./OumarReel";
import { profileSchema } from "./profile";
import { S01Attention } from "./scenes/S01Attention";
import { S02EverySecond } from "./scenes/S02EverySecond";
import { S03Audience } from "./scenes/S03Audience";
import { S04Countdown } from "./scenes/S04Countdown";
import { S05Losing } from "./scenes/S05Losing";
import { S06Leaders } from "./scenes/S06Leaders";
import { S07Clearer } from "./scenes/S07Clearer";
import { S08Clarity } from "./scenes/S08Clarity";
import { S09NewBeginning } from "./scenes/S09NewBeginning";
import { S10Wheel } from "./scenes/S10Wheel";
import { S11NewPage } from "./scenes/S11NewPage";
import { S12Profile } from "./scenes/S12Profile";
import { S13Finale } from "./scenes/S13Finale";
import { z } from "zod";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="OumarReel"
        component={OumarReel}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={1365}
        schema={z.object({ profile: profileSchema })}
        defaultProps={{
          profile: {
            name: "Oumar",
            posts: 14,
            followers: 2077,
            following: 633,
            bio: "Ты становишься тем, что повторяешь ⚡",
          },
        }}
      />
      <Folder name="Scenes-Card">
        <Composition id="S01-Attention" component={S01Attention} width={920} height={1640} fps={30} durationInFrames={90} />
        <Composition id="S02-EverySecond" component={S02EverySecond} width={920} height={1640} fps={30} durationInFrames={75} />
        <Composition id="S03-Audience" component={S03Audience} width={920} height={1640} fps={30} durationInFrames={120} />
        <Composition id="S04-Countdown" component={S04Countdown} width={920} height={1640} fps={30} durationInFrames={75} />
        <Composition id="S05-Losing" component={S05Losing} width={920} height={1640} fps={30} durationInFrames={120} />
        <Composition id="S06-Leaders" component={S06Leaders} width={920} height={1640} fps={30} durationInFrames={90} />
        <Composition id="S07-Clearer" component={S07Clearer} width={920} height={1640} fps={30} durationInFrames={120} />
        <Composition id="S08-Clarity" component={S08Clarity} width={1080} height={1920} fps={30} durationInFrames={135} />
      </Folder>
      <Folder name="Scenes-Instagram">
        <Composition id="S09-NewBeginning" component={S09NewBeginning} width={1080} height={1920} fps={30} durationInFrames={60} />
        <Composition id="S10-Wheel" component={S10Wheel} width={1080} height={1920} fps={30} durationInFrames={75} />
        <Composition id="S11-NewPage" component={S11NewPage} width={1080} height={1920} fps={30} durationInFrames={90} />
        <Composition
          id="S12-Profile"
          component={S12Profile}
          width={1080}
          height={1920}
          fps={30}
          durationInFrames={180}
          defaultProps={{
            profile: {
              name: "Oumar",
              posts: 14,
              followers: 2077,
              following: 633,
              bio: "Ты становишься тем, что повторяешь ⚡",
            },
          }}
        />
        <Composition
          id="S13-Finale"
          component={S13Finale}
          width={1080}
          height={1920}
          fps={30}
          durationInFrames={135}
          defaultProps={{
            profile: {
              name: "Oumar",
              posts: 14,
              followers: 2077,
              following: 633,
              bio: "Ты становишься тем, что повторяешь ⚡",
            },
          }}
        />
      </Folder>
    </>
  );
};
