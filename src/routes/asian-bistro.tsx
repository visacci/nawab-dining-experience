import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { FeatureSplit, LocationSection, TextStatement } from "@/components/site/blocks";
import { PhotoNote, Reveal, SectionLabel } from "@/components/site/motion";
import { IMG } from "@/lib/images";
import { BISTRO } from "@/lib/site";

export const Route = createFileRoute("/asian-bistro")({
  head: () => ({
    meta: [
      { title: "Nawab Asian Bistro — Pan-Asian Dining at Acacia Mall, Kololo" },
      { name: "description", content: "Pan-Asian restaurant, bar, rooftop terrace with Kampala skyline views and a conference/party room on the 2nd floor of Acacia Mall, Kololo." },
      { property: "og:title", content: "Nawab Asian Bistro — An Elevated Asian Dining Experience" },
      { property: "og:description", content: "Pan-Asian flavours and skyline views at Acacia Mall, Kololo, Kampala." },
    ],
  }),
  component: Bistro,
});

function Bistro() {
  return (
    <>
      <PageHero
        tall
        image={IMG.heroFood}
        alt="Pan-Asian dishes on a dark table"
        eyebrow="Nawab Asian Bistro · Kololo"
        title={<>An Elevated <em className="text-primary-glow">Asian</em> Dining Experience.</>}
        text="Discover a world of Pan-Asian flavours at Nawab Asian Bistro, located on the second floor of Acacia Mall in Kololo."
      >
        <Button asChild variant="brand" size="xl"><Link to="/reserve">Reserve a table <ArrowRight /></Link></Button>
        <Button asChild variant="ghostLight" size="xl"><a href={`tel:${BISTRO.tel}`}><Phone /> {BISTRO.phone}</a></Button>
      </PageHero>

      <nav className="sticky top-[68px] z-30 hidden border-b border-border bg-paper/95 backdrop-blur md:block" aria-label="Bistro sections">
        <div className="container-x flex gap-10 py-4">
          {[["restaurant", "Restaurant"], ["bar", "Bar"], ["rooftop", "Rooftop Terrace"], ["conference", "Conference / Party Room"], ["location", "Location"]].map(([h, l]) => (
            <a key={h} href={`#${h}`} className="link-underline eyebrow text-[0.65rem] text-ink hover:text-primary">{l}</a>
          ))}
        </div>
      </nav>

      <FeatureSplit
        id="restaurant" index="01" label="The Restaurant" title="A world of Pan-Asian flavour"
        text="Our main dining room brings together a wide-ranging Pan-Asian menu, spacious indoor seating and a polished, welcoming atmosphere — ideal for everything from a quick business lunch to a long evening with friends."
        points={["Wide-ranging Pan-Asian cuisine", "Spacious indoor dining", "Dine-in and takeaway", "Vegetarian, vegan & gluten-free options", "Customisable spice levels", "Secure parking at Acacia Mall"]}
        image={IMG.interior} alt="Elegant dining room with green velvet banquettes"
      />

      <FeatureSplit
        id="bar" index="02" label="The Bar" title="Unwind, catch up, stay a while" dark reverse
        text="The bar is a relaxed corner of the Bistro for meeting friends after work, settling in before dinner or lingering after a meal. Ask our team about the current drinks selection."
        image={IMG.bar} alt="A backlit bar with brass stools"
      />

      <section id="rooftop" className="relative scroll-mt-24 overflow-hidden bg-ink text-on-ink">
        <div className="relative h-[90svh] min-h-[600px]">
          <img src={IMG.rooftop} alt="Rooftop terrace overlooking a city skyline at dusk" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          <div className="bg-card-overlay absolute inset-0" />
          <PhotoNote />
          <div className="container-x relative flex h-full items-end pb-20">
            <Reveal className="max-w-2xl">
              <SectionLabel className="text-primary-glow">03 · The Rooftop Terrace</SectionLabel>
              <h2 className="display mt-6 text-5xl md:text-8xl">Dinner above the city.</h2>
              <p className="mt-6 text-lg text-on-ink/85">An elevated outdoor terrace with panoramic views across the Kampala skyline.</p>
            </Reveal>
          </div>
        </div>
        <div className="container-x grid gap-px bg-on-ink/10 py-px sm:grid-cols-3 lg:grid-cols-6">
          {["Elevated rooftop dining", "Panoramic skyline views", "Romantic dinners", "Weekend dining", "Birthday celebrations", "Social gatherings"].map((t, i) => (
            <Reveal key={t} delay={i * 0.05} className="bg-ink p-6">
              <span className="font-serif text-primary">0{i + 1}</span>
              <p className="mt-3 font-serif text-xl">{t}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <FeatureSplit
        id="conference" index="04" label="Conference / Party Room" title="A private room for your occasion"
        text="A dedicated space for business meetings, private gatherings and celebrations, with the Bistro's kitchen and team on hand. Get in touch to discuss your date and requirements."
        points={["Business meetings", "Private gatherings", "Birthday celebrations", "Group dining", "Special occasions"]}
        image={IMG.privateRoom} alt="A private dining room with a long set table"
      >
        <Button asChild variant="brand" size="xl"><Link to="/services" hash="enquire">Make an enquiry <ArrowRight /></Link></Button>
      </FeatureSplit>

      <TextStatement label="Good to know">
        Vegetarian, vegan and gluten-free options are available, and dishes can be prepared to your <em className="text-primary">preferred spice level.</em>
      </TextStatement>

      <LocationSection venue={BISTRO.name} address={BISTRO.address} phone={BISTRO.phone} tel={BISTRO.tel} mapsQuery={BISTRO.mapsQuery} />
    </>
  );
}
