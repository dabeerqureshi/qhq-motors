/**
 * Fleet data — 100% static, code-level configuration (no database).
 *
 * ➜ To add a car, copy an object below and edit the fields.
 * ➜ You can also generate the block visually from /admin and paste it here.
 */

export type Transmission = "Automatic";
export type CarCategory = "Sedan" | "Hatchback" | "SUV" | "Van" | "Luxury";
export type FuelType = "Petrol" | "Diesel" | "Hybrid" | "Electric" | "Petrol / CNG";

export interface RentalRates {
  /** Price for one 24-hour day (PKR). */
  daily: number;
  /** Price for 7 days (PKR). */
  weekly: number;
  /** Price for 30 days (PKR). */
  monthly: number;
  /** Free kilometres included per day. */
  freeKmPerDay: number;
  /** Charge per extra kilometre (PKR). */
  extraKmRate: number;
  /** Refundable security deposit (PKR). */
  securityDeposit: number;
}

export interface Car {
  /** URL-safe unique id — used for deep links and the admin panel. */
  id: string;
  /** Marketing name shown on the card. */
  name: string;
  /** Model / generation detail, e.g. "1.6 Automatic". */
  variant: string;
  brand: string;
  model: string;
  year: number;
  category: CarCategory;
  transmission: Transmission;
  fuel: FuelType;
  seats: number;
  doors: number;
  engine: string;
  /** Approximate fuel economy shown as an SEO & user trust signal. */
  mileage: string;
  luggage: string;
  colorName: string;
  /** Hex colour used for the card accent + generated artwork. */
  colorHex: string;
  /** Public image path (SVG/PNG in /public/cars). */
  image: string;
  /** Short punchy one-liner for the card. */
  blurb: string;
  /** Long-form, keyword rich description used for SEO. */
  description: string;
  features: string[];
  /** Ideal for — shown as chips. */
  bestFor: string[];
  rates: RentalRates;
  rating: number;
  reviews: number;
  /** Whether the car can currently be booked. */
  available: boolean;
  /** Highlight this car in the "Featured" rail. */
  featured?: boolean;
  /** Extra SEO keywords specific to this vehicle. */
  keywords: string[];
}

export const CARS: Car[] = [
  {
    id: "toyota-corolla-altis-automatic",
    name: "Toyota Corolla Altis",
    variant: "1.6 Automatic",
    brand: "Toyota",
    model: "Corolla Altis",
    year: 2021,
    category: "Sedan",
    transmission: "Automatic",
    fuel: "Petrol",
    seats: 5,
    doors: 4,
    engine: "1.6L Petrol",
    mileage: "12–14 km/l",
    luggage: "3 large bags + 2 cabin bags",
    colorName: "Pearl White",
    colorHex: "#E7E9EE",
    image: "/cars/toyota-corolla-altis.svg",
    blurb:
      "Pakistan's most trusted sedan — smooth, spacious and effortless to drive in traffic.",
    description:
      "The Toyota Corolla Altis automatic is the flagship of the QHQ Motors fleet and the number one choice for overseas families visiting Chenab Nagar (Rabwah). The 1.6 litre automatic gearbox makes Lahore, Faisalabad and Islamabad airport runs stress-free, while the wide cabin and deep boot swallow luggage for a family of five. Ice-cold air conditioning, dual airbags, ABS and a full service history keep every trip comfortable and safe.",
    features: [
      "Fully automatic transmission",
      "Ice-cold climate air conditioning",
      "Power steering & windows",
      "Dual airbags + ABS",
      "Large boot for airport luggage",
      "Bluetooth audio & USB charging",
      "Rear AC vents",
      "Full service history",
    ],
    bestFor: [
      "Airport transfers",
      "Family visits",
      "Meetings & interviews",
      "Wedding guests",
      "Long drives",
    ],
    rates: {
      daily: 6500,
      weekly: 39000,
      monthly: 129000,
      freeKmPerDay: 120,
      extraKmRate: 32,
      securityDeposit: 20000,
    },
    rating: 5,
    reviews: 128,
    available: true,
    featured: true,
    keywords: [
      "Corolla Altis automatic rental Chenab Nagar",
      "Toyota Corolla rental Rabwah",
      "automatic car hire Faisalabad airport",
      "Corolla Altis self drive Pakistan",
    ],
  },
  {
    id: "suzuki-alto-automatic",
    name: "Suzuki Alto",
    variant: "VXL Automatic",
    brand: "Suzuki",
    model: "Alto",
    year: 2022,
    category: "Hatchback",
    transmission: "Automatic",
    fuel: "Petrol",
    seats: 4,
    doors: 4,
    engine: "660cc Petrol",
    mileage: "18–22 km/l",
    luggage: "2 medium bags + 1 cabin bag",
    colorName: "Metallic Silver",
    colorHex: "#B9BEC7",
    image: "/cars/suzuki-alto.svg",
    blurb:
      "The most economical automatic in Pakistan — perfect for town errands and short visits.",
    description:
      "The Suzuki Alto VXL automatic is the lightest car on the QHQ Motors fleet and easily the most economical. Its 660cc engine and automatic gearbox return 18–22 km per litre, which makes it ideal for guests who want to move around Chenab Nagar, Rabwah, Chiniot and Faisalabad all day without watching the fuel gauge. Compact enough for the busiest bazaar lanes, yet it still fits four adults plus luggage comfortably.",
    features: [
      "Fully automatic transmission",
      "Best-in-class fuel economy",
      "Air conditioning",
      "Power steering",
      "Compact & easy to park",
      "Bluetooth audio",
      "Great for narrow bazaar lanes",
      "Low daily rent",
    ],
    bestFor: [
      "Local errands",
      "Budget travellers",
      "Single travellers",
      "Couples",
      "Short stays",
    ],
    rates: {
      daily: 3800,
      weekly: 22000,
      monthly: 78000,
      freeKmPerDay: 100,
      extraKmRate: 22,
      securityDeposit: 12000,
    },
    rating: 4.9,
    reviews: 96,
    available: true,
    featured: true,
    keywords: [
      "Suzuki Alto automatic rental Chenab Nagar",
      "budget automatic car hire Rabwah",
      "Alto VXL rental Faisalabad",
      "cheap automatic car rental Pakistan",
    ],
  },
];

/** Only bookable cars — used by the public site. */
export const AVAILABLE_CARS = CARS.filter((car) => car.available);

export const CAR_COUNT = CARS.length;

export const CAR_CATEGORIES: CarCategory[] = [
  "Sedan",
  "Hatchback",
  "SUV",
  "Van",
  "Luxury",
];
