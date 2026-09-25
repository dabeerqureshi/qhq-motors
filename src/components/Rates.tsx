"use client";

import { motion } from "framer-motion";
import {
  BadgeCheck,
  Calendar,
  Check,
  MapPin,
  MessageCircle,
  Plane,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import {
  Reveal,
  RevealGroup,
  RevealItem,
  SectionHeading,
} from "@/components/Reveal";
import { CITY_RATES } from "@/data/plans";
import { useFleet } from "@/lib/fleet";
import { logger } from "@/lib/logger";
import { formatForeign, formatPKR } from "@/lib/utils";
import { buildBookingMessage, openWhatsApp } from "@/lib/whatsapp";

/** Transparent destination & monthly rates — simple and honest. */
export function Rates() {
  const cars = useFleet();
  const [selectedCity, setSelectedCity] = useState<string>("fsd");

  const alto = cars.find((c) => c.id.includes("alto")) ?? cars[1] ?? cars[0];
  const altis = cars.find((c) => c.id.includes("altis")) ?? cars[0];

  return (
    <section
      id="rates"
      className="relative overflow-hidden border-b border-white/5 bg-ink-900/40 py-20 lg:py-28"
    >
      <div className="absolute top-1/3 -left-24 -z-10 size-[26rem] rounded-full bg-gold-500/12 blur-[120px]" />

      <div className="container-x">
        <SectionHeading
          eyebrow="Rental rates & packages"
          title="Simple, transparent rates —"
          highlight="no hidden charges"
          description="Straightforward destination rates and monthly packages in Pakistani Rupees for 100% automatic self-drive cars. Free delivery inside Chenab Nagar (Rabwah) and direct car delivery to Lahore, Faisalabad, and Islamabad airports."
        />

        {/* top summary tiles */}
        <RevealGroup className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Alto trip / day from",
              value: alto?.rates.daily ?? 4500,
              sub: "Faisalabad & Sargodha",
            },
            {
              label: "Altis trip / day from",
              value: altis?.rates.daily ?? 5000,
              sub: "Faisalabad & Sargodha",
            },
            {
              label: "Alto monthly",
              value: alto?.rates.monthly ?? 105000,
              sub: "+ oil change",
            },
            {
              label: "Altis monthly",
              value: altis?.rates.monthly ?? 120000,
              sub: "+ oil change",
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
              <p className="mt-0.5 text-[11px] text-slate-400">
                {s.sub} · ≈ {formatForeign(s.value, "USD")}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* City Destination Rates Cards */}
        <div className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-display text-xl font-extrabold text-white">
              <MapPin size={18} className="text-gold-400" /> City Destination / One Trip Rates
            </h3>
            <span className="text-[12px] font-semibold text-slate-400">
              Self-Drive · Automatic
            </span>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {CITY_RATES.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className="card-glow flex flex-col justify-between rounded-3xl border border-white/10 bg-ink-950/70 p-6 transition hover:border-gold-400/40"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-gold-400/15 px-3 py-1 font-display text-[11px] font-extrabold text-gold-300">
                      {item.code}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {item.distance}
                    </span>
                  </div>

                  <h4 className="mt-3 font-display text-lg font-extrabold text-white">
                    {item.city}
                  </h4>
                  <p className="mt-1 text-[12px] leading-relaxed text-slate-400">
                    {item.note}
                  </p>

                  <div className="mt-5 space-y-2 rounded-2xl border border-white/8 bg-white/5 p-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-medium text-slate-300">
                        Suzuki Alto
                      </span>
                      <span className="font-display text-sm font-extrabold text-white">
                        {formatPKR(item.altoRate)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-t border-white/8 pt-2">
                      <span className="text-[12px] font-medium text-slate-300">
                        Corolla Altis
                      </span>
                      <span className="font-display text-sm font-extrabold text-gold-300">
                        {formatPKR(item.altisRate)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    logger.info("rates.city.book", `Booking trip to ${item.city}`);
                    openWhatsApp(
                      buildBookingMessage({
                        destinationCity: item.city,
                        notes: `I would like to book a self-drive trip to ${item.city}. Please confirm car availability.`,
                      }),
                      undefined,
                      `rates-${item.id}`,
                    );
                  }}
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 py-2.5 text-[12.5px] font-bold text-slate-200 transition hover:border-gold-400/50 hover:bg-gold-400/10 hover:text-gold-200"
                >
                  <MessageCircle size={14} /> Book {item.city}
                </button>
              </motion.div>
            ))}
          </div>

          {/* Other Cities banner */}
          <div className="mt-4 flex flex-col items-center justify-between gap-3 rounded-2xl border border-white/10 bg-ink-900/60 p-4 text-center sm:flex-row sm:text-left">
            <p className="text-[13px] text-slate-300">
              <strong className="font-bold text-white">Travelling to another city?</strong>{" "}
              Jhang, Chiniot, Bhalwal, Sahiwal, Sialkot, or any other destination across Punjab — available on request.
            </p>
            <button
              type="button"
              onClick={() =>
                openWhatsApp(
                  "Assalam-o-Alaikum QHQ Motors, I need a self-drive automatic car for another city: (write city name here). Please share your rate.",
                  undefined,
                  "rates-custom-city",
                )
              }
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-gold-400/15 px-5 py-2 text-[12.5px] font-extrabold text-gold-200 transition hover:bg-gold-400/25"
            >
              <MessageCircle size={14} /> Contact for custom rate
            </button>
          </div>
        </div>

        {/* Monthly Rental Packages */}
        <Reveal delay={0.1} className="mt-10">
          <div className="rounded-3xl border border-gold-500/30 bg-gradient-to-br from-gold-500/10 via-ink-950 to-ink-950 p-6 lg:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-400/20 px-3.5 py-1 text-[11px] font-extrabold tracking-wider text-gold-300 uppercase">
                  <Calendar size={12} /> Monthly Rental Packages
                </span>
                <h3 className="mt-3 font-display text-2xl font-extrabold text-white sm:text-3xl">
                  Long-term stays, zero hassle
                </h3>
                <p className="mt-2 max-w-xl text-[13.5px] leading-relaxed text-slate-300">
                  Ideal for overseas visitors spending extended time in Rabwah, medical stays, or temporary family needs. Fixed monthly rate covering 30 days of seamless automatic self-driving.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/12 bg-ink-900/80 p-5">
                  <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                    Suzuki Alto (VXL Auto)
                  </p>
                  <p className="mt-1 font-display text-2xl font-extrabold text-white">
                    {formatPKR(105000)}
                    <span className="text-[12px] font-normal text-slate-400"> / month</span>
                  </p>
                  <p className="mt-1 text-[11.5px] text-amber-300">
                    + routine oil change
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      openWhatsApp(
                        buildBookingMessage({
                          car: alto,
                          plan: "Monthly Rental (30 days)",
                          notes: "Monthly Alto booking — Rs 105,000/month (+ oil change).",
                        }),
                        { car: alto },
                        "rates-monthly-alto",
                      )
                    }
                    className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-gradient-to-br from-[#2ee06f] to-[#128c7e] py-2.5 text-[12.5px] font-extrabold text-white transition hover:brightness-110"
                  >
                    <MessageCircle size={14} /> Book Monthly Alto
                  </button>
                </div>

                <div className="rounded-2xl border border-gold-400/30 bg-ink-900/80 p-5 shadow-[0_12px_30px_-15px_rgba(229,174,60,0.4)]">
                  <p className="text-[11px] font-bold tracking-wider text-gold-300 uppercase">
                    Corolla Altis (1.6 Auto)
                  </p>
                  <p className="mt-1 font-display text-2xl font-extrabold text-white">
                    {formatPKR(120000)}
                    <span className="text-[12px] font-normal text-slate-400"> / month</span>
                  </p>
                  <p className="mt-1 text-[11.5px] text-amber-300">
                    + routine oil change
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      openWhatsApp(
                        buildBookingMessage({
                          car: altis,
                          plan: "Monthly Rental (30 days)",
                          notes: "Monthly Altis booking — Rs 120,000/month (+ oil change).",
                        }),
                        { car: altis },
                        "rates-monthly-altis",
                      )
                    }
                    className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-gradient-to-br from-gold-300 via-gold-400 to-gold-600 py-2.5 text-[12.5px] font-extrabold text-ink-950 transition hover:brightness-110"
                  >
                    <MessageCircle size={14} /> Book Monthly Altis
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Included vs Paid Separately */}
        <RevealGroup className="mt-8 grid gap-6 md:grid-cols-2">
          <RevealItem className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-6">
            <h3 className="font-display text-lg font-extrabold text-white">
              Included in every booking
            </h3>
            <ul className="mt-4 space-y-2 text-[13px] text-slate-300">
              {[
                "100% Self-drive rental — complete freedom & privacy",
                "Fully automatic, clean & air-conditioned vehicle",
                "Free car delivery & collection in Chenab Nagar and Rabwah",
                "Car delivery to Lahore, Faisalabad and Islamabad airports",
                "Serviced, insured and mechanically verified car",
                "24/7 direct WhatsApp support from our family team",
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
                "Fuel / petrol consumed during your rental",
                "Motorway and inter-city toll plaza taxes",
                "Routine oil change on monthly rentals (as agreed)",
                "Traffic violations or challans (if any)",
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
