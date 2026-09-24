"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  CarFront,
  Filter,
  MessageCircle,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useMemo, useState } from "react";
import { CarCard, type RateMode } from "@/components/CarCard";
import { CarModal } from "@/components/CarModal";
import { Reveal, SectionHeading } from "@/components/Reveal";
import type { Car } from "@/data/cars";
import { useFleet } from "@/lib/fleet";
import { logger } from "@/lib/logger";
import { cn } from "@/lib/utils";
import { buildBookingMessage, openWhatsApp } from "@/lib/whatsapp";

const MODES: { key: RateMode; label: string; hint: string }[] = [
  { key: "daily", label: "Daily", hint: "24 hours" },
  { key: "weekly", label: "Weekly", hint: "7 days · save 15%" },
  { key: "monthly", label: "Monthly", hint: "30 days · save 33%" },
];

type SortKey = "featured" | "price-asc" | "price-desc" | "seats";

export function Fleet() {
  const cars = useFleet();
  const [mode, setMode] = useState<RateMode>("daily");
  const [category, setCategory] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("featured");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [selected, setSelected] = useState<Car | null>(null);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(cars.map((c) => c.category)))],
    [cars],
  );

  const visible = useMemo(() => {
    const priceOf = (c: Car) =>
      mode === "daily"
        ? c.rates.daily
        : mode === "weekly"
          ? c.rates.weekly
          : c.rates.monthly;

    const list = cars.filter((c) => {
      const matchesCategory = category === "All" || c.category === category;
      const matchesQuery =
        query.trim().length === 0 ||
        `${c.name} ${c.variant} ${c.brand} ${c.model} ${c.category} ${c.bestFor.join(" ")}`
          .toLowerCase()
          .includes(query.trim().toLowerCase());
      const matchesAvailability = !onlyAvailable || c.available;
      return matchesCategory && matchesQuery && matchesAvailability;
    });

    return [...list].sort((a, b) => {
      if (sort === "price-asc") return priceOf(a) - priceOf(b);
      if (sort === "price-desc") return priceOf(b) - priceOf(a);
      if (sort === "seats") return b.seats - a.seats;
      return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
    });
  }, [cars, category, query, onlyAvailable, sort, mode]);


  return (
    <section
      id="fleet"
      className="relative border-b border-white/5 py-20 lg:py-28"
    >
      <div className="absolute inset-x-0 top-0 -z-10 h-72 bg-gradient-to-b from-ink-900/60 to-transparent" />

      <div className="container-x">
        <SectionHeading
          eyebrow="Our automatic fleet"
          title="Choose your car,"
          highlight="we handle the rest"
          description="Every car in the QHQ Motors fleet is fully automatic, air-conditioned and serviced on schedule — so you can concentrate on your family, your work or your holiday instead of traffic."
        />

        <Reveal delay={0.1} className="mt-10">
          <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-ink-900/70 p-4 backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
            <div className="flex rounded-2xl border border-white/10 bg-ink-950/60 p-1">
              {MODES.map((m) => (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => {
                    setMode(m.key);
                    logger.info("fleet.filter", `Rate mode → ${m.key}`);
                  }}
                  className={cn(
                    "relative flex-1 rounded-xl px-4 py-2.5 text-center transition",
                    mode === m.key
                      ? "text-ink-950"
                      : "text-slate-300 hover:text-white",
                  )}
                >
                  {mode === m.key && (
                    <motion.span
                      layoutId="fleet-mode"
                      className="absolute inset-0 rounded-xl bg-gradient-to-br from-gold-300 to-gold-500"
                      transition={{ type: "spring", stiffness: 340, damping: 30 }}
                    />
                  )}
                  <span className="relative block text-[13px] font-extrabold">
                    {m.label}
                  </span>
                  <span
                    className={cn(
                      "relative block text-[10px] font-semibold",
                      mode === m.key ? "text-ink-800" : "text-slate-500",
                    )}
                  >
                    {m.hint}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className="relative block">
                <Search
                  size={15}
                  className="absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-500"
                />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search Corolla, Alto, sedan…"
                  aria-label="Search the fleet"
                  className="w-full rounded-xl border border-white/12 bg-ink-950/60 py-3 pr-4 pl-10 text-[13px] font-semibold text-white outline-none transition placeholder:text-slate-500 focus:border-gold-400/60 sm:w-56"
                />
              </label>

              <label className="relative block">
                <SlidersHorizontal
                  size={15}
                  className="absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-500"
                />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  aria-label="Sort cars"
                  className="w-full appearance-none rounded-xl border border-white/12 bg-ink-950/60 py-3 pr-8 pl-10 text-[13px] font-semibold text-white outline-none focus:border-gold-400/60 sm:w-44"
                >
                  <option value="featured">Featured first</option>
                  <option value="price-asc">Price: low to high</option>
                  <option value="price-desc">Price: high to low</option>
                  <option value="seats">Most seats</option>
                </select>
              </label>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 text-[11px] font-bold tracking-[0.16em] text-slate-500 uppercase">
              <Filter size={12} /> Filter
            </span>
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setCategory(c);
                  logger.info("fleet.filter", `Category → ${c}`);
                }}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-[12px] font-bold transition",
                  category === c
                    ? "border-gold-400/60 bg-gold-400/15 text-gold-200"
                    : "border-white/12 text-slate-300 hover:border-white/25 hover:text-white",
                )}
              >
                {c}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setOnlyAvailable((v) => !v)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-[12px] font-bold transition",
                onlyAvailable
                  ? "border-emerald-400/60 bg-emerald-400/15 text-emerald-200"
                  : "border-white/12 text-slate-300 hover:border-white/25 hover:text-white",
              )}
            >
              Available now
            </button>
            <span className="ml-auto text-[12px] font-semibold text-slate-500">
              {visible.length} of {cars.length} cars
            </span>
          </div>
        </Reveal>


        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((car, i) => (
              <CarCard
                key={car.id}
                car={car}
                mode={mode}
                index={i}
                onDetails={setSelected}
              />
            ))}
          </AnimatePresence>
        </div>

        {visible.length === 0 && (
          <div className="mt-10 rounded-3xl border border-white/10 bg-ink-900/60 px-6 py-14 text-center">
            <CarFront size={34} className="mx-auto text-gold-500/70" />
            <p className="mt-4 font-display text-lg font-bold text-white">
              No car matches those filters
            </p>
            <p className="mt-1 text-[13px] text-slate-400">
              Tell us what you need and we will arrange it — we source automatic
              cars on request.
            </p>
            <button
              type="button"
              onClick={() =>
                openWhatsApp(
                  `Assalam-o-Alaikum QHQ Motors, I need a specific automatic car: ${query || "(describe here)"}. Is it available?`,
                  undefined,
                  "fleet-empty-state",
                )
              }
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-[#2ee06f] to-[#128c7e] px-6 py-3 text-[13px] font-extrabold text-white"
            >
              <MessageCircle size={15} /> Ask us on WhatsApp
            </button>
          </div>
        )}

        <Reveal delay={0.1} className="mt-8">
          <div className="flex flex-col items-center justify-between gap-4 rounded-3xl border border-gold-500/25 bg-gradient-to-r from-gold-500/12 via-ink-900 to-ink-900 px-6 py-5 text-center sm:flex-row sm:text-left">
            <p className="text-[13.5px] text-slate-300">
              <strong className="font-bold text-white">
                Need something else?
              </strong>{" "}
              SUVs, vans and chauffeur-driven cars can be arranged on request —
              just tell us your dates.
            </p>
            <button
              type="button"
              onClick={() => {
                logger.info("cta.click", "Fleet request CTA clicked");
                openWhatsApp(
                  buildBookingMessage({
                    notes:
                      "I would like a custom vehicle requirement (SUV / van / chauffeur).",
                  }),
                  undefined,
                  "fleet-request",
                );
              }}
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-gold-400/50 px-5 py-2.5 text-[13px] font-extrabold text-gold-200 transition hover:bg-gold-400/15"
            >
              <MessageCircle size={14} /> Request a vehicle
            </button>
          </div>
        </Reveal>
      </div>

      <CarModal car={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
