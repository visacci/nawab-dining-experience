import { supabase } from "@/integrations/supabase/client";
import type { Json, Tables } from "@/integrations/supabase/types";

export type BlogBlock =
  | { type: "paragraph"; html: string }
  | { type: "heading"; level: 2 | 3; html: string }
  | { type: "quote"; html: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "image"; url: string; alt: string; caption: string };

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverUrl: string | null;
  coverAlt: string;
  blocks: BlogBlock[];
  status: "draft" | "published";
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SavePostInput = {
  id: string | null;
  title: string;
  slug: string;
  excerpt: string;
  coverUrl: string | null;
  coverAlt: string;
  blocks: BlogBlock[];
  status: "draft" | "published";
  publishedAt: string | null;
};

const DROP_TAGS = new Set([
  "SCRIPT",
  "STYLE",
  "IFRAME",
  "OBJECT",
  "EMBED",
  "NOSCRIPT",
  "LINK",
  "META",
  "FORM",
]);

export function slugify(value: string) {
  const slug = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return slug || "story";
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function escapeAttr(value: string) {
  return escapeHtml(value).replace(/'/g, "&#39;");
}

export function plainText(html: string) {
  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function safeHref(value: string | null) {
  if (!value) return null;
  const trimmed = value.trim();
  if (trimmed.startsWith("/") && !trimmed.startsWith("//") && !trimmed.startsWith("/\\"))
    return trimmed;
  try {
    const url = new URL(trimmed);
    if (url.protocol === "http:" || url.protocol === "https:" || url.protocol === "mailto:")
      return url.href;
  } catch {
    return null;
  }
  return null;
}

export function safeImageUrl(value: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:") return null;
    return url.href;
  } catch {
    return null;
  }
}

export function sanitizeInline(html: string) {
  if (typeof DOMParser === "undefined") return escapeHtml(plainText(html));
  const doc = new DOMParser().parseFromString(`<div>${html}</div>`, "text/html");
  const root = doc.body.firstElementChild;
  if (!root) return "";
  return cleanChildren(root);
}

function cleanChildren(el: Element): string {
  let out = "";
  for (const node of el.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      out += escapeHtml(node.textContent ?? "");
      continue;
    }
    if (!(node instanceof HTMLElement)) continue;
    const tag = node.tagName;
    if (DROP_TAGS.has(tag)) continue;
    if (tag === "BR") {
      out += "<br>";
      continue;
    }
    if (tag === "STRONG" || tag === "B") {
      const inner = cleanChildren(node);
      out += inner ? `<strong>${inner}</strong>` : "";
      continue;
    }
    if (tag === "EM" || tag === "I") {
      const inner = cleanChildren(node);
      out += inner ? `<em>${inner}</em>` : "";
      continue;
    }
    if (tag === "A") {
      const href = safeHref(node.getAttribute("href"));
      const inner = cleanChildren(node);
      out += href ? `<a href="${escapeAttr(href)}">${inner}</a>` : inner;
      continue;
    }
    if (tag === "SPAN") {
      const weight = node.style.fontWeight;
      const italic = node.style.fontStyle === "italic";
      const inner = cleanChildren(node);
      if (weight === "bold" || weight === "bolder" || Number(weight) >= 600) {
        out += inner ? `<strong>${inner}</strong>` : "";
      } else if (italic) {
        out += inner ? `<em>${inner}</em>` : "";
      } else {
        out += inner;
      }
      continue;
    }
    out += cleanChildren(node);
  }
  return out;
}

export function storyHasBody(blocks: BlogBlock[]) {
  return blocks.some((block) => {
    if (block.type === "image") return true;
    if (block.type === "list") return block.items.some((item) => plainText(item).length > 0);
    return plainText(block.html).length > 0;
  });
}

export function storyExcerpt(post: Pick<BlogPost, "excerpt" | "blocks">, max = 180) {
  const source = post.excerpt.trim() || firstParagraph(post.blocks);
  if (source.length <= max) return source;
  const cut = source.slice(0, max);
  const trimmed = cut.replace(/\s+\S*$/, "");
  return `${trimmed || cut}…`;
}

export function readingMinutes(blocks: BlogBlock[]) {
  const text = blocks
    .map((block) => {
      if (block.type === "image") return block.caption;
      if (block.type === "list") return block.items.map((item) => plainText(item)).join(" ");
      return plainText(block.html);
    })
    .join(" ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function firstParagraph(blocks: BlogBlock[]) {
  for (const block of blocks) {
    if (block.type === "paragraph" || block.type === "heading" || block.type === "quote") {
      const text = plainText(block.html);
      if (text) return text;
    }
  }
  return "";
}

export function formatStoryDate(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function asRecord(value: unknown) {
  if (!value || typeof value !== "object") return null;
  return value as Record<string, unknown>;
}

function textField(record: Record<string, unknown>, key: string) {
  const value = record[key];
  return typeof value === "string" ? value : null;
}

export function parseBlocks(value: unknown): BlogBlock[] {
  if (!Array.isArray(value)) return [];
  const blocks: BlogBlock[] = [];
  for (const item of value) {
    const block = asRecord(item);
    if (!block) continue;
    const kind = block["type"];
    const html = textField(block, "html");
    if (kind === "paragraph" && html) {
      const safe = sanitizeInline(html);
      if (plainText(safe)) blocks.push({ type: "paragraph", html: safe });
      continue;
    }
    if (kind === "heading" && html) {
      const safe = sanitizeInline(html);
      if (!plainText(safe)) continue;
      blocks.push({ type: "heading", level: block["level"] === 3 ? 3 : 2, html: safe });
      continue;
    }
    if (kind === "quote" && html) {
      const safe = sanitizeInline(html);
      if (plainText(safe)) blocks.push({ type: "quote", html: safe });
      continue;
    }
    if (kind === "list" && Array.isArray(block["items"])) {
      const items = block["items"]
        .filter((entry): entry is string => typeof entry === "string")
        .map((entry) => sanitizeInline(entry))
        .filter((entry) => plainText(entry));
      if (items.length) blocks.push({ type: "list", ordered: block["ordered"] === true, items });
      continue;
    }
    if (kind === "image") {
      const url = safeImageUrl(textField(block, "url"));
      if (!url) continue;
      blocks.push({
        type: "image",
        url,
        alt: textField(block, "alt")?.trim() ?? "",
        caption: textField(block, "caption")?.trim() ?? "",
      });
    }
  }
  return blocks;
}

export function readStory(root: HTMLElement): BlogBlock[] {
  const blocks: BlogBlock[] = [];
  for (const node of root.childNodes) pushNode(node, blocks);
  return blocks;
}

function pushNode(node: Node, blocks: BlogBlock[]) {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = (node.textContent ?? "").replace(/\u00a0/g, " ").trim();
    if (text) blocks.push({ type: "paragraph", html: escapeHtml(text) });
    return;
  }
  if (!(node instanceof HTMLElement)) return;
  const tag = node.tagName;
  if (tag === "FIGURE" || node.dataset["image"] === "1") {
    const img = node.querySelector("img");
    const url = safeImageUrl(img?.getAttribute("src") ?? null);
    if (!url) return;
    blocks.push({
      type: "image",
      url,
      alt: img?.alt.trim() ?? "",
      caption: (node.querySelector("figcaption")?.textContent ?? "").replace(/\s+/g, " ").trim(),
    });
    return;
  }
  if (tag === "H2" || tag === "H3") {
    const html = sanitizeInline(node.innerHTML);
    if (plainText(html)) blocks.push({ type: "heading", level: tag === "H2" ? 2 : 3, html });
    return;
  }
  if (tag === "BLOCKQUOTE") {
    const html = sanitizeInline(node.innerHTML);
    if (plainText(html)) blocks.push({ type: "quote", html });
    return;
  }
  if (tag === "UL" || tag === "OL") {
    const items = [...node.querySelectorAll(":scope > li")]
      .map((item) => sanitizeInline(item.innerHTML))
      .filter((html) => plainText(html));
    if (items.length) blocks.push({ type: "list", ordered: tag === "OL", items });
    return;
  }
  if (tag === "P" || tag === "DIV") {
    const nested = node.querySelector("figure, h2, h3, blockquote, ul, ol");
    if (nested) {
      for (const child of node.childNodes) pushNode(child, blocks);
      return;
    }
    const html = sanitizeInline(node.innerHTML);
    if (plainText(html)) blocks.push({ type: "paragraph", html });
    return;
  }
  for (const child of node.childNodes) pushNode(child, blocks);
}

export function blocksToHtml(blocks: BlogBlock[]) {
  return blocks
    .map((block) => {
      if (block.type === "paragraph") return `<p>${block.html}</p>`;
      if (block.type === "heading") return `<h${block.level}>${block.html}</h${block.level}>`;
      if (block.type === "quote") return `<blockquote>${block.html}</blockquote>`;
      if (block.type === "list") {
        const tag = block.ordered ? "ol" : "ul";
        return `<${tag}>${block.items.map((item) => `<li>${item}</li>`).join("")}</${tag}>`;
      }
      const url = safeImageUrl(block.url);
      if (!url) return "";
      return `<figure contenteditable="false" data-image="1"><img src="${escapeAttr(url)}" alt="${escapeAttr(block.alt)}" draggable="false" /><figcaption contenteditable="true">${escapeHtml(block.caption)}</figcaption></figure>`;
    })
    .join("");
}

export function explainBlogError(message: string) {
  if (/schema cache|could not find the table|relation .*posts.* does not exist/i.test(message)) {
    return "Blog storage isn't set up yet. In the Supabase SQL editor, run supabase/migrations/20261103210000_create_posts.sql, then try again.";
  }
  if (/bucket not found/i.test(message)) {
    return "Photo uploads aren't set up yet. Run supabase/migrations/20261103210000_create_posts.sql in the Supabase SQL editor, then try again.";
  }
  if (/row-level security|permission denied|not authorized|jwt/i.test(message)) {
    return "This account can't change stories yet. Sign in with a staff account after the blog migration has been run.";
  }
  return message;
}

export function toPost(row: Tables<"posts">): BlogPost {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    coverUrl: row.cover_url,
    coverAlt: row.cover_alt ?? "",
    blocks: parseBlocks(row.content),
    status: row.status === "published" ? "published" : "draft",
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listPosts(publishedOnly: boolean) {
  let query = supabase.from("posts").select("*");
  if (publishedOnly) {
    query = query.eq("status", "published").order("published_at", { ascending: false });
  } else {
    query = query.order("updated_at", { ascending: false });
  }
  const { data, error } = await query;
  if (error) throw new Error(explainBlogError(error.message));
  return (data ?? []).map((row) => toPost(row));
}

export async function getPublishedPost(slug: string) {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error) throw new Error(explainBlogError(error.message));
  return data ? toPost(data) : null;
}

export async function savePost(input: SavePostInput) {
  const title = input.title.trim();
  if (!title) throw new Error("Add a title before saving.");
  const slug = await uniqueSlug(slugify(input.slug.trim() || title), input.id);
  const publishedAt =
    input.status === "published"
      ? (input.publishedAt ?? new Date().toISOString())
      : input.publishedAt;
  const payload = {
    title,
    slug,
    excerpt: input.excerpt.trim(),
    cover_url: input.coverUrl,
    cover_alt: input.coverAlt.trim() || null,
    content: input.blocks as unknown as Json,
    status: input.status,
    published_at: publishedAt,
    updated_at: new Date().toISOString(),
  };
  if (input.id) {
    const { data, error } = await supabase
      .from("posts")
      .update(payload)
      .eq("id", input.id)
      .select("id, slug, published_at")
      .maybeSingle();
    if (error) throw new Error(explainBlogError(error.message));
    if (!data)
      throw new Error(
        "That story could not be saved. This account needs permission to edit posts.",
      );
    return { id: data.id, slug: data.slug, publishedAt: data.published_at };
  }
  const { data, error } = await supabase
    .from("posts")
    .insert(payload)
    .select("id, slug, published_at")
    .maybeSingle();
  if (error) throw new Error(explainBlogError(error.message));
  if (!data)
    throw new Error(
      "That story could not be saved. This account needs permission to create posts.",
    );
  return { id: data.id, slug: data.slug, publishedAt: data.published_at };
}

async function uniqueSlug(base: string, ignoreId: string | null) {
  let candidate = base;
  for (let n = 2; n < 40; n += 1) {
    let query = supabase.from("posts").select("id").eq("slug", candidate);
    if (ignoreId) query = query.neq("id", ignoreId);
    const { data, error } = await query;
    if (error) throw new Error(explainBlogError(error.message));
    if (!data?.length) return candidate;
    candidate = `${base}-${n}`.slice(0, 90);
  }
  return `${base}-${crypto.randomUUID().slice(0, 8)}`;
}

export async function deletePost(id: string) {
  const { data, error } = await supabase.from("posts").delete().eq("id", id).select("id");
  if (error) throw new Error(explainBlogError(error.message));
  if (!data?.length)
    throw new Error(
      "That story could not be removed. This account needs permission to delete posts.",
    );
}

const MAX_EDGE = 2000;
const MAX_UPLOAD = 8 * 1024 * 1024;
const MAX_ORIGINAL = 25 * 1024 * 1024;

export async function uploadBlogImage(file: File) {
  if (
    !file.type.startsWith("image/") &&
    !/\.(jpe?g|png|webp|gif|avif|heic|heif)$/i.test(file.name)
  ) {
    throw new Error("Choose a photo — JPG, PNG or WEBP.");
  }
  if (file.size > MAX_ORIGINAL) throw new Error("That photo is over 25 MB. Choose a smaller one.");
  const prepared = await prepareImage(file);
  if (prepared.body.size > MAX_UPLOAD)
    throw new Error("That photo is still too large after resizing. Try another one.");
  const path = `stories/${crypto.randomUUID()}.${prepared.ext}`;
  const { error } = await supabase.storage.from("blog-images").upload(path, prepared.body, {
    contentType: prepared.contentType,
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw new Error(explainBlogError(error.message));
  const { data } = supabase.storage.from("blog-images").getPublicUrl(path);
  const url = safeImageUrl(data.publicUrl);
  if (!url) throw new Error("The photo uploaded, but its address could not be read.");
  return url;
}

async function prepareImage(file: File) {
  if (file.type === "image/gif") {
    if (file.size > MAX_UPLOAD) throw new Error("GIF photos need to be under 8 MB.");
    return { body: file, contentType: "image/gif", ext: "gif" };
  }
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    if (file.size <= MAX_UPLOAD && /image\/(jpeg|png|webp|avif)/.test(file.type)) {
      return { body: file, contentType: file.type, ext: extFromMime(file.type) };
    }
    throw new Error("This photo couldn't be read. Use a JPG, PNG or WEBP.");
  }
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    throw new Error("This photo couldn't be prepared. Try another one.");
  }
  const png = file.type === "image/png";
  if (!png) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
  }
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  const type = png ? "image/png" : "image/jpeg";
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, 0.86));
  if (!blob) throw new Error("This photo couldn't be prepared. Try another one.");
  if (png && blob.size > MAX_UPLOAD) {
    const jpeg = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.86),
    );
    if (jpeg) return { body: jpeg, contentType: "image/jpeg", ext: "jpg" };
  }
  return { body: blob, contentType: type, ext: png ? "png" : "jpg" };
}

function extFromMime(type: string) {
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  if (type === "image/avif") return "avif";
  return "jpg";
}
