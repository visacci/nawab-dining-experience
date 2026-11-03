import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { StoryProse } from "@/components/site/StoryProse";
import { formatStoryDate, getPublishedPost, readingMinutes, type BlogPost } from "@/lib/blog";

export const Route = createFileRoute("/blog/$slug")({
  head: () => ({
    meta: [
      { title: "Story — Nawab" },
      { name: "description", content: "A story from Nawab Asian Bistro and Nawab Gardens." },
    ],
  }),
  component: StoryPage,
});

function StoryPage() {
  const { slug } = Route.useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "missing">("loading");

  useEffect(() => {
    let active = true;
    setState("loading");
    getPublishedPost(slug)
      .then((row) => {
        if (!active) return;
        setPost(row);
        setState(row ? "ready" : "missing");
      })
      .catch(() => {
        if (!active) return;
        setPost(null);
        setState("missing");
      });
    return () => {
      active = false;
    };
  }, [slug]);

  useEffect(() => {
    if (!post) return;
    document.title = `${post.title} — Nawab`;
  }, [post]);

  if (state === "loading") {
    return (
      <section className="bg-ink px-6 pb-28 pt-40 text-on-ink">
        <p className="container-x text-on-ink-muted">Loading story…</p>
      </section>
    );
  }

  if (!post) {
    return (
      <section className="bg-ink px-6 pb-28 pt-40 text-center text-on-ink">
        <p className="eyebrow text-primary-glow">Blog</p>
        <h1 className="display mt-4 text-5xl">This story isn’t on the table.</h1>
        <Link
          to="/blog"
          className="eyebrow mt-8 inline-block bg-primary px-6 py-4 text-primary-foreground"
        >
          All stories
        </Link>
      </section>
    );
  }

  const date = formatStoryDate(post.publishedAt ?? post.createdAt);

  return (
    <article>
      <header className="relative flex min-h-[72svh] items-end overflow-hidden bg-ink text-on-ink">
        {post.coverUrl ? (
          <img
            src={post.coverUrl}
            alt={post.coverAlt || ""}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : null}
        {post.coverUrl ? <div className="bg-hero-overlay absolute inset-0" /> : null}
        <div className="container-x relative pb-16 pt-40 md:pb-24">
          <Link to="/blog" className="eyebrow text-primary-glow">
            Blog
          </Link>
          <h1 className="display mt-5 max-w-4xl text-5xl sm:text-7xl">{post.title}</h1>
          <p className="mt-6 text-sm text-on-ink/80">
            {date} · {readingMinutes(post.blocks)} min read
          </p>
        </div>
      </header>
      <div className="bg-background py-16 md:py-24">
        <div className="container-x max-w-3xl">
          {post.excerpt ? (
            <p className="font-serif text-2xl leading-snug text-ink/80 md:text-3xl">
              {post.excerpt}
            </p>
          ) : null}
          <div className="story-read mt-10">
            <StoryProse blocks={post.blocks} />
          </div>
          <Link to="/blog" className="eyebrow mt-16 inline-block text-ink">
            All stories
          </Link>
        </div>
      </div>
    </article>
  );
}
