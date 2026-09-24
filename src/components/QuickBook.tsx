"use client";

import { motion } from "framer-motion";
import {
  Calendar,
  CarFront,
  ChevronDown,
  MapPin,
  MessageCircle,
  Plane,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import type { Car as CarType } from "@/data/cars";
import { SITE } from "@/data/site";
import { logger } from "@/lib/logger";
import { formatPKR } from "@/lib/utils";
import { buildBookingMessage, openWhatsApp } from "@/lib/whatsapp";

export type PlanKey = "daily" | "weekly" | "monthly";

const PLAN_OPTIONS: { key: PlanKey; label: string; badge?: string }[] = [
  { key: "daily", label: "Daily (24 hours)" },
  { key: "weekly", label: "Weekly (7 days)", badge: "Save 15%" },
  { key: "monthly", label: "Monthly (30 days)", badge: "Save 33%" },
];

const fieldClass =
  "w-full appearance-none rounded-xl border border-white/12 bg-ink-900/80 px-10 py-3.5 text-sm font-semibold text-white outline-none transition focus:border-gold-400/70 focus:bg-ink-900 focus:ring-2 focus:ring-gold-400/20";

/** Compact quick-booking bar shown in the hero. Sends everything to WhatsApp. */
export function QuickBook({
  cars,
  defaultPlan = "daily",
  compact = false,
}: {
  cars: CarType[];
  defaultPlan?: PlanKey;
  compact?: boolean;
}) {
  const [carId, setCarId] = useState(cars[0]?.id ?? "");
  const [plan, setPlan] = useState<PlanKey>(defaultPlan);
  const [pickup, setPickup] = useState<string>(SITE.pickupPoints[0].label);
  const [pickupDate, setPickupDate] = useState("");
  const [advanced, setAdvanced] = useState(false);
  const [returnDate, setReturnDate] = useState("");
  const [withDriver, setWithDriver] = useState(false);
  const [name, setName] = useState("");

  const car = cars.find((c) => c.id === carId) ?? cars[0] ?? null;

  function submit() {
    if (!pickupDate) {
      logger.warn(
        "booking.validation",
        "Booking attempted without a pickup date",
      );
    }
    const message = buildBookingMessage({
      car,
      plan,
      pickup,
      pickupDate,
      returnDate: returnDate || undefined,
      withDriver,
      name: name || undefined,
    });
    openWhatsApp(message, { car, plan, pickup }, "hero-quick-book");
    logger.success("booking.submit", "Quick booking sent to WhatsApp", {
      car: car?.name,
      plan,
      pickup,
      pickupDate,
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full rounded-3xl border border-white/12 bg-ink-950/70 p-4 shadow-[0_30px_80px_-40px_rgba(0,0,0,1)] backdrop-blur-xl sm:p-5"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.18em] text-gold-300 uppercase">
          <Sparkles size={13} /> Instant booking — no forms, no waiting
        </div>
        <button
          type="button"
          onClick={() => setAdvanced((v) => !v)}
          className="text-[11px] font-bold text-slate-400 underline decoration-dotted transition hover:text-gold-300"
        >
          {advanced ? "Hide options" : "More options"}
        </button>
      </div>


      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <label className="relative block">
          <CarFront
            size={15}
            className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-gold-400"
          />
          <ChevronDown
            size={14}
            className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-slate-500"
          />
          <select
            value={carId}
            onChange={(e) => {
              setCarId(e.target.value);
              logger.info("filter.car", `Car selected: ${e.target.value}`);
            }}
            className={fieldClass}
            aria-label="Choose a car"
          >
            {cars.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} {c.variant}
              </option>
            ))}
          </select>
        </label>

        <label className="relative block">
          <Calendar
            size={15}
            className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-gold-400"
          />
          <ChevronDown
            size={14}
            className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-slate-500"
          />
          <select
            value={plan}
            onChange={(e) => {
              const value = e.target.value as PlanKey;
              setPlan(value);
              logger.info("filter.plan", `Plan selected: ${value}`);
            }}
            className={fieldClass}
            aria-label="Choose a rental plan"
          >
            {PLAN_OPTIONS.map((p) => (
              <option key={p.key} value={p.key}>
                {p.label}
                {p.badge ? ` — ${p.badge}` : ""}
              </option>
            ))}
          </select>
        </label>

        <label className="relative block">
          <Plane
            size={15}
            className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-gold-400"
          />
          <ChevronDown
            size={14}
            className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-slate-500"
          />
          <select
            value={pickup}
            onChange={(e) => {
              setPickup(e.target.value);
              logger.info("filter.pickup", `Pickup point: ${e.target.value}`);
            }}
            className={fieldClass}
            aria-label="Choose a pickup point"
          >
            {SITE.pickupPoints.map((p) => (
              <option key={p.id} value={p.label}>
                {p.short}
              </option>
            ))}
          </select>
        </label>

        <label className="relative block">
          <MapPin
            size={15}
            className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-gold-400"
          />
          <input
            type="date"
            value={pickupDate}
            min={new Date().toISOString().slice(0, 10)}
            onChange={(e) => setPickupDate(e.target.value)}
            className={fieldClass}
            aria-label="Pickup date"
          />
        </label>
      </div>


      {advanced && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-3 grid gap-3 overflow-hidden md:grid-cols-3"
        >
          <label className="relative block">
            <Calendar
              size={15}
              className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-gold-400"
            />
            <input
              type="date"
              value={returnDate}
              min={pickupDate || new Date().toISOString().slice(0, 10)}
              onChange={(e) => setReturnDate(e.target.value)}
              className={fieldClass}
              aria-label="Return date"
            />
          </label>
          <label className="relative block">
            <UserRound
              size={15}
              className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-gold-400"
            />
            <input
              type="text"
              value={name}
              placeholder="Your name (optional)"
              onChange={(e) => setName(e.target.value)}
              className={fieldClass}
              aria-label="Your name"
            />
          </label>
          <div className="flex items-center gap-1 rounded-xl border border-white/12 bg-ink-900/60 p-1">
            <button
              type="button"
              onClick={() => setWithDriver(false)}
              className={
                "flex-1 rounded-lg px-3 py-2.5 text-[12px] font-bold transition " +
                (!withDriver
                  ? "bg-gold-400 text-ink-950"
                  : "text-slate-300 hover:text-white")
              }
            >
              Self drive
            </button>
            <button
              type="button"
              onClick={() => setWithDriver(true)}
              className={
                "flex-1 rounded-lg px-3 py-2.5 text-[12px] font-bold transition " +
                (withDriver
                  ? "bg-gold-400 text-ink-950"
                  : "text-slate-300 hover:text-white")
              }
            >
              With driver
            </button>
          </div>
        </motion.div>
      )}

      <div className="mt-4 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[12px] leading-snug text-slate-400">
          {car ? (
            <>
              <span className="font-bold text-white">
                {car.name} {car.variant}
              </span>{" "}
              ·{" "}
              <span className="font-bold text-gold-300">
                {formatPKR(
                  plan === "daily"
                    ? car.rates.daily
                    : plan === "weekly"
                      ? car.rates.weekly
                      : car.rates.monthly,
                )}
              </span>{" "}
              per{" "}
              {plan === "daily" ? "day" : plan === "weekly" ? "week" : "month"}{" "}
              · {car.rates.freeKmPerDay} free km/day
            </>
          ) : (
            "Fleet details coming soon."
          )}
        </p>
        <button
          type="button"
          onClick={submit}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-gradient-to-br from-[#2ee06f] to-[#128c7e] px-6 py-3.5 text-sm font-extrabold text-white shadow-[0_14px_40px_-14px_rgba(37,211,102,0.9)] transition hover:brightness-110 active:scale-95"
        >
          <MessageCircle size={16} /> Check availability
        </button>
      </div>

      {!compact && (
        <p className="mt-3 text-center text-[11px] text-slate-500">
          Opens WhatsApp with your details pre-filled · Reply usually within 5
          minutes · {SITE.phone.display}
        </p>
      )}
    </motion.div>
  );
}
