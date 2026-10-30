import { Composition, Folder } from "remotion";
import { z } from "zod";
import { OumarReel } from "./OumarReel";
import { profileSchema } from "./profile";
import { S1NewBeginning } from "./scenes/S1NewBeginning";
import { S2Wheel } from "./scenes/S2Wheel";
import { S3Introducing } from "./scenes/S3Introducing";
import { S4Profile } from "./scenes/S4Profile";
import { S5Follow } from "./scenes/S5Follow";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="OumarReel"
        component={OumarReel}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={544}
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
      <Folder name="Scenes">
        <Composition id="S1-NewBeginning" component={S1NewBeginning} width={1080} height={1920} fps={30} durationInFrames={60} />
        <Composition id="S2-Wheel" component={S2Wheel} width={1080} height={1920} fps={30} durationInFrames={60} />
        <Composition id="S3-Introducing" component={S3Introducing} width={1080} height={1920} fps={30} durationInFrames={104} />
        <Composition
          id="S4-Profile"
          component={S4Profile}
          width={1080}
          height={1920}
          fps={30}
          durationInFrames={152}
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
          id="S5-Follow"
          component={S5Follow}
          width={1080}
          height={1920}
          fps={30}
          durationInFrames={192}
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
