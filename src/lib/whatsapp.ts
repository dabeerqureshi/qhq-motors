import { SITE } from "@/data/site";
import type { Car } from "@/data/cars";
import { logger } from "@/lib/logger";
import { formatPKR } from "@/lib/utils";

export interface BookingDetails {
  car?: Car | null;
  /** "daily" | "weekly" | "monthly" */
  plan?: "daily" | "weekly" | "monthly";
  pickup?: string;
  dropoff?: string;
  pickupDate?: string;
  returnDate?: string;
  days?: number;
  withDriver?: boolean;
  passengers?: number;
  name?: string;
  notes?: string;
}

const PLAN_TITLES: Record<string, string> = {
  daily: "Daily Rental",
  weekly: "Weekly Rental (7 days)",
  monthly: "Monthly Rental (30 days)",
};

/** Build a tidy, human readable WhatsApp booking message. */
export function buildBookingMessage(details: BookingDetails = {}): string {
  const lines: string[] = [];
  lines.push("*NEW BOOKING REQUEST — QHQ Motors*");
  lines.push("");

  if (details.name) lines.push(`Name: ${details.name}`);
  if (details.car) {
    lines.push(
      `Car: ${details.car.name} ${details.car.variant} (${details.car.transmission})`,
    );
  }
  if (details.plan) {
    lines.push(`Plan: ${PLAN_TITLES[details.plan] ?? details.plan}`);
  }
  if (details.pickup) lines.push(`Pickup point: ${details.pickup}`);
  if (details.dropoff) lines.push(`Drop-off: ${details.dropoff}`);
  if (details.pickupDate) lines.push(`Pickup date: ${details.pickupDate}`);
  if (details.returnDate) lines.push(`Return date: ${details.returnDate}`);
  if (details.days) lines.push(`Duration: ${details.days} day(s)`);
  if (typeof details.passengers === "number") {
    lines.push(`Passengers: ${details.passengers}`);
  }
  if (typeof details.withDriver === "boolean") {
    lines.push(`Driver: ${details.withDriver ? "With driver" : "Self drive"}`);
  }
  if (details.car && details.plan) {
    const rate =
      details.plan === "daily"
        ? details.car.rates.daily
        : details.plan === "weekly"
          ? details.car.rates.weekly
          : details.car.rates.monthly;
    lines.push(`Listed rate: ${formatPKR(rate)}`);
  }
  if (details.notes) {
    lines.push("");
    lines.push(`Notes: ${details.notes}`);
  }

  lines.push("");
  lines.push("Please confirm availability & total price. Shukriya!");
  return lines.join("\n");
}

/** Open WhatsApp with a pre-filled message. Works on mobile & desktop. */
export function openWhatsApp(
  message?: string,
  details?: BookingDetails,
  source = "unknown",
): string {
  const text = message ?? buildBookingMessage(details);
  const url = `https://wa.me/${SITE.phone.whatsapp}?text=${encodeURIComponent(text)}`;

  logger.info("whatsapp.click", "WhatsApp booking link opened", {
    source,
    car: details?.car?.name,
    plan: details?.plan,
    pickup: details?.pickup,
  });

  if (typeof document !== "undefined") {
    /* Trigger a real link navigation instead of window.open — behaves
       identically on mobile (opens the WhatsApp app) and desktop (new tab),
       and is far less likely to be blocked by popup filters. */
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
  return url;
}

/** Plain WhatsApp chat link with no pre-filled message. */
export function whatsAppUrl(message?: string): string {
  return message
    ? `https://wa.me/${SITE.phone.whatsapp}?text=${encodeURIComponent(message)}`
    : `https://wa.me/${SITE.phone.whatsapp}`;
}
