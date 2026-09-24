# Deploying QHQ Motors

The site is a fully static Next.js 15 app (no server, no env vars required).
Everything below assumes the code is already pushed to
`https://github.com/dabeerqureshi/qhq-motors` on `main`.

## 0. Pre-deploy checklist

- [ ] **Change the admin PIN** — open `src/components/AdminPanel.tsx` and edit
      `const ADMIN_PIN = "QHQ-2026"` (top of the file) to a private 4–8 digit PIN
      before sharing `/admin` or going live.
- [ ] Confirm the WhatsApp number in `src/data/site.ts` (`whatsapp` field)
      matches the real business number (international format, no `+`).
- [ ] `npx tsc --noEmit && npx eslint && npm run build` all pass.

## 1. Deploy to Vercel (recommended, free)

### Option A — via GitHub (zero config, auto re-deploys on push)

1. Go to <https://vercel.com/new> and sign in with GitHub.
2. **Import** the `dabeerqureshi/qhq-motors` repository.
3. Vercel auto-detects **Next.js** — do not change any framework settings.
4. Click **Deploy**. ~60 seconds later you get a live
   `<project>.vercel.app` URL.
5. Every future `git push origin main` triggers a new production deploy.

### Option B — via CLI (manual)

```bash
npm i -g vercel
vercel login          # interactive, one-time
vercel --prod
```

## 2. Add the custom domain (qhqmotors.com)

1. In the Vercel project: **Settings → Domains → Add**.
2. Add `qhqmotors.com` and `www.qhqmotors.com`.
3. Vercel shows a **domain card** with the exact DNS values to create —
   use those values as the source of truth.

## 3. Hostinger DNS setup

In Hostinger: **hPanel → Domains → qhqmotors.com → DNS / Nameservers**.

| Type  | Name | Value                | TTL  |
|-------|------|----------------------|------|
| A     | `@`  | `76.76.21.21`*       | Auto |
| CNAME | `www`| `cname.vercel-dns.com` | Auto |

\* The general-purpose Vercel A record is `76.76.21.21`; newer projects may be
assigned a pool address (e.g. `216.198.79.1`) shown on your Vercel domain card —
**the card wins** if it differs.

Rules:

- **Remove any AAAA (IPv6) records** for the apex — Vercel does not support
  IPv6 for third-party DNS providers and it stalls SSL.
- Do **not** keep Hostinger's default parking A record on `@`.
- Alternative (optional): instead of records, delegate nameservers to
  `ns1.vercel-dns.com` / `ns2.vercel-dns.com` (only needed for wildcards).

DNS propagation typically takes 5–60 minutes (up to 24h worst case).

## 4. Verify

- [ ] `https://qhqmotors.com` loads with HTTPS (SSL auto-provisions once DNS resolves).
- [ ] `https://qhqmotors.com/robots.txt` → allows `/`, disallows `/admin`.
- [ ] `https://qhqmotors.com/sitemap.xml` → 200.
- [ ] `https://qhqmotors.com/opengraph-image` → 200 (share preview image).
- [ ] In Vercel → Domains, both domains show **Valid** configuration (green).
- [ ] WhatsApp buttons open a pre-filled chat.
- [ ] `/admin` requires the PIN and is not indexed (view-source shows `noindex`).

## 5. Updating content later

- **Fleet (prices/availability/cars):** edit `src/data/cars.ts` directly, or use
  `/admin` → *Copy cars.ts block* → paste the result into `src/data/cars.ts`
  → commit & push. (`/admin` edits alone only persist in the browser's
  localStorage — the copied file makes them permanent for all visitors.)
- **Text, FAQs, rates, contact info:** edit the files under `src/data/`.
- Any push to `main` redeploys automatically.
