import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, SESSION_TTL_MS, checkPassword, createSessionToken, isAdminConfigured } from "@/lib/auth";
import { clientIp, rateLimit } from "@/lib/visitor";

export async function POST(req: NextRequest) {
  if (!isAdminConfigured()) {
    return NextResponse.json({ error: "Задайте переменную окружения ADMIN_PASSWORD" }, { status: 503 });
  }
  if (!rateLimit(`login:${clientIp(req)}`, 10, 15 * 60_000)) {
    return NextResponse.json({ error: "Слишком много попыток, подождите 15 минут" }, { status: 429 });
  }
  const { password } = (await req.json().catch(() => ({}))) as { password?: string };
  if (!password || !(await checkPassword(password))) {
    return NextResponse.json({ error: "Неверный пароль" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, await createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production" && process.env.INSECURE_COOKIES !== "1",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });
  return res;
}
