"use client";

import { BadgeCheck, Clock, CreditCard, Headphones, Plane, ShieldCheck } from "lucide-react";
import { SITE } from "@/data/site";

const SIGNALS = [
  { icon: ShieldCheck, label: "Fully insured & verified vehicles" },
  { icon: Plane, label: "24/7 airport meet & greet" },
  { icon: BadgeCheck, label: "100% automatic fleet" },
  { icon: CreditCard, label: "Cash · Bank · Easypaisa · JazzCash" },
  { icon: Clock, label: "Free delivery in Chenab Nagar" },
  { icon: Headphones, label: "24/7 WhatsApp support" },
];

/** Infinite marquee of trust signals — pure CSS animation, very light. */
export function TrustBar() {
  const items = [...SIGNALS, ...SIGNALS];

  return (
    <section
      aria-label="Why guests trust QHQ Motors"
      className="relative overflow-hidden border-y border-white/8 bg-ink-900/60 py-4"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink-950 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink-950 to-transparent" />

      <div className="flex w-max animate-marquee items-center gap-10 will-change-transform">
        {items.map((item, i) => (
          <span
            key={`${item.label}-${i}`}
            className="flex shrink-0 items-center gap-2.5 text-[13px] font-semibold whitespace-nowrap text-slate-300"
          >
            <item.icon size={15} className="text-gold-400" />
            {item.label}
            <span className="ml-6 size-1 rounded-full bg-gold-500/60" />
          </span>
        ))}
      </div>

      {/* served-airport strip (SEO signal for airport searches) */}
      <div className="container-x mt-4 hidden flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11.5px] text-slate-500 md:flex">
        <span className="font-bold tracking-[0.16em] text-slate-400 uppercase">
          Airports we serve:
        </span>
        {SITE.pickupPoints
          .filter((p) => p.id === "lhe" || p.id === "lyp" || p.id === "isb" || p.id === "skt")
          .map((p) => (
            <span key={p.id} className="flex items-center gap-1.5">
              <Plane size={12} className="text-gold-500" />
              {p.short}
            </span>
          ))}
      </div>
    </section>
  );
}
