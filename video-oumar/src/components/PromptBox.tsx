import React from "react";
import { FONT } from "../fonts";
import {
  ArrowUpIcon,
  ChevronIcon,
  CloseIcon,
  ImageIcon,
  MicIcon,
  PlusIcon,
} from "./shapes";

export const PROMPT_TEXT = "je fais ce que j'aime le plus : monter des vidéos";

/** Layout constants, shared with the scenes that move the camera around the box. */
export const BOX = {
  width: 940,
  left: 70,
  top: 407,
  flashCenter: { x: 758, y: 617 },
};

export const MENU_ITEMS = ["Aujourd'hui", "j'ai", "zéro client"];

/** A dark "AI prompt" input box, like a chat composer. */
export const PromptBox: React.FC<{
  typed: number;
  /** Index (in PROMPT_TEXT words) of the word to highlight, or -1. */
  highlightWord: number;
  caretVisible: boolean;
  flashPressed?: number;
  /** 0 → 1 menu open progress. */
  menuOpen?: number;
  /** Fractional index of the highlighted menu item. */
  menuActive?: number;
}> = ({ typed, highlightWord, caretVisible, flashPressed = 0, menuOpen = 0, menuActive = -1 }) => {
  const shown = PROMPT_TEXT.slice(0, typed);
  // Split the typed text into words, keeping whitespace, to colour the spoken one.
  const parts = shown.split(/(\s+)/);
  let wordIndex = -1;

  return (
    <div
      style={{
        position: "absolute",
        left: BOX.left,
        top: BOX.top,
        width: BOX.width,
        borderRadius: 46,
        padding: "34px 36px 26px",
        background: "linear-gradient(180deg, rgba(44,51,68,0.96), rgba(32,38,52,0.96))",
        border: "1.5px solid rgba(255,255,255,0.09)",
        boxShadow: "0 30px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          minHeight: 116,
          fontSize: 44,
          lineHeight: "58px",
          fontWeight: 500,
          color: "#C9D0DC",
          letterSpacing: "-0.01em",
        }}
      >
        {parts.map((part, i) => {
          if (/^\s+$/.test(part) || part === "") {
            return <span key={i}>{part}</span>;
          }
          if (part !== ":") {
            wordIndex++;
          }
          const active = part !== ":" && wordIndex === highlightWord;
          return (
            <span key={i} style={{ color: active ? "#5A9BFF" : undefined }}>
              {part}
            </span>
          );
        })}
        <span
          style={{
            display: "inline-block",
            width: 3,
            height: 50,
            marginLeft: 3,
            verticalAlign: "-9px",
            backgroundColor: "#4D8DFF",
            opacity: caretVisible ? 1 : 0,
          }}
        />
      </div>
      <div
        style={{
          marginTop: 26,
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <PlusIcon size={40} color="#D3D8E2" stroke={2.2} />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              height: 52,
              padding: "0 16px",
              borderRadius: 16,
              backgroundColor: "rgba(52,108,255,0.28)",
              border: "1.5px solid rgba(90,150,255,0.45)",
            }}
          >
            <ImageIcon size={30} color="#BFD3FF" />
            <div style={{ width: 1.5, height: 26, backgroundColor: "rgba(191,211,255,0.4)" }} />
            <CloseIcon size={24} color="#BFD3FF" />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <div style={{ position: "relative" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                height: 52,
                padding: "0 18px 0 22px",
                borderRadius: 999,
                backgroundColor: `rgba(255,255,255,${0.07 + 0.08 * flashPressed})`,
                color: "#DDE2EA",
                fontSize: 26,
                fontWeight: 600,
                scale: String(1 - 0.08 * flashPressed),
              }}
            >
              Flash
              <ChevronIcon size={26} color="#DDE2EA" direction="down" />
            </div>
            {menuOpen > 0.001 ? (
              <div
                style={{
                  position: "absolute",
                  top: 66,
                  left: -40,
                  width: 300,
                  padding: 10,
                  borderRadius: 24,
                  background: "rgba(30,35,48,0.98)",
                  border: "1.5px solid rgba(255,255,255,0.08)",
                  boxShadow: "0 24px 60px rgba(0,0,0,0.55)",
                  transformOrigin: "50% 0%",
                  scale: `1 ${0.6 + 0.4 * Math.min(1, menuOpen)}`,
                  opacity: Math.min(1, menuOpen * 1.5),
                  filter: `blur(${(1 - Math.min(1, menuOpen)) * 8}px)`,
                }}
              >
                {menuActive >= 0 ? (
                  <div
                    style={{
                      position: "absolute",
                      left: 10,
                      right: 10,
                      top: 10 + menuActive * 64,
                      height: 64,
                      borderRadius: 16,
                      background: "linear-gradient(90deg, #2F55E0, #3D6BFF)",
                      boxShadow: "0 8px 24px rgba(47,85,224,0.45)",
                    }}
                  />
                ) : null}
                {MENU_ITEMS.map((item, i) => (
                  <div
                    key={item}
                    style={{
                      position: "relative",
                      height: 64,
                      display: "flex",
                      alignItems: "center",
                      padding: "0 20px",
                      fontSize: 29,
                      fontWeight: 600,
                      color: Math.abs(menuActive - i) < 0.5 ? "white" : "#A9B1C0",
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
          <MicIcon size={40} color="#D3D8E2" />
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: 999,
              backgroundColor: "#1F6BFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 6px 20px rgba(31,107,255,0.5)",
            }}
          >
            <ArrowUpIcon size={32} color="white" />
          </div>
        </div>
      </div>
    </div>
  );
};
