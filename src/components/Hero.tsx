"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  BadgeCheck,
  Clock,
  Gauge,
  MapPin,
  MessageCircle,
  Phone,
  Plane,
  Route,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import { QuickBook } from "@/components/QuickBook";
import { Counter, Stars } from "@/components/ui";
import type { Car } from "@/data/cars";
import { SITE } from "@/data/site";
import { logger } from "@/lib/logger";
import { formatPKR } from "@/lib/utils";
import { buildBookingMessage, openWhatsApp } from "@/lib/whatsapp";

const STATS = [
  { icon: Clock, value: 24, suffix: "/7", label: "Airport pickup" },
  { icon: Route, value: 180, suffix: "k+", label: "Kilometres covered" },
  { icon: Star, value: 4.9, decimals: 1, suffix: "/5", label: "Guest rating" },
  { icon: BadgeCheck, value: 100, suffix: "%", label: "Automatic fleet" },
];

export function Hero({ cars }: { cars: Car[] }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 110]);
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.85],
    [1, reduced ? 1 : 0.15],
  );

  const heroCar = cars[0];
  const fromRate = cars.length
    ? Math.min(...cars.map((c) => c.rates.daily))
    : 5000;

  return (
    <section
      id="home"
      ref={ref}
      className="noise relative isolate overflow-hidden border-b border-white/5"
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-950 via-ink-900 to-ink-950" />
      <div className="grid-lines absolute inset-0 -z-10 opacity-60" />
      <div className="absolute -top-40 -right-24 -z-10 size-[36rem] rounded-full bg-gold-500/15 blur-[130px]" />
      <div className="absolute top-40 -left-32 -z-10 size-[30rem] rounded-full bg-sky-500/10 blur-[130px]" />

      <motion.div
        style={{ y, opacity }}
        className="container-x relative pt-14 pb-16 lg:pt-20 lg:pb-24"
      >

        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          {/* copy */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex flex-wrap items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-4 py-2 text-[11px] font-bold tracking-[0.16em] text-gold-200 uppercase"
            >
              <MapPin size={13} />
              Chenab Nagar · Rabwah · Punjab, Pakistan
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.08 }}
              className="mt-6 text-[2.1rem] leading-[1.12] font-extrabold text-white sm:text-5xl lg:text-[3.6rem]"
            >
              Automatic Car Rental in{" "}
              <span className="text-gradient-gold">Chenab Nagar</span>{" "}
              <span className="text-slate-300">&amp;</span>{" "}
              <span className="text-gradient-gold">Rabwah</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.18 }}
              className="mt-6 max-w-xl text-[15.5px] leading-relaxed text-slate-300/90 sm:text-lg"
            >
              Clean, fully{" "}
              <strong className="font-bold text-white">automatic</strong> cars —
              the Toyota Corolla Altis and Suzuki Alto — with honest daily,
              weekly and monthly rates from{" "}
              <strong className="font-bold text-gold-300">
                {formatPKR(fromRate)}
              </strong>
              . Free delivery in Chenab Nagar &amp; Rabwah, plus{" "}
              <strong className="font-bold text-white">
                24/7 meet-and-greet pickup
              </strong>{" "}
              at Lahore, Faisalabad, Islamabad and Sialkot airports for our
              overseas guests.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.28 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <button
                type="button"
                onClick={() => {
                  logger.info("cta.click", "Hero primary CTA clicked");
                  openWhatsApp(
                    buildBookingMessage({ car: heroCar, plan: "daily" }),
                    { car: heroCar, plan: "daily" },
                    "hero-primary",
                  );
                }}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-gold-300 via-gold-400 to-gold-600 px-7 py-4 text-[15px] font-extrabold text-ink-950 shadow-[0_18px_50px_-16px_rgba(229,174,60,0.9)] transition hover:brightness-110 active:scale-95"
              >
                <MessageCircle size={17} /> Book on WhatsApp
              </button>
              <a
                href="#fleet"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-4 text-[15px] font-bold text-white transition hover:border-gold-400/50 hover:bg-white/10"
              >
                <Gauge size={17} /> See the fleet &amp; rates
              </a>
              <a
                href={`tel:${SITE.phone.tel}`}
                className="inline-flex items-center gap-2 rounded-full px-4 py-4 text-[14px] font-bold text-slate-300 transition hover:text-gold-300"
              >
                <Phone size={16} /> {SITE.phone.display}
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-[13px] text-slate-300"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck size={15} className="text-gold-400" /> Verified
                &amp; insured cars
              </span>
              <span className="flex items-center gap-2">
                <Plane size={15} className="text-gold-400" /> Flight-tracked
                pickups
              </span>
              <span className="flex items-center gap-2">
                <Sparkles size={15} className="text-gold-400" /> No hidden
                charges
              </span>
            </motion.div>

            <div className="mt-10 grid max-w-xl grid-cols-2 gap-4 sm:grid-cols-4">
              {STATS.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + i * 0.08 }}
                  className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3.5 text-center"
                >
                  <s.icon size={16} className="mx-auto text-gold-400" />
                  <p className="mt-2 font-display text-xl font-extrabold text-white">
                    <Counter
                      to={s.value}
                      suffix={s.suffix}
                      decimals={s.decimals ?? 0}
                    />
                  </p>
                  <p className="mt-0.5 text-[10.5px] font-semibold tracking-wide text-slate-400 uppercase">
                    {s.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>


          {/* car visual */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{
                duration: 0.9,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {heroCar && (
                <div className="relative">
                  <div className="absolute inset-x-8 top-8 bottom-16 rounded-[3rem] bg-gold-500/20 blur-3xl" />
                  <motion.div
                    animate={reduced ? undefined : { y: [0, -14, 0] }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Image
                      src={heroCar.image}
                      alt={`${heroCar.name} ${heroCar.variant} rental in Chenab Nagar, Pakistan`}
                      width={900}
                      height={420}
                      priority
                      className="relative w-full rounded-2xl drop-shadow-[0_36px_60px_rgba(0,0,0,0.65)]"
                    />
                  </motion.div>

                  <div className="mx-auto -mt-6 w-[85%] overflow-hidden rounded-2xl">
                    <div className="road-stripes h-1.5 w-full opacity-70" />
                  </div>

                  <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-white/12 bg-ink-950/70 px-5 py-4 backdrop-blur-xl">
                    <div>
                      <p className="text-[11px] font-bold tracking-[0.18em] text-gold-300 uppercase">
                        Featured automatic
                      </p>
                      <p className="mt-1 font-display text-lg font-extrabold text-white">
                        {heroCar.name}
                      </p>
                      <p className="text-[12px] text-slate-400">
                        {heroCar.variant} · {heroCar.seats} seats ·{" "}
                        {heroCar.mileage}
                      </p>
                    </div>
                    <div className="text-right">
                      <Stars rating={heroCar.rating} />
                      <p className="mt-1 font-display text-xl font-extrabold text-gold-300">
                        {formatPKR(heroCar.rates.daily)}
                      </p>
                      <p className="text-[11px] text-slate-400">per day</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* quick booking bar */}
        <div className="mt-12 lg:mt-16">
          <QuickBook cars={cars} />
        </div>
      </motion.div>
    </section>
  );
}
