import type { Car, CityRates } from "@/data/cars";

export type CityKey = "fsd" | "srg" | "lhr" | "isl" | "other";

export interface DestinationCity {
  key: CityKey;
  name: string;
  short: string;
  tag: string;
  distance: string;
}

export const CITIES: DestinationCity[] = [
  {
    key: "fsd",
    name: "Faisalabad (FSD)",
    short: "Faisalabad",
    tag: "LYP Airport & City",
    distance: "≈ 72 km",
  },
  {
    key: "srg",
    name: "Sargodha (SRG)",
    short: "Sargodha",
    tag: "City & Suburbs",
    distance: "≈ 50 km",
  },
  {
    key: "lhr",
    name: "Lahore (LHR)",
    short: "Lahore",
    tag: "LHE Airport & Motorway M-2",
    distance: "≈ 168 km",
  },
  {
    key: "isl",
    name: "Islamabad (ISB)",
    short: "Islamabad",
    tag: "ISB Airport & Twin Cities",
    distance: "≈ 320 km",
  },
  {
    key: "other",
    name: "Other Cities",
    short: "Other Cities",
    tag: "Contact on WhatsApp for rate",
    distance: "Custom route",
  },
];

export function getCityRate(car: Car, city: CityKey): number | null {
  if (city === "other") return null;
  return car.rates.cities[city as keyof CityRates] ?? car.rates.daily;
}

/** Total price for city trip / day rental */
export function priceForTrip(car: Car, city: CityKey, days = 1): number {
  const rate = getCityRate(car, city) ?? car.rates.daily;
  return rate * Math.max(1, days);
}

/** Total price for monthly rental */
export function priceForMonthly(car: Car, months = 1): number {
  return car.rates.monthly * Math.max(1, months);
}
