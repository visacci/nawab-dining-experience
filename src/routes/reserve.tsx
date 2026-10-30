import { createFileRoute } from "@tanstack/react-router";
import { Phone, Mail, Info } from "lucide-react";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { Reveal, SectionLabel } from "@/components/site/motion";
import { IMG } from "@/lib/images";
import { BISTRO } from "@/lib/site";

export const Route = createFileRoute("/reserve")({
  head: () => ({
    meta: [
      { title: "Reserve a Table — Nawab Asian Bistro & Nawab Gardens" },
      { name: "description", content: "Request a table at Nawab Asian Bistro (Acacia Mall) or Nawab Gardens (Bugolobi). Our team will contact you to confirm." },
      { property: "og:title", content: "Reserve a Table at Nawab" },
      { property: "og:description", content: "Send a reservation request to either Nawab venue in Kampala." },
    ],
  }),
  component: Reserve,
});

function Reserve() {
  return (
    <section className="grid min-h-screen bg-paper lg:grid-cols-2">
      <div className="relative min-h-[50vh] overflow-hidden bg-ink text-on-ink">
        <img src={IMG.rooftop} alt="The rooftop terrace at Nawab Asian Bistro" className="animate-slow-zoom absolute inset-0 h-full w-full object-cover" />
        <div className="bg-hero-overlay absolute inset-0" />
        <div className="relative flex h-full flex-col justify-end p-8 pt-40 md:p-16">
          <SectionLabel className="text-primary-glow">Reservations</SectionLabel>
          <h1 className="display mt-6 text-5xl md:text-7xl">Your Table Is Waiting.</h1>
          <div className="mt-10 space-y-4 text-sm text-on-ink/85">
            <a href={`tel:${BISTRO.tel}`} className="flex gap-3 hover:text-primary-glow"><Phone className="h-5 w-5 text-primary-glow" />Asian Bistro: {BISTRO.phone}</a>
            <p className="flex gap-3"><Mail className="h-5 w-5 text-primary-glow" />Nawab Gardens: please use this form — phone number coming soon.</p>
          </div>
        </div>
      </div>
      <div className="px-6 pb-20 pt-16 md:px-16 lg:pt-40">
        <Reveal>
          <h2 className="text-4xl">Request a reservation</h2>
          <p className="mt-3 flex gap-2 text-sm text-muted-foreground">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            This sends a request — your table is confirmed only once our team contacts you.
          </p>
          <EnquiryForm kind="reservation" className="mt-10" />
        </Reveal>
      </div>
    </section>
  );
}
