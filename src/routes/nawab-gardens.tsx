import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { FeatureSplit, LocationSection } from "@/components/site/blocks";
import { ImageReveal, PhotoNote, Reveal, SectionLabel } from "@/components/site/motion";
import { IMG } from "@/lib/images";
import { GARDENS } from "@/lib/site";

export const Route = createFileRoute("/nawab-gardens")({
  head: () => ({
    meta: [
      { title: "Nawab Gardens — Indian Cuisine in a Garden Setting, Bugolobi" },
      { name: "description", content: "Authentic Indian cuisine at 27 Bandali Rise, Bugolobi. Garden dining, bar, rooftop terrace and a conference/party room for gatherings." },
      { property: "og:title", content: "Nawab Gardens — Where Nature Meets Exceptional Dining" },
      { property: "og:description", content: "Indian cuisine in a peaceful garden setting in Bugolobi, Kampala." },
    ],
  }),
  component: Gardens,
});

function Gardens() {
  return (
    <div className="bg-sage">
      <PageHero
        tall
        image={IMG.garden}
        alt="Dining tables on a lawn beneath leafy trees"
        eyebrow="Nawab Gardens · Bugolobi"
        title={<>Where Nature Meets <em className="text-primary-glow">Exceptional</em> Dining.</>}
        text="Discover authentic Indian cuisine in a peaceful garden setting at Nawab Gardens, Bugolobi."
      >
        <Button asChild variant="brand" size="xl"><Link to="/reserve">Request a table <ArrowRight /></Link></Button>
        <Button asChild variant="ghostLight" size="xl"><a href="#gardens">Explore the gardens</a></Button>
      </PageHero>

      <section className="py-28 md:py-36">
        <Reveal className="container-x max-w-4xl text-center">
          <SectionLabel className="justify-center">A garden retreat</SectionLabel>
          <p className="display mt-8 text-3xl leading-snug md:text-5xl">
            Away from the bustle of the city, long lunches stretch into the afternoon and evenings slow down under the trees.
          </p>
        </Reveal>
      </section>

      <FeatureSplit
        id="restaurant" index="01" label="The Restaurant" title="Authentic Indian cuisine"
        text="Generous, aromatic Indian cooking served with warm hospitality in a calm, relaxed dining room — made for families, friends and unhurried meals."
        points={["Indian cuisine", "Warm hospitality", "Peaceful atmosphere", "Family dining", "Long lunches", "Gatherings with friends"]}
        image={IMG.indian} alt="Biryani in a copper pot with curries and naan"
      />

      <section id="gardens" className="scroll-mt-24 bg-ink text-on-ink">
        <div className="relative h-[100svh] min-h-[640px] overflow-hidden">
          <img src={IMG.garden} alt="Lush garden with outdoor dining" loading="lazy" className="absolute inset-0 h-full w-full scale-105 object-cover" />
          <div className="bg-hero-overlay absolute inset-0" />
          <PhotoNote />
          <div className="container-x relative flex h-full flex-col justify-center">
            <Reveal className="max-w-3xl">
              <SectionLabel className="text-primary-glow">The Gardens · Signature</SectionLabel>
              <h2 className="display mt-6 text-6xl md:text-9xl">Dine beneath the trees.</h2>
            </Reveal>
          </div>
        </div>
        <div className="container-x grid gap-16 py-24 lg:grid-cols-2">
          <Reveal>
            <p className="text-lg leading-relaxed text-on-ink-muted">
              The gardens are the heart of Nawab Gardens — a peaceful, green setting for outdoor dining, family gatherings and special occasions, away from the busy city centre.
            </p>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2">
              {["Green surroundings", "Outdoor dining", "Relaxed atmosphere", "Family gatherings", "Special occasions", "Peaceful dining away from the city"].map((p) => (
                <li key={p} className="flex items-center gap-3 border-b border-on-ink/10 pb-4 font-serif text-xl">
                  <span className="h-1.5 w-1.5 rotate-45 bg-primary" />{p}
                </li>
              ))}
            </ul>
          </Reveal>
          <ImageReveal src={IMG.wedding} alt="A candlelit table set in a garden" className="aspect-[4/5]" />
        </div>
      </section>

      <FeatureSplit
        id="bar" index="02" label="The Bar" title="A relaxed place to gather" reverse
        text="The bar at Nawab Gardens offers an easy-going spot to meet, wait for friends or wind down after a meal. Ask our team about the current selection."
        image={IMG.bar} alt="A warmly lit bar"
      />

      <FeatureSplit
        id="rooftop" index="03" label="Rooftop Terrace" title="An elevated corner of the gardens" dark
        text="A rooftop terrace is part of the Nawab Gardens venue. Authentic photographs of this space will be added soon — please contact us for details about using it for your visit or occasion."
        image={IMG.rooftop} alt="Illustrative rooftop terrace at dusk"
      />

      <FeatureSplit
        id="conference" index="04" label="Conference / Party Room" title="Space for every gathering" reverse
        text="A versatile room for meetings, private parties and celebrations, supported by the Nawab Gardens kitchen and team. Share your plans and we'll help shape the occasion."
        points={["Meetings", "Private parties", "Birthdays & anniversaries", "Family celebrations"]}
        image={IMG.privateRoom} alt="Private room with a long set table"
      >
        <Button asChild variant="brand" size="xl"><Link to="/services" hash="enquire">Enquire about events <ArrowRight /></Link></Button>
      </FeatureSplit>

      <LocationSection venue={GARDENS.name} address={GARDENS.address} phone={null} mapsQuery={GARDENS.mapsQuery} />
    </div>
  );
}
