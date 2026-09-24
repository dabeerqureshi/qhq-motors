"use client";

import { motion } from "framer-motion";
import {
  Calculator,
  CarFront,
  ChevronDown,
  Clock,
  Info,
  MessageCircle,
  Route,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Reveal, SectionHeading } from "@/components/Reveal";
import { useFleet } from "@/lib/fleet";
import { logger } from "@/lib/logger";
import { cn, formatForeign, formatPKR } from "@/lib/utils";
import { buildBookingMessage, openWhatsApp } from "@/lib/whatsapp";
import { priceForDays } from "@/lib/pricing";

type PlanKey = "daily" | "weekly" | "monthly";

const fieldClass =
  "w-full appearance-none rounded-xl border border-white/12 bg-ink-950/70 px-10 py-3.5 text-sm font-semibold text-white outline-none transition focus:border-gold-400/70";

export function CostCalculator() {
  const cars = useFleet();
  const [carId, setCarId] = useState(cars[0]?.id ?? "");
  const [plan, setPlan] = useState<PlanKey>("weekly");
  const [units, setUnits] = useState(1);
  const [extraKm, setExtraKm] = useState(0);
  const [withDriver, setWithDriver] = useState(false);

  const car = cars.find((c) => c.id === carId) ?? cars[0] ?? null;

  const quote = useMemo(() => {
    if (!car) return null;
    const daysPerUnit = plan === "daily" ? 1 : plan === "weekly" ? 7 : 30;
    const totalDays = daysPerUnit * units;
    /* Best price for the whole stay — the per-day rate drops automatically
       the longer you book (weekly/monthly packages kick in). */
    const base = priceForDays(car, totalDays);
    const includedKm = car.rates.freeKmPerDay * totalDays;
    const extra = extraKm > includedKm ? extraKm - includedKm : 0;
    const extraCost = extra * car.rates.extraKmRate;
    const driverFee = withDriver
      ? (plan === "daily" ? 2500 : 1800) * totalDays
      : 0;
    const total = base + extraCost + driverFee;
    const straightDaily = totalDays * car.rates.daily;

    return {
      base,
      daysPerUnit,
      totalDays,
      includedKm,
      extra,
      extraCost,
      driverFee,
      total,
      perDay: Math.round(base / totalDays),
      save: Math.max(0, straightDaily - base),
      deposit: car.rates.securityDeposit,
    };
  }, [car, plan, units, extraKm, withDriver]);

  function send() {
    if (!car || !quote) return;
    logger.success("calculator.send", "Calculator quote sent to WhatsApp", {
      car: car.id,
      plan,
      units,
      extraKm,
      total: quote.total,
    });
    openWhatsApp(
      buildBookingMessage({
        car,
        plan,
        days: quote.totalDays,
        withDriver,
        notes: [
          `Rental duration: ${quote.totalDays} days`,
          `Planned kilometres: ${extraKm} km (free allowance ${quote.includedKm} km)`,
          `Estimated total: ${formatPKR(quote.total)}`,
          "Please confirm availability and the final price.",
        ].join("\n"),
      }),
      { car, plan },
      "cost-calculator",
    );
  }

  return (
    <section
      id="calculator"
      className="relative border-b border-white/5 bg-ink-900/40 py-20 lg:py-28"
    >
      <div className="container-x">
        <SectionHeading
          eyebrow="Price calculator"
          title="Know your total"
          highlight="before you book"
          description="Slide, tap and see exactly what your rental will cost. The estimate uses our published live rates and automatically applies a lower per-day rate the longer you book — no registration, no email, no spam."
        />

        <Reveal delay={0.1} className="mt-10">
          <div className="grid gap-6 rounded-3xl border border-white/10 bg-ink-950/60 p-6 lg:grid-cols-[1.15fr_0.85fr] lg:p-8">
            {/* inputs */}
            <div className="space-y-5">
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
                  onChange={(e) => setCarId(e.target.value)}
                  aria-label="Choose a car"
                  className={fieldClass}
                >
                  {cars.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.variant}
                    </option>
                  ))}
                </select>
              </label>

              <div>
                <p className="mb-2 flex items-center gap-2 text-[11px] font-bold tracking-[0.16em] text-slate-400 uppercase">
                  <Clock size={12} /> Package
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { k: "daily" as PlanKey, label: "Daily", sub: "24 h" },
                    { k: "weekly" as PlanKey, label: "Weekly", sub: "7 days" },
                    { k: "monthly" as PlanKey, label: "Monthly", sub: "30 days" },
                  ].map((p) => (
                    <button
                      key={p.k}
                      type="button"
                      onClick={() => {
                        setPlan(p.k);
                        setUnits(1);
                      }}
                      className={cn(
                        "rounded-xl border px-3 py-2.5 text-center transition",
                        plan === p.k
                          ? "border-gold-400/60 bg-gold-400/15 text-gold-100"
                          : "border-white/12 text-slate-300 hover:border-white/25",
                      )}
                    >
                      <span className="block text-[13px] font-extrabold">
                        {p.label}
                      </span>
                      <span className="block text-[10.5px] text-slate-500">
                        {p.sub}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="flex items-center gap-2 text-[11px] font-bold tracking-[0.16em] text-slate-400 uppercase">
                    <Sparkles size={12} /> How many{" "}
                    {plan === "daily"
                      ? "days"
                      : plan === "weekly"
                        ? "weeks"
                        : "months"}
                    ?
                  </p>
                  <span className="font-display text-lg font-extrabold text-gold-300">
                    {units}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={plan === "daily" ? 30 : plan === "weekly" ? 12 : 6}
                  value={units}
                  onChange={(e) => setUnits(Number(e.target.value))}
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-ink-700 accent-gold-400"
                  aria-label="Duration"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="flex items-center gap-2 text-[11px] font-bold tracking-[0.16em] text-slate-400 uppercase">
                    <Route size={12} /> Planned kilometres
                  </p>
                  <span className="font-display text-lg font-extrabold text-gold-300">
                    {extraKm} km
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={4000}
                  step={50}
                  value={extraKm}
                  onChange={(e) => setExtraKm(Number(e.target.value))}
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-ink-700 accent-gold-400"
                  aria-label="Planned kilometres"
                />
                {quote && (
                  <p className="mt-2 text-[11.5px] text-slate-500">
                    Free allowance for this booking:{" "}
                    <strong className="text-slate-300">
                      {quote.includedKm} km
                    </strong>
                    {quote.extra > 0 && (
                      <>
                        {" · "}
                        <span className="text-amber-300">
                          {quote.extra} km chargeable
                        </span>
                      </>
                    )}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-white/12 bg-ink-900/60 p-1">
                <button
                  type="button"
                  onClick={() => setWithDriver(false)}
                  className={cn(
                    "flex-1 rounded-lg px-3 py-2.5 text-[12.5px] font-bold transition",
                    !withDriver
                      ? "bg-gold-400 text-ink-950"
                      : "text-slate-300 hover:text-white",
                  )}
                >
                  Self drive
                </button>
                <button
                  type="button"
                  onClick={() => setWithDriver(true)}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-[12.5px] font-bold transition",
                    withDriver
                      ? "bg-gold-400 text-ink-950"
                      : "text-slate-300 hover:text-white",
                  )}
                >
                  <UserRound size={13} /> With driver
                </button>
              </div>
            </div>

            {/* output */}
            <motion.div
              layout
              className="flex flex-col rounded-3xl border border-gold-500/25 bg-gradient-to-b from-gold-500/12 to-ink-950/40 p-6"
            >
              <p className="flex items-center gap-2 text-[11px] font-bold tracking-[0.18em] text-gold-300 uppercase">
                <Calculator size={13} /> Estimated total
              </p>
              <p className="mt-3 font-display text-4xl font-extrabold text-white">
                {quote ? formatPKR(quote.total) : "—"}
              </p>
              <p className="mt-1 text-[12px] text-slate-400">
                ≈ {quote ? formatForeign(quote.total, "USD") : "—"} ·{" "}
                {quote ? formatForeign(quote.total, "GBP") : "—"} ·{" "}
                {quote ? formatForeign(quote.total, "AED") : "—"}
              </p>

              {quote && quote.save > 0 && (
                <p className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-[#25d366]/12 px-3 py-1.5 text-[11.5px] font-bold text-[#4ade80]">
                  <Sparkles size={12} />
                  You save {formatPKR(quote.save)} — per-day rate drops on
                  longer bookings
                </p>
              )}

              <dl className="mt-5 space-y-2.5 text-[12.5px]">
                {quote &&
                  [
                    {
                      k: `Vehicle rent (${quote.totalDays} days)`,
                      v: formatPKR(quote.base),
                    },
                    { k: "Free kilometres", v: `${quote.includedKm} km` },
                    ...(quote.extraCost > 0
                      ? [
                          {
                            k: `Extra km (${quote.extra} km)`,
                            v: formatPKR(quote.extraCost),
                          },
                        ]
                      : []),
                    ...(quote.driverFee > 0
                      ? [
                          {
                            k: "Driver allowance",
                            v: formatPKR(quote.driverFee),
                          },
                        ]
                      : []),
                    { k: "Average per day", v: formatPKR(quote.perDay) },
                    { k: "Refundable deposit", v: formatPKR(quote.deposit) },
                  ].map((row) => (
                    <div
                      key={row.k}
                      className="flex items-center justify-between gap-3 border-b border-white/8 pb-2 last:border-0"
                    >
                      <dt className="text-slate-400">{row.k}</dt>
                      <dd className="font-bold text-slate-100">{row.v}</dd>
                    </div>
                  ))}
              </dl>

              <p className="mt-5 flex items-start gap-2 text-[11px] leading-relaxed text-slate-500">
                <Info size={13} className="mt-0.5 shrink-0 text-gold-500" />
                Estimate only. Fuel, motorway tolls and driver meals are not
                included. Send it to us on WhatsApp and we will confirm the
                exact total for your dates.
              </p>

              <button
                type="button"
                onClick={send}
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-[#2ee06f] to-[#128c7e] px-6 py-3.5 text-[13.5px] font-extrabold text-white transition hover:brightness-110 active:scale-95"
              >
                <MessageCircle size={16} /> Send this quote on WhatsApp
              </button>
            </motion.div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
