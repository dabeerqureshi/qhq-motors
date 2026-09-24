"use client";

import {
  clearLogs,
  downloadLogs,
  logger,
  readLogs,
  type LogEvent,
} from "@/lib/logger";
import { AnimatePresence, motion } from "framer-motion";
import { Bug, Download, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Site-wide analytics + activity logging.
 *
 * • logs the page view
 * • tracks scroll depth milestones (25 / 50 / 75 / 100 %)
 * • tracks which sections a visitor actually reads (for SEO / content tuning)
 * • tracks every outbound phone call, WhatsApp click and email click
 * • in development it renders a floating "Activity log" drawer so you can
 *   watch every event live — it is automatically hidden in production.
 */
export function AnalyticsTracker() {
  const [open, setOpen] = useState(false);
  const [events, setEvents] = useState<LogEvent[]>(() =>
    typeof window === "undefined" ? [] : readLogs(),
  );

  useEffect(() => {
    logger.info("page.view", "Landing page viewed", {
      referrer: document.referrer || "direct",
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });

    /* ---------- section visibility (IntersectionObserver) ---------- */
    const sections = document.querySelectorAll<HTMLElement>("section[id]");
    const seen = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;
          if (entry.isIntersecting && !seen.has(id)) {
            seen.add(id);
            logger.debug("section.view", `Section "${id}" entered viewport`, {
              id,
            });
          }
        });
      },
      { threshold: 0.35 },
    );
    sections.forEach((s) => observer.observe(s));

    /* ---------- scroll depth ---------- */
    const marks = [25, 50, 75, 100];
    const hit = new Set<number>();
    function onScroll() {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const pct = max > 0 ? Math.round((h.scrollTop / max) * 100) : 0;
      marks.forEach((m) => {
        if (pct >= m && !hit.has(m)) {
          hit.add(m);
          logger.debug("scroll.depth", `Scrolled ${m}% of the page`, {
            percent: m,
          });
        }
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });

    /* ---------- outbound link tracking ---------- */
    function onClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement | null)?.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href") ?? "";
      if (href.startsWith("tel:")) {
        logger.success("contact.call", "Phone call initiated", { href });
      } else if (href.startsWith("mailto:")) {
        logger.success("contact.email", "Email link clicked", { href });
      } else if (href.includes("wa.me")) {
        logger.success("whatsapp.link", "WhatsApp link clicked", {
          href,
          text: anchor.textContent?.trim().slice(0, 60),
        });
      }
    }
    document.addEventListener("click", onClick);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onClick);
    };
  }, []);

  /* keep the dev drawer in sync with the store */
  useEffect(() => {
    if (process.env.NODE_ENV === "production" || !open) return;
    function onLog() {
      setEvents(readLogs());
    }
    window.addEventListener("qhq:log", onLog);
    return () => window.removeEventListener("qhq:log", onLog);
  }, [open]);

  if (process.env.NODE_ENV === "production") return null;

  return (
    <>
      <button
        type="button"
        onClick={() => {
          const next = !open;
          if (next) setEvents(readLogs());
          setOpen(next);
        }}
        aria-label="Toggle activity log"
        className="fixed bottom-24 left-4 z-[80] hidden size-10 place-items-center rounded-full border border-white/15 bg-ink-900/90 text-gold-300 shadow-lg backdrop-blur transition hover:bg-ink-800 md:grid"
      >
        <Bug size={17} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-36 left-4 z-[80] hidden w-[380px] max-w-[92vw] overflow-hidden rounded-2xl border border-white/12 bg-ink-900/95 shadow-2xl backdrop-blur-xl md:block"
          >
            <header className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div>
                <p className="font-display text-sm font-bold text-white">
                  Activity log
                </p>
                <p className="text-[11px] text-slate-400">
                  {events.length} events · live
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={downloadLogs}
                  aria-label="Download log"
                  className="grid size-8 place-items-center rounded-lg text-slate-300 hover:bg-white/10"
                >
                  <Download size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    clearLogs();
                    setEvents([]);
                  }}
                  aria-label="Clear log"
                  className="grid size-8 place-items-center rounded-lg text-slate-300 hover:bg-white/10"
                >
                  <Trash2 size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close log"
                  className="grid size-8 place-items-center rounded-lg text-slate-300 hover:bg-white/10"
                >
                  <X size={15} />
                </button>
              </div>
            </header>
            <ul className="max-h-[46vh] divide-y divide-white/5 overflow-y-auto">
              {events.length === 0 && (
                <li className="px-4 py-6 text-center text-xs text-slate-400">
                  No events yet — scroll, filter the fleet or click a booking
                  button.
                </li>
              )}
              {events.map((e) => (
                <li key={e.id} className="px-4 py-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={
                        "rounded px-1.5 py-0.5 text-[10px] font-bold uppercase " +
                        (e.level === "error"
                          ? "bg-rose-500/15 text-rose-300"
                          : e.level === "warn"
                            ? "bg-amber-500/15 text-amber-300"
                            : e.level === "success"
                              ? "bg-emerald-500/15 text-emerald-300"
                              : "bg-sky-500/15 text-sky-300")
                      }
                    >
                      {e.level}
                    </span>
                    <span className="font-mono text-[10px] text-slate-500">
                      {new Date(e.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="mt-1 font-mono text-[11px] text-gold-300">
                    {e.event}
                  </p>
                  <p className="text-[11px] leading-snug text-slate-300">
                    {e.message}
                  </p>
                </li>
              ))}
            </ul>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
