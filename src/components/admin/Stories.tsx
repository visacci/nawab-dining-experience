import { Link } from "@tanstack/react-router";
import {
  Bold,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Pilcrow,
  Quote,
  Trash2,
} from "lucide-react";
import { memo, useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { StoryProse } from "@/components/site/StoryProse";
import { Button } from "@/components/ui/button";
import {
  blocksToHtml,
  deletePost,
  escapeAttr,
  formatStoryDate,
  listPosts,
  readStory,
  safeHref,
  savePost,
  slugify,
  storyExcerpt,
  storyHasBody,
  uploadBlogImage,
  type BlogPost,
} from "@/lib/blog";
import { cn } from "@/lib/utils";

type EditorHandlers = {
  onInput: () => void;
  onClick: (event: MouseEvent) => void;
  onPaste: (event: ClipboardEvent) => void;
  onDrop: (event: DragEvent) => void;
  onDragOver: (event: DragEvent) => void;
  onKeyDown: (event: KeyboardEvent) => void;
  onFocus: () => void;
};

export function Stories({
  email,
  onDirtyChange,
}: {
  email: string;
  onDirtyChange: (dirty: boolean) => void;
}) {
  const [editing, setEditing] = useState<BlogPost | "new" | null>(null);

  useEffect(() => {
    if (!editing) onDirtyChange(false);
  }, [editing, onDirtyChange]);

  if (editing) {
    return (
      <StoryEditor
        initial={editing === "new" ? null : editing}
        onDirtyChange={onDirtyChange}
        onBack={() => setEditing(null)}
      />
    );
  }
  return <StoryList email={email} onCreate={() => setEditing("new")} onEdit={setEditing} />;
}

function StoryList({
  email,
  onCreate,
  onEdit,
}: {
  email: string;
  onCreate: () => void;
  onEdit: (post: BlogPost) => void;
}) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    try {
      setPosts(await listPosts(false));
      setError("");
    } catch (err) {
      setPosts([]);
      setError(err instanceof Error ? err.message : "Stories could not be loaded.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function remove(post: BlogPost) {
    if (!window.confirm(`Remove “${post.title}”? This cannot be undone.`)) return;
    try {
      await deletePost(post.id);
      setPosts((current) => current.filter((item) => item.id !== post.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "That story could not be removed.");
    }
  }

  return (
    <div>
      <p className="eyebrow text-primary">Blog</p>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-4xl sm:text-5xl">Stories</h1>
        <div className="flex items-center gap-4">
          <p className="text-sm text-on-ink-muted">{email}</p>
          <Button type="button" variant="brand" size="lg" onClick={onCreate}>
            New story
          </Button>
        </div>
      </div>
      <p className="mt-4 max-w-2xl text-sm text-on-ink-muted">
        Write a story, place photos from your computer between sections, then publish it to the
        blog.
      </p>
      {error ? <p className="mt-6 max-w-2xl text-sm text-primary-glow">{error}</p> : null}
      {loading ? <p className="mt-10 text-on-ink-muted">Loading stories…</p> : null}
      {!loading && posts.length === 0 ? (
        <p className="mt-10 text-on-ink-muted">No stories yet.</p>
      ) : null}
      <ul className="mt-8 space-y-4">
        {posts.map((post) => (
          <li
            key={post.id}
            className="flex flex-col gap-5 bg-paper p-5 text-ink shadow-elegant sm:flex-row"
          >
            <div className="h-28 w-full shrink-0 overflow-hidden bg-secondary sm:w-40">
              {post.coverUrl ? (
                <img src={post.coverUrl} alt="" className="h-full w-full object-cover" />
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              <p className="eyebrow text-primary">
                {post.status === "published" ? "Published" : "Draft"}
              </p>
              <h2 className="mt-2 text-3xl">{post.title}</h2>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                {storyExcerpt(post) || "No summary yet."}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                {formatStoryDate(post.publishedAt ?? post.updatedAt)} · /blog/{post.slug}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-4 text-sm">
              <button
                type="button"
                onClick={() => onEdit(post)}
                className="text-ink hover:text-primary"
              >
                Edit
              </button>
              {post.status === "published" ? (
                <Link
                  to="/blog/$slug"
                  params={{ slug: post.slug }}
                  target="_blank"
                  className="text-muted-foreground hover:text-ink"
                >
                  View
                </Link>
              ) : null}
              <button
                type="button"
                onClick={() => void remove(post)}
                className="inline-flex items-center gap-1 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" /> Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StoryEditor({
  initial,
  onBack,
  onDirtyChange,
}: {
  initial: BlogPost | null;
  onBack: () => void;
  onDirtyChange: (dirty: boolean) => void;
}) {
  const surface = useRef<HTMLDivElement>(null);
  const savedRange = useRef<Range | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);
  const handlers = useRef<EditorHandlers | null>(null);
  const [title, setTitle] = useState(initial?.title ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(Boolean(initial));
  const [coverUrl, setCoverUrl] = useState<string | null>(initial?.coverUrl ?? null);
  const [coverAlt, setCoverAlt] = useState(initial?.coverAlt ?? "");
  const [postId, setPostId] = useState<string | null>(initial?.id ?? null);
  const [publishedAt, setPublishedAt] = useState<string | null>(initial?.publishedAt ?? null);
  const [status, setStatus] = useState<"draft" | "published">(initial?.status ?? "draft");
  const [dirty, setDirty] = useState(false);
  const [empty, setEmpty] = useState((initial?.blocks.length ?? 0) === 0);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [preview, setPreview] = useState(false);
  const [previewBlocks, setPreviewBlocks] = useState(initial?.blocks ?? []);
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("https://");
  const [activeFigure, setActiveFigure] = useState<HTMLElement | null>(null);
  const [alt, setAlt] = useState("");
  const [marks, setMarks] = useState({ bold: false, italic: false });
  const initialHtml = blocksToHtml(initial?.blocks ?? []);

  useEffect(() => {
    onDirtyChange(dirty);
  }, [dirty, onDirtyChange]);

  useEffect(() => {
    const update = () => {
      try {
        setMarks({
          bold: document.queryCommandState("bold"),
          italic: document.queryCommandState("italic"),
        });
      } catch {
        setMarks({ bold: false, italic: false });
      }
    };
    document.addEventListener("selectionchange", update);
    return () => document.removeEventListener("selectionchange", update);
  }, []);

  function markDirty() {
    setDirty(true);
    setNotice("");
    setPreview(false);
  }

  function syncEmpty() {
    const editor = surface.current;
    if (!editor) return;
    const text = (editor.textContent ?? "").replace(/\u00a0/g, "").trim();
    setEmpty(!text && !editor.querySelector("img"));
  }

  function rememberSelection() {
    const editor = surface.current;
    const selection = window.getSelection();
    if (!editor || !selection || selection.rangeCount === 0) return;
    if (!editor.contains(selection.anchorNode)) return;
    savedRange.current = selection.getRangeAt(0).cloneRange();
  }

  function focusEditor() {
    const editor = surface.current;
    if (!editor) return;
    editor.focus();
    try {
      document.execCommand("defaultParagraphSeparator", false, "p");
      document.execCommand("styleWithCSS", false, "false");
    } catch {
      // Older browsers ignore these editing commands.
    }
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && editor.contains(selection.anchorNode)) return;
    const range = savedRange.current;
    if (range && editor.contains(range.startContainer)) {
      selection?.removeAllRanges();
      selection?.addRange(range);
      return;
    }
    const next = document.createRange();
    next.selectNodeContents(editor);
    next.collapse(false);
    selection?.removeAllRanges();
    selection?.addRange(next);
  }

  function command(name: string, value?: string) {
    focusEditor();
    document.execCommand(name, false, value);
    markDirty();
    syncEmpty();
    rememberSelection();
  }

  function formatBlock(tag: "h2" | "h3" | "blockquote" | "p") {
    focusEditor();
    const anchor = window.getSelection()?.anchorNode;
    const element = anchor instanceof Element ? anchor : anchor?.parentElement;
    const current = element?.closest("h2, h3, blockquote, p, div")?.tagName.toLowerCase();
    document.execCommand("formatBlock", false, current === tag ? "p" : tag);
    markDirty();
  }

  function selectFigure(figure: HTMLElement | null) {
    surface.current
      ?.querySelectorAll("figure.is-selected")
      .forEach((node) => node.classList.remove("is-selected"));
    if (figure) figure.classList.add("is-selected");
    setActiveFigure(figure);
    setAlt(figure?.querySelector("img")?.alt ?? "");
  }

  function placeCaretAfter(token: string) {
    const editor = surface.current;
    const paragraph = editor?.querySelector(`p[data-token="${token}"]`);
    if (!(paragraph instanceof HTMLElement)) return;
    paragraph.removeAttribute("data-token");
    const range = document.createRange();
    range.selectNodeContents(paragraph);
    range.collapse(true);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
    savedRange.current = range.cloneRange();
  }

  function insertImage(url: string) {
    focusEditor();
    const token = crypto.randomUUID();
    const html = `<figure contenteditable="false" data-image="1" data-token="${token}"><img src="${escapeAttr(url)}" alt="" draggable="false" /><figcaption contenteditable="true"></figcaption></figure><p data-token="${token}"><br></p>`;
    const inserted = document.execCommand("insertHTML", false, html);
    if (!inserted && surface.current) surface.current.insertAdjacentHTML("beforeend", html);
    const figure = surface.current?.querySelector(`figure[data-token="${token}"]`);
    if (figure instanceof HTMLElement) {
      figure.removeAttribute("data-token");
      selectFigure(figure);
    }
    placeCaretAfter(token);
    markDirty();
    syncEmpty();
  }

  async function uploadFiles(files: File[]) {
    if (!files.length) return;
    setUploading(true);
    setError("");
    try {
      for (const file of files) {
        const url = await uploadBlogImage(file);
        insertImage(url);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "The photo could not be uploaded.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function uploadCover(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      setCoverUrl(await uploadBlogImage(file));
      markDirty();
    } catch (err) {
      setError(err instanceof Error ? err.message : "The cover photo could not be uploaded.");
    } finally {
      setUploading(false);
      if (coverRef.current) coverRef.current.value = "";
    }
  }

  handlers.current = {
    onInput: () => {
      markDirty();
      syncEmpty();
    },
    onClick: (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      if (target.closest("a")) event.preventDefault();
      const figure = target.closest("figure");
      if (figure instanceof HTMLElement && surface.current?.contains(figure)) selectFigure(figure);
      else selectFigure(null);
      rememberSelection();
    },
    onPaste: (event) => {
      const clipboard = event.clipboardData;
      if (!clipboard) return;
      const images = [...clipboard.files].filter((file) => file.type.startsWith("image/"));
      if (images.length) {
        event.preventDefault();
        rememberSelection();
        void uploadFiles(images);
        return;
      }
      event.preventDefault();
      const text = clipboard.getData("text/plain");
      focusEditor();
      document.execCommand("insertText", false, text);
      markDirty();
      syncEmpty();
    },
    onDragOver: (event) => {
      const transfer = event.dataTransfer;
      if (transfer && [...transfer.types].includes("Files")) event.preventDefault();
    },
    onDrop: (event) => {
      const transfer = event.dataTransfer;
      if (!transfer) return;
      const images = [...transfer.files].filter((file) => file.type.startsWith("image/"));
      if (!images.length) return;
      event.preventDefault();
      const point = document.caretRangeFromPoint?.(event.clientX, event.clientY);
      if (point && surface.current?.contains(point.startContainer)) savedRange.current = point;
      void uploadFiles(images);
    },
    onKeyDown: (event) => {
      const target = event.target;
      if (target instanceof HTMLElement && target.closest("figcaption") && event.key === "Enter") {
        event.preventDefault();
      }
    },
    onFocus: () => {
      try {
        document.execCommand("defaultParagraphSeparator", false, "p");
        document.execCommand("styleWithCSS", false, "false");
      } catch {
        // Ignore when the browser does not support the command.
      }
    },
  };

  function applyLink() {
    const href = safeHref(linkUrl);
    if (!href) {
      setError("Use a full web address, starting with https://");
      return;
    }
    setError("");
    command("createLink", href);
    setLinkOpen(false);
  }

  function removeFigure() {
    activeFigure?.remove();
    selectFigure(null);
    markDirty();
    syncEmpty();
  }

  async function save(nextStatus: "draft" | "published") {
    const editor = surface.current;
    if (!editor) return;
    const blocks = readStory(editor);
    if (!title.trim()) {
      setError("Add a title before saving.");
      return;
    }
    if (nextStatus === "published" && !storyHasBody(blocks) && !coverUrl) {
      setError("Add some writing or a photo before publishing.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const saved = await savePost({
        id: postId,
        title,
        slug: slugEdited ? slug : title,
        excerpt,
        coverUrl,
        coverAlt,
        blocks,
        status: nextStatus,
        publishedAt,
      });
      setPostId(saved.id);
      setSlug(saved.slug);
      setSlugEdited(true);
      setPublishedAt(saved.publishedAt);
      setStatus(nextStatus);
      setDirty(false);
      setNotice(nextStatus === "published" ? "Published. It’s live on the blog." : "Draft saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "The story could not be saved.");
    } finally {
      setSaving(false);
    }
  }

  function back() {
    if (dirty && !window.confirm("Leave this story? Unsaved changes will be lost.")) return;
    onBack();
  }

  const busy = saving || uploading;

  return (
    <div>
      <button type="button" onClick={back} className="text-sm text-on-ink-muted hover:text-on-ink">
        ← All stories
      </button>
      <div className="mt-6 bg-paper p-5 text-ink shadow-elegant sm:p-10">
        <label className="group relative block cursor-pointer overflow-hidden bg-secondary">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={coverAlt || ""}
              className="aspect-[16/7] w-full object-cover"
            />
          ) : (
            <span className="flex aspect-[16/7] flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
              <ImagePlus className="h-5 w-5" />
              Choose a cover photo from your computer
            </span>
          )}
          <input
            ref={coverRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(event) => void uploadCover(event.target.files?.[0])}
          />
        </label>
        {coverUrl ? (
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <label className="min-w-0 flex-1 text-xs text-muted-foreground">
              Cover description
              <input
                value={coverAlt}
                onChange={(event) => {
                  setCoverAlt(event.target.value);
                  markDirty();
                }}
                placeholder="What is in the photo"
                className="mt-1 w-full border border-ink/10 bg-background px-3 py-2 text-sm text-ink outline-none focus:border-primary"
              />
            </label>
            <button
              type="button"
              onClick={() => {
                setCoverUrl(null);
                setCoverAlt("");
                markDirty();
              }}
              className="text-sm text-muted-foreground hover:text-destructive"
            >
              Remove cover
            </button>
          </div>
        ) : null}
        <input
          value={title}
          onChange={(event) => {
            const next = event.target.value;
            setTitle(next);
            if (!slugEdited) setSlug(slugify(next));
            markDirty();
          }}
          placeholder="Story title"
          className="mt-8 w-full bg-transparent font-serif text-4xl outline-none placeholder:text-ink/25 sm:text-6xl"
        />
        <label className="mt-6 block text-sm text-muted-foreground">
          Short summary for the blog page
          <textarea
            value={excerpt}
            onChange={(event) => {
              setExcerpt(event.target.value);
              markDirty();
            }}
            rows={3}
            maxLength={400}
            placeholder="A line or two that invites someone to read."
            className="mt-2 w-full resize-none border border-ink/10 bg-background px-3 py-3 text-base text-ink outline-none focus:border-primary"
          />
        </label>
        <label className="mt-4 block text-xs text-muted-foreground">
          Web address
          <span className="mt-2 flex items-center border border-ink/10 bg-background">
            <span className="px-3 text-ink/40">/blog/</span>
            <input
              value={slug}
              onChange={(event) => {
                setSlugEdited(true);
                setSlug(slugify(event.target.value));
                markDirty();
              }}
              className="w-full bg-transparent py-2 pr-3 text-sm text-ink outline-none"
            />
          </span>
        </label>

        <div className="sticky top-0 z-10 mt-8 flex flex-wrap items-center gap-1 border-y border-ink/10 bg-paper/95 py-2 backdrop-blur">
          <Tool label="Bold" active={marks.bold} onClick={() => command("bold")}>
            <Bold className="h-4 w-4" />
          </Tool>
          <Tool label="Italic" active={marks.italic} onClick={() => command("italic")}>
            <Italic className="h-4 w-4" />
          </Tool>
          <span className="mx-1 h-5 w-px bg-ink/10" />
          <Tool label="Heading" onClick={() => formatBlock("h2")}>
            <Heading2 className="h-4 w-4" />
          </Tool>
          <Tool label="Subheading" onClick={() => formatBlock("h3")}>
            <Heading3 className="h-4 w-4" />
          </Tool>
          <Tool label="Paragraph" onClick={() => formatBlock("p")}>
            <Pilcrow className="h-4 w-4" />
          </Tool>
          <Tool label="Quote" onClick={() => formatBlock("blockquote")}>
            <Quote className="h-4 w-4" />
          </Tool>
          <Tool label="Bulleted list" onClick={() => command("insertUnorderedList")}>
            <List className="h-4 w-4" />
          </Tool>
          <Tool label="Numbered list" onClick={() => command("insertOrderedList")}>
            <ListOrdered className="h-4 w-4" />
          </Tool>
          <span className="mx-1 h-5 w-px bg-ink/10" />
          <Tool
            label="Link"
            active={linkOpen}
            onMouseDown={rememberSelection}
            onClick={() => {
              setLinkOpen((open) => !open);
              setError("");
            }}
          >
            <Link2 className="h-4 w-4" />
          </Tool>
          <button
            type="button"
            onMouseDown={(event) => {
              event.preventDefault();
              rememberSelection();
            }}
            onClick={() => fileRef.current?.click()}
            disabled={busy}
            className="ml-1 inline-flex h-9 items-center gap-2 bg-ink px-3 text-[0.68rem] uppercase tracking-[0.16em] text-on-ink disabled:opacity-50"
          >
            <ImagePlus className="h-4 w-4" /> {uploading ? "Uploading…" : "Photo"}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={(event) => void uploadFiles([...(event.target.files ?? [])])}
          />
          <button
            type="button"
            onClick={() => {
              if (!preview && surface.current) setPreviewBlocks(readStory(surface.current));
              setPreview((value) => !value);
            }}
            className="ml-auto text-xs uppercase tracking-[0.16em] text-muted-foreground hover:text-ink"
          >
            {preview ? "Edit" : "Preview"}
          </button>
        </div>
        {linkOpen ? (
          <div className="mt-3 flex flex-wrap gap-2">
            <input
              value={linkUrl}
              onChange={(event) => setLinkUrl(event.target.value)}
              placeholder="https://"
              className="min-w-0 flex-1 border border-ink/10 bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <Button type="button" variant="brand" onClick={applyLink}>
              Add link
            </Button>
          </div>
        ) : null}
        {activeFigure ? (
          <div className="mt-3 flex flex-wrap items-end gap-3">
            <label className="min-w-0 flex-1 text-xs text-muted-foreground">
              Photo description
              <input
                value={alt}
                onChange={(event) => {
                  const next = event.target.value;
                  setAlt(next);
                  const image = activeFigure.querySelector("img");
                  if (image) image.alt = next;
                  markDirty();
                }}
                placeholder="Describe the photo for guests using screen readers"
                className="mt-1 w-full border border-ink/10 bg-background px-3 py-2 text-sm text-ink outline-none focus:border-primary"
              />
            </label>
            <button
              type="button"
              onClick={removeFigure}
              className="pb-2 text-sm text-muted-foreground hover:text-destructive"
            >
              Remove photo
            </button>
          </div>
        ) : null}
        <p className="mt-4 text-xs text-muted-foreground">
          Click where the photo should go, then choose Photo. You can also drop a photo into the
          story or paste one.
        </p>
        <div className={cn("relative mt-4", preview && "hidden")}>
          {empty ? (
            <p className="pointer-events-none absolute inset-x-0 top-0 text-muted-foreground">
              Start the story. Place photos between paragraphs whenever you like.
            </p>
          ) : null}
          <EditorSurface initialHtml={initialHtml} surfaceRef={surface} handlersRef={handlers} />
        </div>
        {preview ? (
          <div className="story-read mt-6">
            <StoryProse blocks={previewBlocks} />
          </div>
        ) : null}
        {error ? <p className="mt-6 text-sm text-destructive">{error}</p> : null}
        {notice ? (
          <p className="mt-6 text-sm text-primary">
            {notice}{" "}
            {status === "published" && slug ? (
              <Link to="/blog/$slug" params={{ slug }} target="_blank" className="underline">
                Open it
              </Link>
            ) : null}
          </p>
        ) : null}
        <div className="mt-8 flex flex-wrap gap-3">
          {status === "published" ? (
            <Button
              type="button"
              variant="ghostDark"
              size="lg"
              disabled={busy}
              onClick={() => void save("draft")}
            >
              Unpublish
            </Button>
          ) : (
            <Button
              type="button"
              variant="ghostDark"
              size="lg"
              disabled={busy}
              onClick={() => void save("draft")}
            >
              {saving ? "Saving…" : "Save draft"}
            </Button>
          )}
          <Button
            type="button"
            variant="brand"
            size="lg"
            disabled={busy}
            onClick={() => void save("published")}
          >
            {saving ? "Saving…" : status === "published" ? "Update story" : "Publish"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function Tool({
  label,
  active,
  onClick,
  onMouseDown,
  children,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
  onMouseDown?: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onMouseDown={(event) => {
        event.preventDefault();
        onMouseDown?.();
      }}
      onClick={onClick}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center text-ink/70 hover:bg-secondary hover:text-ink",
        active && "bg-secondary text-primary",
      )}
    >
      {children}
    </button>
  );
}

const EditorSurface = memo(function EditorSurface({
  initialHtml,
  surfaceRef,
  handlersRef,
}: {
  initialHtml: string;
  surfaceRef: RefObject<HTMLDivElement | null>;
  handlersRef: RefObject<EditorHandlers | null>;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const editor = ref.current;
    if (!editor) return;
    editor.innerHTML = initialHtml;
    surfaceRef.current = editor;
    const onInput = () => handlersRef.current?.onInput();
    const onClick = (event: MouseEvent) => handlersRef.current?.onClick(event);
    const onPaste = (event: ClipboardEvent) => handlersRef.current?.onPaste(event);
    const onDrop = (event: DragEvent) => handlersRef.current?.onDrop(event);
    const onDragOver = (event: DragEvent) => handlersRef.current?.onDragOver(event);
    const onKeyDown = (event: KeyboardEvent) => handlersRef.current?.onKeyDown(event);
    const onFocus = () => handlersRef.current?.onFocus();
    editor.addEventListener("input", onInput);
    editor.addEventListener("click", onClick);
    editor.addEventListener("paste", onPaste);
    editor.addEventListener("drop", onDrop);
    editor.addEventListener("dragover", onDragOver);
    editor.addEventListener("keydown", onKeyDown);
    editor.addEventListener("focus", onFocus);
    return () => {
      editor.removeEventListener("input", onInput);
      editor.removeEventListener("click", onClick);
      editor.removeEventListener("paste", onPaste);
      editor.removeEventListener("drop", onDrop);
      editor.removeEventListener("dragover", onDragOver);
      editor.removeEventListener("keydown", onKeyDown);
      editor.removeEventListener("focus", onFocus);
    };
  }, [handlersRef, initialHtml, surfaceRef]);

  return (
    <div
      ref={ref}
      contentEditable
      role="textbox"
      aria-multiline="true"
      aria-label="Story"
      spellCheck
      suppressContentEditableWarning
      className="story-prose story-editor"
    />
  );
});
