/**
 * Central business / brand configuration for QHQ Motors.
 * Everything here is static and safe to edit — no database required.
 */

export const SITE = {
  name: "QHQ Motors",
  legalName: "QHQ Motors Car Rental",
  tagline: "Automatic Self-Drive Car Rental in Chenab Nagar (Rabwah), Pakistan",
  shortDescription:
    "QHQ Motors provides clean, fully automatic self-drive cars in Chenab Nagar (Rabwah) with car delivery to Lahore, Faisalabad and Islamabad airports.",

  /** Live production domain — used for canonical URLs, sitemap & Open Graph. */
  url: "https://qhqmotors.com",

  domain: "qhqmotors.com",

  /** Business WhatsApp / phone — booking line. */
  phone: {
    /** E.164 without the leading "+" so it can be used in wa.me links. */
    whatsapp: "923326212431",
    /** Pretty version shown in the UI. */
    display: "+92 332 621 2431",
    tel: "+923326212431",
  },

  email: "booking@qhqmotors.com",

  address: {
    street: "Chenab Nagar",
    locality: "Chenab Nagar (Rabwah)",
    region: "Punjab",
    country: "Pakistan",
    countryCode: "PK",
    postalCode: "35460",
    /** Chenab Nagar / Rabwah coordinates. */
    latitude: 31.7515,
    longitude: 72.9155,
  },

  /** Geo radius (km) the business is willing to serve. */
  serviceRadiusKm: 250,

  founders: {
    founder: {
      name: "Qamar Ul Haq Qureshi",
      role: "Founder",
    },
    ceo: {
      name: "Dabeer Ul Haq Qureshi",
      role: "Chief Executive Officer",
    },
  },

  /** Opening hours (24/7 airport reception, so we publish 24 hours). */
  hours: {
    opens: "00:00",
    closes: "23:59",
    days: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
  },

  /** Areas served — these double as SEO long-tail keywords. */
  serviceAreas: [
    "Chenab Nagar",
    "Rabwah",
    "Chiniot",
    "Faisalabad",
    "Sargodha",
    "Jhang",
    "Bhalwal",
    "Sahiwal",
    "Lahore",
    "Islamabad",
    "Pindi Bhattian",
    "Sangla Hill",
  ],

  /** Airports + stations we offer car delivery and handover at. */
  pickupPoints: [
    {
      id: "chenab-nagar",
      label: "Chenab Nagar / Rabwah (Free Delivery)",
      short: "Chenab Nagar",
      code: "CN",
      note: "Free doorstep car delivery anywhere inside Chenab Nagar & Rabwah.",
    },
    {
      id: "lhe",
      label: "Lahore — Allama Iqbal International Airport (LHE)",
      short: "Lahore Airport (LHE)",
      code: "LHE",
      note: "Car delivered to Lahore airport for seamless self-drive handover.",
    },
    {
      id: "lyp",
      label: "Faisalabad International Airport (LYP)",
      short: "Faisalabad Airport (LYP)",
      code: "LYP",
      note: "Our closest international airport — car delivered to terminal on arrival.",
    },
    {
      id: "isb",
      label: "Islamabad International Airport (ISB)",
      short: "Islamabad Airport (ISB)",
      code: "ISB",
      note: "Car delivered directly to Islamabad Airport for self-drive travel.",
    },
    {
      id: "fsd-city",
      label: "Faisalabad City / Daewoo Terminal",
      short: "Faisalabad City",
      code: "FSD",
      note: "City-wide & bus terminal handover available.",
    },
    {
      id: "srg-city",
      label: "Sargodha City / PAF Road",
      short: "Sargodha City",
      code: "SRG",
      note: "Direct delivery across Sargodha city.",
    },
    {
      id: "lhr-city",
      label: "Lahore City / Thokar Niaz Baig",
      short: "Lahore City",
      code: "LHR",
      note: "Doorstep delivery across Lahore city.",
    },
    {
      id: "isb-city",
      label: "Islamabad / Rawalpindi City",
      short: "Islamabad City",
      code: "RWP",
      note: "Hotel or residence car delivery.",
    },
  ],

  /** Currency used for all published rates. */
  currency: {
    code: "PKR",
    symbol: "Rs",
    /** Approximate FX for the international rate hint shown to overseas visitors. */
    usdRate: 278,
    gbpRate: 352,
    eurRate: 303,
    aedRate: 75.7,
  },

  social: {
    whatsapp: "https://wa.me/923326212431",
    facebook: "https://www.facebook.com/qhqmotors",
    instagram: "https://www.instagram.com/qhqmotors",
  },
} as const;

export type SiteConfig = typeof SITE;
