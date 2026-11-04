import { Link } from "@tanstack/react-router";
import { ArrowUp, MapPin, Phone } from "lucide-react";
import { BISTRO, GARDENS, SOCIALS } from "@/lib/site";
import { Logo } from "./Header";

const quick = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Nawab Asian Bistro", to: "/asian-bistro" },
  { label: "Nawab Gardens", to: "/nawab-gardens" },
  { label: "Services & Experiences", to: "/services" },
  { label: "Blog", to: "/blog" },
  { label: "FAQs", to: "/faqs" },
  { label: "Contact", to: "/contact" },
];

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="3.8" />
      <circle cx="17.4" cy="6.6" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="currentColor">
      <path d="M14.2 3c.3 2.2 1.6 3.8 3.8 4.1v2.4a6.7 6.7 0 0 1-3.8-1.2v6.2a5.6 5.6 0 1 1-5.6-5.6c.3 0 .6 0 .9.1v2.6a3 3 0 1 0 2.1 2.9V3h2.6Z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="relative bg-ink text-on-ink">
      <div className="container-x grid gap-14 py-20 md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo light />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-on-ink-muted">
            A Kampala dining brand built on generous flavour, warm hospitality and memorable settings —
            a skyline bistro in Kololo and a garden retreat in Bugolobi.
          </p>
          <p className="mt-8 font-serif text-xl italic text-on-ink/90">
            Exceptional flavours. Beautiful spaces. Unforgettable experiences.
          </p>
        </div>
        <div className="lg:col-span-2">
          <h3 className="eyebrow mb-6 text-primary">Quick links</h3>
          <ul className="space-y-3 text-sm">
            {quick.map((q) => (
              <li key={q.to}>
                <Link to={q.to} className="link-underline text-on-ink-muted transition-colors hover:text-on-ink">
                  {q.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-4">
          <h3 className="eyebrow mb-6 text-primary">Our locations</h3>
          <div className="space-y-8 text-sm">
            <div>
              <p className="font-serif text-xl">{BISTRO.name}</p>
                <p className="mt-2 flex gap-2 text-on-ink-muted"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{BISTRO.address}</p>
                <a href={`tel:${BISTRO.tel}`} className="mt-2 flex gap-2 text-on-ink-muted hover:text-on-ink"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{BISTRO.phone}</a>
                <a href={`tel:${BISTRO.phone2}`} className="mt-2 flex gap-2 text-on-ink-muted hover:text-on-ink"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{BISTRO.phone2}</a>

            </div>
            <div>
              <p className="font-serif text-xl">{GARDENS.name}</p>
              <p className="mt-2 flex gap-2 text-on-ink-muted"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{GARDENS.address}</p>
              <a href={`tel:${GARDENS.tel}`} className="mt-2 flex gap-2 text-on-ink-muted hover:text-on-ink"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{GARDENS.phone}</a>
              <a href={`tel:${GARDENS.tel2}`} className="mt-2 flex gap-2 text-on-ink-muted hover:text-on-ink"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{GARDENS.phone2}</a>
            </div>
          </div>
        </div>
        <div className="lg:col-span-2">
          <h3 className="eyebrow mb-6 text-primary">Follow us</h3>
          <div className="flex gap-3">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="flex h-11 w-11 items-center justify-center border border-on-ink/20 text-on-ink transition-colors hover:border-primary hover:bg-primary"
              >
                {s.label === "Instagram" ? <InstagramIcon /> : <TikTokIcon />}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-on-ink/10">
        <div className="container-x flex flex-col items-center justify-between gap-4 py-6 text-xs text-on-ink-muted md:flex-row">
          <p>© {new Date().getFullYear()} Nawab Asian Bistro & Nawab Gardens. All rights reserved. Credits to Axhela Digital agency</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-on-ink">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-on-ink">Terms & Conditions</Link>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="group flex h-10 w-10 items-center justify-center border border-on-ink/20 transition-colors hover:border-primary hover:bg-primary"
              aria-label="Back to top"
            >
              <ArrowUp className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
