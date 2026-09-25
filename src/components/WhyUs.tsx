"use client";

import {
  BadgeCheck,
  Banknote,
  Clock,
  Headphones,
  Key,
  Plane,
} from "lucide-react";
import { RevealGroup, RevealItem, SectionHeading } from "@/components/Reveal";
import { Counter } from "@/components/ui";
import { SITE } from "@/data/site";

const REASONS = [
  {
    icon: BadgeCheck,
    title: "100% automatic fleet",
    text: "No clutch, no manual gears. Every QHQ Motors car is automatic, so you can drive effortlessly and comfortably in city or highway traffic.",
  },
  {
    icon: Key,
    title: "100% self-drive privacy",
    text: "Complete freedom for you and your family. No drivers, no waiting around, and no awkwardness — the car is entirely yours for your stay.",
  },
  {
    icon: Plane,
    title: "24/7 airport car delivery",
    text: "We track your flight and deliver your self-drive car directly to Lahore, Faisalabad or Islamabad airport on arrival — day or night.",
  },
  {
    icon: Banknote,
    title: "Honest, transparent pricing",
    text: "Clear destination and monthly rates. The price we confirm on WhatsApp is the price you pay — no hidden charges or surprises.",
  },
  {
    icon: Clock,
    title: "Free doorstep delivery",
    text: "Your car comes straight to your family home, hotel or guest house anywhere in Chenab Nagar and Rabwah — collected when you are done.",
  },
  {
    icon: Headphones,
    title: "One WhatsApp away",
    text: "Our team replies in minutes, in English or Urdu, 24 hours a day. Whether you need an extension or route guidance, we are always available.",
  },
];

export function WhyUs() {
  return (
    <section
      id="why-us"
      className="relative overflow-hidden border-b border-white/5 py-20 lg:py-28"
    >
      <div className="absolute top-20 -right-24 -z-10 size-[26rem] rounded-full bg-gold-500/10 blur-[130px]" />

      <div className="container-x">
        <SectionHeading
          eyebrow="Why choose QHQ Motors"
          title="Six reasons guests keep"
          highlight="coming back to us"
          description="Renting a car in Pakistan should be simple, safe and fairly priced. That is the whole idea behind QHQ Motors."
        />

        <RevealGroup className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {REASONS.map((r) => (
            <RevealItem
              key={r.title}
              className="card-glow group relative h-full rounded-3xl border border-white/10 bg-ink-900/60 p-6 transition-colors hover:border-gold-400/35"
            >
              <span className="grid size-12 place-items-center rounded-2xl border border-gold-500/30 bg-gradient-to-br from-gold-500/20 to-ink-900 text-gold-300 transition-transform duration-500 group-hover:scale-110">
                <r.icon size={20} />
              </span>
              <h3 className="mt-5 font-display text-[17px] font-extrabold text-white">
                {r.title}
              </h3>
              <p className="mt-2.5 text-[13px] leading-relaxed text-slate-300/85">
                {r.text}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* counters */}
        <RevealGroup className="mt-12 grid gap-4 rounded-3xl border border-white/10 bg-ink-950/60 p-6 sm:grid-cols-2 lg:grid-cols-4 lg:p-8">
          {[
            { value: 480, suffix: "+", label: "Completed bookings" },
            { value: 4.9, suffix: "/5", decimals: 1, label: "Average rating" },
            { value: 24, suffix: "/7", label: "Support & airport delivery" },
            { value: 12, suffix: "+", label: "Cities served" },
          ].map((s) => (
            <RevealItem key={s.label} className="text-center">
              <p className="font-display text-3xl font-extrabold text-gradient-gold lg:text-4xl">
                <Counter
                  to={s.value}
                  suffix={s.suffix}
                  decimals={s.decimals ?? 0}
                />
              </p>
              <p className="mt-1.5 text-[11.5px] font-bold tracking-[0.14em] text-slate-400 uppercase">
                {s.label}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* areas served */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          <span className="mr-2 text-[11px] font-bold tracking-[0.18em] text-slate-500 uppercase">
            Serving
          </span>
          {SITE.serviceAreas.map((area) => (
            <span
              key={area}
              className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-[12px] font-semibold text-slate-300"
            >
              {area}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
