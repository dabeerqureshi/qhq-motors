/**
 * Fleet data — 100% static, code-level configuration (no database).
 *
 * ➜ To add a car, copy an object below and edit the fields.
 * ➜ You can also generate the block visually from /admin and paste it here.
 */

export type Transmission = "Automatic";
export type CarCategory = "Sedan" | "Hatchback" | "SUV" | "Van" | "Luxury";
export type FuelType = "Petrol" | "Diesel" | "Hybrid" | "Electric" | "Petrol / CNG";

export interface CityRates {
  /** Faisalabad rate (PKR) */
  fsd: number;
  /** Sargodha rate (PKR) */
  srg: number;
  /** Lahore rate (PKR) */
  lhr: number;
  /** Islamabad rate (PKR) */
  isl: number;
}

export interface RentalRates {
  /** Baseline daily starting rate (PKR). */
  daily: number;
  /** City / destination rates (PKR). */
  cities: CityRates;
  /** Price for 30 days (PKR). */
  monthly: number;
  /** Monthly note e.g. "plus oil change" */
  monthlyNote: string;
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
    image: "/cars/toyota-corolla-altis.jpeg",
    blurb:
      "Pakistan's most trusted automatic sedan — smooth, spacious self-drive experience.",
    description:
      "The Toyota Corolla Altis automatic is the flagship of the QHQ Motors self-drive fleet and the number one choice for overseas families visiting Chenab Nagar (Rabwah). The 1.6 litre automatic gearbox makes Lahore, Faisalabad, Sargodha and Islamabad journeys stress-free, while the wide cabin and deep boot swallow luggage for a family of five. Ice-cold air conditioning, dual airbags, ABS and a full service history keep every trip comfortable and safe.",
    features: [
      "100% Self-drive only",
      "Fully automatic transmission",
      "Airport delivery available",
      "Ice-cold climate air conditioning",
      "Power steering & windows",
      "Dual airbags + ABS",
      "Large boot for luggage",
      "Bluetooth audio & USB charging",
    ],
    bestFor: [
      "Airport delivery",
      "Self-drive trips",
      "Family visits",
      "Inter-city travel",
      "Monthly rental",
    ],
    rates: {
      daily: 5000,
      cities: {
        fsd: 5000,
        srg: 5000,
        lhr: 5500,
        isl: 6000,
      },
      monthly: 120000,
      monthlyNote: "Plus oil change",
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
    image: "/cars/suzuki-alto.jpeg",
    blurb:
      "The most economical automatic self-drive in Pakistan — perfect for town errands & city trips.",
    description:
      "The Suzuki Alto VXL automatic is the lightest car on the QHQ Motors self-drive fleet and easily the most economical. Its 660cc engine and automatic gearbox return 18–22 km per litre, making it ideal for guests travelling to Faisalabad, Sargodha, Lahore, Islamabad or moving around Chenab Nagar and Rabwah. Compact enough for narrow bazaar lanes, yet fits four adults comfortably.",
    features: [
      "100% Self-drive only",
      "Fully automatic transmission",
      "Airport delivery available",
      "Best-in-class fuel economy",
      "Air conditioning",
      "Power steering",
      "Compact & easy to park",
      "Bluetooth audio",
    ],
    bestFor: [
      "City trips",
      "Local errands",
      "Budget travellers",
      "Single travellers & couples",
      "Monthly rental",
    ],
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
    rating: 4.9,
    reviews: 96,
    available: true,
    featured: true,
    keywords: [
      "Suzuki Alto automatic rental Chenab Nagar",
      "budget automatic car hire Rabwah",
      "Alto VXL self drive Faisalabad",
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
