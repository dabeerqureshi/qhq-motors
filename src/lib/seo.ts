import { SITE } from "@/data/site";
import type { Car } from "@/data/cars";
import { FAQS } from "@/data/faqs";
import { formatPKR } from "@/lib/utils";

/**
 * Structured data (JSON-LD) builders.
 * These power Google rich results for a local car-rental business:
 * star ratings, price ranges, FAQ accordions, breadcrumbs and map packs.
 */

const ORG_ID = `${SITE.url}/#organization`;
const WEBSITE_ID = `${SITE.url}/#website`;

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["AutoRental", "LocalBusiness"],
    "@id": ORG_ID,
    name: SITE.name,
    legalName: SITE.legalName,
    description: SITE.shortDescription,
    url: SITE.url,
    telephone: SITE.phone.tel,
    email: SITE.email,
    image: `${SITE.url}/og-image.svg`,
    logo: `${SITE.url}/logo.svg`,
    priceRange: "Rs 5,000 – Rs 120,000",
    currenciesAccepted: "PKR",
    paymentAccepted: "Cash, Bank Transfer, Easypaisa, JazzCash",
    slogan: "Automatic cars, honest rates, airport pickup 24/7.",
    founder: {
      "@type": "Person",
      name: SITE.founders.founder.name,
      jobTitle: SITE.founders.founder.role,
    },
    employee: {
      "@type": "Person",
      name: SITE.founders.ceo.name,
      jobTitle: SITE.founders.ceo.role,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.locality,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.countryCode,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE.address.latitude,
      longitude: SITE.address.longitude,
    },
    areaServed: SITE.serviceAreas.map((area) => ({
      "@type": "City",
      name: area,
    })),
    serviceArea: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: SITE.address.latitude,
        longitude: SITE.address.longitude,
      },
      geoRadius: SITE.serviceRadiusKm * 1000,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: SITE.hours.days,
        opens: SITE.hours.opens,
        closes: SITE.hours.closes,
      },
    ],
    sameAs: [SITE.social.facebook, SITE.social.instagram],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: 224,
      bestRating: "5",
      worstRating: "1",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "QHQ Motors Rental Plans",
      itemListElement: [
        {
          "@type": "Offer",
          name: "Daily Car Rental",
          description:
            "24-hour automatic car rental with 100–120 free kilometres per day.",
          priceCurrency: SITE.currency.code,
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: 5000,
            priceCurrency: SITE.currency.code,
            unitCode: "DAY",
          },
        },
        {
          "@type": "Offer",
          name: "Weekly Car Rental",
          description: "7-day discounted automatic car rental package.",
          priceCurrency: SITE.currency.code,
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: 30000,
            priceCurrency: SITE.currency.code,
            unitCode: "WEE",
          },
        },
        {
          "@type": "Offer",
          name: "Monthly Car Rental",
          description:
            "30-day automatic car rental for long stays, work and family visits.",
          priceCurrency: SITE.currency.code,
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: 100000,
            priceCurrency: SITE.currency.code,
            unitCode: "MON",
          },
        },
        {
          "@type": "Offer",
          name: "Airport Pickup & Drop",
          description:
            "Meet and greet airport transfers from Lahore, Faisalabad, Islamabad and Sialkot airports to Chenab Nagar and Rabwah.",
          priceCurrency: SITE.currency.code,
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: 9000,
            priceCurrency: SITE.currency.code,
          },
        },
      ],
    },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE.url,
    name: SITE.name,
    inLanguage: "en",
    publisher: { "@id": ORG_ID },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE.url}/?q={search_term_string}#fleet`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function carSchema(car: Car) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${car.name} ${car.variant}`,
    image: `${SITE.url}${car.image}`,
    description: car.description,
    sku: car.id,
    brand: { "@type": "Brand", name: car.brand },
    category: `${car.category} Car Rental`,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: car.rating.toString(),
      reviewCount: Math.max(car.reviews, 1),
      bestRating: "5",
      worstRating: "1",
    },
    additionalProperty: [
      { "@type": "PropertyValue", name: "Transmission", value: car.transmission },
      { "@type": "PropertyValue", name: "Fuel", value: car.fuel },
      { "@type": "PropertyValue", name: "Seats", value: car.seats },
      { "@type": "PropertyValue", name: "Engine", value: car.engine },
      { "@type": "PropertyValue", name: "Mileage", value: car.mileage },
      { "@type": "PropertyValue", name: "Model year", value: car.year },
    ],
    offers: {
      "@type": "Offer",
      url: `${SITE.url}/#${car.id}`,
      priceCurrency: SITE.currency.code,
      price: car.rates.daily,
      availability: car.available
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/UsedCondition",
      seller: { "@id": ORG_ID },
      priceSpecification: [
        {
          "@type": "UnitPriceSpecification",
          name: "Daily rate",
          price: car.rates.daily,
          priceCurrency: SITE.currency.code,
          unitCode: "DAY",
        },
        {
          "@type": "UnitPriceSpecification",
          name: "Weekly rate",
          price: car.rates.weekly,
          priceCurrency: SITE.currency.code,
          unitCode: "WEE",
        },
        {
          "@type": "UnitPriceSpecification",
          name: "Monthly rate",
          price: car.rates.monthly,
          priceCurrency: SITE.currency.code,
          unitCode: "MON",
        },
      ],
    },
  };
}

export function offersSchema(cars: Car[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "QHQ Motors Automatic Car Fleet",
    itemListElement: cars.map((car, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `${car.name} ${car.variant} — from ${formatPKR(car.rates.daily)}/day`,
      url: `${SITE.url}/#${car.id}`,
    })),
  };
}

export function faqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function breadcrumbSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
      {
        "@type": "ListItem",
        position: 2,
        name: "Our Fleet",
        item: `${SITE.url}/#fleet`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Rental Rates",
        item: `${SITE.url}/#rates`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Airport Pickup",
        item: `${SITE.url}/#airport`,
      },
      {
        "@type": "ListItem",
        position: 5,
        name: "Contact",
        item: `${SITE.url}/#contact`,
      },
    ],
  };
}

/** Every schema in one array, ready for a <script type="application/ld+json">. */
export function allSchemas(cars: Car[]) {
  return [
    localBusinessSchema(),
    websiteSchema(),
    offersSchema(cars),
    breadcrumbSchema(),
    faqSchema(),
    ...cars.map(carSchema),
  ];
}
