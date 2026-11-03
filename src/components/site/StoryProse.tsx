import type { ReactNode } from "react";
import { safeHref, sanitizeInline, type BlogBlock } from "@/lib/blog";

export function StoryProse({ blocks, className }: { blocks: BlogBlock[]; className?: string }) {
  return (
    <div className={className ? `story-prose ${className}` : "story-prose"}>
      {blocks.map((block, index) => {
        if (block.type === "paragraph") {
          return (
            <p key={index}>
              <RichText html={block.html} />
            </p>
          );
        }
        if (block.type === "heading") {
          const Tag = block.level === 3 ? "h3" : "h2";
          return (
            <Tag key={index}>
              <RichText html={block.html} />
            </Tag>
          );
        }
        if (block.type === "quote") {
          return (
            <blockquote key={index}>
              <RichText html={block.html} />
            </blockquote>
          );
        }
        if (block.type === "list") {
          const Tag = block.ordered ? "ol" : "ul";
          return (
            <Tag key={index}>
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>
                  <RichText html={item} />
                </li>
              ))}
            </Tag>
          );
        }
        return (
          <figure key={index}>
            <img src={block.url} alt={block.alt || block.caption || ""} />
            {block.caption ? <figcaption>{block.caption}</figcaption> : null}
          </figure>
        );
      })}
    </div>
  );
}

function RichText({ html }: { html: string }) {
  return <>{renderHtml(sanitizeInline(html))}</>;
}

function renderHtml(html: string): ReactNode[] {
  if (typeof DOMParser === "undefined") return [html.replace(/<[^>]+>/g, "")];
  const doc = new DOMParser().parseFromString(`<div>${html}</div>`, "text/html");
  const root = doc.body.firstElementChild;
  if (!root) return [];
  return renderNodes(root.childNodes);
}

function renderNodes(nodes: NodeListOf<ChildNode>): ReactNode[] {
  return [...nodes].map((node, index) => {
    if (node.nodeType === Node.TEXT_NODE) return node.textContent;
    if (!(node instanceof HTMLElement)) return null;
    const children = renderNodes(node.childNodes);
    if (node.tagName === "BR") return <br key={index} />;
    if (node.tagName === "STRONG" || node.tagName === "B")
      return <strong key={index}>{children}</strong>;
    if (node.tagName === "EM" || node.tagName === "I") return <em key={index}>{children}</em>;
    if (node.tagName === "A") {
      const href = safeHref(node.getAttribute("href"));
      if (!href) return <span key={index}>{children}</span>;
      const external = href.startsWith("http");
      return (
        <a key={index} href={href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
          {children}
        </a>
      );
    }
    return <span key={index}>{children}</span>;
  });
}
