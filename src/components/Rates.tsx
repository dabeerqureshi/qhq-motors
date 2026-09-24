"use client";

import { motion } from "framer-motion";
import { BadgeCheck, Check, Crown, MessageCircle, Sparkles } from "lucide-react";
import { useState } from "react";
import {
  Reveal,
  RevealGroup,
  RevealItem,
  SectionHeading,
} from "@/components/Reveal";
import { PLANS } from "@/data/plans";
import { useFleet } from "@/lib/fleet";
import { logger } from "@/lib/logger";
import { cn, formatForeign, formatPKR } from "@/lib/utils";
import { buildBookingMessage, openWhatsApp } from "@/lib/whatsapp";

type PlanKey = "daily" | "weekly" | "monthly";

/** Transparent rental packages — daily, weekly and monthly. */
export function Rates() {
  const cars = useFleet();
  const [plan, setPlan] = useState<PlanKey>("weekly");

  const active = PLANS.find((p) => p.id === plan)!;
  const byPrice = [...cars].sort((a, b) => a.rates[plan] - b.rates[plan]);
  const cheapest = byPrice[0];

  return (
    <section
      id="rates"
      className="relative border-b border-white/5 bg-ink-900/40 py-20 lg:py-28"
    >
      <div className="absolute top-1/3 -left-24 -z-10 size-[26rem] rounded-full bg-gold-500/12 blur-[120px]" />

      <div className="container-x">
        <SectionHeading
          eyebrow="Rental packages & rates"
          title="Pricing you can trust —"
          highlight="no hidden charges"
          description="Pick the package that fits your stay. All rates are in Pakistani Rupees, include free kilometres every day and free delivery inside Chenab Nagar (Rabwah). Fuel and motorway tolls are extra."
        />

        <RevealGroup className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Daily from", value: cheapest?.rates.daily ?? 3800 },
            { label: "Weekly from", value: cheapest?.rates.weekly ?? 22000 },
            { label: "Monthly from", value: cheapest?.rates.monthly ?? 78000 },
            {
              label: "Deposit from",
              value: cheapest?.rates.securityDeposit ?? 12000,
            },
          ].map((s) => (
            <RevealItem
              key={s.label}
              className="rounded-2xl border border-white/10 bg-ink-950/60 px-5 py-4"
            >
              <p className="text-[10.5px] font-bold tracking-[0.16em] text-slate-500 uppercase">
                {s.label}
              </p>
              <p className="mt-1 font-display text-xl font-extrabold text-gold-300">
                {formatPKR(s.value)}
              </p>
              <p className="text-[11px] text-slate-500">
                ≈ {formatForeign(s.value, "USD")} ·{" "}
                {formatForeign(s.value, "GBP")}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>


        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {PLANS.map((p, i) => {
            const isActive = p.id === plan;
            const planKey = p.id as PlanKey;
            const best = cars.length
              ? Math.min(...cars.map((c) => c.rates[planKey]))
              : p.from;

            return (
              <motion.button
                key={p.id}
                type="button"
                onClick={() => {
                  setPlan(planKey);
                  logger.info("rates.select", `Package selected: ${p.name}`);
                }}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className={cn(
                  "group relative overflow-hidden rounded-3xl border p-7 text-left transition-colors",
                  isActive
                    ? "border-gold-400/60 bg-gradient-to-b from-gold-500/15 to-ink-900 shadow-[0_28px_70px_-40px_rgba(229,174,60,0.85)]"
                    : "border-white/10 bg-ink-950/60 hover:border-gold-400/35",
                )}
              >
                {p.popular && (
                  <span className="absolute top-5 right-5">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-br from-gold-300 to-gold-500 px-3 py-1 text-[10px] font-extrabold tracking-wider text-ink-950 uppercase">
                      <Crown size={11} /> Most booked
                    </span>
                  </span>
                )}

                <p className="text-[11px] font-bold tracking-[0.2em] text-gold-300 uppercase">
                  {p.name}
                </p>
                <p className="mt-3 flex items-end gap-2">
                  <span className="font-display text-4xl font-extrabold text-white">
                    {formatPKR(Math.round(best))}
                  </span>
                  <span className="pb-1 text-[12px] font-semibold text-slate-400">
                    /{" "}
                    {p.id === "daily"
                      ? "day"
                      : p.id === "weekly"
                        ? "week"
                        : "month"}
                  </span>
                </p>
                <p className="mt-1 text-[12px] text-slate-400">
                  from · ≈ {formatForeign(Math.round(best), "USD")} ·{" "}
                  {formatForeign(Math.round(best), "GBP")}
                </p>

                <p className="mt-4 text-[13px] leading-relaxed text-slate-300/90">
                  {p.tagline}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[11px] font-bold text-emerald-200">
                    <Sparkles size={11} /> {p.save}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/5 px-3 py-1 text-[11px] font-semibold text-slate-300">
                    <BadgeCheck size={11} className="text-gold-400" />{" "}
                    {p.freeKm}
                  </span>
                </div>

                <ul className="mt-5 space-y-2">
                  {p.perks.map((perk) => (
                    <li
                      key={perk}
                      className="flex items-start gap-2 text-[12.5px] text-slate-300"
                    >
                      <Check
                        size={13}
                        className="mt-0.5 shrink-0 text-emerald-400"
                      />
                      {perk}
                    </li>
                  ))}
                </ul>

                <span
                  className={cn(
                    "mt-6 flex items-center justify-center gap-2 rounded-full px-5 py-3 text-[13px] font-extrabold transition",
                    isActive
                      ? "bg-gradient-to-br from-[#2ee06f] to-[#128c7e] text-white"
                      : "border border-white/15 text-slate-200 group-hover:border-gold-400/50 group-hover:text-gold-200",
                  )}
                >
                  <MessageCircle size={15} />
                  {isActive
                    ? "Book this package on WhatsApp"
                    : "Select this package"}
                </span>
              </motion.button>
            );
          })}
        </div>


        <Reveal delay={0.1} className="mt-8">
          <div className="flex flex-col gap-4 rounded-3xl border border-gold-500/25 bg-ink-950/70 p-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[11px] font-bold tracking-[0.18em] text-gold-300 uppercase">
                Selected package
              </p>
              <p className="mt-1 font-display text-xl font-extrabold text-white">
                {active.name} — {active.days}{" "}
                {active.days === 1 ? "day" : "days"}
              </p>
              <p className="mt-1 text-[12.5px] text-slate-400">
                {active.freeKm} · {active.perks.length} included benefits ·
                Extension available at the same rate
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3">
                <p className="text-[10.5px] font-bold tracking-wider text-slate-500 uppercase">
                  Cheapest car
                </p>
                <p className="font-display text-lg font-extrabold text-gold-300">
                  {cheapest
                    ? formatPKR(cheapest.rates[plan])
                    : formatPKR(active.from)}
                </p>
                <p className="text-[11px] text-slate-500">
                  {cheapest
                    ? `${cheapest.name} ${cheapest.variant}`
                    : "Fleet loading"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  logger.success(
                    "rates.book",
                    `Package booking started: ${active.name}`,
                    { plan },
                  );
                  openWhatsApp(
                    buildBookingMessage({ car: cheapest ?? null, plan }),
                    { car: cheapest ?? null, plan },
                    "rates-cta",
                  );
                }}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-gold-300 via-gold-400 to-gold-600 px-6 py-3.5 text-[13.5px] font-extrabold text-ink-950 transition hover:brightness-110"
              >
                <MessageCircle size={15} /> Confirm {active.name} on WhatsApp
              </button>
            </div>
          </div>
        </Reveal>

        <RevealGroup className="mt-8 grid gap-6 md:grid-cols-2">
          <RevealItem className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-6">
            <h3 className="font-display text-lg font-extrabold text-white">
              Included in every booking
            </h3>
            <ul className="mt-4 space-y-2 text-[13px] text-slate-300">
              {[
                "Fully automatic, air-conditioned vehicle",
                "Free delivery & collection in Chenab Nagar and Rabwah",
                "100–120 free kilometres per day",
                "Serviced, insured and clean car with paperwork",
                "24/7 WhatsApp support from our team",
                "Unlimited driver-time inside the city",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Check
                    size={14}
                    className="mt-0.5 shrink-0 text-emerald-400"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </RevealItem>

          <RevealItem className="rounded-3xl border border-amber-500/20 bg-amber-500/5 p-6">
            <h3 className="font-display text-lg font-extrabold text-white">
              Paid separately
            </h3>
            <ul className="mt-4 space-y-2 text-[13px] text-slate-300">
              {[
                "Fuel / petrol and CNG",
                "Motorway and inter-city toll taxes",
                "Driver meals and overnight stay on long trips",
                "Extra kilometres beyond the free allowance",
                "Traffic fines and challans (if any)",
                "Refundable security deposit at handover",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Check size={14} className="mt-0.5 shrink-0 text-amber-400" />
                  {item}
                </li>
              ))}
            </ul>
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  );
}
