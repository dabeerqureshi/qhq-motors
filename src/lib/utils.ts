import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { SITE } from "@/data/site";

/** Tailwind-aware class name merger. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number as PKR, e.g. 6500 -> "Rs 6,500". */
export function formatPKR(amount: number): string {
  return `${SITE.currency.symbol} ${new Intl.NumberFormat("en-PK").format(amount)}`;
}

/** Convert PKR into a rough foreign-currency hint for overseas visitors. */
export function formatForeign(amount: number, currency: "USD" | "GBP" | "EUR" | "AED") {
  const rates: Record<string, number> = {
    USD: SITE.currency.usdRate,
    GBP: SITE.currency.gbpRate,
    EUR: SITE.currency.eurRate,
    AED: SITE.currency.aedRate,
  };
  const symbols: Record<string, string> = {
    USD: "$",
    GBP: "£",
    EUR: "€",
    AED: "AED ",
  };
  const value = amount / rates[currency];
  return `${symbols[currency]}${value.toFixed(currency === "AED" ? 0 : 0)}`;
}

/** Mid-point discount shown for weekly/monthly plans vs. paying daily. */
export function savingsVsDaily(
  rate: number,
  days: number,
  total: number,
): number {
  const full = rate * days;
  if (full <= 0) return 0;
  return Math.max(0, Math.round(((full - total) / full) * 100));
}

/** URL-safe slug. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** Clamp a number between min and max. */
export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/** Human friendly date, e.g. "24 Sep 2026". */
export function formatDate(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

/** Copy text to the clipboard with a graceful fallback. */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}
