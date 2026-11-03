import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHero } from "@/components/site/PageHero";
import {
  formatStoryDate,
  listPosts,
  readingMinutes,
  storyExcerpt,
  type BlogPost,
} from "@/lib/blog";
import { IMG } from "@/lib/images";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blog — Stories, Flavours & Experiences | Nawab" },
      {
        name: "description",
        content:
          "Stories about food, dining and celebrations from Nawab Asian Bistro and Nawab Gardens.",
      },
      { property: "og:title", content: "Nawab Blog" },
      {
        property: "og:description",
        content: "Stories, flavours and experiences from Nawab in Kampala.",
      },
    ],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const [posts, setPosts] = useState<BlogPost[] | null>(null);

  useEffect(() => {
    let active = true;
    listPosts(true)
      .then((rows) => {
        if (active) setPosts(rows);
      })
      .catch(() => {
        if (active) setPosts([]);
      });
    return () => {
      active = false;
    };
  }, []);

  const featured = posts?.[0];
  const rest = posts?.slice(1) ?? [];

  return (
    <>
      <PageHero
        image={IMG.heroFood}
        alt="A spread of dishes from the Nawab kitchen"
        eyebrow="Blog"
        title={
          <>
            Stories, Flavours & <em className="text-primary-glow">Experiences.</em>
          </>
        }
      />
      <section className="bg-background py-20 md:py-28">
        <div className="container-x">
          {posts === null ? <p className="text-muted-foreground">Loading stories…</p> : null}
          {posts && posts.length === 0 ? <EmptyBlog /> : null}
          {featured ? <Featured post={featured} /> : null}
          {rest.length > 0 ? (
            <div className="mt-20 grid gap-12 md:grid-cols-2 xl:grid-cols-3">
              {rest.map((post) => (
                <StoryCard key={post.id} post={post} />
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}

function EmptyBlog() {
  return (
    <div className="mx-auto max-w-2xl py-10 text-center">
      <h2 className="text-4xl">Our first stories are on their way.</h2>
      <p className="mt-4 text-muted-foreground">
        Articles on food, events and dining experiences will appear here soon.
      </p>
      <Link
        to="/contact"
        className="eyebrow mt-8 inline-block bg-primary px-6 py-4 text-primary-foreground"
      >
        Contact us
      </Link>
    </div>
  );
}

function Featured({ post }: { post: BlogPost }) {
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.slug }}
      className="group grid items-end gap-8 lg:grid-cols-12"
    >
      <Cover post={post} className="aspect-[16/10] lg:col-span-7" />
      <div className="lg:col-span-5 lg:pb-4">
        <p className="eyebrow text-primary">{meta(post)}</p>
        <h2 className="display mt-4 text-5xl transition-colors group-hover:text-primary md:text-6xl">
          {post.title}
        </h2>
        {storyExcerpt(post) ? (
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{storyExcerpt(post)}</p>
        ) : null}
        <span className="eyebrow mt-8 inline-block text-ink">Read the story</span>
      </div>
    </Link>
  );
}

function StoryCard({ post }: { post: BlogPost }) {
  return (
    <Link to="/blog/$slug" params={{ slug: post.slug }} className="group block">
      <Cover post={post} className="aspect-[4/3]" />
      <p className="eyebrow mt-5 text-primary">{meta(post)}</p>
      <h2 className="mt-3 text-3xl transition-colors group-hover:text-primary">{post.title}</h2>
      {storyExcerpt(post, 120) ? (
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {storyExcerpt(post, 120)}
        </p>
      ) : null}
    </Link>
  );
}

function Cover({ post, className }: { post: BlogPost; className?: string }) {
  return (
    <div className={cn("overflow-hidden bg-ink", className)}>
      {post.coverUrl ? (
        <img
          src={post.coverUrl}
          alt={post.coverAlt || ""}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
      ) : (
        <div className="flex h-full min-h-48 items-center justify-center">
          <span className="display text-7xl italic text-primary-glow">
            {post.title.slice(0, 1)}
          </span>
        </div>
      )}
    </div>
  );
}

function meta(post: BlogPost) {
  const date = formatStoryDate(post.publishedAt ?? post.createdAt);
  return `${date} · ${readingMinutes(post.blocks)} min read`;
}
