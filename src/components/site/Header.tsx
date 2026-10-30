import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { NAV, BISTRO } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Logo({ light }: { light?: boolean }) {
  return (
    <Link to="/" className="flex flex-col leading-none" aria-label="Nawab home">
      <span className={cn("font-serif text-3xl tracking-[0.12em]", light ? "text-on-ink" : "text-ink")}>
        NAWAB
      </span>
      <span className="mt-1 text-[0.55rem] uppercase tracking-[0.42em] text-primary">
        Bistro · Gardens
      </span>
    </Link>
  );
}

export function Header() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setOpen(false), [pathname]);

  // All pages open on a dark photographic hero, so transparent + light text works everywhere.
  const solid = scrolled;
  const light = !solid;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        solid ? "bg-paper/95 py-3 shadow-sm backdrop-blur" : "bg-transparent py-6",
      )}
    >
      <div className="container-x flex items-center justify-between gap-6">
        <Logo light={light} />

        <nav className="hidden items-center gap-7 xl:flex" aria-label="Main">
          {NAV.map((item) => (
            <div key={item.label} className="group relative">
              <Link
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                className={cn(
                  "link-underline flex items-center gap-1 py-2 text-[0.72rem] uppercase tracking-[0.18em] transition-colors data-[status=active]:text-primary",
                  light ? "text-on-ink" : "text-ink",
                )}
              >
                {item.label}
                {item.children && <ChevronDown className="h-3 w-3 transition-transform group-hover:rotate-180" />}
              </Link>
              {item.children && (
                <div className="invisible absolute left-1/2 top-full z-50 w-64 -translate-x-1/2 translate-y-2 pt-4 opacity-0 transition-all duration-300 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="border-t-2 border-primary bg-paper p-3 shadow-elegant">
                    {item.children.map((c) => (
                      <Link
                        key={c.label}
                        to={c.to}
                        hash={c.hash}
                        className="block px-3 py-2.5 text-sm text-ink transition-all hover:translate-x-1 hover:text-primary"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button asChild variant="brand" size="lg" className="hidden h-11 sm:inline-flex">
            <Link to="/reserve">Reserve a table</Link>
          </Button>
          <button
            onClick={() => setOpen(true)}
            className={cn("p-2 xl:hidden", light ? "text-on-ink" : "text-ink")}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-overlay xl:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-ink text-on-ink xl:hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
              aria-label="Mobile menu"
            >
              <div className="flex items-center justify-between p-6">
                <Logo light />
                <button onClick={() => setOpen(false)} aria-label="Close menu" className="p-2">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto px-6">
                {NAV.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.04 }}
                    className="border-b border-on-ink/10"
                  >
                    <div className="flex items-center justify-between">
                      <Link to={item.to} className="block py-4 font-serif text-2xl data-[status=active]:text-primary" activeOptions={{ exact: item.to === "/" }}>
                        {item.label}
                      </Link>
                      {item.children && (
                        <button
                          onClick={() => setExpanded(expanded === item.label ? null : item.label)}
                          aria-label={`Expand ${item.label}`}
                          aria-expanded={expanded === item.label}
                          className="p-2"
                        >
                          <ChevronDown className={cn("h-5 w-5 transition-transform", expanded === item.label && "rotate-180")} />
                        </button>
                      )}
                    </div>
                    <AnimatePresence>
                      {item.children && expanded === item.label && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          {item.children.map((c) => (
                            <Link key={c.label} to={c.to} hash={c.hash} onClick={() => setOpen(false)} className="block py-2 pl-4 text-sm text-on-ink-muted hover:text-primary">
                              {c.label}
                            </Link>
                          ))}
                          <div className="h-3" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </nav>
              <div className="space-y-3 p-6">
                <Button asChild variant="brand" size="xl" className="w-full">
                  <Link to="/reserve">Reserve a table</Link>
                </Button>
                <a href={`tel:${BISTRO.tel}`} className="flex items-center justify-center gap-2 text-sm text-on-ink-muted">
                  <Phone className="h-4 w-4 text-primary" /> Bistro: {BISTRO.phone}
                </a>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
