export function getPublicStory(text: string | undefined): string {
  const content = text?.trim() ?? "";
  const placeholder = content.replace(/\s+/g, "").replace(/[.!。]+$/u, "");
  const emptyLabels = new Set(["설명없음", "설명이없습니다", "설명란입니다", "내용없음", "등록된설명이없습니다"]);
  return emptyLabels.has(placeholder) ? "" : content;
}

function splitSentences(text: string): string[] {
  if (typeof Intl.Segmenter === "function") {
    const segmenter = new Intl.Segmenter("ko", { granularity: "sentence" });
    return Array.from(segmenter.segment(text), ({ segment }) => segment.trim())
      .filter(Boolean);
  }

  // Older browsers: retain punctuation and avoid splitting decimal numbers.
  return text.split(/(?<=[.!?。！？])\s+/u).map((sentence) => sentence.trim())
    .filter(Boolean);
}

export function getStoryOpeningSentences(text: string | undefined): string[] {
  const content = getPublicStory(text);
  if (!content) return [];
  const opening = content.replace(/\s+/g, " ");
  return splitSentences(opening).slice(0, 2);
}

export function getStoryExcerpt(text: string | undefined): string {
  return getStoryOpeningSentences(text).join(" ");
}

export function getStoryParagraphs(text: string): string[] {
  const blocks = getPublicStory(text).replace(/\r\n?/g, "\n").split(/\n+/)
    .map((block) => block.trim()).filter(Boolean);

  // Respect author-entered paragraphs. Only format an unbroken block automatically.
  if (blocks.length > 1) return blocks;
  const sentences = splitSentences(blocks[0] ?? "");
  const paragraphs: string[] = [];
  for (let index = 0; index < sentences.length; index += 2) {
    paragraphs.push(sentences.slice(index, index + 2).join(" "));
  }
  return paragraphs;
}
