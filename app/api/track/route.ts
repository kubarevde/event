import { NextResponse, type NextRequest } from "next/server";
import { EVENT_TYPES, isBot, recordEvent, type EventType } from "@/lib/analytics";
import { SESSION_COOKIE as ADMIN_COOKIE, verifySessionToken } from "@/lib/auth";
import { clientIp, rateLimit, readVisitor, writeVisitor, type Attribution } from "@/lib/visitor";

const clip = (v: unknown, max = 200) => (typeof v === "string" && v.trim() ? v.trim().slice(0, max) : null);

export async function POST(req: NextRequest) {
  const ua = req.headers.get("user-agent") ?? "";
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return new NextResponse(null, { status: 400 });
  }
  const type = body.type as EventType;
  if (!EVENT_TYPES.includes(type) || type === "form_submit") return new NextResponse(null, { status: 400 });

  // Боты и сам администратор в статистику не попадают.
  if (isBot(ua) || (await verifySessionToken(req.cookies.get(ADMIN_COOKIE)?.value))) {
    return new NextResponse(null, { status: 204 });
  }
  if (!rateLimit(`track:${clientIp(req)}`, 120, 60_000)) return new NextResponse(null, { status: 429 });

  const { visitorId, sessionId, attribution } = readVisitor(req);
  let current: Attribution = attribution;

  let referrerHost: string | null = null;
  try {
    const ref = clip(body.referrer, 500);
    if (ref) {
      const host = new URL(ref).hostname;
      if (host && host !== req.nextUrl.hostname) referrerHost = host.replace(/^www\./, "");
    }
  } catch {
    // невалидный referrer
  }

  const utm = (body.utm ?? {}) as Record<string, unknown>;
  const utmSource = clip(utm.source, 100);
  if (type === "pageview" && (utmSource || referrerHost)) {
    // Атрибуция по последнему непрямому заходу.
    current = {
      utmSource,
      utmMedium: clip(utm.medium, 100),
      utmCampaign: clip(utm.campaign, 150),
      referrerHost,
    };
  }

  recordEvent({
    type,
    path: clip(body.path, 300),
    visitorId,
    sessionId,
    referrerHost: type === "pageview" ? referrerHost : null,
    utmSource: current.utmSource,
    utmMedium: current.utmMedium,
    utmCampaign: current.utmCampaign,
    ua,
    meta: clip(body.label, 200),
  });

  const res = new NextResponse(null, { status: 204 });
  writeVisitor(res, { visitorId, sessionId }, current !== attribution ? current : undefined);
  return res;
}
