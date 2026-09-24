"use client";

import { ArrowUp, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import { NAV_LINKS } from "@/components/Header";
import { SITE } from "@/data/site";
import { logger } from "@/lib/logger";
import { whatsAppUrl } from "@/lib/whatsapp";

/* Brand icons (lucide no longer ships social logos) */
function FacebookIcon({ size = 17 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.45 2.91h-2.33V22C18.34 21.24 22 17.08 22 12.06Z" />
    </svg>
  );
}

function InstagramIcon({ size = 17 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-white/10 bg-ink-950 pt-16">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/60 to-transparent" />
      <div className="absolute -bottom-32 left-1/2 -z-10 size-[34rem] -translate-x-1/2 rounded-full bg-gold-500/10 blur-[130px]" />

      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-2xl border border-gold-500/40 bg-gradient-to-br from-ink-800 to-ink-950 font-display text-lg font-extrabold text-gold-300">
                Q
              </span>
              <span>
                <span className="block font-display text-[17px] font-extrabold text-white">
                  QHQ <span className="text-gradient-gold">MOTORS</span>
                </span>
                <span className="mt-0.5 block text-[10px] font-semibold tracking-[0.2em] text-slate-500 uppercase">
                  Chenab Nagar · Rabwah
                </span>
              </span>
            </div>
            <p className="mt-5 max-w-sm text-[13px] leading-relaxed text-slate-400">
              {SITE.shortDescription} Family-run, fully insured and available 24
              hours a day for our guests travelling home from overseas.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <a
                href={whatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp QHQ Motors"
                className="grid size-10 place-items-center rounded-xl border border-white/12 text-[#25d366] transition hover:border-[#25d366]/50 hover:bg-[#25d366]/10"
              >
                <MessageCircle size={17} />
              </a>
              <a
                href={SITE.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="QHQ Motors on Facebook"
                className="grid size-10 place-items-center rounded-xl border border-white/12 text-slate-300 transition hover:border-gold-400/50 hover:text-gold-200"
              >
                <FacebookIcon />
              </a>
              <a
                href={SITE.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="QHQ Motors on Instagram"
                className="grid size-10 place-items-center rounded-xl border border-white/12 text-slate-300 transition hover:border-gold-400/50 hover:text-gold-200"
              >
                <InstagramIcon />
              </a>
            </div>
          </div>

          <nav aria-label="Footer navigation">
            <h3 className="text-[11px] font-bold tracking-[0.2em] text-gold-300 uppercase">
              Explore
            </h3>
            <ul className="mt-4 space-y-2.5">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-[13px] text-slate-400 transition hover:text-gold-200"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <Link
                  href="/admin"
                  onClick={() => logger.info("nav.admin", "Admin panel opened")}
                  className="text-[13px] text-slate-500 transition hover:text-gold-200"
                >
                  Owner dashboard
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h3 className="text-[11px] font-bold tracking-[0.2em] text-gold-300 uppercase">
              Areas served
            </h3>
            <ul className="mt-4 space-y-2.5">
              {SITE.serviceAreas.slice(0, 8).map((area) => (
                <li key={area} className="text-[13px] text-slate-400">
                  Car rental in {area}
                </li>
              ))}
            </ul>
          </div>


          <div>
            <h3 className="text-[11px] font-bold tracking-[0.2em] text-gold-300 uppercase">
              Get in touch
            </h3>
            <ul className="mt-4 space-y-3 text-[13px]">
              <li>
                <a
                  href={`tel:${SITE.phone.tel}`}
                  className="flex items-start gap-2.5 text-slate-300 transition hover:text-gold-200"
                >
                  <Phone size={14} className="mt-0.5 shrink-0 text-gold-400" />
                  {SITE.phone.display}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="flex items-start gap-2.5 text-slate-300 transition hover:text-gold-200"
                >
                  <Mail size={14} className="mt-0.5 shrink-0 text-gold-400" />
                  {SITE.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-slate-400">
                <MapPin size={14} className="mt-0.5 shrink-0 text-gold-400" />
                Chenab Nagar (Rabwah), District Chiniot, Punjab, Pakistan
              </li>
            </ul>
            <a
              href={whatsAppUrl(
                "Assalam-o-Alaikum QHQ Motors, please share your availability.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-gold-300 via-gold-400 to-gold-600 px-5 py-2.5 text-[12.5px] font-extrabold text-ink-950 transition hover:brightness-110"
            >
              <MessageCircle size={14} /> Book on WhatsApp
            </a>
          </div>
        </div>

        {/* SEO keyword paragraph */}
        <div className="mt-12 border-t border-white/8 pt-8">
          <p className="text-[11.5px] leading-relaxed text-slate-500">
            <strong className="font-bold text-slate-400">QHQ Motors</strong>{" "}
            provides automatic car rental in Chenab Nagar (Rabwah) and the
            surrounding cities of Chiniot, Faisalabad, Sargodha, Jhang, Bhalwal
            and Sahiwal. Popular services include Toyota Corolla Altis automatic
            rental, Suzuki Alto automatic rental, self-drive car hire, cars with
            driver, wedding car rental, monthly car rental for overseas
            Pakistanis, and 24/7 airport pickup and drop-off from Allama Iqbal
            International Airport Lahore (LHE), Faisalabad International Airport
            (LYP), Islamabad International Airport (ISB) and Sialkot
            International Airport (SKT).
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/8 py-7 sm:flex-row">
          <p className="text-center text-[11.5px] text-slate-500 sm:text-left">
            © {year} {SITE.name}. All rights reserved. Rates in PKR and subject
            to availability.
          </p>
          <div className="flex items-center gap-4">
            <p className="text-[11.5px] text-slate-500">
              Proudly serving Rabwah guests worldwide 🌍
            </p>
            <button
              type="button"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                logger.debug("nav.totop", "Back to top clicked");
              }}
              aria-label="Back to top"
              className="grid size-9 place-items-center rounded-xl border border-white/12 text-slate-300 transition hover:border-gold-400/50 hover:text-gold-200"
            >
              <ArrowUp size={15} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
