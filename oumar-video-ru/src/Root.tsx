import "./fonts";
import { Composition, Folder } from "remotion";
import { OumarVideo } from "./OumarVideo";
import { ChatScene } from "./scenes/ChatScene";
import { ComposerScene } from "./scenes/ComposerScene";
import { EndCardScene } from "./scenes/EndCardScene";
import { HookScene } from "./scenes/HookScene";
import { NotificationsScene } from "./scenes/NotificationsScene";
import { PhraseScene } from "./scenes/PhraseScene";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Scenes">
        <Composition id="Hook" component={HookScene} width={1080} height={1080} fps={30} durationInFrames={80} />
        <Composition id="Composer" component={ComposerScene} width={1080} height={1080} fps={30} durationInFrames={150} />
        <Composition id="Notifications" component={NotificationsScene} width={1080} height={1080} fps={30} durationInFrames={180} />
        <Composition id="Chat" component={ChatScene} width={1080} height={1080} fps={30} durationInFrames={165} />
        <Composition id="Phrase" component={PhraseScene} width={1080} height={1080} fps={30} durationInFrames={70} />
        <Composition id="EndCard" component={EndCardScene} width={1080} height={1080} fps={30} durationInFrames={150} />
      </Folder>
      <Composition id="OumarRU" component={OumarVideo} width={1080} height={1080} fps={30} durationInFrames={741} />
    </>
  );
};
