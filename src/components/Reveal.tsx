"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, type ReactNode, type Ref } from "react";
import { cn } from "@/lib/utils";

type Direction = "up" | "down" | "left" | "right" | "none";

const OFFSET: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 34 },
  down: { x: 0, y: -34 },
  left: { x: 44, y: 0 },
  right: { x: -44, y: 0 },
  none: { x: 0, y: 0 },
};

export interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Which direction the element travels in from. */
  direction?: Direction;
  /** Delay before the animation starts, in seconds. */
  delay?: number;
  duration?: number;
  /** Animate only the first time it scrolls into view. */
  once?: boolean;
  /** Scale from 0.94 → 1 for a subtle zoom-in. */
  zoom?: boolean;
  as?: "div" | "section" | "li" | "span" | "article";
}

/** Scroll-triggered reveal wrapper used across the whole site. */
export function Reveal({
  children,
  className,
  direction = "up",
  delay = 0,
  duration = 0.7,
  once = true,
  zoom = false,
  as = "div",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: "-80px 0px -60px 0px" });
  const reduced = useReducedMotion();
  const offset = OFFSET[direction];

  const hidden = {
    opacity: 0,
    x: offset.x,
    y: offset.y,
    scale: zoom ? 0.94 : 1,
  } as const;

  if (reduced) {
    switch (as) {
      case "section":
        return <section className={className}>{children}</section>;
      case "article":
        return <article className={className}>{children}</article>;
      case "li":
        return <li className={className}>{children}</li>;
      case "span":
        return <span className={className}>{children}</span>;
      default:
        return <div className={className}>{children}</div>;
    }
  }

  const anim = {
    initial: hidden,
    animate: inView ? { opacity: 1, x: 0, y: 0, scale: 1 } : hidden,
    transition: { duration, delay, ease: [0.22, 1, 0.36, 1] as const },
  };

  switch (as) {
    case "section":
      return (
        <motion.section ref={ref} className={className} {...anim}>
          {children}
        </motion.section>
      );
    case "article":
      return (
        <motion.article ref={ref} className={className} {...anim}>
          {children}
        </motion.article>
      );
    case "li":
      return (
        <motion.li
          ref={ref as unknown as Ref<HTMLLIElement>}
          className={className}
          {...anim}
        >
          {children}
        </motion.li>
      );
    case "span":
      return (
        <motion.span ref={ref} className={className} {...anim}>
          {children}
        </motion.span>
      );
    default:
      return (
        <motion.div ref={ref} className={className} {...anim}>
          {children}
        </motion.div>
      );
  }
}

/** Staggers its direct children into view one after another. */
export function RevealGroup({
  children,
  className,
  stagger = 0.09,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-70px 0px" });
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {children}
    </motion.div>
  );
}

/** Child of <RevealGroup> — inherits the stagger timing. */
export function RevealItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 26 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.62, ease: [0.22, 1, 0.36, 1] },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

/** Section heading with an animated gold under-line. */
export function SectionHeading({
  eyebrow,
  title,
  highlight,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  highlight?: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      {eyebrow && (
        <Reveal direction="none" zoom>
          <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-4 py-1.5 text-[11px] font-bold tracking-[0.22em] text-gold-300 uppercase">
            <span className="size-1.5 rounded-full bg-gold-400" />
            {eyebrow}
          </span>
        </Reveal>
      )}
      <Reveal delay={0.08}>
        <h2 className="mt-5 text-3xl font-extrabold text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.12]">
          {title}{" "}
          {highlight && <span className="text-gradient-gold">{highlight}</span>}
        </h2>
      </Reveal>
      <Reveal delay={0.16}>
        <div
          className={cn(
            "mt-5 h-px w-40 bg-gradient-to-r from-transparent via-gold-400 to-transparent",
            align === "center" && "mx-auto",
          )}
        />
      </Reveal>
      {description && (
        <Reveal delay={0.22}>
          <p className="mt-5 text-base leading-relaxed text-slate-300/85 sm:text-lg">
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
