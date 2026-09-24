import type { Car } from "@/data/cars";

/**
 * Best total price for renting `car` for `days` days.
 *
 * Longer bookings automatically cost less per day: the quote uses the
 * cheapest combination of monthly (30-day), weekly (7-day) and daily
 * packages that covers the whole rental period. Prices come straight from
 * `car.rates`, so the discount is always consistent with the published
 * package rates.
 */
export function priceForDays(car: Car, days: number): number {
  const total = Math.max(1, Math.ceil(days));
  const { daily, weekly, monthly } = car.rates;

  // Plain daily rate for every day — the baseline to beat.
  let best = total * daily;

  // Try every number of full months and fill the rest with the cheapest
  // mix of weeks and single days (weekly is always cheaper than 7 dailies).
  const maxMonths = Math.floor(total / 30);
  for (let months = 0; months <= maxMonths; months += 1) {
    const rest = total - months * 30;
    const weeks = Math.floor(rest / 7);
    const cost =
      months * monthly + weeks * weekly + (rest - weeks * 7) * daily;
    if (cost < best) best = cost;
  }

  return best;
}
