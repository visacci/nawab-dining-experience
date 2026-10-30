import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function ImageReveal({
  src,
  alt,
  className,
  imgClassName,
  parallax = true,
  eager,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  parallax?: boolean;
  eager?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  return (
    <motion.div
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      initial={reduce ? false : { clipPath: "inset(12% 0 12% 0)" }}
      whileInView={{ clipPath: "inset(0% 0 0% 0)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 1.2, ease: [0.2, 0.7, 0.2, 1] }}
    >
      <motion.img
        src={src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        style={parallax && !reduce ? { y, scale: 1.14 } : undefined}
        className={cn("h-full w-full object-cover", imgClassName)}
      />
    </motion.div>
  );
}

export function ArrowLink({
  to,
  hash,
  children,
  className,
}: {
  to: string;
  hash?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      to={to}
      {...(hash ? { hash } : {})}
      className={cn(
        "group eyebrow inline-flex items-center gap-3 text-current transition-colors hover:text-primary",
        className,
      )}
    >
      <span className="link-underline">{children}</span>
      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
    </Link>
  );
}

export function SectionLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("eyebrow flex items-center gap-3 text-primary", className)}>
      <span className="h-px w-10 bg-primary" />
      {children}
    </div>
  );
}

export function PhotoNote({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "pointer-events-none absolute bottom-3 right-3 z-10 rounded-sm bg-overlay px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-on-ink-muted backdrop-blur",
        className,
      )}
    >
      Illustrative image
    </span>
  );
}
