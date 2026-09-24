/**
 * Lightweight structured logger.
 *
 * Every meaningful interaction on the site (page view, WhatsApp click, filter,
 * admin edit …) is pushed through here. Events are written to the browser
 * console with a consistent prefix and mirrored into `localStorage` so the
 * /admin panel can show a live "Activity log" without any backend.
 */

export type LogLevel = "debug" | "info" | "success" | "warn" | "error";

export interface LogEvent {
  id: string;
  level: LogLevel;
  /** Machine readable event name, e.g. "whatsapp.click". */
  event: string;
  message: string;
  /** Optional structured payload. */
  data?: Record<string, unknown>;
  timestamp: string;
  /** Page the event happened on. */
  path: string;
}

const STORAGE_KEY = "qhq:logs";
const MAX_EVENTS = 200;

const LEVEL_STYLE: Record<LogLevel, string> = {
  debug: "color:#94a3b8",
  info: "color:#38bdf8",
  success: "color:#22c55e",
  warn: "color:#f59e0b",
  error: "color:#ef4444",
};

const isBrowser = () => typeof window !== "undefined";

let memoryBuffer: LogEvent[] = [];

/** Read persisted events (most recent first). */
export function readLogs(): LogEvent[] {
  if (!isBrowser()) return memoryBuffer;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as LogEvent[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persist(events: LogEvent[]) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch {
    /* storage full or blocked — logging must never break the app */
  }
}

/** Emit a single structured log event. */
export function log(
  level: LogLevel,
  event: string,
  message: string,
  data?: Record<string, unknown>,
): LogEvent {
  const entry: LogEvent = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    level,
    event,
    message,
    data,
    timestamp: new Date().toISOString(),
    path: isBrowser() ? window.location.pathname + window.location.hash : "/",
  };

  if (isBrowser() && process.env.NODE_ENV !== "production") {
    console.log(
      `%c[QHQ ${level.toUpperCase()}] ${event} — ${message}`,
      LEVEL_STYLE[level],
      data ?? "",
    );
  }

  const next = [entry, ...readLogs()].slice(0, MAX_EVENTS);
  persist(next);
  memoryBuffer = next;

  if (isBrowser()) {
    window.dispatchEvent(new CustomEvent("qhq:log", { detail: entry }));
  }

  return entry;
}

export const logger = {
  debug: (event: string, message: string, data?: Record<string, unknown>) =>
    log("debug", event, message, data),
  info: (event: string, message: string, data?: Record<string, unknown>) =>
    log("info", event, message, data),
  success: (event: string, message: string, data?: Record<string, unknown>) =>
    log("success", event, message, data),
  warn: (event: string, message: string, data?: Record<string, unknown>) =>
    log("warn", event, message, data),
  error: (event: string, message: string, data?: Record<string, unknown>) =>
    log("error", event, message, data),
};

/** Remove every persisted event. */
export function clearLogs() {
  persist([]);
  memoryBuffer = [];
  if (isBrowser()) {
    window.dispatchEvent(new CustomEvent("qhq:log", { detail: null }));
  }
}

/** Download the activity log as a JSON file. */
export function downloadLogs() {
  if (!isBrowser()) return;
  const blob = new Blob([JSON.stringify(readLogs(), null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `qhq-motors-activity-log-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  logger.info("log.export", "Activity log exported to JSON");
}
