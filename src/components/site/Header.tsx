import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { NAV, BISTRO, type NavItem } from "@/lib/site";
import logoOnDark from "@/assets/nawab-logo.png";
import logoOnLight from "@/assets/nawab-logo-ink.png";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Logo({ light }: { light?: boolean }) {
  return (
    <Link to="/" className="inline-flex shrink-0 items-center" aria-label="Nawab home">
      <img src={light ? logoOnDark : logoOnLight} alt="" className="h-12 w-auto sm:h-14" />
    </Link>
  );
}

function MobileMenu({
  open,
  pathname,
  expanded,
  onClose,
  onToggle,
}: {
  open: boolean;
  pathname: string;
  expanded: string | null;
  onClose: () => void;
  onToggle: (label: string) => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!open) return;
    const update = () => setHeight(window.innerHeight);
    update();
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, [open]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="xl:hidden"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        width: "100%",
        height: height ? `${height}px` : "100dvh",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        backgroundColor: "#080808",
        color: "#ffffff",
      }}
    >
      <div
        className="flex shrink-0 items-center justify-between gap-4 border-b border-white/15 px-5 py-4"
        style={{ paddingTop: "max(1rem, env(safe-area-inset-top))", backgroundColor: "#080808" }}
      >
        <Logo light />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center border border-white/40 bg-white text-ink"
        >
          <X className="h-5 w-5" strokeWidth={2.25} />
        </button>
      </div>
      <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5" aria-label="Mobile" style={{ backgroundColor: "#080808" }}>
        {NAV.map((item, i) => (
          <MobileNavItem
            key={item.label}
            item={item}
            index={i}
            pathname={pathname}
            expanded={expanded === item.label}
            onToggle={() => onToggle(item.label)}
            onClose={onClose}
          />
        ))}
      </nav>
      <div
        className="shrink-0 space-y-3 border-t border-white/15 px-5 py-4"
        style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))", backgroundColor: "#080808" }}
      >
        <Button asChild variant="brand" size="xl" className="w-full">
          <Link to="/reserve" onClick={onClose}>
            Reserve a table
          </Link>
        </Button>
        <a href={`tel:${BISTRO.tel}`} className="flex min-h-11 items-center justify-center gap-2 text-sm text-white">
          <Phone className="h-4 w-4 text-primary-glow" /> Bistro: {BISTRO.phone}
        </a>
      </div>
    </div>,
    document.body,
  );
}

