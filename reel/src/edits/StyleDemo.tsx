import React from "react";
import { Video } from "@remotion/media";
import { AbsoluteFill, staticFile } from "remotion";
import { CameraRig, Shake, Shot } from "../components/footage/CameraRig";
import { Finish } from "../components/footage/Finish";
import { Captions } from "../components/text/Captions";
import { KeywordSlam } from "../components/text/KeywordSlam";
import { KineticHeadline } from "../components/text/KineticHeadline";
import { Beat, kicksFor, Sfx, TransitionAt, TransitionSpec } from "../components/timeline";
import { Cursor } from "../components/ui/Cursor";
import { SearchBar } from "../components/ui/SearchBar";
import { StatCard } from "../components/ui/StatCard";
import { Toast } from "../components/ui/Toast";
import { fakeCaptions } from "../lib/fake-captions";
import { ink } from "../theme";

// Timeline, in seconds. Cuts (shot changes) sit under transition midpoints or
// on sentence boundaries, exactly like a hand-cut talking-head reel.
const transitions: TransitionSpec[] = [
  { at: 3.0, kind: "sweep", palette: "aurora", label: "The method", index: "01" },
  { at: 6.4, kind: "bars", palette: "sunset" },
  { at: 9.6, kind: "iris", palette: "ocean" },
  { at: 11.8, kind: "flash", palette: "aurora" },
  { at: 14.4, kind: "sweep", palette: "royal" },
];

const shots: Shot[] = [
  { at: 0, scale: 1.0, drift: 0.04 },
  { at: 3.0, scale: 1.16, y: -3 },
  { at: 4.75, scale: 1.04 },
  { at: 6.4, scale: 1.12, x: 2 },
  { at: 8.1, scale: 1.24, y: -4, smooth: 0.7 },
  { at: 9.6, scale: 1.0 },
  { at: 11.8, scale: 1.14, y: -3 },
  { at: 14.4, scale: 1.02, drift: 0.05 },
];

const shakes: Shake[] = [
  { at: 0.05, intensity: 0.8 },
  { at: 9.75, intensity: 1.2, duration: 0.5 },
];

const captions = fakeCaptions([
  [3.35, "Every cut and every word is designed"],
  [5.0, "to keep you watching."],
  [6.75, "Retention climbs when the edit has rhythm."],
  [12.0, "Type it once, then let"],
  [13.2, "the system do the work."],
]);

export const StyleDemo: React.FC<{ src: string }> = ({ src }) => {
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

      {/* 0–3s · Hook */}
      <Beat name="Hook headline" at={0} dur={2.75}>
        <KineticHeadline kicker="Premium edit" text={"Most reels\nlose you in the\nfirst *second.*"} />
      </Beat>
      <Sfx name="impact" at={0} volume={0.55} />
      <Sfx name="pop" at={0.2} volume={0.35} />

      {/* 3–6.4s · Social proof */}
      <Beat name="Toast · views" at={3.35} dur={2.75}>
        <Toast app="Instagram Insights" title="Your reel is taking off" body="10,482 views in the first hour" glyph="↗" />
      </Beat>
      <Sfx name="ding" at={3.5} volume={0.45} />
      <Sfx name="swipe" at={3.35} volume={0.4} />

      {/* 6.4–9.6s · Data */}
      <Beat name="Stat card" at={6.6} dur={2.75}>
        <StatCard label="Average watch time" value={87} suffix="%" delta="212%" palette="sunset" />
      </Beat>
      <Sfx name="swipe" at={6.6} volume={0.4} />
      <Sfx name="pop" at={7.7} volume={0.35} />
      <Sfx name="riser" at={8.0} volume={0.5} />

      {/* 9.6–11.8s · Statement */}
      <Beat name="Keyword slam" at={9.7} dur={2.0}>
        <KeywordSlam word="Rhythm." sub="is everything" palette="ocean" />
      </Beat>
      <Sfx name="impact" at={9.72} volume={0.7} />

      {/* 11.8–14.4s · Product moment */}
      <Beat name="Search bar" at={11.95} dur={2.35}>
        <SearchBar query="Make my reel feel premium" palette="aurora" />
      </Beat>
      <Beat name="Cursor" at={12.55} dur={1.7}>
        <Cursor from={[30, 46]} to={[80.5, 23.5]} clickAt={1.35} />
      </Beat>
      <Sfx name="swipe" at={11.95} volume={0.35} />
      <Sfx name="tick" at={12.45} volume={0.25} />
      <Sfx name="tick" at={12.62} volume={0.25} />
      <Sfx name="tick" at={12.8} volume={0.25} />
      <Sfx name="tick" at={12.97} volume={0.25} />
      <Sfx name="tick" at={13.15} volume={0.25} />
      <Sfx name="tick" at={13.3} volume={0.25} />
      <Sfx name="click" at={13.9} volume={0.6} />

      {/* 14.4–16s · Outro */}
      <Beat name="Outro headline" at={14.55} dur={1.45}>
        <KineticHeadline kicker="Save this" text={"Follow for *more.*"} position="center" palette="royal" size={112} />
      </Beat>

      <Captions
        captions={captions}
        keywords={["designed", "watching", "rhythm", "system"]}
        hide={[[0, 3.2], [9.6, 11.8]]}
      />

      {transitions.map((t) => (
        <TransitionAt key={t.at} {...t} />
      ))}
    </AbsoluteFill>
  );
};
