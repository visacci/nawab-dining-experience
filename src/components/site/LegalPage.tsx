import type { ReactNode } from "react";

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <>
      <section className="bg-ink pb-16 pt-40 text-on-ink">
        <div className="container-x max-w-3xl">
          <p className="eyebrow text-primary-glow">Legal</p>
          <h1 className="display mt-4 text-5xl md:text-7xl">{title}</h1>
        </div>
      </section>
      <section className="bg-paper py-20">
        <div className="container-x max-w-3xl space-y-6 leading-relaxed text-muted-foreground [&_h2]:mt-10 [&_h2]:text-3xl [&_h2]:text-foreground">
          {children}
        </div>
      </section>
    </>
  );
}
