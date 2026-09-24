"use client";

import {
  Clock,
  Copy,
  Mail,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
} from "lucide-react";
import { useState } from "react";
import { QuickBook } from "@/components/QuickBook";
import {
  Reveal,
  RevealGroup,
  RevealItem,
  SectionHeading,
} from "@/components/Reveal";
import { SITE } from "@/data/site";
import { useFleet } from "@/lib/fleet";
import { logger } from "@/lib/logger";
import { copyToClipboard } from "@/lib/utils";
import { whatsAppUrl } from "@/lib/whatsapp";

const MAP_QUERY = encodeURIComponent("Chenab Nagar (Rabwah), Punjab, Pakistan");

export function Contact() {
  const cars = useFleet();
  const [copied, setCopied] = useState(false);

  async function copyPhone() {
    const ok = await copyToClipboard(SITE.phone.tel);
    if (ok) {
      setCopied(true);
      logger.info("contact.copy", "Phone number copied", {
        value: SITE.phone.tel,
      });
      window.setTimeout(() => setCopied(false), 1800);
    }
  }

  const cards = [
    {
      icon: MapPin,
      label: "Location",
      value: "Chenab Nagar (Rabwah), Punjab",
      note: "Free delivery inside the city & Rabwah",
    },
    {
      icon: Clock,
      label: "Hours",
      value: "Open 24 hours · 7 days",
      note: "Night arrivals welcome",
    },
    {
      icon: Mail,
      label: "Email",
      value: SITE.email,
      note: "For invoices & company bookings",
    },
  ];

  return (
    <section
      id="contact"
      className="relative border-b border-white/5 py-20 lg:py-28"
    >
      <div className="absolute inset-x-0 top-0 -z-10 h-64 bg-gradient-to-b from-ink-900/60 to-transparent" />

      <div className="container-x">
        <SectionHeading
          eyebrow="Contact & booking"
          title="Let's get you on the road"
          highlight="today"
          description="One WhatsApp message is all it takes. Tell us your dates, where you are arriving and which car you like — we will confirm the price straight away."
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-4">
            <RevealGroup className="space-y-4">
              <RevealItem>
                <a
                  href={whatsAppUrl(
                    "Assalam-o-Alaikum QHQ Motors, I would like to book a car. My dates are: ",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-glow flex items-center gap-4 rounded-2xl border border-[#25d366]/30 bg-[#25d366]/10 p-5 transition hover:bg-[#25d366]/15"
                >
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#2ee06f] to-[#128c7e] text-white">
                    <MessageCircle size={20} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10.5px] font-bold tracking-[0.18em] text-[#6ff0a0] uppercase">
                      WhatsApp — fastest
                    </p>
                    <p className="font-display text-lg font-extrabold text-white">
                      {SITE.phone.display}
                    </p>
                    <p className="text-[11.5px] text-slate-400">
                      Replies within minutes, 24/7
                    </p>
                  </div>
                </a>
              </RevealItem>

              <RevealItem>
                <button
                  type="button"
                  onClick={copyPhone}
                  className="flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-ink-950/60 p-5 text-left transition hover:border-gold-400/35"
                >
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-gold-500/25 bg-gold-500/10 text-gold-300">
                    <Phone size={19} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10.5px] font-bold tracking-[0.18em] text-slate-500 uppercase">
                      Call us
                    </p>
                    <p className="font-display text-lg font-extrabold text-white">
                      {SITE.phone.display}
                    </p>
                    <p className="text-[11.5px] text-slate-400">
                      {copied
                        ? "Copied to clipboard!"
                        : "Tap to copy the number"}
                    </p>
                  </div>
                  <Copy
                    size={16}
                    className={
                      copied
                        ? "shrink-0 text-emerald-400"
                        : "shrink-0 text-slate-500"
                    }
                  />
                </button>
              </RevealItem>

              {cards.map((c) => (
                <RevealItem key={c.label}>
                  <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-ink-950/60 p-5">
                    <span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-gold-500/25 bg-gold-500/10 text-gold-300">
                      <c.icon size={19} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[10.5px] font-bold tracking-[0.18em] text-slate-500 uppercase">
                        {c.label}
                      </p>
                      <p className="truncate font-display text-base font-extrabold text-white">
                        {c.value}
                      </p>
                      <p className="text-[11.5px] text-slate-400">{c.note}</p>
                    </div>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>

            <Reveal delay={0.1}>
              <div className="overflow-hidden rounded-3xl border border-white/10">
                <iframe
                  title="QHQ Motors location — Chenab Nagar (Rabwah), Punjab, Pakistan"
                  src={`https://www.google.com/maps?q=${MAP_QUERY}&output=embed`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-56 w-full"
                  allowFullScreen
                />
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${MAP_QUERY}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 border-t border-white/10 bg-ink-950/80 py-3 text-[12.5px] font-bold text-gold-200 transition hover:bg-ink-900"
                >
                  <Navigation size={14} /> Get driving directions
                </a>
              </div>
            </Reveal>
          </div>

          <div>
            <Reveal direction="left">
              <div className="rounded-3xl border border-white/10 bg-ink-900/50 p-5 sm:p-6">
                <h3 className="font-display text-xl font-extrabold text-white">
                  Request your car now
                </h3>
                <p className="mt-1.5 text-[13px] text-slate-400">
                  Fill in the details and tap the button — WhatsApp opens with
                  everything pre-filled so you only need to press send.
                </p>
                <div className="mt-5">
                  <QuickBook cars={cars} />
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.12} className="mt-6">
              <div className="rounded-3xl border border-white/10 bg-ink-950/60 p-6">
                <h3 className="font-display text-base font-extrabold text-white">
                  Pickup points we cover
                </h3>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {SITE.pickupPoints.map((p) => (
                    <li
                      key={p.id}
                      className="flex items-start gap-2 text-[12.5px] text-slate-300"
                    >
                      <span className="mt-1 size-1.5 shrink-0 rounded-full bg-gold-400" />
                      {p.short}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
