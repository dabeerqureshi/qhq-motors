"use client";

import { motion } from "framer-motion";
import {
  Calculator,
  CarFront,
  ChevronDown,
  Clock,
  Info,
  MapPin,
  MessageCircle,
  Plane,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Reveal, SectionHeading } from "@/components/Reveal";
import { useFleet } from "@/lib/fleet";
import { logger } from "@/lib/logger";
import { CITIES, type CityKey, getCityRate, priceForMonthly, priceForTrip } from "@/lib/pricing";
import { cn, formatForeign, formatPKR } from "@/lib/utils";
import { buildBookingMessage, openWhatsApp } from "@/lib/whatsapp";

type CalcMode = "city" | "monthly";

const fieldClass =
  "w-full appearance-none rounded-xl border border-white/12 bg-ink-950/70 px-10 py-3.5 text-sm font-semibold text-white outline-none transition focus:border-gold-400/70";

export function CostCalculator() {
  const cars = useFleet();
  const [carId, setCarId] = useState(cars[0]?.id ?? "");
  const [mode, setMode] = useState<CalcMode>("city");
  const [city, setCity] = useState<CityKey>("fsd");
  const [days, setDays] = useState(1);
  const [months, setMonths] = useState(1);
  const [airportDelivery, setAirportDelivery] = useState(false);

  const car = cars.find((c) => c.id === carId) ?? cars[0] ?? null;

  const quote = useMemo(() => {
    if (!car) return null;

    if (mode === "monthly") {
      const total = priceForMonthly(car, months);
      return {
        mode: "monthly" as const,
        total,
        perMonth: car.rates.monthly,
        months,
        oilChange: "Client covers routine oil change",
        summaryText: `${car.name} (${months} month${months > 1 ? "s" : ""})`,
      };
    }

    const cityRate = getCityRate(car, city);
    const total = priceForTrip(car, city, days);
    const cityName = CITIES.find((c) => c.key === city)?.name ?? "City Trip";

    return {
      mode: "city" as const,
      total,
      cityRate: cityRate ?? car.rates.daily,
      isCustomCity: city === "other",
      days,
      city,
      cityName,
      summaryText: `${car.name} — ${cityName} (${days} day${days > 1 ? "s" : ""})`,
    };
  }, [car, mode, city, days, months]);

  function send() {
    if (!car || !quote) return;
    logger.success("calculator.send", "Calculator quote sent to WhatsApp", {
      car: car.id,
      mode,
      city,
      days,
      months,
      total: quote.total,
    });

    const destinationName =
      mode === "monthly"
        ? `Monthly Rental (${months} month${months > 1 ? "s" : ""})`
        : quote.mode === "city"
          ? quote.cityName
          : "City Trip";

    openWhatsApp(
      buildBookingMessage({
        car,
        plan:
          mode === "monthly"
            ? `Monthly Rental (${months} Month${months > 1 ? "s" : ""})`
            : `City Trip — ${destinationName}`,
        destinationCity: destinationName,
        days: mode === "city" ? days : undefined,
        months: mode === "monthly" ? months : undefined,
        airportDelivery,
        rate: quote.total,
        notes: [
          `Self-Drive 100% Automatic`,
          airportDelivery ? "Airport car delivery requested" : "Local / Doorstep delivery",
          mode === "monthly" ? "Plus routine oil change" : "Simple transparent rate",
          "Please confirm car availability for my dates.",
        ].join("\n"),
      }),
      { car },
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
          title="Instant rate estimate —"
          highlight="simple & transparent"
          description="Select your car, choose your destination city or monthly plan, and get an instant quote. 100% self-drive automatic cars with no complicated kilometre calculations or hidden fees."
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
                      {c.name} {c.variant} (Automatic)
                    </option>
                  ))}
                </select>
              </label>

              <div>
                <p className="mb-2 flex items-center gap-2 text-[11px] font-bold tracking-[0.16em] text-slate-400 uppercase">
                  <Clock size={12} /> Rental Type
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMode("city")}
                    className={cn(
                      "rounded-xl border px-4 py-3 text-center transition",
                      mode === "city"
                        ? "border-gold-400/60 bg-gold-400/15 text-gold-100"
                        : "border-white/12 text-slate-300 hover:border-white/25",
                    )}
                  >
                    <span className="block text-[13.5px] font-extrabold">
                      City Trip / Daily
                    </span>
                    <span className="block text-[11px] text-slate-400">
                      Destination-based rates
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMode("monthly")}
                    className={cn(
                      "rounded-xl border px-4 py-3 text-center transition",
                      mode === "monthly"
                        ? "border-gold-400/60 bg-gold-400/15 text-gold-100"
                        : "border-white/12 text-slate-300 hover:border-white/25",
                    )}
                  >
                    <span className="block text-[13.5px] font-extrabold">
                      Monthly Rental
                    </span>
                    <span className="block text-[11px] text-slate-400">
                      Long stays (+ oil change)
                    </span>
                  </button>
                </div>
              </div>

              {mode === "city" ? (
                <>
                  <div>
                    <p className="mb-2 flex items-center gap-2 text-[11px] font-bold tracking-[0.16em] text-slate-400 uppercase">
                      <MapPin size={12} /> Destination City
                    </p>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {CITIES.map((c) => {
                        const isSelected = city === c.key;
                        const rate = car ? getCityRate(car, c.key) : null;
                        return (
                          <button
                            key={c.key}
                            type="button"
                            onClick={() => setCity(c.key)}
                            className={cn(
                              "rounded-xl border p-3 text-left transition",
                              isSelected
                                ? "border-gold-400/70 bg-gold-500/15 text-white"
                                : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20",
                            )}
                          >
                            <p className="text-[12.5px] font-bold">{c.short}</p>
                            <p className="mt-0.5 text-[11px] font-extrabold text-gold-300">
                              {rate ? formatPKR(rate) : "WhatsApp"}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <p className="flex items-center gap-2 text-[11px] font-bold tracking-[0.16em] text-slate-400 uppercase">
                        <Sparkles size={12} /> Number of days
                      </p>
                      <span className="font-display text-lg font-extrabold text-gold-300">
                        {days} {days === 1 ? "day" : "days"}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={30}
                      value={days}
                      onChange={(e) => setDays(Number(e.target.value))}
                      className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-ink-700 accent-gold-400"
                      aria-label="Number of days"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <p className="flex items-center gap-2 text-[11px] font-bold tracking-[0.16em] text-slate-400 uppercase">
                      <Sparkles size={12} /> Number of months
                    </p>
                    <span className="font-display text-lg font-extrabold text-gold-300">
                      {months} {months === 1 ? "month" : "months"}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={12}
                    value={months}
                    onChange={(e) => setMonths(Number(e.target.value))}
                    className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-ink-700 accent-gold-400"
                    aria-label="Number of months"
                  />
                  <p className="mt-2 text-[11.5px] text-amber-300/90">
                    * Monthly rental policy: routine oil change is to be maintained by client.
                  </p>
                </div>
              )}

              {/* Airport Delivery Option */}
              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-white/12 bg-ink-900/60 p-3.5 transition hover:border-white/25">
                <div className="flex items-center gap-3">
                  <span className="grid size-8 place-items-center rounded-lg bg-gold-400/10 text-gold-400">
                    <Plane size={15} />
                  </span>
                  <div>
                    <p className="text-[13px] font-bold text-white">
                      Airport Car Delivery
                    </p>
                    <p className="text-[11px] text-slate-400">
                      We deliver the car to Lahore, Faisalabad or Islamabad airport
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={airportDelivery}
                  onChange={(e) => setAirportDelivery(e.target.checked)}
                  className="size-4.5 accent-gold-400"
                />
              </label>

              {/* Self-drive only indicator */}
              <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2.5 text-[12px] font-bold text-emerald-300">
                <ShieldCheck size={16} className="shrink-0 text-emerald-400" />
                <span>100% Self-Drive Rental (No driver hassle)</span>
              </div>
            </div>

            {/* output */}
            <motion.div
              layout
              className="flex flex-col rounded-3xl border border-gold-500/25 bg-gradient-to-b from-gold-500/12 to-ink-950/40 p-6"
            >
              <p className="flex items-center gap-2 text-[11px] font-bold tracking-[0.18em] text-gold-300 uppercase">
                <Calculator size={13} /> Estimated Total
              </p>
              <p className="mt-3 font-display text-4xl font-extrabold text-white">
                {quote ? formatPKR(quote.total) : "—"}
              </p>
              <p className="mt-1 text-[12px] text-slate-400">
                ≈ {quote ? formatForeign(quote.total, "USD") : "—"} ·{" "}
                {quote ? formatForeign(quote.total, "GBP") : "—"} ·{" "}
                {quote ? formatForeign(quote.total, "AED") : "—"}
              </p>

              {mode === "monthly" && (
                <p className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-gold-400/15 px-3 py-1.5 text-[11.5px] font-bold text-gold-200">
                  <Sparkles size={12} />
                  {car?.rates.monthlyNote || "Plus oil change"}
                </p>
              )}

              <dl className="mt-5 space-y-2.5 text-[12.5px]">
                {quote && (
                  <>
                    <div className="flex items-center justify-between gap-3 border-b border-white/8 pb-2">
                      <dt className="text-slate-400">Vehicle</dt>
                      <dd className="font-bold text-slate-100">
                        {car?.name} ({car?.variant})
                      </dd>
                    </div>

                    <div className="flex items-center justify-between gap-3 border-b border-white/8 pb-2">
                      <dt className="text-slate-400">Drive Type</dt>
                      <dd className="font-bold text-emerald-400">
                        Self Drive (Automatic)
                      </dd>
                    </div>

                    {quote.mode === "city" ? (
                      <>
                        <div className="flex items-center justify-between gap-3 border-b border-white/8 pb-2">
                          <dt className="text-slate-400">Destination</dt>
                          <dd className="font-bold text-slate-100">
                            {quote.cityName}
                          </dd>
                        </div>
                        <div className="flex items-center justify-between gap-3 border-b border-white/8 pb-2">
                          <dt className="text-slate-400">Duration</dt>
                          <dd className="font-bold text-slate-100">
                            {quote.days} {quote.days === 1 ? "day" : "days"}
                          </dd>
                        </div>
                        <div className="flex items-center justify-between gap-3 border-b border-white/8 pb-2">
                          <dt className="text-slate-400">Rate per day / trip</dt>
                          <dd className="font-bold text-gold-300">
                            {formatPKR(quote.cityRate)}
                          </dd>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center justify-between gap-3 border-b border-white/8 pb-2">
                          <dt className="text-slate-400">Plan</dt>
                          <dd className="font-bold text-slate-100">
                            Monthly Rental ({quote.months} mo)
                          </dd>
                        </div>
                        <div className="flex items-center justify-between gap-3 border-b border-white/8 pb-2">
                          <dt className="text-slate-400">Monthly Rate</dt>
                          <dd className="font-bold text-gold-300">
                            {formatPKR(quote.perMonth)} / month
                          </dd>
                        </div>
                        <div className="flex items-center justify-between gap-3 border-b border-white/8 pb-2">
                          <dt className="text-slate-400">Maintenance</dt>
                          <dd className="font-bold text-amber-300">
                            Plus oil change
                          </dd>
                        </div>
                      </>
                    )}

                    {airportDelivery && (
                      <div className="flex items-center justify-between gap-3 border-b border-white/8 pb-2">
                        <dt className="text-slate-400">Airport Handover</dt>
                        <dd className="font-bold text-sky-400">
                          Car delivered to Airport
                        </dd>
                      </div>
                    )}
                  </>
                )}
              </dl>

              <p className="mt-5 flex items-start gap-2 text-[11px] leading-relaxed text-slate-400">
                <Info size={13} className="mt-0.5 shrink-0 text-gold-500" />
                Simple pricing. Fuel and motorway tolls are paid by the guest. Free delivery in Chenab Nagar & Rabwah. Send to WhatsApp to confirm your booking dates.
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
