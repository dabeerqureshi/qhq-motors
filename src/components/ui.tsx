"use client";

import Link from "next/link";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import {
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Button                                                             */
/* ------------------------------------------------------------------ */

type Variant = "gold" | "whatsapp" | "ghost" | "outline" | "dark";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  gold: "bg-gradient-to-br from-gold-300 via-gold-400 to-gold-600 text-ink-950 shadow-[0_10px_34px_-10px_rgba(229,174,60,0.75)] hover:shadow-[0_16px_44px_-10px_rgba(229,174,60,0.9)]",
  whatsapp:
    "bg-gradient-to-br from-[#2ee06f] to-[#128c7e] text-white shadow-[0_10px_34px_-10px_rgba(37,211,102,0.8)] hover:shadow-[0_16px_44px_-10px_rgba(37,211,102,0.95)]",
  ghost: "bg-white/5 text-white hover:bg-white/10 border border-white/10",
  outline:
    "border border-gold-400/60 text-gold-200 hover:bg-gold-400/10 hover:text-gold-100",
  dark: "bg-ink-800 text-slate-100 hover:bg-ink-700 border border-white/10",
};

const SIZES: Record<Size, string> = {
  sm: "px-4 py-2 text-[13px]",
  md: "px-6 py-3 text-sm",
  lg: "px-7 py-4 text-[15px]",
};

interface BaseProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  full?: boolean;
}

const baseClass =
  "group relative inline-flex items-center justify-center gap-2 rounded-full font-bold tracking-wide transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.97]";

export function Button({
  variant = "gold",
  size = "md",
  className,
  children,
  full,
  ...rest
}: BaseProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        baseClass,
        VARIANTS[variant],
        SIZES[size],
        full && "w-full",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "gold",
  size = "md",
  className,
  children,
  full,
  external,
  onClick,
}: BaseProps & {
  href: string;
  external?: boolean;
  onClick?: () => void;
}) {
  const classes = cn(
    baseClass,
    VARIANTS[variant],
    SIZES[size],
    full && "w-full",
    className,
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} onClick={onClick}>
      {children}
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  Badge                                                              */
/* ------------------------------------------------------------------ */

export function Badge({
  children,
  className,
  tone = "gold",
}: {
  children: ReactNode;
  className?: string;
  tone?: "gold" | "green" | "slate" | "red";
}) {
  const tones = {
    gold: "border-gold-400/35 bg-gold-400/10 text-gold-200",
    green: "border-emerald-400/35 bg-emerald-400/10 text-emerald-200",
    slate: "border-white/15 bg-white/5 text-slate-200",
    red: "border-rose-400/35 bg-rose-400/10 text-rose-200",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold tracking-wider uppercase",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Animated counter                                                   */
/* ------------------------------------------------------------------ */

export function Counter({
  to,
  suffix = "",
  prefix = "",
  decimals = 0,
  duration = 1.8,
  className,
}: {
  to: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduced = useReducedMotion();
  const [value, setValue] = useState(0);
  /* reduced-motion users see the final number immediately */
  const display = reduced ? to : value;

  useEffect(() => {
    if (!inView || reduced) return;
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(v),
    });
    return () => controls.stop();
  }, [inView, to, duration, reduced]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Star rating                                                        */
/* ------------------------------------------------------------------ */

export function Stars({
  rating,
  size = 14,
  className,
}: {
  rating: number;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={cn("inline-flex items-center gap-0.5", className)}
      aria-label={`${rating} out of 5 stars`}
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <Star
          key={i}
          width={size}
          height={size}
          className={
            i < Math.round(rating)
              ? "fill-gold-400 text-gold-400"
              : "fill-transparent text-slate-600"
          }
        />
      ))}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Tilt wrapper (subtle 3D pointer reaction)                          */
/* ------------------------------------------------------------------ */

export function Tilt({
  children,
  className,
  intensity = 8,
}: {
  children: ReactNode;
  className?: string;
  intensity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(rawX, { stiffness: 180, damping: 18 });
  const rotateY = useSpring(rawY, { stiffness: 180, damping: 18 });

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rawY.set(px * intensity);
    rawX.set(-py * intensity);
  }

  function handleLeave() {
    rawX.set(0);
    rawY.set(0);
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Scroll progress bar                                                */
/* ------------------------------------------------------------------ */

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? (h.scrollTop / max) * 100 : 0);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      className="fixed inset-x-0 top-0 z-[70] h-[3px] bg-transparent"
      aria-hidden="true"
    >
      <div
        className="h-full bg-gradient-to-r from-gold-600 via-gold-300 to-gold-500 transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
