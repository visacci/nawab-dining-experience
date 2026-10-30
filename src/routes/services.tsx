import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { FeatureSplit } from "@/components/site/blocks";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { Reveal, SectionLabel } from "@/components/site/motion";
import { IMG } from "@/lib/images";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Events & Experiences at Nawab — Weddings, Parties, Corporate" },
      { name: "description", content: "Plan weddings, birthdays, corporate meetings and private events at Nawab Asian Bistro and Nawab Gardens in Kampala. Send an event enquiry." },
      { property: "og:title", content: "Every Occasion Deserves Something Special — Nawab" },
      { property: "og:description", content: "Weddings, celebrations, corporate meetings and private dining in Kampala." },
    ],
  }),
  component: Services,
});

const Cta = () => (
  <>
    <Button asChild variant="brand" size="xl"><a href="#enquire">Enquire now <ArrowRight /></a></Button>
    <Button asChild variant="ghostDark" size="xl"><Link to="/contact">Contact us</Link></Button>
  </>
);
const CtaDark = () => (
  <>
    <Button asChild variant="brand" size="xl"><a href="#enquire">Enquire now <ArrowRight /></a></Button>
    <Button asChild variant="ghostLight" size="xl"><Link to="/contact">Contact us</Link></Button>
  </>
);

function Services() {
  return (
    <>
      <PageHero
        image={IMG.wedding} alt="Candlelit wedding table in a garden" eyebrow="Services & experiences"
        title={<>Every Occasion Deserves Something <em className="text-primary-glow">Special.</em></>}
        text="From intimate dinners to milestone celebrations, our teams at both venues help you shape the day."
      >
        <Button asChild variant="brand" size="xl"><a href="#enquire">Plan your event <ArrowRight /></a></Button>
      </PageHero>

      <FeatureSplit id="weddings" index="01" label="Weddings" title="Celebrate your union in style"
        text="Garden settings, elegant rooms and generous menus for wedding celebrations, receptions and family dinners around the big day. Tell us your vision and we'll talk through what's possible."
        image={IMG.wedding} alt="Wedding reception table in a garden"><Cta /></FeatureSplit>

      <FeatureSplit id="parties" index="02" label="Parties & Celebrations" title="Moments worth raising a glass to" dark reverse
        text="Mark life's milestones with food, friends and a setting to remember."
        points={["Birthdays", "Anniversaries", "Family celebrations", "Private parties", "Group gatherings"]}
        image={IMG.celebration} alt="Guests toasting at a birthday dinner"><CtaDark /></FeatureSplit>

      <FeatureSplit id="corporate" index="03" label="Corporate Meetings" title="Business, made more pleasant"
        text="A calm, professional setting for meetings over a meal, with conference/party rooms available at both venues."
        points={["Business lunches", "Corporate meetings", "Professional gatherings", "Group dining"]}
        image={IMG.privateRoom} alt="Private meeting and dining room"><Cta /></FeatureSplit>

      <FeatureSplit id="private" index="04" label="Private Events" title="Your own space, your own pace" dark reverse
        text="Reserve a private room or area for an occasion that's entirely yours — from a quiet family dinner to a larger gathering."
        image={IMG.interior} alt="Elegant private dining area"><CtaDark /></FeatureSplit>

      <section id="dining" className="scroll-mt-24 bg-paper py-28">
        <div className="container-x">
          <Reveal><SectionLabel>05 · Dining experiences</SectionLabel><h2 className="display mt-6 text-5xl md:text-6xl">Choose your setting</h2></Reveal>
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { t: "Skyline evenings", d: "Rooftop dining above Kololo at the Bistro.", img: IMG.rooftop },
              { t: "Garden lunches", d: "Long, relaxed meals beneath the trees in Bugolobi.", img: IMG.garden },
              { t: "Pan-Asian feasts", d: "Shared plates from across Asia.", img: IMG.heroFood },
              { t: "Indian classics", d: "Curries, biryani and warm breads.", img: IMG.indian },
            ].map((x, i) => (
              <Reveal key={x.t} delay={i * 0.06} className="group">
                <div className="aspect-[3/4] overflow-hidden"><img src={x.img} alt={x.t} loading="lazy" className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110" /></div>
                <h3 className="mt-5 text-2xl">{x.t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{x.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="enquire" className="scroll-mt-20 bg-ink py-28 text-on-ink">
        <div className="container-x grid gap-16 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <SectionLabel>Event enquiry</SectionLabel>
            <h2 className="display mt-6 text-5xl">Let's plan something memorable.</h2>
            <p className="mt-6 text-on-ink-muted">Share a few details and our events team will be in touch to discuss availability and arrangements.</p>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-8">
            <EnquiryForm kind="event" dark />
          </Reveal>
        </div>
      </section>
    </>
  );
}
