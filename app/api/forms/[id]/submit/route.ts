import { NextResponse, type NextRequest } from "next/server";
import { isBot, recordEvent } from "@/lib/analytics";
import { validateSubmission } from "@/lib/forms";
import { createSubmission, getForm } from "@/lib/store";
import { clientIp, rateLimit, readVisitor, writeVisitor } from "@/lib/visitor";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const form = getForm(id);
  if (!form) return NextResponse.json({ error: "Форма не найдена" }, { status: 404 });

  if (!rateLimit(`submit:${clientIp(req)}`, 10, 10 * 60_000)) {
    return NextResponse.json({ error: "Слишком много заявок, попробуйте позже" }, { status: 429 });
  }

  let body: { data?: Record<string, unknown>; website?: string; startedAt?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  // Ловушка для спам-ботов: скрытое поле и слишком быстрое заполнение.
  const tooFast = typeof body.startedAt === "number" && Date.now() - body.startedAt < 2500;
  if (body.website || tooFast) return NextResponse.json({ ok: true });

  const result = validateSubmission(form.schema, body.data ?? {});
  if (!result.ok) return NextResponse.json({ errors: result.errors }, { status: 422 });

  const { visitorId, sessionId, attribution } = readVisitor(req);
  createSubmission({ formId: form.id, data: result.data, visitorId, ...attribution });

  const ua = req.headers.get("user-agent") ?? "";
  if (!isBot(ua)) {
    recordEvent({ type: "form_submit", path: "/", visitorId, sessionId, ...attribution, ua, meta: form.id });
  }

  const res = NextResponse.json({ ok: true });
  writeVisitor(res, { visitorId, sessionId });
  return res;
}
