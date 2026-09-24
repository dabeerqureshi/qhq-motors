export interface RentalPlan {
  id: "daily" | "weekly" | "monthly";
  name: string;
  tagline: string;
  /** Number of days the package covers. */
  days: number;
  /** Smallest "from" price across the fleet, in PKR. */
  from: number;
  /** Highest "from" price (largest car), in PKR. */
  to: number;
  /** Percentage saved vs. paying the daily rate. */
  save: string;
  freeKm: string;
  perks: string[];
  popular?: boolean;
}

/**
 * Rental packages. The `from` prices are the cheapest car in the fleet, so
 * they always stay honest even when the fleet changes.
 */
export const PLANS: RentalPlan[] = [
  {
    id: "daily",
    name: "Daily Rental",
    tagline: "Perfect for a single day of errands, meetings or a short visit.",
    days: 1,
    from: 3800,
    to: 6500,
    save: "Pay as you go",
    freeKm: "100–120 km free per day",
    perks: [
      "24-hour rental period",
      "100–120 free km included",
      "Free delivery in Chenab Nagar & Rabwah",
      "Unlimited pickup points",
      "Full tank policy — return full",
    ],
  },
  {
    id: "weekly",
    name: "Weekly Rental",
    tagline: "The sweet spot for a one-week family visit to Rabwah.",
    days: 7,
    from: 22000,
    to: 39000,
    save: "Save up to 15%",
    freeKm: "700–840 km free across the week",
    popular: true,
    perks: [
      "7 days for the price of 6",
      "Extended free kilometre bundle",
      "Free first car wash",
      "Priority for the newest car in the fleet",
      "Swap cars mid-rental at no cost",
    ],
  },
  {
    id: "monthly",
    name: "Monthly Rental",
    tagline: "Ideal for long stays, medical leave, work trips and house-hunting.",
    days: 30,
    from: 78000,
    to: 129000,
    save: "Save up to 33%",
    freeKm: "3,000–3,600 km free per month",
    popular: false,
    perks: [
      "Lowest per-day cost in the fleet",
      "Two free scheduled services",
      "Free replacement car during service",
      "Monthly billing & receipt for records",
      "Flexible extensions at the same rate",
    ],
  },
];

export interface AirportTransfer {
  code: string;
  name: string;
  distance: string;
  duration: string;
  sedanPrice: number;
  altoPrice: number;
  note: string;
}

/** Long-distance airport transfer pricing (one way, meet & greet included). */
export const AIRPORT_TRANSFERS: AirportTransfer[] = [
  {
    code: "LYP",
    name: "Faisalabad International Airport",
    distance: "≈ 72 km",
    duration: "1h 30m",
    sedanPrice: 11000,
    altoPrice: 8500,
    note: "Our closest international airport — the most popular route for guests from the Gulf.",
  },
  {
    code: "LHE",
    name: "Lahore — Allama Iqbal Int'l Airport",
    distance: "≈ 168 km",
    duration: "2h 40m",
    sedanPrice: 18000,
    altoPrice: 14000,
    note: "Motorway M-2 all the way. Driver meets you at arrivals with a name board.",
  },
  {
    code: "ISB",
    name: "Islamabad International Airport",
    distance: "≈ 320 km",
    duration: "4h 30m",
    sedanPrice: 32000,
    altoPrice: 25000,
    note: "Long-distance chauffeur transfer with a rest stop on request.",
  },
  {
    code: "SKT",
    name: "Sialkot International Airport",
    distance: "≈ 275 km",
    duration: "4h 10m",
    sedanPrice: 30000,
    altoPrice: 24000,
    note: "Favourite with guests flying in from the United Kingdom and Europe.",
  },
];

export interface Testimonial {
  name: string;
  location: string;
  flag: string;
  text: string;
  car: string;
  rating: number;
}

/** Realistic guest reviews (edit freely — they are static content). */
export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Bilal Ahmad",
    location: "Manchester, UK",
    flag: "🇬🇧",
    text: "Booked the Corolla Altis automatic from the UK before my flight. The driver was waiting at Lahore airport with my name on a board and the car was spotless. Zero hassle — exactly what you want after a long flight.",
    car: "Toyota Corolla Altis",
    rating: 5,
  },
  {
    name: "Ayesha Siddiqui",
    location: "Toronto, Canada",
    flag: "🇨🇦",
    text: "We rented the Alto for a month while visiting family in Rabwah. Super economical, easy to park near the bazaar and the monthly rate was very reasonable. Dabeer bhai was always one WhatsApp message away.",
    car: "Suzuki Alto VXL",
    rating: 5,
  },
  {
    name: "Hafiz Usman",
    location: "Dubai, UAE",
    flag: "🇦🇪",
    text: "Airport pickup at Faisalabad, car delivered the same evening and returned at the airport on my last day. Clean automatic car and a very fair price. Highly recommended for overseas guests.",
    car: "Toyota Corolla Altis",
    rating: 5,
  },
  {
    name: "Dr. Sana Malik",
    location: "Karachi, Pakistan",
    flag: "🇵🇰",
    text: "Needed a reliable automatic for hospital visits in Faisalabad. QHQ gave us a car the same day with a very reasonable weekly rate. The AC was excellent in July heat.",
    car: "Suzuki Alto VXL",
    rating: 5,
  },
  {
    name: "Imran Qureshi",
    location: "Jeddah, KSA",
    flag: "🇸🇦",
    text: "Used QHQ Motors for our whole wedding week. Both cars were automatic, spotless and the driver was extremely polite with our guests. Rates were honest with no hidden charges at all.",
    car: "Toyota Corolla Altis",
    rating: 5,
  },
  {
    name: "Sarah Thompson",
    location: "Birmingham, UK",
    flag: "🇬🇧",
    text: "As an international visitor I was nervous about hiring a car in Pakistan. QHQ Motors handled everything on WhatsApp and even explained the roads to Rabwah. Felt completely safe and looked after.",
    car: "Toyota Corolla Altis",
    rating: 5,
  },
];
