import "server-only";
import { randomUUID } from "crypto";
import type { NextRequest, NextResponse } from "next/server";

// Первичные cookie для подсчёта уникальных посетителей и визитов (без внешних счётчиков).
const VISITOR_COOKIE = "vid";
const SESSION_COOKIE = "sid";
const UTM_COOKIE = "utm";
const SESSION_IDLE_SEC = 30 * 60;
const YEAR_SEC = 365 * 24 * 60 * 60;

export interface Attribution {
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  referrerHost: string | null;
}

export function readVisitor(req: NextRequest) {
  const visitorId = req.cookies.get(VISITOR_COOKIE)?.value || randomUUID();
  const sessionId = req.cookies.get(SESSION_COOKIE)?.value || randomUUID();
  let attribution: Attribution = { utmSource: null, utmMedium: null, utmCampaign: null, referrerHost: null };
  try {
    const raw = req.cookies.get(UTM_COOKIE)?.value;
    if (raw) attribution = { ...attribution, ...JSON.parse(raw) };
  } catch {
    // повреждённая cookie — игнорируем
  }
  return { visitorId, sessionId, attribution };
}

export function writeVisitor(
  res: NextResponse,
  ids: { visitorId: string; sessionId: string },
  attribution?: Attribution
) {
  const secure = process.env.NODE_ENV === "production" && process.env.INSECURE_COOKIES !== "1";
  const base = { httpOnly: true, sameSite: "lax" as const, secure, path: "/" };
  res.cookies.set(VISITOR_COOKIE, ids.visitorId, { ...base, maxAge: YEAR_SEC });
  res.cookies.set(SESSION_COOKIE, ids.sessionId, { ...base, maxAge: SESSION_IDLE_SEC });
  if (attribution) {
    res.cookies.set(UTM_COOKIE, JSON.stringify(attribution), { ...base, maxAge: 30 * 24 * 60 * 60 });
  }
}

/** IP посетителя за WAF/прокси: заголовок из CLIENT_IP_HEADER или последний адрес X-Forwarded-For
 *  (его добавляет ближайший прокси, подделать его клиент не может). */
export function clientIp(req: NextRequest) {
  const custom = process.env.CLIENT_IP_HEADER;
  if (custom) {
    const v = req.headers.get(custom)?.split(",")[0]?.trim();
    if (v) return v;
  }
  const xff = req.headers.get("x-forwarded-for");
  return xff?.split(",").pop()?.trim() || req.headers.get("x-real-ip") || "unknown";
}

const buckets = new Map<string, number[]>();

/** Простое ограничение частоты в памяти процесса. */
export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    buckets.set(key, hits);
    return false;
  }
  hits.push(now);
  buckets.set(key, hits);
  if (buckets.size > 10_000) buckets.clear();
  return true;
}
