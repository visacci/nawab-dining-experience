import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, ChefHat, HeartHandshake, Trees, Leaf, PartyPopper, Car, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowLink, ImageReveal, Reveal, SectionLabel } from "@/components/site/motion";
import { ReserveBand } from "@/components/site/blocks";
import { BISTRO_IMG, IMG } from "@/lib/images";
import { BISTRO, GARDENS } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nawab — Asian Bistro & Gardens | Fine Dining in Kampala" },
      { name: "description", content: "Pan-Asian dining with a skyline terrace at Acacia Mall, and authentic Indian cuisine in a garden setting in Bugolobi. Reserve your table at Nawab." },
      { property: "og:title", content: "Nawab — Where Flavour Meets Experience" },
      { property: "og:description", content: "Two distinct Kampala dining destinations: Nawab Asian Bistro, Kololo and Nawab Gardens, Bugolobi." },
    ],
  }),
  component: Home,
});

function Hero() {
  const reduce = useReducedMotion();
  const words = "Where Flavour Meets Experience.".split(" ");
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-ink text-on-ink">
      <img src={IMG.bar} alt="The bar and rooftop terrace at Nawab Asian Bistro" className="animate-slow-zoom absolute inset-0 h-full w-full object-cover" />
      <div className="bg-hero-overlay absolute inset-0" />
      <div className="container-x relative pt-24">
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="eyebrow flex items-center gap-3 text-primary-glow"
        >
          <span className="h-px w-12 bg-primary-glow" /> An extraordinary dining experience in Kampala
        </motion.p>
        <h1 className="display mt-8 max-w-5xl text-6xl sm:text-8xl lg:text-[8.5rem]">
          {words.map((w, i) => (
            <span key={i} className="inline-block overflow-hidden pb-2 pr-[0.25em] align-bottom">
              <motion.span
                className={`inline-block ${w === "Experience." ? "italic text-primary-glow" : ""}`}
                initial={reduce ? false : { y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1, delay: 0.35 + i * 0.1, ease: [0.2, 0.7, 0.2, 1] }}
              >
                {w}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.9 }}
          className="mt-8 max-w-xl text-lg leading-relaxed text-on-ink/85"
        >
          Discover exceptional Asian and Indian cuisine, beautiful settings and unforgettable moments at Nawab Asian Bistro and Nawab Gardens.
        </motion.p>
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.1 }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <Button asChild variant="brand" size="xl">
            <a href="#venues">Explore our venues <ArrowRight className="transition-transform group-hover:translate-x-1" /></a>
          </Button>
          <Button asChild variant="ghostLight" size="xl"><Link to="/reserve">Reserve a table</Link></Button>
        </motion.div>
      </div>
      <a href="#intro" aria-label="Scroll down" className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 text-on-ink/70">
        <span className="eyebrow text-[0.6rem]">Scroll</span>
        <span className="flex h-10 w-6 justify-center rounded-full border border-on-ink/40 pt-2">
          <span className="animate-scroll-dot h-2 w-1 rounded-full bg-primary-glow" />
        </span>
      </a>
    </section>
  );
}

function Intro() {
  return (
    <section id="intro" className="bg-paper py-28 md:py-40">
      <div className="container-x grid items-center gap-16 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <SectionLabel>Introducing Nawab</SectionLabel>
          <h2 className="display mt-6 text-5xl md:text-7xl">More Than Dining. <em className="text-primary">It's an Experience.</em></h2>
          <p className="mt-8 text-lg leading-relaxed text-muted-foreground">
            Nawab is a Kampala dining brand built on generous flavour, warm hospitality and memorable settings. Across two distinct venues, we welcome guests looking for food worth lingering over, whether it's a business lunch above the city, a birthday dinner with family or a relaxed evening in a garden.
          </p>
          <ArrowLink to="/about" className="mt-10 text-ink">About Nawab</ArrowLink>
        </Reveal>
        <div className="relative lg:col-span-7">
          <ImageReveal src={BISTRO_IMG.counter} alt="The Nawab counters at Acacia Mall" className="ml-auto aspect-[4/5] w-4/5" />
          <div className="absolute -bottom-10 left-0 w-1/2 border-8 border-paper shadow-elegant">
            <ImageReveal src={IMG.curry} alt="Curries and sides at Nawab Gardens" className="aspect-square" parallax={false} />
          </div>
          <span className="display absolute -top-6 left-6 text-7xl italic text-primary/25">N</span>
        </div>
      </div>
    </section>
  );
}

