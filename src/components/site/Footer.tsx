import { Link } from "@tanstack/react-router";
import { ArrowUp, MapPin, Phone } from "lucide-react";
import { BISTRO, GARDENS } from "@/lib/site";
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
              <p className="mt-2 flex gap-2 text-on-ink-muted"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />+256772727777 — <Link to="/contact" className="underline hover:text-on-ink">send an enquiry</Link></p>
              <p className="mt-2 flex gap-2 text-on-ink-muted"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />+256709743524 — <Link to="/contact" className="underline hover:text-on-ink">send an enquiry</Link></p>
            </div>
          </div>
        </div>
        <div className="lg:col-span-2">
          <h3 className="eyebrow mb-6 text-primary">Follow us</h3>
          <p className="text-sm text-on-ink-muted">Official Instagram and Facebook pages will be linked here soon.</p>
        </div>
      </div>
      <div className="border-t border-on-ink/10">
        <div className="container-x flex flex-col items-center justify-between gap-4 py-6 text-xs text-on-ink-muted md:flex-row">
          <p>© {new Date().getFullYear()} Nawab Asian Bistro & Nawab Gardens. All rights reserved.</p>
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
