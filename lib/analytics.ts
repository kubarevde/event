import "server-only";
import { getDb } from "./db";

export const EVENT_TYPES = ["pageview", "cta_click", "form_view", "form_start", "form_submit"] as const;
export type EventType = (typeof EVENT_TYPES)[number];

const BOT_RE = /bot|crawl|spider|slurp|preview|headless|lighthouse|pingdom|monitor|curl|wget|python|go-http/i;

export function isBot(ua: string) {
  return !ua || BOT_RE.test(ua);
}

export function parseUserAgent(ua: string) {
  const device = /ipad|tablet/i.test(ua)
    ? "Планшет"
    : /mobi|iphone|android/i.test(ua)
      ? "Смартфон"
      : "Компьютер";
  const browser = /yabrowser/i.test(ua)
    ? "Яндекс Браузер"
    : /edg\//i.test(ua)
      ? "Edge"
      : /opr\/|opera/i.test(ua)
        ? "Opera"
        : /firefox|fxios/i.test(ua)
          ? "Firefox"
          : /chrome|crios/i.test(ua)
            ? "Chrome"
            : /safari/i.test(ua)
              ? "Safari"
              : "Другой";
  const os = /windows/i.test(ua)
    ? "Windows"
    : /iphone|ipad|ios/i.test(ua)
      ? "iOS"
      : /android/i.test(ua)
        ? "Android"
        : /mac os/i.test(ua)
          ? "macOS"
          : /linux/i.test(ua)
            ? "Linux"
            : "Другая";
  return { device, browser, os };
}

export function recordEvent(e: {
  type: EventType;
  path: string | null;
  visitorId: string;
  sessionId: string;
  referrerHost: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  ua: string;
  meta?: string | null;
}) {
  const { device, browser, os } = parseUserAgent(e.ua);
  getDb()
    .prepare(
      `INSERT INTO events (ts, type, path, visitor_id, session_id, referrer_host, utm_source, utm_medium, utm_campaign, device, browser, os, meta)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      Date.now(),
      e.type,
      e.path,
      e.visitorId,
      e.sessionId,
      e.referrerHost,
      e.utmSource,
      e.utmMedium,
      e.utmCampaign,
      device,
      browser,
      os,
      e.meta ?? null
    );
}

// ---------- Отчёты ----------

export interface DayStat {
  day: string; // YYYY-MM-DD в часовом поясе площадки
  pageviews: number;
  visitors: number;
  submissions: number;
}

export interface Breakdown {
  label: string;
  value: number;
}

export interface Stats {
  totals: {
    pageviews: number;
    visitors: number;
    sessions: number;
    formViews: number;
    formStarts: number;
    submissions: number;
    ctaClicks: number;
  };
  days: DayStat[];
  referrers: Breakdown[];
  utm: Breakdown[];
  devices: Breakdown[];
  browsers: Breakdown[];
  os: Breakdown[];
  hours: number[];
}

function dayKey(ts: number, offsetMin: number) {
  return new Date(ts + offsetMin * 60_000).toISOString().slice(0, 10);
}

export function getStats(from: number, to: number, offsetMin: number): Stats {
  const db = getDb();
  const shift = offsetMin * 60; // секунды, для SQLite-функций даты
  const range = [from, to];

  const count = (type: EventType, distinct: "id" | "visitor_id" | "session_id" = "id") =>
    (
      db
        .prepare(`SELECT COUNT(DISTINCT ${distinct}) AS n FROM events WHERE type = ? AND ts >= ? AND ts < ?`)
        .get(type, ...range) as { n: number }
    ).n;

  const submissions = (
    db.prepare("SELECT COUNT(*) AS n FROM submissions WHERE created_at >= ? AND created_at < ?").get(...range) as {
      n: number;
    }
  ).n;

  const dayExpr = `date(ts / 1000 + ${shift}, 'unixepoch')`;
  const pvRows = db
    .prepare(
      `SELECT ${dayExpr} AS day, COUNT(*) AS pageviews, COUNT(DISTINCT visitor_id) AS visitors
       FROM events WHERE type = 'pageview' AND ts >= ? AND ts < ? GROUP BY day`
    )
    .all(...range) as { day: string; pageviews: number; visitors: number }[];
  const subRows = db
    .prepare(
      `SELECT date(created_at / 1000 + ${shift}, 'unixepoch') AS day, COUNT(*) AS n
       FROM submissions WHERE created_at >= ? AND created_at < ? GROUP BY day`
    )
    .all(...range) as { day: string; n: number }[];

  const byDay = new Map<string, DayStat>();
  const lastDay = dayKey(Math.min(to, Date.now()) - 1, offsetMin);
  for (let t = from; ; t += 86_400_000) {
    const day = dayKey(t, offsetMin);
    byDay.set(day, { day, pageviews: 0, visitors: 0, submissions: 0 });
    if (day >= lastDay || byDay.size > 400) break;
  }
  for (const r of pvRows) {
    const d = byDay.get(r.day) ?? { day: r.day, pageviews: 0, visitors: 0, submissions: 0 };
    d.pageviews = r.pageviews;
    d.visitors = r.visitors;
    byDay.set(r.day, d);
  }
  for (const r of subRows) {
    const d = byDay.get(r.day) ?? { day: r.day, pageviews: 0, visitors: 0, submissions: 0 };
    d.submissions = r.n;
    byDay.set(r.day, d);
  }

  const breakdown = (column: string, where = "") =>
    db
      .prepare(
        `SELECT ${column} AS label, COUNT(DISTINCT session_id) AS value FROM events
         WHERE type = 'pageview' AND ts >= ? AND ts < ? ${where}
         GROUP BY label ORDER BY value DESC LIMIT 10`
      )
      .all(...range) as Breakdown[];

  const hoursRows = db
    .prepare(
      `SELECT CAST(strftime('%H', ts / 1000 + ${shift}, 'unixepoch') AS INTEGER) AS h, COUNT(*) AS n
       FROM events WHERE type = 'pageview' AND ts >= ? AND ts < ? GROUP BY h`
    )
    .all(...range) as { h: number; n: number }[];
  const hours = Array.from({ length: 24 }, () => 0);
  for (const r of hoursRows) hours[r.h] = r.n;

  return {
    totals: {
      pageviews: count("pageview"),
      visitors: count("pageview", "visitor_id"),
      sessions: count("pageview", "session_id"),
      formViews: count("form_view", "session_id"),
      formStarts: count("form_start", "session_id"),
      submissions,
      ctaClicks: count("cta_click"),
    },
    days: [...byDay.values()].sort((a, b) => a.day.localeCompare(b.day)),
    referrers: breakdown("COALESCE(referrer_host, 'Прямые заходы')"),
    utm: breakdown(
      "utm_source || ' / ' || COALESCE(utm_medium, '—') || ' / ' || COALESCE(utm_campaign, '—')",
      "AND utm_source IS NOT NULL"
    ),
    devices: breakdown("device"),
    browsers: breakdown("browser"),
    os: breakdown("os"),
    hours,
  };
}
