"use client";

import { useEffect, useState } from "react";
import { getCountdown, type CountdownValues } from "@/lib/countdown";

const UNITS: [keyof Omit<CountdownValues, "isExpired">, string][] = [
  ["days", "дн"],
  ["hours", "ч"],
  ["minutes", "мин"],
  ["seconds", "сек"],
];

export default function Countdown({ target }: { target: string }) {
  const [time, setTime] = useState<CountdownValues | null>(null);

  useEffect(() => {
    setTime(getCountdown(target));
    const id = setInterval(() => setTime(getCountdown(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (time?.isExpired) {
    return <p className="text-[13px] text-white/70">Круглый стол прошёл. Оставьте заявку на следующий — пришлём приглашение.</p>;
  }

  return (
    <div className="flex gap-1.5 tabular-nums" aria-label="До начала">
      {UNITS.map(([key, label]) => (
        <div key={key} className="flex-1 rounded-lg bg-white/5 py-1.5 text-center">
          <b suppressHydrationWarning className="block font-heading text-xl font-semibold text-sky-300">
            {String(time?.[key] ?? 0).padStart(2, "0")}
          </b>
          <span className="text-[10px] uppercase tracking-wider text-white/50">{label}</span>
        </div>
      ))}
    </div>
  );
}
