"use client";

import { motion } from "framer-motion";
import {
  Clock,
  Key,
  MapPinned,
  MessageCircle,
  Plane,
  ShieldCheck,
  Timer,
} from "lucide-react";
import { RevealGroup, RevealItem, SectionHeading } from "@/components/Reveal";
import { AIRPORT_TRANSFERS } from "@/data/plans";
import { logger } from "@/lib/logger";
import { formatForeign, formatPKR } from "@/lib/utils";
import { buildBookingMessage, openWhatsApp } from "@/lib/whatsapp";

export function Airport() {
  return (
    <section
      id="airport"
      className="relative overflow-hidden border-b border-white/5 py-20 lg:py-28"
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-950 via-ink-900/60 to-ink-950" />
      <div className="absolute top-24 -right-20 -z-10 size-[28rem] rounded-full bg-sky-500/12 blur-[130px]" />

      <div className="container-x">
        <SectionHeading
          eyebrow="Airport car delivery · 24/7"
          title="Landing in Pakistan?"
          highlight="We deliver your car to the airport"
          description="Flying home to Chenab Nagar or Rabwah? We deliver your clean, automatic self-drive car straight to Lahore, Faisalabad or Islamabad airport on arrival. Step off your flight, take the keys and drive yourself home in comfort."
        />

        <RevealGroup className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Key, label: "Self drive handover", value: "At arrivals" },
            { icon: Timer, label: "Flight tracking", value: "24 / 7 Live" },
            { icon: Clock, label: "Night flights", value: "Welcome" },
            { icon: ShieldCheck, label: "Fixed price", value: "Guaranteed" },
          ].map((s) => (
            <RevealItem
              key={s.label}
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-ink-950/60 px-5 py-4"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-gold-500/25 bg-gold-500/10 text-gold-300">
                <s.icon size={17} />
              </span>
              <div>
                <p className="text-[10.5px] font-bold tracking-[0.16em] text-slate-500 uppercase">
                  {s.label}
                </p>
                <p className="font-display text-base font-extrabold text-white">
                  {s.value}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {AIRPORT_TRANSFERS.map((t, i) => (
            <motion.article
              key={t.code}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className="card-glow group relative rounded-3xl border border-white/10 bg-ink-900/70 p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="grid size-12 place-items-center rounded-2xl border border-gold-500/30 bg-gradient-to-br from-gold-500/20 to-ink-900 font-display text-[13px] font-extrabold text-gold-200">
                    {t.code}
                  </span>
                  <div>
                    <h3 className="font-display text-[15.5px] leading-tight font-extrabold text-white">
                      {t.name}
                    </h3>
                    <p className="mt-0.5 flex items-center gap-3 text-[11.5px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPinned size={11} /> {t.distance}
                      </span>
                      <span className="flex items-center gap-1">
                        <Timer size={11} /> {t.duration}
                      </span>
                    </p>
                  </div>
                </div>
                <Plane
                  size={18}
                  className="shrink-0 text-gold-400/70 transition-transform duration-500 group-hover:translate-x-1"
                />
              </div>

              <p className="mt-3.5 text-[12.5px] leading-relaxed text-slate-300/85">
                {t.note}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                    Suzuki Alto
                  </p>
                  <p className="font-display text-lg font-extrabold text-white">
                    {formatPKR(t.altoPrice)}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                    Corolla Altis
                  </p>
                  <p className="font-display text-lg font-extrabold text-gold-300">
                    {formatPKR(t.altisPrice)}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <p className="text-[11px] text-slate-400">
                  Self-drive airport delivery · ≈{" "}
                  {formatForeign(t.altoPrice, "USD")}–
                  {formatForeign(t.altisPrice, "USD")}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    logger.success(
                      "airport.book",
                      `Airport car delivery requested: ${t.code}`,
                      { code: t.code },
                    );
                    openWhatsApp(
                      buildBookingMessage({
                        pickup: t.name,
                        airportDelivery: true,
                        notes:
                          `Airport delivery requested at ${t.name}. My flight number and landing date are: `,
                      }),
                      { pickup: t.name },
                      `airport-${t.code}`,
                    );
                  }}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-br from-[#2ee06f] to-[#128c7e] px-4 py-2.5 text-[12px] font-extrabold text-white transition hover:brightness-110"
                >
                  <MessageCircle size={13} /> Book delivery
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
