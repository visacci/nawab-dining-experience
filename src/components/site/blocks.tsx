import { Link } from "@tanstack/react-router";
import { ArrowRight, MapPin, Navigation, Phone, Mail } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ImageReveal, Reveal, SectionLabel } from "./motion";
import { EnquiryForm } from "./EnquiryForm";
import { directionsUrl, embedUrl } from "@/lib/site";
import { IMG } from "@/lib/images";
import { cn } from "@/lib/utils";

export function FeatureSplit({
  id,
  index,
  label,
  title,
  text,
  points,
  image,
  alt,
  reverse,
  dark,
  children,
}: {
  id?: string;
  index?: string;
  label: string;
  title: string;
  text: string;
  points?: string[];
  image: string;
  alt: string;
  reverse?: boolean;
  dark?: boolean;
  children?: ReactNode;
}) {
  return (
    <section id={id} className={cn("scroll-mt-24 py-24 md:py-32", dark ? "bg-ink text-on-ink" : "bg-background")}>
      <div className="container-x grid items-center gap-12 lg:grid-cols-12 lg:gap-20">
        <div className={cn("relative lg:col-span-7", reverse && "lg:order-2")}>
          <ImageReveal src={image} alt={alt} className="aspect-[4/3] w-full" />
          {index && (
            <span className={cn("display absolute -top-10 text-[7rem] text-primary/20 md:text-[10rem]", reverse ? "-right-2" : "-left-2")}>
              {index}
            </span>
          )}
        </div>
        <Reveal className="lg:col-span-5">
          <SectionLabel>{label}</SectionLabel>
          <h2 className="display mt-6 text-4xl md:text-6xl">{title}</h2>
          <p className={cn("mt-6 leading-relaxed", dark ? "text-on-ink-muted" : "text-muted-foreground")}>{text}</p>
          {points && (
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {points.map((p) => (
                <li key={p} className="flex items-start gap-3 text-sm">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-primary" />
                  {p}
                </li>
              ))}
            </ul>
          )}
          {children && <div className="mt-10 flex flex-wrap gap-4">{children}</div>}
        </Reveal>
      </div>
    </section>
  );
}

export function PhotoGrid({
  label,
  images,
}: {
  label: string;
  images: { src: string; alt: string }[];
}) {
  return (
    <section className="bg-background py-24 md:py-32">
      <div className="container-x">
        <SectionLabel>{label}</SectionLabel>
        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3">
          {images.map((img) => (
            <div key={img.src} className="aspect-[4/3] overflow-hidden">
              <img src={img.src} alt={img.alt} loading="lazy" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ReserveBand({ image = IMG.celebration }: { image?: string }) {
  return (
    <section className="relative overflow-hidden bg-ink py-32 text-center text-on-ink md:py-44">
      <img src={image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-50" />
      <div className="absolute inset-0 bg-overlay" />
      <Reveal className="container-x relative">
        <SectionLabel className="justify-center text-primary-glow">Reservations</SectionLabel>
        <h2 className="display mt-6 text-5xl md:text-8xl">Your Table Is Waiting.</h2>
        <p className="mx-auto mt-6 max-w-xl text-on-ink/85">
          Whether you're planning a celebration, a business lunch or a quiet dinner, we'd love to host you.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button asChild variant="brand" size="xl">
            <Link to="/reserve">Reserve a table <ArrowRight className="transition-transform group-hover:translate-x-1" /></Link>
          </Button>
          <Button asChild variant="ghostLight" size="xl"><Link to="/contact">Contact us</Link></Button>
        </div>
      </Reveal>
    </section>
  );
}

export function LocationSection({
  venue,
  address,
  phone,
  tel,
  mapsQuery,
}: {
  venue: string;
  address: string;
  phone: string | null;
  tel?: string;
  mapsQuery: string;
}) {
  return (
    <section id="location" className="scroll-mt-24 bg-secondary py-24 md:py-32">
      <div className="container-x grid gap-16 lg:grid-cols-2">
        <Reveal>
          <SectionLabel>Location & reservations</SectionLabel>
          <h2 className="display mt-6 text-4xl md:text-6xl">Visit {venue}</h2>
          <div className="mt-10 space-y-5">
            <p className="flex gap-3"><MapPin className="h-5 w-5 shrink-0 text-primary" />{address}</p>
            {phone ? (
              <a href={`tel:${tel}`} className="flex gap-3 hover:text-primary"><Phone className="h-5 w-5 shrink-0 text-primary" />{phone}</a>
            ) : (
              <p className="flex gap-3 text-muted-foreground"><Mail className="h-5 w-5 shrink-0 text-primary" />Phone number coming soon — please use the enquiry form and our team will reply.</p>
            )}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {phone && (
              <Button asChild variant="brand" size="xl"><a href={`tel:${tel}`}><Phone /> Call us</a></Button>
            )}
            <Button asChild variant="ghostDark" size="xl">
              <a href={directionsUrl(mapsQuery)} target="_blank" rel="noreferrer"><Navigation /> Get directions</a>
            </Button>
          </div>
          <div className="mt-10 aspect-[16/10] overflow-hidden border border-border">
            <iframe title={`Map of ${venue}`} src={embedUrl(mapsQuery)} className="h-full w-full grayscale-[40%]" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </Reveal>
        <Reveal delay={0.15} className="bg-paper p-8 shadow-elegant md:p-12">
          <h3 className="text-3xl">Request a table</h3>
          <p className="mt-2 text-sm text-muted-foreground">Tell us when you'd like to visit and we'll confirm with you directly.</p>
          <EnquiryForm kind="reservation" defaultVenue={venue} className="mt-8" />
        </Reveal>
      </div>
    </section>
  );
}

export function TextStatement({ label, children, dark }: { label: string; children: ReactNode; dark?: boolean }) {
  return (
    <section className={cn("py-28 md:py-40", dark ? "bg-ink text-on-ink" : "bg-paper")}>
      <Reveal className="container-x max-w-5xl text-center">
        <SectionLabel className="justify-center">{label}</SectionLabel>
        <p className="display mt-8 text-3xl leading-tight md:text-5xl">{children}</p>
      </Reveal>
    </section>
  );
}
