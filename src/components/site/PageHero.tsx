import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageHero({
  image,
  alt,
  eyebrow,
  title,
  text,
  children,
  tall,
}: {
  image: string;
  alt: string;
  eyebrow: string;
  title: ReactNode;
  text?: string;
  children?: ReactNode;
  tall?: boolean;
}) {
  const reduce = useReducedMotion();
  const anim = (d: number) =>
    reduce ? {} : { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 }, transition: { duration: 1, delay: d, ease: [0.2, 0.7, 0.2, 1] as const } };
  return (
    <section className={cn("relative flex items-end overflow-hidden bg-ink text-on-ink", tall ? "min-h-[100svh]" : "min-h-[78svh]")}>
      <img src={image} alt={alt} className="animate-slow-zoom absolute inset-0 h-full w-full object-cover" />
      <div className="bg-hero-overlay absolute inset-0" />
      <div className="container-x relative pb-20 pt-40 md:pb-28">
        <motion.div {...anim(0.1)} className="eyebrow flex items-center gap-3 text-primary-glow">
          <span className="h-px w-10 bg-primary-glow" />
          {eyebrow}
        </motion.div>
        <motion.h1 {...anim(0.25)} className="display mt-6 max-w-5xl text-5xl sm:text-7xl lg:text-8xl">
          {title}
        </motion.h1>
        {text && (
          <motion.p {...anim(0.45)} className="mt-6 max-w-xl text-base leading-relaxed text-on-ink/85 md:text-lg">
            {text}
          </motion.p>
        )}
        {children && <motion.div {...anim(0.6)} className="mt-10 flex flex-wrap gap-4">{children}</motion.div>}
      </div>
    </section>
  );
}
