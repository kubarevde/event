import type { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { csvResponse } from "@/lib/csv";
import { formatValue, statusLabel } from "@/lib/forms";
import { formatDateTime, resolveRange } from "@/lib/ranges";
import { getContent, getForm, listForms, listSubmissions } from "@/lib/store";

export async function GET(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const sp = req.nextUrl.searchParams;
  const formId = sp.get("form") || undefined;
  const status = sp.get("status") || undefined;
  const { utcOffset } = getContent().event;
  const range = sp.get("range") || sp.get("from") ? resolveRange(
    { range: sp.get("range") ?? undefined, from: sp.get("from") ?? undefined, to: sp.get("to") ?? undefined },
    utcOffset,
    0
  ) : null;

  const forms = formId ? [getForm(formId)].filter((f) => !!f) : listForms();
  const formNames = new Map(forms.map((f) => [f.id, f.name]));
  const columns = new Map<string, string>();
  for (const f of forms) for (const field of f.schema.fields) if (!columns.has(field.id)) columns.set(field.id, field.label);

  const rows = listSubmissions({ formId, status, from: range?.from, to: range?.to });
  const header = ["№", "Дата", "Форма", "Статус", ...columns.values(), "Комментарий менеджера", "utm_source", "utm_medium", "utm_campaign", "Источник перехода", "Город", "Регион", "Страна"];
  const body = rows.map((s) => [
    s.id,
    formatDateTime(s.createdAt, utcOffset),
    formNames.get(s.formId) ?? s.formId,
    statusLabel(s.status),
    ...[...columns.keys()].map((k) => formatValue(s.data[k])),
    s.note,
    s.utmSource,
    s.utmMedium,
    s.utmCampaign,
    s.referrerHost,
    s.city,
    s.region,
    s.country,
  ]);
  const date = new Date().toISOString().slice(0, 10);
  return csvResponse(`zayavki-${date}.csv`, [header, ...body]);
}
