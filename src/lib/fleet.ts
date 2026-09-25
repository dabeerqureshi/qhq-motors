"use client";

import { useSyncExternalStore } from "react";
import { CARS, type Car } from "@/data/cars";
import { logger } from "@/lib/logger";

/**
 * Client-side fleet store.
 *
 * The site is 100% static — the source of truth is `src/data/cars.ts`.
 * The /admin panel lets the owner add / edit / delete cars in the browser and
 * keeps the working copy in `localStorage`, so they can preview changes live
 * and then copy the generated TypeScript block back into `src/data/cars.ts`
 * (or export a JSON backup). No database, no server, no cost.
 */

const STORAGE_KEY = "qhq:fleet";

let cache: Car[] | null = null;
const listeners = new Set<() => void>();

function read(): Car[] {
  if (typeof window === "undefined") return CARS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return CARS;
    const parsed = JSON.parse(raw) as Car[];
    if (!Array.isArray(parsed) || parsed.length === 0) return CARS;
    return parsed;
  } catch {
    return CARS;
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      cache = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): Car[] {
  if (cache === null) cache = read();
  return cache;
}

function getServerSnapshot(): Car[] {
  return CARS;
}

function emit() {
  cache = null;
  listeners.forEach((l) => l());
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("qhq:fleet-changed"));
  }
}

/** React hook returning the current fleet (static + admin overrides). */
export function useFleet(): Car[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Persist the full fleet array as the new working copy. */
export function saveFleet(cars: Car[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cars, null, 2));
    emit();
  } catch {
    logger.error("fleet.save", "Could not persist fleet to localStorage");
  }
}

/** True when the browser copy differs from the shipped static fleet. */
export function hasLocalOverrides(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(window.localStorage.getItem(STORAGE_KEY));
}

/** Drop local overrides and fall back to `src/data/cars.ts`. */
export function resetFleet() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
  logger.warn("fleet.reset", "Local fleet overrides cleared");
  emit();
}

export function upsertCar(car: Car) {
  const fleet = getSnapshot();
  const index = fleet.findIndex((c) => c.id === car.id);
  const next =
    index === -1
      ? [...fleet, car]
      : fleet.map((c) => (c.id === car.id ? car : c));
  saveFleet(next);
  logger.success(
    index === -1 ? "admin.car.create" : "admin.car.update",
    `${index === -1 ? "Added" : "Updated"} ${car.name} ${car.variant}`,
    { id: car.id },
  );
}

export function deleteCar(id: string) {
  const fleet = getSnapshot();
  const car = fleet.find((c) => c.id === id);
  saveFleet(fleet.filter((c) => c.id !== id));
  logger.warn("admin.car.delete", `Deleted ${car?.name ?? id}`, { id });
}

export function toggleAvailability(id: string) {
  const fleet = getSnapshot();
  const car = fleet.find((c) => c.id === id);
  if (!car) return;
  upsertCar({ ...car, available: !car.available });
}

/** Renders the fleet as a ready-to-paste TypeScript array. */
export function fleetToTypeScript(cars: Car[]): string {
  const body = cars
    .map((car) => {
      const lines: string[] = [];
      lines.push("  {");
      lines.push(`    id: ${JSON.stringify(car.id)},`);
      lines.push(`    name: ${JSON.stringify(car.name)},`);
      lines.push(`    variant: ${JSON.stringify(car.variant)},`);
      lines.push(`    brand: ${JSON.stringify(car.brand)},`);
      lines.push(`    model: ${JSON.stringify(car.model)},`);
      lines.push(`    year: ${car.year},`);
      lines.push(`    category: ${JSON.stringify(car.category)},`);
      lines.push(`    transmission: "Automatic",`);
      lines.push(`    fuel: ${JSON.stringify(car.fuel)},`);
      lines.push(`    seats: ${car.seats},`);
      lines.push(`    doors: ${car.doors},`);
      lines.push(`    engine: ${JSON.stringify(car.engine)},`);
      lines.push(`    mileage: ${JSON.stringify(car.mileage)},`);
      lines.push(`    luggage: ${JSON.stringify(car.luggage)},`);
      lines.push(`    colorName: ${JSON.stringify(car.colorName)},`);
      lines.push(`    colorHex: ${JSON.stringify(car.colorHex)},`);
      lines.push(`    image: ${JSON.stringify(car.image)},`);
      lines.push(`    blurb: ${JSON.stringify(car.blurb)},`);
      lines.push(`    description: ${JSON.stringify(car.description)},`);
      lines.push(
        `    features: [${car.features.map((f) => JSON.stringify(f)).join(", ")}],`,
      );
      lines.push(
        `    bestFor: [${car.bestFor.map((f) => JSON.stringify(f)).join(", ")}],`,
      );
      lines.push("    rates: {");
      lines.push(`      daily: ${car.rates.daily},`);
      lines.push("      cities: {");
      lines.push(`        fsd: ${car.rates.cities?.fsd ?? car.rates.daily},`);
      lines.push(`        srg: ${car.rates.cities?.srg ?? car.rates.daily},`);
      lines.push(`        lhr: ${car.rates.cities?.lhr ?? car.rates.daily},`);
      lines.push(`        isl: ${car.rates.cities?.isl ?? car.rates.daily},`);
      lines.push("      },");
      lines.push(`      monthly: ${car.rates.monthly},`);
      lines.push(`      monthlyNote: ${JSON.stringify(car.rates.monthlyNote || "Plus oil change")},`);
      lines.push("    },");
      lines.push(`    rating: ${car.rating},`);
      lines.push(`    reviews: ${car.reviews},`);
      lines.push(`    available: ${car.available},`);
      lines.push(`    featured: ${car.featured ? "true" : "false"},`);
      lines.push(
        `    keywords: [${car.keywords.map((k) => JSON.stringify(k)).join(", ")}],`,
      );
      lines.push("  },");
      return lines.join("\n");
    })
    .join("\n");

  return `export const CARS: Car[] = [\n${body}\n];\n`;
}

/** Download the fleet as JSON. */
export function downloadFleet(cars: Car[]) {
  if (typeof window === "undefined") return;
  const blob = new Blob([JSON.stringify(cars, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `qhq-motors-fleet-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  logger.info("admin.fleet.export", "Fleet exported to JSON", {
    count: cars.length,
  });
}

/** A blank car template used by the "Add car" form. */
export function emptyCar(): Car {
  return {
    id: "",
    name: "",
    variant: "Automatic",
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    category: "Sedan",
    transmission: "Automatic",
    fuel: "Petrol",
    seats: 5,
    doors: 4,
    engine: "1.0L Petrol",
    mileage: "14–16 km/l",
    luggage: "2 large bags",
    colorName: "White",
    colorHex: "#E7E9EE",
    image: "/cars/placeholder-car.svg",
    blurb: "",
    description: "",
    features: ["100% Self-drive only", "Fully automatic transmission", "Air conditioning"],
    bestFor: ["Airport delivery", "City trips"],
    rates: {
      daily: 4500,
      cities: {
        fsd: 4500,
        srg: 4500,
        lhr: 5000,
        isl: 5500,
      },
      monthly: 105000,
      monthlyNote: "Plus oil change",
    },
    rating: 5,
    reviews: 0,
    available: true,
    featured: false,
    keywords: [],
  };
}
