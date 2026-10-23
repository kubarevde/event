import "server-only";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "./auth";

/** Повторная проверка сессии в каждом admin API (в дополнение к middleware). */
export async function requireAdmin(): Promise<NextResponse | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (await verifySessionToken(token)) return null;
  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}
