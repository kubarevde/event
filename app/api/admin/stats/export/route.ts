import type { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { getStats } from "@/lib/analytics";
import { utcOffsetMinutes } from "@/lib/content";
import { csvResponse } from "@/lib/csv";
import { getDb } from "@/lib/db";
import { resolveRange } from "@/lib/ranges";
import { getContent } from "@/lib/store";

export async function GET(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const sp = req.nextUrl.searchParams;
  const { utcOffset } = getContent().event;
  const earliest = (getDb().prepare("SELECT MIN(ts) AS t FROM events").get() as { t: number | null }).t ?? undefined;
  const { from, to } = resolveRange(
    { range: sp.get("range") ?? undefined, from: sp.get("from") ?? undefined, to: sp.get("to") ?? undefined },
    utcOffset,
    earliest
  );
  const s = getStats(from, to, utcOffsetMinutes(utcOffset));
  const conv = (n: number) => (s.totals.visitors ? `${((n / s.totals.visitors) * 100).toFixed(1)}%` : "0%");

  const rows: (string | number)[][] = [
    ["Показатель", "Значение"],
    ["Просмотры", s.totals.pageviews],
    ["Уникальные посетители", s.totals.visitors],
    ["Визиты", s.totals.sessions],
    ["Нажатия на кнопки «Подать заявку»", s.totals.ctaClicks],
    ["Визиты, где увидели форму", s.totals.formViews],
    ["Визиты, где начали заполнять форму", s.totals.formStarts],
    ["Заявки", s.totals.submissions],
    ["Конверсия посетитель → заявка", conv(s.totals.submissions)],
    [],
    ["Дата", "Просмотры", "Посетители", "Заявки"],
    ...s.days.map((d) => [d.day.split("-").reverse().join("."), d.pageviews, d.visitors, d.submissions]),
    [],
    ["Источник", "Визиты"],
    ...s.referrers.map((r) => [r.label, r.value]),
    [],
    ["UTM (source / medium / campaign)", "Визиты"],
    ...s.utm.map((r) => [r.label, r.value]),
    [],
    ["Устройство", "Визиты"],
    ...s.devices.map((r) => [r.label, r.value]),
    [],
    ["Браузер", "Визиты"],
    ...s.browsers.map((r) => [r.label, r.value]),
  ];
  return csvResponse(`statistika-${new Date().toISOString().slice(0, 10)}.csv`, rows);
}
