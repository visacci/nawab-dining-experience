import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Navigation, Phone, Mail, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { Reveal, SectionLabel } from "@/components/site/motion";
import { IMG } from "@/lib/images";
import { BISTRO, GARDENS, directionsUrl, embedUrl } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Nawab — Asian Bistro, Kololo & Gardens, Bugolobi" },
      { name: "description", content: "Call Nawab Asian Bistro on +256 706 171712, get directions to Acacia Mall or 27 Bandali Rise, or send us a message." },
      { property: "og:title", content: "Contact Nawab" },
      { property: "og:description", content: "Locations, directions and a contact form for both Nawab venues in Kampala." },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <>
      <PageHero image={IMG.bar} alt="Warmly lit bar" eyebrow="Contact us" title={<>We'd Love to Hear <em className="text-primary-glow">From You.</em></>}
        text="Whether you're planning a visit, making a reservation or organising a special occasion, our team would be happy to assist." />

      <section className="bg-background py-24">
        <div className="container-x grid gap-8 md:grid-cols-2">
          {[
            { v: BISTRO, img: IMG.rooftop, cuisine: "Pan-Asian" },
            { v: GARDENS, img: IMG.garden, cuisine: "Indian" },
          ].map(({ v, img, cuisine }, i) => (
            <Reveal key={v.name} delay={i * 0.1} className="group overflow-hidden bg-paper shadow-elegant">
              <div className="h-56 overflow-hidden"><img src={img} alt={v.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105" /></div>
              <div className="p-8 md:p-10">
                <p className="eyebrow text-primary">{cuisine}</p>
                <h2 className="mt-3 text-4xl">{v.name}</h2>
                <p className="mt-5 flex gap-3 text-muted-foreground"><MapPin className="h-5 w-5 shrink-0 text-primary" />{v.address}</p>
                <p className="mt-3 flex gap-3 text-muted-foreground"><Phone className="h-5 w-5 shrink-0 text-primary" />{v.phone ?? "To be provided"}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  {v.phone ? (
                    <Button asChild variant="brand" size="lg" className="h-12"><a href={`tel:${BISTRO.tel}`}><Phone /> Call us</a></Button>
                  ) : (
                    <Button asChild variant="brand" size="lg" className="h-12"><a href="#message"><Mail /> Contact us</a></Button>
                  )}
                  <Button asChild variant="ghostDark" size="lg" className="h-12"><a href={directionsUrl(v.mapsQuery)} target="_blank" rel="noreferrer"><Navigation /> Directions</a></Button>
                  <Button asChild variant="ghostDark" size="lg" className="h-12"><Link to="/reserve"><CalendarCheck /> Reserve</Link></Button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="message" className="scroll-mt-20 bg-ink py-28 text-on-ink">
        <div className="container-x grid gap-16 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <SectionLabel>Send a message</SectionLabel>
            <h2 className="display mt-6 text-5xl">How can we help?</h2>
            <p className="mt-6 text-on-ink-muted">Questions, feedback or special requests — drop us a line and we'll respond as soon as we can.</p>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-8"><EnquiryForm kind="contact" dark /></Reveal>
        </div>
      </section>

      <section className="grid md:grid-cols-2">
        {[BISTRO, GARDENS].map((v) => (
          <div key={v.name} className="relative h-[420px]">
            <iframe title={`Map: ${v.name}`} src={embedUrl(v.mapsQuery)} loading="lazy" className="h-full w-full" referrerPolicy="no-referrer-when-downgrade" />
            <div className="absolute left-4 top-4 bg-paper px-4 py-3 shadow-elegant">
              <p className="font-serif text-lg">{v.name}</p>
              <p className="text-xs text-muted-foreground">{v.address}</p>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
