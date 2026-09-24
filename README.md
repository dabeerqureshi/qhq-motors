# QHQ Motors — One-Page Car Rental Website

SEO-optimized, animated one-page site for **QHQ Motors**, automatic car rental in
Chenab Nagar (Rabwah), Punjab — with WhatsApp booking, cost calculator, airport
pickup info, and a PIN-gated fleet admin panel.

- **Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion · lucide-react
- **Routing:** fully static — `/`, `/admin`, `sitemap.xml`, `robots.txt`, auto-generated OG image.
- **Live domain:** `https://qhqmotors.com`

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
```

## Checks

```bash
npx tsc --noEmit   # types
npx eslint         # lint
npm run build      # production build
```

## Project layout

```
src/
├── app/
│   ├── page.tsx             # section order: Header → Hero → TrustBar → Fleet →
│   │                        #   WhyUs → Rates → Airport → CostCalculator →
│   │                        #   About → FAQ → Contact → Footer → StickyBar
│   ├── layout.tsx           # metadata, JSON-LD, self-hosted fonts (next/font)
│   ├── admin/page.tsx       # /admin (noindex)
│   ├── sitemap.ts robots.ts opengraph-image.tsx
├── components/              # Hero, Fleet, CarCard, CarModal, AdminPanel, …
├── data/                    # ← edit content here (code-level CMS)
│   ├── cars.ts              # fleet: prices, specs, availability, photos
│   ├── site.ts              # brand, address, phone/WhatsApp, socials, SEO url
│   ├── plans.ts             # rental plans + rates
│   └── faqs.ts              # FAQ entries (also feed FAQPage JSON-LD)
└── lib/                     # fleet (localStorage store), seo (JSON-LD),
                             #   whatsapp (wa.me deep links), utils, logger
```

## Admin panel

Visit `/admin` and enter the PIN (default `QHQ-2026` — change `ADMIN_PIN` in
`src/components/AdminPanel.tsx` before going live).

- Add / edit / delete cars, toggle availability — stored in **localStorage**
  (instant preview on your device only).
- **Copy cars.ts block** generates the TypeScript array for `src/data/cars.ts`;
  paste it there and push to make changes permanent for all visitors.
- Export JSON / Reset to shipped fleet.

## Deploy

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** — Vercel deploy + Hostinger DNS
(`qhqmotors.com`) + verification checklist.
