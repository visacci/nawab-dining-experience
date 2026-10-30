import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { FeatureSplit, ReserveBand, TextStatement } from "@/components/site/blocks";
import { ImageReveal, Reveal, SectionLabel } from "@/components/site/motion";
import { IMG } from "@/lib/images";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Nawab — A Tradition of Flavour and Hospitality in Kampala" },
      { name: "description", content: "Learn the story behind Nawab, a Kampala dining brand inspired by the Nawabs of South Asia and their love of fine food, gardens and hospitality." },
      { property: "og:title", content: "About Nawab" },
      { property: "og:description", content: "Who we are, our story and our two Kampala dining destinations." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <>
      <PageHero image={IMG.interior} alt="Guests dining at Nawab Asian Bistro" eyebrow="About us" title={<>Generous flavour. <em className="text-primary-glow">Gracious</em> welcome.</>} />

      <TextStatement label="Who we are">
        Nawab is a Kampala dining brand built on generous flavour, warm hospitality and memorable settings — two distinct venues, one way of welcoming guests.
      </TextStatement>

      <FeatureSplit
        label="Our story" title="Named for a love of fine food and gardens" dark
        text="Nawab has been part of Kampala's dining scene for many years, serving guests at several locations across the city. The brand's name recalls the Nawabs of South Asia, known for their love of fine food, gardens and gracious hospitality. That spirit continues to guide how we cook and welcome our guests."
        image={IMG.indian} alt="Naan and rice at Nawab Gardens"
      />

      <section className="bg-paper py-28">
        <div className="container-x">
          <Reveal><SectionLabel>Our two destinations</SectionLabel><h2 className="display mt-6 text-5xl md:text-6xl">Skyline & garden</h2></Reveal>
          <div className="mt-14 grid gap-8 md:grid-cols-2">
            {[
              { to: "/asian-bistro", t: "Nawab Asian Bistro", s: "Pan-Asian · Acacia Mall, Kololo", img: IMG.rooftop },
              { to: "/nawab-gardens", t: "Nawab Gardens", s: "Indian · 27 Bandali Rise, Bugolobi", img: IMG.garden },
            ].map((v, i) => (
              <Reveal key={v.to} delay={i * 0.1}>
                <Link to={v.to} className="group block">
                  <div className="aspect-[4/3] overflow-hidden"><img src={v.img} alt={v.t} loading="lazy" className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105" /></div>
                  <h3 className="mt-6 text-3xl group-hover:text-primary">{v.t}</h3>
                  <p className="eyebrow mt-2 text-muted-foreground">{v.s}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary py-28">
        <div className="container-x grid gap-16 lg:grid-cols-2">
          <Reveal>
            <SectionLabel>What sets us apart</SectionLabel>
            <h2 className="display mt-6 text-5xl">Two moods, one standard.</h2>
            <div className="mt-10 space-y-6 text-muted-foreground">
              <p>Fresh ingredients, authentic spicing and consistent preparation across both kitchens.</p>
              <p>Flexible dining, with vegetarian, vegan and gluten-free options and dishes prepared to your preferred spice level.</p>
              <p>Settings that suit the moment — a skyline terrace in Kololo and a garden retreat in Bugolobi.</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <SectionLabel>Who we serve</SectionLabel>
            <ul className="mt-8 divide-y divide-border border-y border-border">
              {["Families sharing a long lunch", "Colleagues at a business lunch", "Friends celebrating a birthday", "Couples on a quiet dinner", "Groups planning a private event"].map((x) => (
                <li key={x} className="py-5 font-serif text-2xl">{x}</li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="bg-ink py-28 text-on-ink">
        <div className="container-x grid items-center gap-16 lg:grid-cols-2">
          <ImageReveal src={IMG.curry} alt="Curries and sides at Nawab Gardens" className="aspect-[4/5]" />
          <Reveal>
            <SectionLabel>Our commitment</SectionLabel>
            <h2 className="display mt-6 text-5xl md:text-6xl">What you can count on.</h2>
            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              {[["Quality food", "Cooked with care, every service."], ["Attentive service", "Warm, courteous and unhurried."], ["Welcoming spaces", "Comfortable rooms and green outdoor settings."], ["Continuous improvement", "Always listening, always refining."]].map(([t, d]) => (
                <div key={t} className="border-t border-primary pt-5"><h3 className="text-2xl">{t}</h3><p className="mt-2 text-sm text-on-ink-muted">{d}</p></div>
              ))}
            </div>
            <Button asChild variant="brand" size="xl" className="mt-12"><Link to="/contact">Get in touch <ArrowRight /></Link></Button>
          </Reveal>
        </div>
      </section>
      <ReserveBand image={IMG.garden} />
    </>
  );
}
