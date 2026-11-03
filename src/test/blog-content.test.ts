import { describe, expect, it } from "vitest";
import {
  blocksToHtml,
  parseBlocks,
  plainText,
  readStory,
  sanitizeInline,
  slugify,
  storyExcerpt,
} from "@/lib/blog";

describe("blog content", () => {
  it("builds a web address from a title", () => {
    expect(slugify("An Evening at the Gardens!")).toBe("an-evening-at-the-gardens");
  });

  it("drops scripts and keeps emphasis", () => {
    expect(sanitizeInline("Hello <script>alert(1)</script> <strong>there</strong>")).toBe(
      "Hello  <strong>there</strong>",
    );
  });

  it("round-trips paragraphs, headings, quotes, lists and photos", () => {
    const blocks = parseBlocks([
      { type: "heading", level: 2, html: "From the kitchen" },
      { type: "paragraph", html: "A <strong>slow</strong> lunch." },
      { type: "quote", html: "Stay for the evening." },
      { type: "list", ordered: false, items: ["Naan", "Tikka"] },
      {
        type: "image",
        url: "https://cdn.example.com/naan.jpg",
        alt: "Naan",
        caption: "From the tandoor",
      },
      { type: "image", url: "javascript:alert(1)", alt: "Bad", caption: "" },
    ]);
    const root = document.createElement("div");
    root.innerHTML = blocksToHtml(blocks);
    expect(readStory(root)).toEqual([
      { type: "heading", level: 2, html: "From the kitchen" },
      { type: "paragraph", html: "A <strong>slow</strong> lunch." },
      { type: "quote", html: "Stay for the evening." },
      { type: "list", ordered: false, items: ["Naan", "Tikka"] },
      {
        type: "image",
        url: "https://cdn.example.com/naan.jpg",
        alt: "Naan",
        caption: "From the tandoor",
      },
    ]);
    const paragraph = blocks.find((block) => block.type === "paragraph");
    expect(paragraph ? plainText(paragraph.html) : "").toBe("A slow lunch.");
  });

  it("uses the first paragraph when a summary is missing", () => {
    expect(
      storyExcerpt({ excerpt: "", blocks: [{ type: "paragraph", html: "Garden supper." }] }),
    ).toBe("Garden supper.");
  });
});