function VenuePanel({
  to, eyebrow, name, location, cuisine, text, highlights, image, alt, cta, flip,
}: {
  to: string; eyebrow: string; name: string; location: string; cuisine: string; text: string;
  highlights: string[]; image: string; alt: string; cta: string; flip?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  return (
    <div ref={ref} className="group relative min-h-[90svh] overflow-hidden bg-ink text-on-ink">
      <motion.img style={{ y, scale: 1.15 }} src={image} alt={alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[2s] group-hover:scale-[1.2]" />
      <div className="bg-card-overlay absolute inset-0" />
      <div className={`container-x relative flex min-h-[90svh] items-end pb-16 md:pb-24 ${flip ? "md:justify-end" : ""}`}>
        <Reveal className="max-w-xl">
          <p className="eyebrow text-primary-glow">{eyebrow}</p>
          <h3 className="display mt-4 text-5xl md:text-7xl">{name}</h3>
          <p className="mt-4 flex items-center gap-2 text-sm text-on-ink/80"><MapPin className="h-4 w-4 text-primary-glow" />{location} · {cuisine}</p>
          <p className="mt-6 leading-relaxed text-on-ink/85">{text}</p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {highlights.map((h) => (
              <li key={h} className="border border-on-ink/25 px-3 py-1.5 text-xs uppercase tracking-[0.15em] backdrop-blur-sm">{h}</li>
            ))}
          </ul>
          <Button asChild variant="brand" size="xl" className="mt-8">
            <Link to={to}>{cta} <ArrowRight className="transition-transform group-hover:translate-x-1" /></Link>
          </Button>
        </Reveal>
      </div>
    </div>
  );
}

function Venues() {
  return (
    <section id="venues" className="scroll-mt-16 bg-ink">
      <div className="container-x py-24 text-center text-on-ink md:py-32">
        <Reveal>
          <SectionLabel className="justify-center">Two destinations</SectionLabel>
          <h2 className="display mt-6 text-5xl md:text-7xl">Discover Our Two Destinations</h2>
          <p className="mx-auto mt-6 max-w-2xl text-on-ink-muted">One family name, two distinct atmospheres — a cosmopolitan skyline bistro and a tranquil garden retreat.</p>
        </Reveal>
      </div>
      <VenuePanel
        to="/asian-bistro" eyebrow="Destination 01" name={BISTRO.name} location="Acacia Mall, 2nd Floor, Kololo" cuisine="Pan-Asian"
        text="Experience a vibrant Pan-Asian dining destination featuring a diverse menu, elegant indoor dining and a rooftop terrace overlooking the Kampala skyline."
        highlights={["Restaurant", "Bar", "Rooftop Terrace", "Conference / Party Room", "Dine-in & takeaway"]}
        image={IMG.rooftop} alt="The rooftop terrace at Nawab Asian Bistro, looking over Kampala" cta="Explore Asian Bistro"
      />
      <VenuePanel
        to="/nawab-gardens" eyebrow="Destination 02" name={GARDENS.name} location="27 Bandali Rise, Bugolobi" cuisine="Indian" flip
        text="Escape into a beautiful garden dining experience where authentic Indian cuisine meets a peaceful, leafy atmosphere. The perfect destination for long lunches, intimate gatherings and memorable celebrations."
        highlights={["Restaurant", "Bar", "Gardens", "Rooftop Terrace", "Conference / Party Room"]}
        image={IMG.garden} alt="Outdoor tables on the lawn at Nawab Gardens" cta="Explore Nawab Gardens"
      />
    </section>
  );
}

const tastes = [
  { t: "Pan-Asian Cuisine", d: "A wide-ranging journey across Asian kitchens.", img: IMG.heroFood, span: "md:col-span-2 md:row-span-2" },
  { t: "Indian Cuisine", d: "Authentic spicing and generous, comforting plates.", img: IMG.indian, span: "md:col-span-2" },
  { t: "Curries", d: "Slow-built sauces, rich with aroma.", img: IMG.curry, span: "md:row-span-2" },
  { t: "Tandoor plates", d: "Grilled favourites from the clay oven.", img: IMG.tikka, span: "", pos: "object-[50%_20%]" },
  { t: "Naan & Favourites", d: "Warm breads and much-loved accompaniments.", img: IMG.naan, span: "" },
  { t: "Vegetarian Options", d: "Plenty of choice, full of flavour.", img: IMG.veg, span: "md:col-span-2" },
  { t: "Vegan Options", d: "Thoughtful plant-based dishes, on request.", img: IMG.veg, span: "md:col-span-2", pos: "object-[50%_80%]" },
];

function Taste() {
  return (
    <section className="bg-background py-28 md:py-36">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <Reveal>
            <SectionLabel>A taste of Nawab</SectionLabel>
            <h2 className="display mt-6 text-5xl md:text-7xl">Crafted for Every Craving.</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-sm text-muted-foreground">Our full menus are being prepared for the website. Ask our team for today's selection when you visit.</p>
          </Reveal>
        </div>
        <div className="mt-16 grid auto-rows-[220px] gap-4 md:grid-cols-5 md:auto-rows-[240px]">
          {tastes.map((x, i) => (
            <Reveal key={x.t} delay={i * 0.05} className={`group relative overflow-hidden ${x.span}`}>
              <img src={x.img} alt={x.t} loading="lazy" className={`h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-110 ${x.pos ?? ""}`} />
              <div className="bg-card-overlay absolute inset-0" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-on-ink">
                <h3 className="text-2xl md:text-3xl">{x.t}</h3>
                <p className="mt-1 max-h-0 overflow-hidden text-sm text-on-ink/80 opacity-0 transition-all duration-500 group-hover:max-h-20 group-hover:opacity-100">{x.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button asChild variant="ghostDark" size="xl"><Link to="/faqs">Discover our menus <ArrowRight className="transition-transform group-hover:translate-x-1" /></Link></Button>
        </div>
      </div>
    </section>
  );
}

const spaces = [
  { n: "01", t: "The Restaurant", d: "Beautiful indoor dining spaces, welcoming service and exceptional food.", img: IMG.interior, where: "Bistro · Gardens", to: "/asian-bistro", hash: "restaurant" },
  { n: "02", t: "The Bar", d: "A welcoming space for guests to unwind and enjoy their time.", img: IMG.bar, where: "Bistro · Gardens", to: "/asian-bistro", hash: "bar" },
  { n: "03", t: "The Rooftop Terrace", d: "An elevated dining experience with beautiful city views.", img: IMG.rooftop, where: "Bistro · Gardens", to: "/asian-bistro", hash: "rooftop" },
  { n: "04", t: "Conference & Party Room", d: "A space for meetings, private gatherings and celebrations.", img: IMG.privateRoom, where: "Bistro · Gardens", to: "/services", hash: "corporate" },
  { n: "05", t: "The Gardens", d: "A peaceful green setting for outdoor dining and special occasions.", img: IMG.garden, where: "Nawab Gardens", to: "/nawab-gardens", hash: "gardens" },
];

function Spaces() {
  return (
    <section className="bg-ink py-28 text-on-ink md:py-36">
      <div className="container-x">
        <Reveal>
          <SectionLabel>Our spaces</SectionLabel>
          <h2 className="display mt-6 max-w-3xl text-5xl md:text-7xl">Spaces That Make Every Moment Special</h2>
        </Reveal>
        <div className="mt-16 divide-y divide-on-ink/10 border-y border-on-ink/10">
          {spaces.map((s) => (
            <Link key={s.n} to={s.to} hash={s.hash} className="group grid items-center gap-6 py-8 md:grid-cols-12">
              <span className="font-serif text-2xl text-primary md:col-span-1">{s.n}</span>
              <div className="md:col-span-5">
                <h3 className="text-3xl transition-all duration-500 group-hover:translate-x-3 group-hover:text-primary-glow md:text-5xl">{s.t}</h3>
                <p className="eyebrow mt-2 text-[0.6rem] text-on-ink-muted">{s.where}</p>
              </div>
              <p className="text-on-ink-muted md:col-span-3">{s.d}</p>
              <div className="relative h-40 overflow-hidden md:col-span-3 md:h-32">
                <img src={s.img} alt={s.t} loading="lazy" className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0" />
              </div>
            </Link>
          ))}
        </div>
        <p className="mt-6 text-xs text-on-ink-muted">Facilities listed per venue. Please contact us to confirm availability for your date.</p>
      </div>
    </section>
  );
}

function Celebrate() {
  const tags = ["Weddings", "Birthday celebrations", "Private parties", "Corporate meetings", "Family gatherings", "Group dining", "Special celebrations"];
  return (
    <section className="overflow-hidden bg-secondary py-28 md:py-36">
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <div className="grid grid-cols-6 grid-rows-6 gap-4 lg:col-span-7" style={{ height: "min(80vh, 720px)" }}>
          <ImageReveal src={IMG.wedding} alt="Tables set on the lawn at Nawab Gardens in the evening" className="col-span-3 row-span-6" />
          <ImageReveal src={IMG.celebration} alt="Tables arranged on the lawn for a gathering" className="col-span-3 row-span-3" />
          <ImageReveal src={IMG.privateRoom} alt="A long table set for a celebration at Nawab Asian Bistro" className="col-span-3 row-span-3" />
        </div>
        <Reveal className="flex flex-col justify-center lg:col-span-5">
          <SectionLabel>Celebrate with Nawab</SectionLabel>
          <h2 className="display mt-6 text-5xl md:text-7xl">Make Every Occasion Extraordinary.</h2>
          <div className="mt-8 flex flex-wrap gap-2">
            {tags.map((t) => (
              <span key={t} className="border border-ink/15 bg-paper px-4 py-2 text-sm transition-colors hover:border-primary hover:text-primary">{t}</span>
            ))}
          </div>
          <Button asChild variant="brand" size="xl" className="mt-10 self-start">
            <Link to="/services">Plan your event <ArrowRight className="transition-transform group-hover:translate-x-1" /></Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}

const why = [
  { i: ChefHat, t: "Exceptional Food", d: "Fresh ingredients, authentic spicing and consistent preparation." },
  { i: HeartHandshake, t: "Warm Hospitality", d: "Attentive and courteous service." },
  { i: Trees, t: "Beautiful Settings", d: "A skyline terrace in Kololo and a peaceful garden retreat in Bugolobi." },
  { i: Leaf, t: "Flexible Dining", d: "Vegetarian, vegan and gluten-free options, with dishes prepared to preferred spice levels." },
  { i: PartyPopper, t: "Memorable Occasions", d: "Spaces for celebrations, business lunches and private gatherings." },
  { i: Car, t: "Convenience", d: "Dine-in, takeaway at the Bistro and convenient parking at Acacia Mall." },
];

function Why() {
  return (
    <section className="bg-paper py-28 md:py-36">
      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionLabel className="justify-center">Why Nawab</SectionLabel>
          <h2 className="display mt-6 text-5xl md:text-7xl">Why Choose Nawab?</h2>
        </Reveal>
        <div className="mt-20 grid gap-px bg-border md:grid-cols-2 lg:grid-cols-3">
          {why.map((w, i) => (
            <Reveal key={w.t} delay={i * 0.06} className="group bg-paper p-10 transition-colors duration-500 hover:bg-ink hover:text-on-ink">
              <w.i className="h-8 w-8 text-primary transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-110" strokeWidth={1.3} />
              <h3 className="mt-8 text-3xl">{w.t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground group-hover:text-on-ink-muted">{w.d}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Story() {
  return (
    <section className="relative bg-ink text-on-ink">
      <div className="grid lg:grid-cols-2">
        <ImageReveal src={IMG.indian} alt="Naan and rice at Nawab Gardens" className="min-h-[60vh] lg:min-h-[90vh]" />
        <Reveal className="flex flex-col justify-center px-6 py-24 md:px-16 lg:px-20">
          <SectionLabel>Our story</SectionLabel>
          <h2 className="display mt-6 text-5xl md:text-6xl">A Tradition of Flavour and Hospitality.</h2>
          <p className="mt-8 text-lg leading-relaxed text-on-ink-muted">
            Nawab has been part of Kampala's dining scene for many years, serving guests at several locations across the city. The brand's name recalls the Nawabs of South Asia, known for their love of fine food, gardens and gracious hospitality. That spirit continues to guide how we cook and welcome our guests.
          </p>
          <ArrowLink to="/about" className="mt-10 text-on-ink">Discover our story</ArrowLink>
        </Reveal>
      </div>
    </section>
  );
}

function Home() {
  return (
    <>
      <Hero />
      <Intro />
      <Venues />
      <Taste />
      <Spaces />
      <Celebrate />
      <Why />
      <Story />
      <ReserveBand />
    </>
  );
}
