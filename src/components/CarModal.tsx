"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  Fuel,
  Gauge,
  MessageCircle,
  Phone,
  Settings2,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import { Badge, Stars } from "@/components/ui";
import type { Car } from "@/data/cars";
import { SITE } from "@/data/site";
import { logger } from "@/lib/logger";
import { formatForeign, formatPKR } from "@/lib/utils";
import { buildBookingMessage, openWhatsApp } from "@/lib/whatsapp";

/** Full-screen vehicle detail modal with the complete spec sheet. */
export function CarModal({
  car,
  onClose,
}: {
  car: Car | null;
  onClose: () => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = car ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [car]);

  return (
    <AnimatePresence>
      {car && (
        <div className="fixed inset-0 z-[90] flex items-end justify-center p-0 sm:items-center sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink-950/85 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="relative z-10 max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl border border-white/12 bg-ink-900 shadow-2xl sm:rounded-3xl"
          >
            <div className="sticky top-0 z-20 flex items-start justify-between gap-4 border-b border-white/10 bg-ink-900/95 px-6 py-4 backdrop-blur">
              <div>
                <p className="text-[11px] font-bold tracking-[0.2em] text-gold-300 uppercase">
                  {car.category} · {car.transmission}
                </p>
                <h3 className="mt-1 font-display text-2xl font-extrabold text-white">
                  {car.name} {car.variant}
                </h3>
                <div className="mt-1.5 flex items-center gap-3">
                  <Stars rating={car.rating} size={13} />
                  <span className="text-[11.5px] text-slate-400">
                    {car.rating} from {car.reviews} guests
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close details"
                className="grid size-10 shrink-0 place-items-center rounded-xl border border-white/12 text-slate-300 transition hover:bg-white/10"
              >
                <X size={17} />
              </button>
            </div>

            <div className="px-6 pt-5 pb-8">
              <div className="relative mb-6 rounded-2xl border border-white/8 bg-gradient-to-b from-ink-800/60 to-ink-950/40 p-4">
                <Image
                  src={car.image}
                  alt={`${car.name} ${car.variant} rental car in Chenab Nagar`}
                  width={900}
                  height={420}
                  className="w-full rounded-2xl"
                />
                <div className="road-stripes mx-auto mt-2 h-1 w-2/3 rounded-full opacity-60" />
              </div>

              <p className="text-[14px] leading-relaxed text-slate-300">
                {car.description}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {[
                  { icon: Settings2, k: "Transmission", v: car.transmission },
                  { icon: Fuel, k: "Fuel", v: `${car.fuel} · ${car.mileage}` },
                  { icon: Users, k: "Capacity", v: `${car.seats} adults` },
                  { icon: Gauge, k: "Engine", v: car.engine },
                  { icon: Sparkles, k: "Model year", v: String(car.year) },
                  { icon: Check, k: "Colour", v: car.colorName },
                ].map((s) => (
                  <div
                    key={s.k}
                    className="rounded-xl border border-white/8 bg-white/5 px-3.5 py-3"
                  >
                    <s.icon size={15} className="text-gold-400" />
                    <p className="mt-1.5 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                      {s.k}
                    </p>
                    <p className="text-[13px] font-bold text-slate-100">
                      {s.v}
                    </p>
                  </div>
                ))}
              </div>

              <p className="mt-4 flex items-center gap-2 rounded-xl border border-white/8 bg-white/5 px-4 py-3 text-[12.5px] text-slate-300">
                <Check size={14} className="text-gold-400" />
                <span className="font-semibold text-slate-400">Luggage:</span>{" "}
                {car.luggage}
              </p>


              <h4 className="mt-7 font-display text-lg font-extrabold text-white">
                Rental rates
              </h4>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {(
                  [
                    { k: "daily" as const, label: "Daily" },
                    { k: "weekly" as const, label: "Weekly (7 days)" },
                    { k: "monthly" as const, label: "Monthly (30 days)" },
                  ]
                ).map((plan) => (
                  <div
                    key={plan.k}
                    className="flex flex-col rounded-2xl border border-gold-500/25 bg-gold-500/10 p-4"
                  >
                    <p className="text-[10.5px] font-bold tracking-[0.16em] text-gold-300 uppercase">
                      {plan.label}
                    </p>
                    <p className="mt-1 font-display text-xl font-extrabold text-white">
                      {formatPKR(car.rates[plan.k])}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      ≈ {formatForeign(car.rates[plan.k], "USD")}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        logger.success(
                          "booking.modal",
                          `Modal booking started (${plan.k}) for ${car.name}`,
                          { car: car.id, plan: plan.k },
                        );
                        openWhatsApp(
                          buildBookingMessage({ car, plan: plan.k }),
                          { car, plan: plan.k },
                          `modal-${car.id}`,
                        );
                      }}
                      className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-br from-[#2ee06f] to-[#128c7e] px-4 py-2.5 text-[12.5px] font-extrabold text-white transition hover:brightness-110"
                    >
                      <MessageCircle size={13} /> Book{" "}
                      {plan.label.split(" ")[0]}
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <h5 className="text-[12px] font-bold tracking-[0.16em] text-gold-300 uppercase">
                    Included
                  </h5>
                  <ul className="mt-2 space-y-1.5">
                    {car.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2 text-[12.5px] text-slate-300"
                      >
                        <Check
                          size={13}
                          className="mt-0.5 shrink-0 text-emerald-400"
                        />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="text-[12px] font-bold tracking-[0.16em] text-gold-300 uppercase">
                    Good to know
                  </h5>
                  <ul className="mt-2 space-y-1.5 text-[12.5px] text-slate-300">
                    {[
                      `${car.rates.freeKmPerDay} free kilometres every day`,
                      `${formatPKR(car.rates.extraKmRate)} per additional kilometre`,
                      `Refundable security deposit ${formatPKR(car.rates.securityDeposit)}`,
                      "Fuel, tolls & driver meals are the guest's responsibility",
                      "Free delivery & collection in Chenab Nagar / Rabwah",
                    ].map((line) => (
                      <li key={line} className="flex items-start gap-2">
                        <Check
                          size={13}
                          className="mt-0.5 shrink-0 text-emerald-400"
                        />
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <p className="mt-6 text-[11px] leading-relaxed text-slate-600">
                {car.keywords.join(" · ")}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() =>
                    openWhatsApp(
                      buildBookingMessage({ car, plan: "daily" }),
                      { car, plan: "daily" },
                      `modal-cta-${car.id}`,
                    )
                  }
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-br from-gold-300 via-gold-400 to-gold-600 px-6 py-3.5 text-[14px] font-extrabold text-ink-950 transition hover:brightness-110"
                >
                  <MessageCircle size={16} /> Reserve on WhatsApp
                </button>
                <a
                  href={`tel:${SITE.phone.tel}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3.5 text-[14px] font-bold text-white transition hover:border-gold-400/50"
                >
                  <Phone size={15} /> Call now
                </a>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                <Badge tone="slate">{car.category}</Badge>
                {car.bestFor.map((b) => (
                  <Badge key={b} tone="gold">
                    {b}
                  </Badge>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
