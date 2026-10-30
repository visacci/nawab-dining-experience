import { createFileRoute, Link } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PageHero } from "@/components/site/PageHero";
import { ReserveBand } from "@/components/site/blocks";
import { Reveal } from "@/components/site/motion";
import { IMG } from "@/lib/images";
import { BISTRO } from "@/lib/site";

export const Route = createFileRoute("/faqs")({
  head: () => ({
    meta: [
      { title: "FAQs — Nawab Asian Bistro & Nawab Gardens" },
      { name: "description", content: "Locations, cuisines, reservations, takeaway, dietary options, spice levels and events at Nawab in Kampala." },
      { property: "og:title", content: "Frequently Asked Questions — Nawab" },
      { property: "og:description", content: "Everything you need to know before visiting Nawab." },
    ],
  }),
  component: Faqs,
});

const faqs: { q: string; a: React.ReactNode }[] = [
  { q: "Where is Nawab Asian Bistro located?", a: <>On the 2nd Floor of Acacia Mall, Kololo, Kampala. Secure parking is available at the mall.</> },
  { q: "Where is Nawab Gardens located?", a: <>At 27 Bandali Rise, Bugolobi, Kampala.</> },
  { q: "What cuisines do the restaurants serve?", a: <>Nawab Asian Bistro serves Pan-Asian cuisine. Nawab Gardens serves Indian cuisine. Full menus will be published on the website soon — please ask our team for the current selection.</> },
  { q: "Can I make a reservation?", a: <>Yes. Send a <Link to="/reserve" className="text-primary underline">reservation request</Link> and our team will contact you to confirm. For the Bistro you can also call <a href={`tel:${BISTRO.tel}`} className="text-primary underline">{BISTRO.phone}</a>.</> },
  { q: "Does Nawab Asian Bistro offer takeaway?", a: <>Yes, the Bistro offers both dine-in and takeaway.</> },
  { q: "Are vegetarian options available?", a: <>Yes, vegetarian options are available.</> },
  { q: "Are vegan and gluten-free options available?", a: <>Vegan and gluten-free options are available. Please let our team know about any dietary requirements or allergies when you order.</> },
  { q: "Can I request a particular spice level?", a: <>Yes — dishes can be prepared to your preferred spice level.</> },
  { q: "Can I organise a birthday celebration at Nawab?", a: <>Absolutely. Both venues welcome celebrations. Send an <Link to="/services" hash="enquire" className="text-primary underline">event enquiry</Link> with your date and guest numbers.</> },
  { q: "Are spaces available for corporate meetings?", a: <>Both venues list a conference / party room. Please contact us to check availability and arrangements for your meeting.</> },
  { q: "Can I book a private event?", a: <>Yes, please send an <Link to="/services" hash="enquire" className="text-primary underline">event enquiry</Link> and our team will get back to you with options.</> },
  { q: "What are your opening hours?", a: <>Please contact the restaurant for current opening hours.</> },
  { q: "How do I contact the restaurants?", a: <>Call Nawab Asian Bistro on <a href={`tel:${BISTRO.tel}`} className="text-primary underline">{BISTRO.phone}</a>. The Nawab Gardens phone number will be shared soon — in the meantime, use our <Link to="/contact" className="text-primary underline">contact form</Link>.</> },
];

function Faqs() {
  return (
    <>
      <PageHero image={IMG.naan} alt="Naan and rice at Nawab Gardens" eyebrow="FAQs" title={<>Questions, <em className="text-primary-glow">answered.</em></>} />
      <section className="bg-paper py-24 md:py-32">
        <Reveal className="container-x max-w-4xl">
          <Accordion type="single" collapsible className="border-t border-border">
            {faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`q${i}`} className="border-border">
                <AccordionTrigger className="py-7 text-left font-serif text-2xl hover:text-primary hover:no-underline md:text-3xl">{f.q}</AccordionTrigger>
                <AccordionContent className="pb-8 text-base leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </section>
      <ReserveBand />
    </>
  );
}
