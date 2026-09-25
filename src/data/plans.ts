export interface CityDestinationRate {
  id: "fsd" | "srg" | "lhr" | "isl" | "other";
  city: string;
  code: string;
  distance: string;
  altoRate: number;
  altisRate: number;
  note: string;
}

export const CITY_RATES: CityDestinationRate[] = [
  {
    id: "fsd",
    city: "Faisalabad",
    code: "FSD / LYP",
    distance: "≈ 72 km · 1h 30m",
    altoRate: 4500,
    altisRate: 5000,
    note: "City trips, Daewoo terminal and Faisalabad Airport (LYP) car delivery.",
  },
  {
    id: "srg",
    city: "Sargodha",
    code: "SRG",
    distance: "≈ 50 km · 1h 00m",
    altoRate: 4500,
    altisRate: 5000,
    note: "Quick connection to Sargodha city, PAF base, hospitals and markets.",
  },
  {
    id: "lhr",
    city: "Lahore",
    code: "LHR / LHE",
    distance: "≈ 168 km · 2h 40m",
    altoRate: 5000,
    altisRate: 5500,
    note: "Motorway M-2 route, Lahore city & Allama Iqbal Airport (LHE) car delivery.",
  },
  {
    id: "isl",
    city: "Islamabad",
    code: "ISB",
    distance: "≈ 320 km · 4h 30m",
    altoRate: 5500,
    altisRate: 6000,
    note: "Twin Cities & Islamabad International Airport (ISB) car delivery.",
  },
];

export interface AirportDelivery {
  code: string;
  name: string;
  distance: string;
  duration: string;
  altisPrice: number;
  altoPrice: number;
  note: string;
}

/** Airport car delivery pricing for self-drive handover on arrival */
export const AIRPORT_TRANSFERS: AirportDelivery[] = [
  {
    code: "LYP",
    name: "Faisalabad International Airport",
    distance: "≈ 72 km",
    duration: "1h 30m",
    altisPrice: 5000,
    altoPrice: 4500,
    note: "Our closest international airport — we deliver your self-drive car straight to arrivals.",
  },
  {
    code: "LHE",
    name: "Lahore — Allama Iqbal Int'l Airport",
    distance: "≈ 168 km",
    duration: "2h 40m",
    altisPrice: 5500,
    altoPrice: 5000,
    note: "Motorway M-2 direct route. Car delivered to the terminal ready for you to drive.",
  },
  {
    code: "ISB",
    name: "Islamabad International Airport",
    distance: "≈ 320 km",
    duration: "4h 30m",
    altisPrice: 6000,
    altoPrice: 5500,
    note: "Car delivered to Islamabad Airport for effortless self-drive travel back to Rabwah.",
  },
  {
    code: "OTHER",
    name: "Other Airports & Cities",
    distance: "Custom distance",
    duration: "Flexible",
    altisPrice: 5000,
    altoPrice: 4500,
    note: "We deliver to other cities across Punjab — contact us on WhatsApp for a custom rate.",
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

/** Guest reviews (100% self-drive focused) */
export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Bilal Ahmad",
    location: "Manchester, UK",
    flag: "🇬🇧",
    text: "Booked the Corolla Altis automatic from the UK before my flight. The car was delivered right outside Lahore airport spotless and ready to drive. Zero hassle — exactly what you want after a long flight.",
    car: "Toyota Corolla Altis",
    rating: 5,
  },
  {
    name: "Ayesha Siddiqui",
    location: "Toronto, Canada",
    flag: "🇨🇦",
    text: "We rented the Alto for a month while visiting family in Rabwah. Super economical, easy to park near the bazaar and the monthly rate (Rs 105,000 + oil change) was very reasonable. Dabeer bhai was always one WhatsApp message away.",
    car: "Suzuki Alto VXL",
    rating: 5,
  },
  {
    name: "Hafiz Usman",
    location: "Dubai, UAE",
    flag: "🇦🇪",
    text: "Car was delivered to Faisalabad airport on my landing evening, perfect self-drive automatic and handed back smoothly at the airport on my last day. Very honest and transparent pricing.",
    car: "Toyota Corolla Altis",
    rating: 5,
  },
  {
    name: "Dr. Sana Malik",
    location: "Karachi, Pakistan",
    flag: "🇵🇰",
    text: "Needed a reliable automatic for medical visits in Faisalabad. QHQ gave us the Alto with simple per-trip pricing. The AC was ice cold and driving was super comfortable.",
    car: "Suzuki Alto VXL",
    rating: 5,
  },
  {
    name: "Imran Qureshi",
    location: "Jeddah, KSA",
    flag: "🇸🇦",
    text: "Used QHQ Motors for our whole wedding stay. Both cars were automatic, spotless and in immaculate mechanical condition. Clear upfront rates with no hidden extras.",
    car: "Toyota Corolla Altis",
    rating: 5,
  },
  {
    name: "Sarah Thompson",
    location: "Birmingham, UK",
    flag: "🇬🇧",
    text: "First time hiring a car in Pakistan. QHQ Motors arranged everything on WhatsApp and delivered the car to the airport smoothly. Self-driving was easy with the automatic gearbox.",
    car: "Toyota Corolla Altis",
    rating: 5,
  },
];
