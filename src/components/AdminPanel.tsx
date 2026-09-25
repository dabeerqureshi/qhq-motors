"use client";

import {
  ArrowLeft,
  Check,
  ClipboardCopy,
  Download,
  KeyRound,
  Pencil,
  Plus,
  RotateCcw,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { Car, CarCategory, FuelType } from "@/data/cars";
import {
  deleteCar,
  downloadFleet,
  emptyCar,
  fleetToTypeScript,
  hasLocalOverrides,
  resetFleet,
  toggleAvailability,
  upsertCar,
  useFleet,
} from "@/lib/fleet";
import { logger } from "@/lib/logger";
import { formatPKR } from "@/lib/utils";

/**
 * ⚠ OWNER ONLY: change this PIN before deploying.
 * It is a light client-side gate — this page is also marked noindex,
 * but never share the /admin URL publicly.
 */
const ADMIN_PIN = "QHQ-2026";

const CATEGORIES: CarCategory[] = ["Sedan", "Hatchback", "SUV", "Van", "Luxury"];
const FUELS: FuelType[] = ["Petrol", "Diesel", "Hybrid", "Electric", "Petrol / CNG"];

const LABEL =
  "mb-1.5 block text-[10.5px] font-bold tracking-[0.16em] text-slate-500 uppercase";
const INPUT =
  "w-full rounded-xl border border-white/12 bg-ink-950/70 px-3.5 py-2.5 text-[13.5px] text-white outline-none transition focus:border-gold-400/60";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function AdminPanel() {
  const cars = useFleet();
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [draft, setDraft] = useState<Car | null>(null);
  const [copied, setCopied] = useState<"ts" | "json" | "">("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  /* ---------------- PIN gate ---------------- */
  if (!unlocked) {
    return (
      <div className="grid flex-1 place-items-center px-5 py-16">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (pin === ADMIN_PIN) {
              setUnlocked(true);
              setError("");
              logger.success("admin.login", "Owner unlocked the dashboard");
            } else {
              setError("Wrong PIN — try again.");
              logger.warn("admin.login.failed", "Incorrect admin PIN entered");
            }
          }}
          className="w-full max-w-sm rounded-3xl border border-white/10 bg-ink-900/70 p-8 shadow-2xl"
        >
          <span className="grid size-12 place-items-center rounded-2xl border border-gold-500/30 bg-gold-500/10 text-gold-300">
            <KeyRound size={20} />
          </span>
          <h1 className="mt-5 font-display text-2xl font-extrabold text-white">
            QHQ Motors Admin
          </h1>
          <p className="mt-1.5 text-[13px] text-slate-400">
            Enter the owner PIN to manage the fleet.
          </p>
          <input
            type="password"
            inputMode="numeric"
            autoComplete="off"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="PIN"
            className="mt-6 w-full rounded-xl border border-white/12 bg-ink-950/70 px-4 py-3 text-center font-display text-lg tracking-[0.4em] text-white outline-none focus:border-gold-400/60"
          />
          {error && (
            <p className="mt-2 text-center text-[12.5px] font-semibold text-red-400">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="mt-4 w-full rounded-xl bg-gradient-to-br from-gold-300 via-gold-400 to-gold-600 py-3 text-[13.5px] font-extrabold text-ink-950 transition hover:brightness-110"
          >
            Unlock dashboard
          </button>
          <Link
            href="/"
            className="mt-4 flex items-center justify-center gap-1.5 text-[12.5px] text-slate-500 transition hover:text-gold-200"
          >
            <ArrowLeft size={13} /> Back to website
          </Link>
        </form>
      </div>
    );
  }

  /* ---------------- helpers ---------------- */
  function upd(p: Partial<Car>) {
    setDraft((d) => (d ? { ...d, ...p } : d));
  }

  function updRates(p: Partial<Car["rates"]>) {
    setDraft((d) => (d ? { ...d, rates: { ...d.rates, ...p } } : d));
  }

  function updCityRate(city: keyof Car["rates"]["cities"], val: number) {
    setDraft((d) =>
      d
        ? {
            ...d,
            rates: {
              ...d.rates,
              cities: {
                ...d.rates.cities,
                [city]: val,
              },
            },
          }
        : d,
    );
  }

  /* ---------------- dashboard ---------------- */
  async function copyTypeScript() {
    try {
      await navigator.clipboard.writeText(fleetToTypeScript(cars));
      setCopied("ts");
      logger.success("admin.copy.ts", "TypeScript fleet block copied");
      window.setTimeout(() => setCopied(""), 2200);
    } catch {
      logger.error("admin.copy.ts", "Could not access the clipboard");
    }
  }

  function saveDraft() {
    if (!draft) return;
    const car: Car = {
      ...draft,
      id: draft.id.trim() || slugify(`${draft.name} ${draft.variant}`),
      name: draft.name.trim(),
    };
    if (!car.id || !car.name) {
      logger.warn("admin.save.invalid", "Car needs at least a name");
      return;
    }
    upsertCar(car);
    setDraft(null);
  }

  return (
    <div className="container-x flex-1 py-12">
      {/* top bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold tracking-[0.24em] text-gold-300 uppercase">
            Owner dashboard
          </p>
          <h1 className="mt-1 font-display text-3xl font-extrabold text-white">
            Fleet manager
          </h1>
          <p className="mt-1 text-[13px] text-slate-400">
            {cars.length} cars · changes preview live on the homepage
            {hasLocalOverrides() ? " (local overrides active)" : ""}
          </p>
        </div>
        <Link
          href="/"
          className="flex items-center gap-1.5 rounded-full border border-white/12 px-4 py-2.5 text-[12.5px] font-bold text-slate-300 transition hover:border-gold-400/50 hover:text-gold-200"
        >
          <ArrowLeft size={14} /> View website
        </Link>
      </div>

      {/* toolbar */}
      <div className="mt-7 flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={() => setDraft(emptyCar())}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-gold-300 via-gold-400 to-gold-600 px-5 py-2.5 text-[13px] font-extrabold text-ink-950 transition hover:brightness-110"
        >
          <Plus size={15} /> Add car
        </button>
        <button
          type="button"
          onClick={copyTypeScript}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-[13px] font-bold text-slate-200 transition hover:border-gold-400/50 hover:text-gold-200"
        >
          {copied === "ts" ? <Check size={15} /> : <ClipboardCopy size={15} />}
          {copied === "ts" ? "Copied — paste into cars.ts" : "Copy cars.ts block"}
        </button>
        <button
          type="button"
          onClick={() => downloadFleet(cars)}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-[13px] font-bold text-slate-200 transition hover:border-gold-400/50 hover:text-gold-200"
        >
          <Download size={15} /> Export JSON
        </button>
        <button
          type="button"
          onClick={() => {
            if (window.confirm("Discard local changes and restore the shipped fleet?")) {
              resetFleet();
            }
          }}
          className="inline-flex items-center gap-2 rounded-full border border-red-400/30 px-5 py-2.5 text-[13px] font-bold text-red-300 transition hover:bg-red-500/10"
        >
          <RotateCcw size={15} /> Reset to cars.ts
        </button>
      </div>

      <p className="mt-4 rounded-2xl border border-white/10 bg-ink-900/60 px-4 py-3 text-[12.5px] leading-relaxed text-slate-400">
        Edits are saved in this browser only. When you are happy with the result, press{" "}
        <strong className="font-bold text-gold-200">“Copy cars.ts block”</strong>{" "}
        and paste it over the <code className="text-gold-300">CARS</code> array in{" "}
        <code className="text-gold-300">src/data/cars.ts</code>.
      </p>

      {/* car list */}
      <div className="mt-8 grid gap-3">
        {cars.map((car) => (
          <div
            key={car.id}
            className="flex flex-wrap items-center gap-4 rounded-2xl border border-white/10 bg-ink-900/50 p-4"
          >
            <span
              className="size-11 shrink-0 rounded-xl border border-white/10"
              style={{ backgroundColor: `${car.colorHex}33` }}
              aria-hidden="true"
            />
            <div className="min-w-[180px] flex-1">
              <p className="font-display text-[15px] font-extrabold text-white">
                {car.name}{" "}
                <span className="font-semibold text-gold-300">{car.variant}</span>
              </p>
              <p className="text-[12px] text-slate-400">
                {car.year} · {car.category} · FSD: {formatPKR(car.rates.cities?.fsd ?? car.rates.daily)} · Monthly: {formatPKR(car.rates.monthly)}
              </p>
            </div>

            <button
              type="button"
              onClick={() => toggleAvailability(car.id)}
              className={`rounded-full px-3.5 py-1.5 text-[11.5px] font-extrabold transition ${
                car.available
                  ? "bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25"
                  : "bg-red-500/15 text-red-300 hover:bg-red-500/25"
              }`}
            >
              {car.available ? "Available" : "Booked out"}
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDraft({ ...car })}
                aria-label={`Edit ${car.name}`}
                className="grid size-9 place-items-center rounded-xl border border-white/12 text-slate-300 transition hover:border-gold-400/50 hover:text-gold-200"
              >
                <Pencil size={14} />
              </button>
              {confirmDelete === car.id ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      deleteCar(car.id);
                      setConfirmDelete(null);
                    }}
                    className="rounded-xl bg-red-500 px-3 py-2 text-[11.5px] font-extrabold text-white"
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(null)}
                    aria-label="Cancel delete"
                    className="grid size-9 place-items-center rounded-xl border border-white/12 text-slate-400"
                  >
                    <X size={14} />
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(car.id)}
                  aria-label={`Delete ${car.name}`}
                  className="grid size-9 place-items-center rounded-xl border border-white/12 text-red-300 transition hover:border-red-400/50 hover:bg-red-500/10"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ---------- edit modal ---------- */}
      {draft && (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-ink-950/90 p-4 backdrop-blur-sm sm:p-8">
          <div className="mx-auto w-full max-w-3xl rounded-3xl border border-white/10 bg-ink-900 p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold tracking-[0.2em] text-gold-300 uppercase">
                  {cars.some((c) => c.id === draft.id) ? "Edit car" : "New car"}
                </p>
                <h2 className="mt-1 font-display text-xl font-extrabold text-white">
                  {draft.name || "Untitled vehicle"} {draft.variant}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setDraft(null)}
                aria-label="Close editor"
                className="grid size-9 place-items-center rounded-xl border border-white/12 text-slate-400 transition hover:text-white"
              >
                <X size={15} />
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className={LABEL}>Name + variant *</span>
                <div className="flex gap-2">
                  <input
                    value={draft.name}
                    onChange={(e) => upd({ name: e.target.value })}
                    placeholder="Toyota Corolla Altis"
                    className={INPUT}
                  />
                  <input
                    value={draft.variant}
                    onChange={(e) => upd({ variant: e.target.value })}
                    placeholder="1.6 Automatic"
                    className={INPUT}
                  />
                </div>
              </label>

              <label className="block sm:col-span-2">
                <span className={LABEL}>ID (URL slug, auto if empty)</span>
                <input
                  value={draft.id}
                  onChange={(e) => upd({ id: slugify(e.target.value) })}
                  placeholder="toyota-corolla-altis-automatic"
                  className={INPUT}
                />
              </label>

              <label className="block">
                <span className={LABEL}>Brand</span>
                <input
                  value={draft.brand}
                  onChange={(e) => upd({ brand: e.target.value })}
                  className={INPUT}
                />
              </label>
              <label className="block">
                <span className={LABEL}>Model</span>
                <input
                  value={draft.model}
                  onChange={(e) => upd({ model: e.target.value })}
                  className={INPUT}
                />
              </label>

              <label className="block">
                <span className={LABEL}>Year</span>
                <input
                  type="number"
                  value={draft.year}
                  onChange={(e) => upd({ year: Number(e.target.value) })}
                  className={INPUT}
                />
              </label>
              <label className="block">
                <span className={LABEL}>Category</span>
                <select
                  value={draft.category}
                  onChange={(e) => upd({ category: e.target.value as CarCategory })}
                  className={INPUT}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className={LABEL}>Fuel</span>
                <select
                  value={draft.fuel}
                  onChange={(e) => upd({ fuel: e.target.value as FuelType })}
                  className={INPUT}
                >
                  {FUELS.map((f) => (
                    <option key={f}>{f}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className={LABEL}>Engine</span>
                <input
                  value={draft.engine}
                  onChange={(e) => upd({ engine: e.target.value })}
                  className={INPUT}
                />
              </label>

              <label className="block">
                <span className={LABEL}>Seats</span>
                <input
                  type="number"
                  value={draft.seats}
                  onChange={(e) => upd({ seats: Number(e.target.value) })}
                  className={INPUT}
                />
              </label>
              <label className="block">
                <span className={LABEL}>Doors</span>
                <input
                  type="number"
                  value={draft.doors}
                  onChange={(e) => upd({ doors: Number(e.target.value) })}
                  className={INPUT}
                />
              </label>
              <label className="block">
                <span className={LABEL}>Mileage</span>
                <input
                  value={draft.mileage}
                  onChange={(e) => upd({ mileage: e.target.value })}
                  placeholder="12–14 km/l"
                  className={INPUT}
                />
              </label>
              <label className="block">
                <span className={LABEL}>Luggage</span>
                <input
                  value={draft.luggage}
                  onChange={(e) => upd({ luggage: e.target.value })}
                  placeholder="2 large bags"
                  className={INPUT}
                />
              </label>
              <label className="block">
                <span className={LABEL}>Colour name</span>
                <input
                  value={draft.colorName}
                  onChange={(e) => upd({ colorName: e.target.value })}
                  className={INPUT}
                />
              </label>
              <label className="block">
                <span className={LABEL}>Colour hex</span>
                <input
                  value={draft.colorHex}
                  onChange={(e) => upd({ colorHex: e.target.value })}
                  placeholder="#E7E9EE"
                  className={INPUT}
                />
              </label>
              <label className="block sm:col-span-2">
                <span className={LABEL}>Image path (/public/...)</span>
                <input
                  value={draft.image}
                  onChange={(e) => upd({ image: e.target.value })}
                  placeholder="/cars/toyota-corolla-altis.jpeg"
                  className={INPUT}
                />
              </label>

              <label className="block sm:col-span-2">
                <span className={LABEL}>Card one-liner (blurb)</span>
                <input
                  value={draft.blurb}
                  onChange={(e) => upd({ blurb: e.target.value })}
                  className={INPUT}
                />
              </label>
              <label className="block sm:col-span-2">
                <span className={LABEL}>Long SEO description</span>
                <textarea
                  rows={4}
                  value={draft.description}
                  onChange={(e) => upd({ description: e.target.value })}
                  className={`${INPUT} resize-y`}
                />
              </label>

              <div className="sm:col-span-2">
                <p className={LABEL}>Rates (PKR)</p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <label className="block">
                    <span className={LABEL}>Faisalabad (FSD)</span>
                    <input
                      type="number"
                      value={draft.rates.cities?.fsd ?? draft.rates.daily}
                      onChange={(e) =>
                        updCityRate("fsd", Number(e.target.value))
                      }
                      className={INPUT}
                    />
                  </label>
                  <label className="block">
                    <span className={LABEL}>Sargodha (SRG)</span>
                    <input
                      type="number"
                      value={draft.rates.cities?.srg ?? draft.rates.daily}
                      onChange={(e) =>
                        updCityRate("srg", Number(e.target.value))
                      }
                      className={INPUT}
                    />
                  </label>
                  <label className="block">
                    <span className={LABEL}>Lahore (LHR)</span>
                    <input
                      type="number"
                      value={draft.rates.cities?.lhr ?? draft.rates.daily}
                      onChange={(e) =>
                        updCityRate("lhr", Number(e.target.value))
                      }
                      className={INPUT}
                    />
                  </label>
                  <label className="block">
                    <span className={LABEL}>Islamabad (ISB)</span>
                    <input
                      type="number"
                      value={draft.rates.cities?.isl ?? draft.rates.daily}
                      onChange={(e) =>
                        updCityRate("isl", Number(e.target.value))
                      }
                      className={INPUT}
                    />
                  </label>
                  <label className="block">
                    <span className={LABEL}>Monthly Rate</span>
                    <input
                      type="number"
                      value={draft.rates.monthly}
                      onChange={(e) =>
                        updRates({ monthly: Number(e.target.value) })
                      }
                      className={INPUT}
                    />
                  </label>
                  <label className="block">
                    <span className={LABEL}>Monthly Note</span>
                    <input
                      type="text"
                      value={draft.rates.monthlyNote || "Plus oil change"}
                      onChange={(e) =>
                        updRates({ monthlyNote: e.target.value })
                      }
                      className={INPUT}
                    />
                  </label>
                </div>
              </div>

              <label className="block">
                <span className={LABEL}>Rating (0–5)</span>
                <input
                  type="number"
                  step="0.1"
                  min={0}
                  max={5}
                  value={draft.rating}
                  onChange={(e) => upd({ rating: Number(e.target.value) })}
                  className={INPUT}
                />
              </label>
              <label className="block">
                <span className={LABEL}>Reviews count</span>
                <input
                  type="number"
                  value={draft.reviews}
                  onChange={(e) => upd({ reviews: Number(e.target.value) })}
                  className={INPUT}
                />
              </label>

              <label className="flex items-center gap-2.5 sm:col-span-2">
                <input
                  type="checkbox"
                  checked={draft.available}
                  onChange={(e) => upd({ available: e.target.checked })}
                  className="size-4 accent-gold-400"
                />
                <span className="text-[13px] font-bold text-slate-200">
                  Available for booking now
                </span>
              </label>
              <label className="flex items-center gap-2.5 sm:col-span-2">
                <input
                  type="checkbox"
                  checked={Boolean(draft.featured)}
                  onChange={(e) => upd({ featured: e.target.checked })}
                  className="size-4 accent-gold-400"
                />
                <span className="text-[13px] font-bold text-slate-200">
                  Feature this car in the highlighted rail
                </span>
              </label>
            </div>

            <div className="mt-7 flex flex-wrap justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDraft(null)}
                className="rounded-full border border-white/15 px-5 py-2.5 text-[13px] font-bold text-slate-300 transition hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveDraft}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-gold-300 via-gold-400 to-gold-600 px-6 py-2.5 text-[13px] font-extrabold text-ink-950 transition hover:brightness-110"
              >
                <Check size={15} /> Save car
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
