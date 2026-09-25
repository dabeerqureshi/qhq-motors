"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import {
  CalendarCheck,
  ChevronRight,
  Mail,
  Menu,
  MessageCircle,
  Phone,
  ShieldCheck,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SITE } from "@/data/site";
import { cn } from "@/lib/utils";
import { whatsAppUrl } from "@/lib/whatsapp";

export const NAV_LINKS = [
  { href: "#fleet", label: "Fleet" },
  { href: "#rates", label: "Rates" },
  { href: "#airport", label: "Airport Pickup" },
  { href: "#calculator", label: "Calculator" },
  { href: "#why-us", label: "Why Us" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
];

export const HEADER_WHATSAPP_MESSAGE =
  "Assalam-o-Alaikum QHQ Motors, I would like to book a car. Please share availability and rates.";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");
  const { scrollY } = useScroll();
  const headerBlur = useTransform(
    scrollY,
    [0, 90],
    ["blur(0px)", "blur(18px)"],
  );

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* highlight the section currently on screen */
  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.slice(1));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* top trust strip */}
      <div className="hidden border-b border-white/5 bg-ink-950/80 py-2 text-[12px] text-slate-400 lg:block">
        <div className="container-x flex items-center justify-between">
          <p className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-gold-400" />
            100% automatic fleet · Free delivery in Chenab Nagar &amp; Rabwah ·
            Airport pickup 24/7
          </p>
          <div className="flex items-center gap-5">
            <a
              href={`mailto:${SITE.email}`}
              className="flex items-center gap-1.5 transition hover:text-gold-300"
            >
              <Mail size={13} /> {SITE.email}
            </a>
            <a
              href={`tel:${SITE.phone.tel}`}
              className="flex items-center gap-1.5 transition hover:text-gold-300"
            >
              <Phone size={13} /> {SITE.phone.display}
            </a>
            <a
              href={whatsAppUrl(
                "Assalam-o-Alaikum QHQ Motors, I would like to rent a car.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[#25d366] transition hover:text-[#2ee06f]"
            >
              <MessageCircle size={13} /> WhatsApp
            </a>
          </div>
        </div>
      </div>

      <motion.header
        style={{ backdropFilter: headerBlur }}
        className={cn(
          "sticky top-0 z-[60] w-full transition-all duration-500",
          scrolled
            ? "border-b border-white/10 bg-ink-950/85 shadow-[0_14px_40px_-24px_rgba(0,0,0,0.95)]"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="container-x flex h-[68px] items-center justify-between gap-4">
          <Link
            href="/"
            className="group flex items-center gap-3"
            aria-label="QHQ Motors home"
          >
            <span className="relative grid size-11 place-items-center overflow-hidden rounded-2xl border border-gold-500/40 bg-gradient-to-br from-ink-800 to-ink-950">
              <svg viewBox="0 0 64 64" className="size-7" aria-hidden="true">
                <defs>
                  <linearGradient id="hlogo" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#f3dc9c" />
                    <stop offset="55%" stopColor="#e5ae3c" />
                    <stop offset="100%" stopColor="#bd741a" />
                  </linearGradient>
                </defs>
                <path
                  d="M12 40 C12 35 15 33 21 32 L26 32 C30 26 34 23 40 23 L50 23 C53 23 56 25 57 29 L60 34 C61 36 60 38 58 38 L12 38 Z"
                  fill="none"
                  stroke="url(#hlogo)"
                  strokeWidth="3.4"
                  strokeLinejoin="round"
                />
                <circle cx="22" cy="44" r="6" fill="none" stroke="url(#hlogo)" strokeWidth="3.4" />
                <circle cx="48" cy="44" r="6" fill="none" stroke="url(#hlogo)" strokeWidth="3.4" />
              </svg>
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </span>
            <span className="leading-none">
              <span className="block font-display text-[17px] font-extrabold tracking-tight text-white">
                QHQ <span className="text-gradient-gold">MOTORS</span>
              </span>
              <span className="mt-0.5 block text-[10px] font-semibold tracking-[0.2em] text-slate-400 uppercase">
                Chenab Nagar · Rabwah
              </span>
            </span>
          </Link>


          {/* desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "relative rounded-full px-3.5 py-2 text-[13.5px] font-semibold transition-colors",
                  active === link.href
                    ? "text-gold-300"
                    : "text-slate-300 hover:text-white",
                )}
              >
                {link.label}
                {active === link.href && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-transparent via-gold-400 to-transparent"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            ))}
          </nav>

          {/* actions */}
          <div className="flex items-center gap-2">
            <a
              href={`tel:${SITE.phone.tel}`}
              className="hidden items-center gap-2 rounded-full border border-white/12 px-4 py-2.5 text-[13px] font-bold text-slate-200 transition hover:border-gold-400/50 hover:text-gold-200 sm:flex"
            >
              <Phone size={14} /> Call
            </a>
            <a
              href={whatsAppUrl(HEADER_WHATSAPP_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-2 rounded-full bg-gradient-to-br from-gold-300 via-gold-400 to-gold-600 px-5 py-2.5 text-[13px] font-extrabold text-ink-950 shadow-[0_10px_30px_-12px_rgba(229,174,60,0.8)] transition hover:brightness-110 active:scale-95 md:flex"
            >
              <CalendarCheck size={15} /> Book on WhatsApp
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="grid size-11 place-items-center rounded-xl border border-white/12 bg-white/5 text-white lg:hidden"
            >
              <Menu size={19} />
            </button>
          </div>
        </div>
      </motion.header>


      {/* mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[75] bg-ink-950/80 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="fixed inset-y-0 right-0 z-[76] flex w-[86%] max-w-sm flex-col border-l border-white/10 bg-ink-900 lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <span className="font-display text-sm font-extrabold tracking-widest text-gold-300 uppercase">
                  Menu
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="grid size-9 place-items-center rounded-lg border border-white/12 text-slate-300"
                >
                  <X size={17} />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto px-3 py-4">
                {NAV_LINKS.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.05 }}
                    className="flex items-center justify-between rounded-xl px-4 py-3.5 text-[15px] font-bold text-slate-200 transition hover:bg-white/5 hover:text-gold-200"
                  >
                    {link.label}
                    <ChevronRight size={16} className="text-slate-500" />
                  </motion.a>
                ))}
              </nav>

              <div className="space-y-3 border-t border-white/10 p-5">
                <a
                  href={`mailto:${SITE.email}`}
                  className="flex items-center justify-center gap-2 rounded-full border border-white/15 py-3 text-sm font-bold text-white transition hover:border-gold-400/50"
                >
                  <Mail size={15} className="text-gold-400" /> {SITE.email}
                </a>
                <a
                  href={`tel:${SITE.phone.tel}`}
                  className="flex items-center justify-center gap-2 rounded-full border border-white/15 py-3 text-sm font-bold text-white"
                >
                  <Phone size={15} /> {SITE.phone.display}
                </a>
                <a
                  href={whatsAppUrl(HEADER_WHATSAPP_MESSAGE)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-br from-[#2ee06f] to-[#128c7e] py-3 text-sm font-extrabold text-white"
                >
                  <MessageCircle size={16} /> Book on WhatsApp
                </a>
                <p className="pt-1 text-center text-[11px] leading-relaxed text-slate-500">
                  Chenab Nagar (Rabwah), Punjab, Pakistan · Open 24/7
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
