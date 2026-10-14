const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&nbsp;": " ",
};

function decode(text: string) {
  return text.replace(/&(amp|lt|gt|quot|#39|nbsp);/g, (m) => ENTITIES[m] ?? m);
}

const stripTags = (html: string) => html.replace(/<[^>]+>/g, "");

const hasTags = (text: string) => /<\/?[a-z][^>]*>/i.test(text);

/** Rich-text HTML -> plain text with one line per list item / paragraph. */
function htmlToText(html: string) {
  return decode(stripTags(html.replace(/<\/(li|p|h[1-6])>|<br\s*\/?>/gi, "\n")));
}

/**
 * Admin-authored lists -> arrays. Works for rich text (bullets / paragraphs)
 * as well as plain one-per-line text.
 */
export function parseLines(text: string | undefined | null): string[] {
  const source = text || "";
  return (hasTags(source) ? htmlToText(source) : source)
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
}

/**
 * "Title | detail" or "Title: detail" entries. The detail is optional. A colon
 * only splits when the part before it is short enough to be a title.
 */
export function parseTitled(text: string | undefined | null): { title: string; detail: string }[] {
  return parseLines(text).map((line) => {
    if (line.includes("|")) {
      const [title, ...rest] = line.split("|");
      return { title: title.trim(), detail: rest.join("|").trim() };
    }
    const colon = line.indexOf(":");
    if (colon > 0 && colon <= 48 && line.slice(0, colon).trim().split(/\s+/).length <= 7) {
      return { title: line.slice(0, colon).trim(), detail: line.slice(colon + 1).trim() };
    }
    return { title: line, detail: "" };
  });
}

/** Sections: a heading (or the first line of a block) titles each group, bullets follow. */
export function parseBlocks(text: string | undefined | null): { title: string; items: string[] }[] {
  const source = text || "";

  if (hasTags(source)) {
    const blocks: { title: string; items: string[] }[] = [];
    const token = /<(h[1-6])[^>]*>([\s\S]*?)<\/\1>|<li[^>]*>([\s\S]*?)<\/li>/gi;
    let match: RegExpExecArray | null;
    while ((match = token.exec(source))) {
      if (match[1]) {
        const title = decode(stripTags(match[2])).trim();
        if (title) blocks.push({ title, items: [] });
      } else if (blocks.length) {
        const item = decode(stripTags(match[3])).trim();
        if (item) blocks[blocks.length - 1].items.push(item);
      }
    }
    return blocks;
  }

  return source
    .split(/\r?\n\s*\r?\n/)
    .map((block) => parseLines(block))
    .filter((lines) => lines.length)
    .map(([title, ...items]) => ({ title, items }));
}