function MobileNavItem({
  item,
  index,
  pathname,
  expanded,
  onToggle,
  onClose,
}: {
  item: NavItem;
  index: number;
  pathname: string;
  expanded: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  const childActive = item.children?.some((c) => c.to && pathname === c.to) ?? false;
  const labelClass = "min-w-0 flex-1 py-4 text-left font-serif text-[1.65rem] leading-tight text-white data-[status=active]:text-primary-glow";

  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.08 + index * 0.04 }}
      className="border-b border-white/15"
    >
      <div className="flex items-center gap-2">
        {item.to ? (
          <Link to={item.to} activeOptions={{ exact: item.to === "/" }} className={labelClass} onClick={onClose}>
            {item.label}
          </Link>
        ) : (
          <button type="button" onClick={onToggle} aria-expanded={expanded} className={cn(labelClass, childActive && "text-primary-glow")}>
            {item.label}
          </button>
        )}
        {item.children && (
          <button
            type="button"
            onClick={onToggle}
            aria-label={`${expanded ? "Collapse" : "Expand"} ${item.label}`}
            aria-expanded={expanded}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center text-white"
          >
            <ChevronDown className={cn("h-5 w-5 transition-transform", expanded && "rotate-180")} />
          </button>
        )}
      </div>
      <AnimatePresence initial={false}>
        {item.children && expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-1 border-l-2 border-primary pb-4 pl-3">
              {item.children.map((child) =>
                child.to ? (
                  <Link
                    key={child.label}
                    to={child.to}
                    {...(child.hash ? { hash: child.hash } : {})}
                    onClick={onClose}
                    className="flex min-h-11 items-center gap-3 py-2 text-base text-white/90 hover:text-primary-glow"
                  >
                    {child.image ? <img src={child.image} alt="" className="h-12 w-16 shrink-0 object-cover" /> : null}
                    <span>{child.label}</span>
                  </Link>
                ) : null,
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
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
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1280px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const previous = html.style.overflow;
    html.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const stopScroll = (event: TouchEvent) => {
      const menu = document.getElementById("mobile-menu");
      if (menu?.contains(event.target as Node)) return;
      event.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("touchmove", stopScroll, { passive: false });
    return () => {
      html.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("touchmove", stopScroll);
    };
  }, [open]);

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
          {NAV.map((item) => {
            const childActive = item.children?.some((c) => c.to && pathname === c.to) ?? false;
            const triggerClass = cn(
              "link-underline flex items-center gap-1 py-2 text-[0.72rem] uppercase tracking-[0.18em] transition-colors data-[status=active]:text-primary",
              light ? "text-on-ink" : "text-ink",
              !item.to && childActive && "text-primary",
            );
            return (
              <div key={item.label} className="group relative">
                {item.to ? (
                  <Link to={item.to} activeOptions={{ exact: item.to === "/" }} className={triggerClass}>
                    {item.label}
                    {item.children && <ChevronDown className="h-3 w-3 transition-transform group-hover:rotate-180" />}
                  </Link>
                ) : (
                  <button type="button" className={cn(triggerClass, "cursor-pointer")} aria-haspopup="true">
                    {item.label}
                    {item.children && <ChevronDown className="h-3 w-3 transition-transform group-hover:rotate-180" />}
                  </button>
                )}
                {item.children && (
                  <div
                    className={cn(
                      "invisible absolute top-full z-50 translate-y-2 pt-4 opacity-0 transition-all duration-300 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100",
                      item.children.some((c) => c.image) ? "left-0 w-[28rem]" : "left-1/2 w-64 -translate-x-1/2",
                    )}
                  >
                    <div
                      className={cn(
                        "border-t-2 border-primary bg-paper shadow-elegant",
                        item.children.some((c) => c.image) ? "grid grid-cols-2 gap-2 p-3" : "p-3",
                      )}
                    >
                      {item.children.map((c) =>
                        c.to ? (
                          <Link
                            key={c.label}
                            to={c.to}
                            {...(c.hash ? { hash: c.hash } : {})}
                            className={cn(
                              "text-ink transition-all hover:text-primary",
                              c.image ? "block" : "block px-3 py-2.5 text-sm hover:translate-x-1",
                            )}
                          >
                            {c.image ? (
                              <>
                                <img src={c.image} alt="" className="aspect-[4/3] w-full object-cover" />
                                <span className="mt-2 block px-1 pb-1 text-[0.68rem] uppercase tracking-[0.14em]">{c.label}</span>
                              </>
                            ) : (
                              c.label
                            )}
                          </Link>
                        ) : null,
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Button asChild variant="brand" size="lg" className="hidden h-11 sm:inline-flex">
            <Link to="/reserve">Reserve a table</Link>
          </Button>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className={cn(
              "inline-flex h-11 w-11 items-center justify-center border xl:hidden",
              light
                ? "border-white/70 bg-black/75 text-white shadow-[0_2px_16px_rgba(0,0,0,0.45)]"
                : "border-ink/20 bg-white text-ink shadow-sm",
            )}
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <Menu className="h-5 w-5" strokeWidth={2.25} />
          </button>
        </div>
      </div>

      <MobileMenu
        open={open}
        pathname={pathname}
        expanded={expanded}
        onClose={() => setOpen(false)}
        onToggle={(label) => setExpanded(expanded === label ? null : label)}
      />
    </header>
  );
}
