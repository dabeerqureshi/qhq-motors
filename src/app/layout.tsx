import type { Metadata, Viewport } from "next";
import { Manrope, Sora } from "next/font/google";
import "./globals.css";
import { SITE } from "@/data/site";
import { CARS } from "@/data/cars";
import { allSchemas } from "@/lib/seo";
import { ScrollProgress } from "@/components/ui";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";

/* Self-hosted, zero-CLS webfonts (loaded once for the whole app). */
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-sora",
  display: "swap",
});

const DESCRIPTION = `${SITE.shortDescription} 100% automatic cars, daily / weekly / monthly rates from Rs 5,000, free delivery in Chenab Nagar & Rabwah, and 24/7 meet-and-greet airport transfers.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default:
      "QHQ Motors | Automatic Car Rental in Chenab Nagar (Rabwah) + Airport Pickup",
    template: "%s | QHQ Motors Chenab Nagar",
  },
  description: DESCRIPTION,
  applicationName: SITE.name,
  keywords: [
    "car rental Chenab Nagar",
    "rent a car Rabwah",
    "automatic car rental Pakistan",
    "QHQ Motors",
    "car hire Chenab Nagar",
    "car rental Faisalabad airport",
    "Lahore airport pickup to Rabwah",
    "Islamabad airport to Chenab Nagar",
    "self drive car rental Rabwah",
    "rent a car Chiniot",
    "monthly car rental Pakistan",
    "overseas Pakistani car rental",
    "Toyota Corolla Altis rental Pakistan",
    "Suzuki Alto automatic rental",
    "car with driver Chenab Nagar",
    "airport transfer Rabwah",
  ],
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  category: "Car Rental",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: SITE.url,
    siteName: SITE.name,
    title:
      "QHQ Motors | Automatic Car Rental in Chenab Nagar (Rabwah) + Airport Pickup",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "QHQ Motors | Automatic Car Rental in Chenab Nagar (Rabwah)",
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg" }],
  },
  formatDetection: { telephone: true, address: true, email: true },
};

export const viewport: Viewport = {
  themeColor: "#04060d",
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const schemas = allSchemas(CARS);

  return (
    <html
      lang="en"
      className={`h-full antialiased ${manrope.variable} ${sora.variable}`}
    >
      <head>
        <link rel="dns-prefetch" href="https://wa.me" />
        <meta name="geo.region" content="PK-PB" />
        <meta name="geo.placename" content="Chenab Nagar (Rabwah), Punjab" />
        <meta
          name="geo.position"
          content={`${SITE.address.latitude};${SITE.address.longitude}`}
        />
        <meta
          name="ICBM"
          content={`${SITE.address.latitude}, ${SITE.address.longitude}`}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-ink-950">
        <ScrollProgress />
        <AnalyticsTracker />
        {children}
      </body>
    </html>
  );
}
