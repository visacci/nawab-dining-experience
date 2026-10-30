import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { IMG } from "@/lib/images";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Stories, Flavours & Experiences | Nawab" },
      { name: "description", content: "Stories about food, dining and celebrations from Nawab Asian Bistro and Nawab Gardens." },
      { property: "og:title", content: "Nawab Blog" },
      { property: "og:description", content: "Stories, flavours and experiences from Nawab in Kampala." },
    ],
  }),
  component: Blog,
});

function Blog() {
  return (
    <>
      <PageHero image={IMG.heroFood} alt="A spread of dishes from the Nawab kitchen" eyebrow="Blog" title={<>Stories, Flavours & <em className="text-primary-glow">Experiences.</em></>} />
      <section className="bg-paper py-28 text-center">
        <div className="container-x max-w-2xl">
          <h2 className="text-4xl">Our first stories are on their way.</h2>
          <p className="mt-4 text-muted-foreground">Articles on food & cuisine, events and dining experiences will appear here soon.</p>
          <Link to="/contact" className="eyebrow mt-8 inline-block bg-primary px-6 py-4 text-primary-foreground">Contact us</Link>
        </div>
      </section>
    </>
  );
}
