import { Audio } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { AbsoluteFill, staticFile } from "remotion";
import { Background } from "./components/Background";
import { ChatScene } from "./scenes/ChatScene";
import { ComposerScene } from "./scenes/ComposerScene";
import { EndCardScene } from "./scenes/EndCardScene";
import { HookScene } from "./scenes/HookScene";
import { NotificationsScene } from "./scenes/NotificationsScene";
import { PhraseScene } from "./scenes/PhraseScene";

// 80 + 150 + 180 + 165 + 70 + 150 - (10 + 12 + 10 + 10 + 12) = 741 frames
export const OumarVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Background />
      <TransitionSeries>
        <TransitionSeries.Sequence name="Hook" durationInFrames={80}>
          <HookScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 10 })} />
        <TransitionSeries.Sequence name="Composer" durationInFrames={150}>
          <ComposerScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 12 })} />
        <TransitionSeries.Sequence name="Notifications" durationInFrames={180}>
          <NotificationsScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 10 })} />
        <TransitionSeries.Sequence name="Chat" durationInFrames={165}>
          <ChatScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 10 })} />
        <TransitionSeries.Sequence name="Phrase" durationInFrames={70}>
          <PhraseScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 12 })} />
        <TransitionSeries.Sequence name="End card" durationInFrames={150}>
          <EndCardScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <Audio name="Music" src={staticFile("audio/music.wav")} volume={0.5} />
    </AbsoluteFill>
  );
};
