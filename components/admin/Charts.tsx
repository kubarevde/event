"use client";

import { useState } from "react";

const fmtDay = (day: string) => {
  const [, m, d] = day.split("-");
  return `${d}.${m}`;
};

/** Столбчатая диаграмма одной величины по дням с подсказкой при наведении. */
export function DailyBars({
  data,
  label,
}: {
  data: { day: string; value: number }[];
  label: string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(1, ...data.map((d) => d.value));
  const ticks = max >= 4 ? [max, Math.round(max / 2), 0] : [max, "", 0];
  const labelEvery = Math.ceil(data.length / 10);

  return (
    <div className="relative">
      <div className="flex gap-2">
        <div className="flex h-40 flex-col justify-between py-0 text-right text-[11px] tabular-nums text-slate-400">
          {ticks.map((t, i) => (
            <span key={i} className="-translate-y-1/2 first:translate-y-0 last:translate-y-0">
              {t}
            </span>
          ))}
        </div>
        <div className="relative min-w-0 flex-1">
          <div className="absolute inset-x-0 top-0 h-40 border-b border-slate-200">
            <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-slate-100" />
          </div>
          <div className="relative flex h-40 items-end gap-[2px]" onMouseLeave={() => setHover(null)}>
            {data.map((d, i) => (
              <div
                key={d.day}
                className="flex h-full min-w-0 flex-1 items-end"
                onMouseEnter={() => setHover(i)}
              >
                <div
                  className={`w-full rounded-t-[4px] transition-colors ${hover === i ? "bg-tgu-brand-dark" : "bg-tgu-brand"}`}
                  style={{ height: `${(d.value / max) * 100}%`, minHeight: d.value ? 2 : 0 }}
                />
              </div>
            ))}
          </div>
          <div className="mt-1.5 flex gap-[2px] text-[10px] text-slate-400">
            {data.map((d, i) => (
              <span key={d.day} className="min-w-0 flex-1 overflow-visible whitespace-nowrap text-center">
                {i % labelEvery === 0 ? fmtDay(d.day) : ""}
              </span>
            ))}
          </div>
          {hover !== null && data[hover] && (
            <div
              className="pointer-events-none absolute -top-2 z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md bg-slate-900 px-2.5 py-1.5 text-xs text-white shadow-lg"
              style={{ left: `${((hover + 0.5) / data.length) * 100}%` }}
            >
              <span className="text-slate-300">{fmtDay(data[hover].day)}</span> · {label}:{" "}
              <span className="font-semibold tabular-nums">{data[hover].value}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/** Горизонтальные полосы для разбивок (источники, устройства, воронка). */
export function BarList({
  items,
  total,
  empty = "Нет данных",
}: {
  items: { label: string; value: number; hint?: string }[];
  total?: number;
  empty?: string;
}) {
  if (items.length === 0) return <p className="py-4 text-sm text-slate-400">{empty}</p>;
  const max = Math.max(1, ...items.map((i) => i.value));
  const sum = total ?? items.reduce((a, b) => a + b.value, 0);
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.label} title={`${item.label}: ${item.value}`}>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="truncate text-slate-700">{item.label}</span>
            <span className="shrink-0 tabular-nums text-slate-900">
              {item.value}
              <span className="ml-1.5 text-xs text-slate-400">
                {item.hint ?? (sum ? `${Math.round((item.value / sum) * 100)}%` : "")}
              </span>
            </span>
          </div>
          <div className="mt-1 h-1.5 rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-tgu-brand" style={{ width: `${(item.value / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Активность по часам суток (локальное время площадки). */
export function HourStrip({ hours }: { hours: number[] }) {
  const max = Math.max(1, ...hours);
  return (
    <div>
      <div className="grid grid-cols-12 gap-[2px] sm:grid-cols-[repeat(24,minmax(0,1fr))]">
        {hours.map((n, h) => (
          <div
            key={h}
            title={`${String(h).padStart(2, "0")}:00 — ${n} просмотров`}
            className="h-8 rounded-[3px] bg-tgu-brand"
            style={{ opacity: n ? 0.15 + (n / max) * 0.85 : 0.06 }}
          />
        ))}
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-slate-400">
        <span>00:00</span>
        <span>12:00</span>
        <span>23:00</span>
      </div>
    </div>
  );
}
