import { utcOffsetMinutes } from "./content";

export const RANGE_OPTIONS = [
  { value: "today", label: "Сегодня" },
  { value: "7", label: "7 дней" },
  { value: "30", label: "30 дней" },
  { value: "90", label: "90 дней" },
  { value: "all", label: "Всё время" },
] as const;

/** Полуинтервал [from, to) в мс, выровненный по полуночи часового пояса площадки. */
export function resolveRange(
  params: { range?: string; from?: string; to?: string },
  utcOffset: string,
  earliest?: number
) {
  const off = utcOffsetMinutes(utcOffset) * 60_000;
  const now = Date.now();
  const startOfDay = (ts: number) => Math.floor((ts + off) / 86_400_000) * 86_400_000 - off;
  const parseDay = (s?: string) => (s && /^\d{4}-\d{2}-\d{2}$/.test(s) ? Date.parse(`${s}T00:00:00Z`) - off : NaN);

  const from = parseDay(params.from);
  const to = parseDay(params.to);
  if (!Number.isNaN(from) && !Number.isNaN(to) && to >= from) {
    return { from, to: to + 86_400_000, key: "custom" };
  }

  const tomorrow = startOfDay(now) + 86_400_000;
  const range = params.range ?? "30";
  if (range === "today") return { from: startOfDay(now), to: tomorrow, key: range };
  if (range === "all") {
    return { from: startOfDay(Math.min(earliest ?? now, now - 6 * 86_400_000)), to: tomorrow, key: range };
  }
  const days = ["7", "30", "90"].includes(range) ? Number(range) : 30;
  return { from: tomorrow - days * 86_400_000, to: tomorrow, key: String(days) };
}

export function formatDateTime(ts: number, utcOffset: string) {
  const d = new Date(ts + utcOffsetMinutes(utcOffset) * 60_000);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getUTCDate())}.${p(d.getUTCMonth() + 1)}.${d.getUTCFullYear()} ${p(d.getUTCHours())}:${p(d.getUTCMinutes())}`;
}
