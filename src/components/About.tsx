"use client";

import { motion } from "framer-motion";
import { Award, Car, Heart, Quote, Star } from "lucide-react";
import {
  Reveal,
  RevealGroup,
  RevealItem,
  SectionHeading,
} from "@/components/Reveal";
import { Stars } from "@/components/ui";
import { TESTIMONIALS } from "@/data/plans";

export function About() {
  return (
    <section
      id="about"
      className="relative overflow-hidden border-b border-white/5 bg-ink-900/40 py-20 lg:py-28"
    >
      <div className="container-x">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              align="left"
              eyebrow="About QHQ Motors"
              title="A local family business,"
              highlight="built on trust"
            />

            <Reveal delay={0.2}>
              <div className="mt-6 space-y-4 text-[14.5px] leading-relaxed text-slate-300/90">
                <p>
                  QHQ Motors was started in{" "}
                  <strong className="font-bold text-white">
                    Chenab Nagar (Rabwah)
                  </strong>{" "}
                  with one simple observation: guests arriving from abroad were
                  being over-charged, handed tired manual cars and left to
                  negotiate in the heat after a long flight.
                </p>
                <p>
                  We decided to do the opposite. Every car we hand over is{" "}
                  <strong className="font-bold text-white">automatic</strong>,
                  washed, serviced and insured. Every price is fixed in advance
                  on WhatsApp. Every airport pickup is met in person, with a
                  name board and cold water waiting in the car.
                </p>
                <p>
                  Today QHQ Motors looks after families, students, wedding
                  parties, doctors and business travellers across Punjab — and
                  most of our bookings come from guests who came back, or from
                  the people they told about us.
                </p>
              </div>
            </Reveal>

            <RevealGroup className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                {
                  icon: Car,
                  label: "Fleet",
                  value: "Automatic only",
                  note: "Corolla Altis & Suzuki Alto",
                },
                {
                  icon: Heart,
                  label: "Promise",
                  value: "Fixed price",
                  note: "Quoted before you travel",
                },
                {
                  icon: Award,
                  label: "Founder",
                  value: "Qamar Ul Haq Qureshi",
                  note: "Family-run since day one",
                },
                {
                  icon: Star,
                  label: "Leadership",
                  value: "Dabeer Ul Haq Qureshi",
                  note: "Chief Executive Officer",
                },
              ].map((card) => (
                <RevealItem
                  key={card.label}
                  className="rounded-2xl border border-white/10 bg-ink-950/60 p-5"
                >
                  <card.icon size={17} className="text-gold-400" />
                  <p className="mt-3 text-[10.5px] font-bold tracking-[0.16em] text-slate-500 uppercase">
                    {card.label}
                  </p>
                  <p className="mt-0.5 font-display text-[15px] font-extrabold text-white">
                    {card.value}
                  </p>
                  <p className="text-[11.5px] text-slate-400">{card.note}</p>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>


          <div className="lg:pt-14">
            <Reveal direction="left">
              <div className="mb-5 flex items-center justify-between gap-4 rounded-2xl border border-gold-500/25 bg-gold-500/10 px-5 py-4">
                <div>
                  <p className="text-[10.5px] font-bold tracking-[0.18em] text-gold-300 uppercase">
                    Guest satisfaction
                  </p>
                  <p className="font-display text-2xl font-extrabold text-white">
                    4.9 / 5
                  </p>
                </div>
                <div className="text-right">
                  <Stars rating={5} size={16} />
                  <p className="mt-1 text-[11.5px] text-slate-400">
                    Based on 224+ reviews
                  </p>
                </div>
              </div>
            </Reveal>

            <div className="space-y-4">
              {TESTIMONIALS.slice(0, 4).map((t, i) => (
                <motion.blockquote
                  key={t.name}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.55, delay: i * 0.09 }}
                  className="card-glow relative rounded-2xl border border-white/10 bg-ink-950/60 p-5"
                >
                  <Quote
                    size={20}
                    className="absolute top-4 right-4 text-gold-500/40"
                  />
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 place-items-center rounded-full border border-white/12 bg-white/5 text-base">
                      {t.flag}
                    </span>
                    <div>
                      <p className="text-[13px] font-bold text-white">
                        {t.name}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {t.location} · {t.car}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-[12.5px] leading-relaxed text-slate-300/90">
                    “{t.text}”
                  </p>
                  <Stars rating={t.rating} size={12} className="mt-3" />
                </motion.blockquote>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
