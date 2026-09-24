"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CalendarCheck, ChevronUp, MessageCircle, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { SITE } from "@/data/site";
import { logger } from "@/lib/logger";
import { whatsAppUrl } from "@/lib/whatsapp";

/**
 * Always-visible booking bar.
 * • Desktop: pulsing WhatsApp bubble + call + back-to-top.
 * • Mobile (the majority of our guests): a full-width action bar.
 */
export function StickyBar() {
  const [show, setShow] = useState(false);
  const [tipOpen, setTipOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setShow(window.scrollY > 600);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => setTipOpen(true), 6000);
    return () => window.clearTimeout(t);
  }, []);

  function track(source: string) {
    logger.success("cta.sticky", `Sticky bar action (${source})`, { source });
  }

  return (
    <>
      <div className="pointer-events-none fixed right-5 bottom-6 z-[85] hidden flex-col items-end gap-3 md:flex">
        <AnimatePresence>
          {tipOpen && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              className="pointer-events-auto relative max-w-[250px] rounded-2xl border border-white/12 bg-ink-900/95 p-4 shadow-2xl backdrop-blur-xl"
            >
              <button
                type="button"
                onClick={() => setTipOpen(false)}
                aria-label="Dismiss message"
                className="absolute top-2.5 right-2.5 text-slate-500 transition hover:text-white"
              >
                <X size={13} />
              </button>
              <p className="pr-4 text-[12.5px] font-bold text-white">
                Need a car in Chenab Nagar?
              </p>
              <p className="mt-1 text-[11.5px] leading-relaxed text-slate-400">
                WhatsApp us your dates — automatic cars from 5,000 PKR per day
                with free delivery.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {show && (
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                track("back-to-top");
              }}
              aria-label="Back to top"
              className="pointer-events-auto grid size-11 place-items-center rounded-full border border-white/15 bg-ink-900/90 text-slate-300 shadow-lg backdrop-blur transition hover:border-gold-400/50 hover:text-gold-200"
            >
              <ChevronUp size={18} />
            </motion.button>
          )}
        </AnimatePresence>

        <a
          href={`tel:${SITE.phone.tel}`}
          onClick={() => track("desktop-call")}
          aria-label={`Call ${SITE.phone.display}`}
          className="pointer-events-auto grid size-12 place-items-center rounded-full border border-white/15 bg-ink-900/90 text-gold-300 shadow-lg backdrop-blur transition hover:border-gold-400/50"
        >
          <Phone size={19} />
        </a>

        <span className="relative block size-14">
          <span className="absolute inset-0 animate-pulse-ring rounded-full bg-[#25d366]/60" />
          <a
            href={whatsAppUrl(
              "Assalam-o-Alaikum QHQ Motors, I would like to book an automatic car in Chenab Nagar.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("desktop-whatsapp")}
            aria-label="Chat with QHQ Motors on WhatsApp"
            className="pointer-events-auto relative grid size-14 place-items-center rounded-full bg-gradient-to-br from-[#2ee06f] to-[#128c7e] text-white shadow-[0_16px_44px_-12px_rgba(37,211,102,0.95)] transition hover:brightness-110"
          >
            <MessageCircle size={25} />
          </a>
        </span>
      </div>


      {/* ---------- mobile action bar ---------- */}
      <div className="fixed inset-x-0 bottom-0 z-[85] border-t border-white/10 bg-ink-950/95 px-3 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] backdrop-blur-xl md:hidden">
        <div className="flex items-center gap-2">
          <a
            href={`tel:${SITE.phone.tel}`}
            onClick={() => track("mobile-call")}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/12 py-3 text-[12.5px] font-extrabold text-slate-200"
          >
            <Phone size={15} /> Call
          </a>
          <a
            href={whatsAppUrl(
              "Assalam-o-Alaikum QHQ Motors, I would like to book an automatic car in Chenab Nagar.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("mobile-whatsapp")}
            className="flex flex-[1.5] items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-[#2ee06f] to-[#128c7e] py-3 text-[13px] font-extrabold text-white"
          >
            <MessageCircle size={16} /> WhatsApp
          </a>
          <a
            href="#fleet"
            onClick={() => track("mobile-fleet")}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-gold-300 via-gold-400 to-gold-600 py-3 text-[12.5px] font-extrabold text-ink-950"
          >
            <CalendarCheck size={15} /> Book
          </a>
        </div>
      </div>

      <div className="h-20 bg-ink-950 md:hidden" aria-hidden="true" />
    </>
  );
}
