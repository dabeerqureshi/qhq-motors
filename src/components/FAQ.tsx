"use client";

import { AnimatePresence, motion } from "framer-motion";
import { HelpCircle, MessageCircle, Minus, Phone, Plus } from "lucide-react";
import { useState } from "react";
import { Reveal, SectionHeading } from "@/components/Reveal";
import { FAQS } from "@/data/faqs";
import { SITE } from "@/data/site";
import { logger } from "@/lib/logger";
import { cn } from "@/lib/utils";
import { whatsAppUrl } from "@/lib/whatsapp";

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative border-b border-white/5 py-20 lg:py-28">
      <div className="absolute top-1/4 -left-24 -z-10 size-[24rem] rounded-full bg-sky-500/10 blur-[120px]" />

      <div className="container-x">
        <SectionHeading
          eyebrow="Frequently asked questions"
          title="Everything you need to know"
          highlight="before you book"
          description="Still unsure about something? Send us a WhatsApp message — real people answer, usually within five minutes."
        />

        <div className="mx-auto mt-10 max-w-3xl space-y-3">
          {FAQS.map((faq, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={faq.question} delay={i * 0.04}>
                <div
                  className={cn(
                    "overflow-hidden rounded-2xl border transition-colors",
                    isOpen
                      ? "border-gold-400/45 bg-gold-500/8"
                      : "border-white/10 bg-ink-900/60 hover:border-white/20",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(isOpen ? null : i);
                      logger.debug(
                        "faq.toggle",
                        `${isOpen ? "Closed" : "Opened"} FAQ: ${faq.question}`,
                      );
                    }}
                    aria-expanded={isOpen}
                    className="flex w-full items-start gap-4 px-5 py-4.5 text-left"
                  >
                    <HelpCircle
                      size={17}
                      className={cn(
                        "mt-0.5 shrink-0",
                        isOpen ? "text-gold-300" : "text-slate-500",
                      )}
                    />
                    <span
                      className={cn(
                        "flex-1 font-display text-[14.5px] leading-snug font-bold",
                        isOpen ? "text-white" : "text-slate-200",
                      )}
                    >
                      {faq.question}
                    </span>
                    <span
                      className={cn(
                        "mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border",
                        isOpen
                          ? "border-gold-400/50 text-gold-300"
                          : "border-white/15 text-slate-400",
                      )}
                    >
                      {isOpen ? <Minus size={13} /> : <Plus size={13} />}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pt-0 pb-5 pl-[3.6rem] text-[13.5px] leading-relaxed text-slate-300/90">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.15} className="mt-10">
          <div className="mx-auto flex max-w-3xl flex-col items-center justify-between gap-4 rounded-3xl border border-gold-500/25 bg-gradient-to-r from-gold-500/12 via-ink-900 to-ink-900 px-6 py-5 text-center sm:flex-row sm:text-left">
            <p className="text-[13.5px] text-slate-300">
              <strong className="font-bold text-white">
                Question not answered?
              </strong>{" "}
              Ask us directly — we reply in English or Urdu, 24/7.
            </p>
            <div className="flex shrink-0 gap-2">
              <a
                href={whatsAppUrl(
                  "Assalam-o-Alaikum QHQ Motors, I have a question about renting a car: ",
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-[#2ee06f] to-[#128c7e] px-5 py-2.5 text-[13px] font-extrabold text-white"
              >
                <MessageCircle size={14} /> WhatsApp us
              </a>
              <a
                href={`tel:${SITE.phone.tel}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-[13px] font-bold text-white transition hover:border-gold-400/50"
              >
                <Phone size={13} /> Call
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
