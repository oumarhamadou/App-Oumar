export type Word = { text: string; emphasis: boolean; lineBreak: boolean };

/**
 * "Edit like a *real pro*\nevery time" -> words, with *...* spans marked as
 * emphasis (serif italic + gradient) and \n as forced line breaks.
 */
export const parseWords = (input: string): Word[] => {
  const words: Word[] = [];
  let emphasis = false;
  input.split("\n").forEach((line, lineIndex) => {
    line
      .split(" ")
      .filter(Boolean)
      .forEach((raw, i) => {
        let text = raw;
        const opens = text.startsWith("*");
        if (opens) {
          emphasis = true;
          text = text.slice(1);
        }
        const closes = text.endsWith("*") || text.match(/\*[.,!?:;]+$/) !== null;
        text = text.replace(/\*/g, "");
        words.push({ text, emphasis, lineBreak: lineIndex > 0 && i === 0 });
        if (closes) emphasis = false;
      });
  });
  return words;
};
