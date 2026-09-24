"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  Fuel,
  Gauge,
  Info,
  MessageCircle,
  Settings2,
  Users,
} from "lucide-react";
import Image from "next/image";
import type { Car } from "@/data/cars";
import { logger } from "@/lib/logger";
import { formatForeign, formatPKR } from "@/lib/utils";
import { buildBookingMessage, openWhatsApp } from "@/lib/whatsapp";
import { Badge, Stars } from "@/components/ui";

export type RateMode = "daily" | "weekly" | "monthly";

export function rateFor(car: Car, mode: RateMode) {
  return mode === "daily"
    ? car.rates.daily
    : mode === "weekly"
      ? car.rates.weekly
      : car.rates.monthly;
}

const MODE_LABEL: Record<RateMode, string> = {
  daily: "per day",
  weekly: "per week",
  monthly: "per month",
};

/** A single fleet card with specs, rates and a WhatsApp CTA. */
export function CarCard({
  car,
  mode,
  index = 0,
  onDetails,
}: {
  car: Car;
  mode: RateMode;
  index?: number;
  onDetails: (car: Car) => void;
}) {
  const price = rateFor(car, mode);

  function book() {
    logger.success("booking.card", `Book flow started for ${car.name}`, {
      car: car.id,
      mode,
    });
    openWhatsApp(
      buildBookingMessage({ car, plan: mode }),
      { car, plan: mode },
      `fleet-card-${car.id}`,
    );
  }

  return (
    <motion.article
      id={car.id}
      layout
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      whileHover={{ y: -6 }}
      className="card-glow group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-ink-850 to-ink-900 shadow-[0_24px_70px_-40px_rgba(0,0,0,1)]"
    >
      {/* artwork */}
      <div className="relative overflow-hidden border-b border-white/8 bg-gradient-to-b from-ink-800/70 to-ink-900/30 px-6 pt-8">
        <div className="absolute inset-x-10 top-6 h-32 rounded-full bg-gold-500/15 blur-3xl" />

        <div className="relative mb-5 flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={car.available ? "green" : "red"}>
              {car.available ? (
                <>
                  <CheckCircle2 size={11} /> Available
                </>
              ) : (
                <>Booked out</>
              )}
            </Badge>
            <Badge tone="gold">
              <Settings2 size={11} /> {car.transmission}
            </Badge>
          </div>
          <div className="text-right">
            <Stars rating={car.rating} size={13} />
            <p className="mt-0.5 text-[10.5px] text-slate-400">
              {car.rating} · {car.reviews} reviews
            </p>
          </div>
        </div>

        <motion.div
          whileHover={{ scale: 1.045 }}
          transition={{ type: "spring", stiffness: 220, damping: 20 }}
          className="relative mx-auto max-w-[420px]"
        >
          <Image
            src={car.image}
            alt={`${car.name} ${car.variant} automatic car rental in Chenab Nagar (Rabwah)`}
            width={900}
            height={420}
            loading={index < 2 ? "eager" : "lazy"}
            className="w-full drop-shadow-[0_26px_38px_rgba(0,0,0,0.6)]"
          />
        </motion.div>

        <div className="road-stripes mx-auto -mt-2 h-1 w-[70%] rounded-full opacity-60" />
      </div>

      {/* body */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl font-extrabold text-white">
          {car.name}
        </h3>
        <p className="text-[12.5px] font-semibold text-gold-300">
          {car.variant} · {car.year} · {car.colorName}
        </p>

        <p className="mt-3 text-[13px] leading-relaxed text-slate-300/85">
          {car.blurb}
        </p>

        {/* spec grid */}
        <dl className="mt-5 grid grid-cols-2 gap-2.5 text-[12px]">
          {[
            { icon: Users, k: "Seats", v: `${car.seats} adults` },
            { icon: Settings2, k: "Gearbox", v: car.transmission },
            { icon: Fuel, k: "Fuel", v: `${car.fuel} · ${car.mileage}` },
            { icon: Gauge, k: "Engine", v: car.engine },
          ].map((s) => (
            <div
              key={s.k}
              className="flex items-center gap-2.5 rounded-xl border border-white/8 bg-white/5 px-3 py-2.5"
            >
              <s.icon size={14} className="shrink-0 text-gold-400" />
              <div className="min-w-0">
                <dt className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                  {s.k}
                </dt>
                <dd className="truncate font-semibold text-slate-200">{s.v}</dd>
              </div>
            </div>
          ))}
        </dl>

        {/* best for */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {car.bestFor.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10.5px] font-semibold text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* price */}
        <div className="mt-auto pt-6">
          <div className="flex items-end justify-between gap-3 rounded-2xl border border-gold-500/25 bg-gold-500/10 px-4 py-3.5">
            <div>
              <p className="text-[10.5px] font-bold tracking-[0.16em] text-gold-300 uppercase">
                {mode} rate
              </p>
              <p className="font-display text-2xl font-extrabold text-white">
                {formatPKR(price)}
              </p>
              <p className="text-[11px] text-slate-400">
                {MODE_LABEL[mode]} · ≈ {formatForeign(price, "USD")}
              </p>
            </div>
            <p className="text-right text-[11px] leading-snug text-slate-400">
              {car.rates.freeKmPerDay} free km/day
              <br />
              {formatPKR(car.rates.extraKmRate)} per extra km
            </p>
          </div>

          <div className="mt-4 flex gap-2.5">
            <button
              type="button"
              onClick={book}
              disabled={!car.available}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-br from-[#2ee06f] to-[#128c7e] px-5 py-3 text-[13.5px] font-extrabold text-white shadow-[0_12px_32px_-14px_rgba(37,211,102,0.9)] transition hover:brightness-110 active:scale-95 disabled:from-slate-600 disabled:to-slate-700 disabled:opacity-60"
            >
              <MessageCircle size={15} />
              {car.available ? "Book this car" : "Unavailable"}
            </button>
            <button
              type="button"
              onClick={() => {
                logger.info("fleet.details", `Details opened for ${car.name}`, {
                  car: car.id,
                });
                onDetails(car);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-4 py-3 text-[13px] font-bold text-slate-200 transition hover:border-gold-400/50 hover:text-gold-200"
            >
              <Info size={15} /> Details
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
