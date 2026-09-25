import { SITE } from "@/data/site";
import type { Car } from "@/data/cars";
import { logger } from "@/lib/logger";
import { formatPKR } from "@/lib/utils";

export interface BookingDetails {
  car?: Car | null;
  /** "trip" | "monthly" | "daily" */
  plan?: string;
  destinationCity?: string;
  pickup?: string;
  dropoff?: string;
  pickupDate?: string;
  returnDate?: string;
  days?: number;
  months?: number;
  airportDelivery?: boolean;
  name?: string;
  notes?: string;
  rate?: number;
}

/** Build a tidy, human readable WhatsApp booking message. */
export function buildBookingMessage(details: BookingDetails = {}): string {
  const lines: string[] = [];
  lines.push("*NEW BOOKING REQUEST — QHQ Motors*");
  lines.push("_Self-Drive Automatic Car Rental_");
  lines.push("");

  if (details.name) lines.push(`Name: ${details.name}`);
  if (details.car) {
    lines.push(
      `Car: ${details.car.name} ${details.car.variant} (Automatic · Self-Drive)`,
    );
  }
  if (details.destinationCity) {
    lines.push(`Destination / Route: ${details.destinationCity}`);
  }
  if (details.plan) {
    lines.push(`Plan: ${details.plan}`);
  }
  if (details.pickup) lines.push(`Pickup / Delivery point: ${details.pickup}`);
  if (details.dropoff) lines.push(`Drop-off: ${details.dropoff}`);
  if (details.pickupDate) lines.push(`Pickup date: ${details.pickupDate}`);
  if (details.returnDate) lines.push(`Return date: ${details.returnDate}`);
  if (details.days && details.days > 0) lines.push(`Duration: ${details.days} day(s)`);
  if (details.months && details.months > 0) {
    lines.push(`Duration: ${details.months} month(s) (+ oil change)`);
  }
  if (details.airportDelivery) {
    lines.push("Service: Airport Car Delivery requested");
  }

  if (details.rate) {
    lines.push(`Quoted Rate: ${formatPKR(details.rate)}`);
  } else if (details.car) {
    if (details.plan?.toLowerCase().includes("month")) {
      lines.push(
        `Monthly Rate: ${formatPKR(details.car.rates.monthly)}/month (+ oil change)`,
      );
    } else {
      lines.push(`Daily starting rate: ${formatPKR(details.car.rates.daily)}/day`);
    }
  }

  if (details.notes) {
    lines.push("");
    lines.push(`Notes: ${details.notes}`);
  }

  lines.push("");
  lines.push("Please confirm availability & booking. Shukriya!");
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
