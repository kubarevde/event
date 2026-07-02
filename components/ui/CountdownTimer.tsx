"use client";

import { useEffect, useState } from "react";
import { getCountdown, type CountdownValues } from "@/lib/countdown";

interface CountdownTimerProps {
  targetDate: string | Date;
  compact?: boolean;
  dark?: boolean;
}

function TimeBlock({
  value,
  label,
  compact,
  dark,
}: {
  value: number;
  label: string;
  compact?: boolean;
  dark?: boolean;
}) {
  const boxClass = dark
    ? "border border-white/10 bg-white/5"
    : "border border-tgu-border bg-tgu-surface";

  if (compact) {
    return (
      <div className={`min-w-[48px] px-2 py-1.5 text-center ${boxClass}`}>
        <span
          suppressHydrationWarning
          className="block font-heading text-xl font-semibold tabular-nums text-tgu-brand"
        >
          {String(value).padStart(2, "0")}
        </span>
        <span className="text-[10px] uppercase tracking-wider text-tgu-muted">
          {label}
        </span>
      </div>
    );
  }

  return (
    <div className={`min-w-[64px] p-3 text-center ${boxClass}`}>
      <span
        suppressHydrationWarning
        className="block font-heading text-3xl font-semibold tabular-nums text-tgu-brand"
      >
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[10px] uppercase tracking-wider text-tgu-ink-secondary">
        {label}
      </span>
    </div>
  );
}

const PLACEHOLDER: CountdownValues = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  isExpired: false,
};

export default function CountdownTimer({
  targetDate,
  compact = false,
  dark = false,
}: CountdownTimerProps) {
  const [time, setTime] = useState<CountdownValues>(PLACEHOLDER);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTime(getCountdown(targetDate));
    const interval = setInterval(() => {
      setTime(getCountdown(targetDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (!mounted) {
    return (
      <div className={compact ? "space-y-2" : "space-y-3"} aria-hidden>
        <div className={`flex items-center ${compact ? "gap-1.5" : "gap-2"}`}>
          <TimeBlock value={0} label="дн" compact={compact} dark={dark} />
          <span className={`font-heading text-lg ${dark ? "text-white/45" : "text-tgu-border"}`}>:</span>
          <TimeBlock value={0} label="ч" compact={compact} dark={dark} />
          <span className={`font-heading text-lg ${dark ? "text-white/45" : "text-tgu-border"}`}>:</span>
          <TimeBlock value={0} label="мин" compact={compact} dark={dark} />
          <span className={`font-heading text-lg ${dark ? "text-white/45" : "text-tgu-border"}`}>:</span>
          <TimeBlock value={0} label="сек" compact={compact} dark={dark} />
        </div>
      </div>
    );
  }

  if (time.isExpired) {
    return (
      <p className={`font-body text-sm ${dark ? "text-tgu-muted" : "text-tgu-ink-secondary"}`}>
        Круглый стол начался
      </p>
    );
  }

  const sepClass = `font-heading text-lg ${dark ? "text-white/45" : "text-tgu-border"}`;

  return (
    <div className={compact ? "space-y-2" : "space-y-3"}>
      <div className={`flex items-center ${compact ? "gap-1.5" : "gap-2"}`}>
        <TimeBlock value={time.days} label="дн" compact={compact} dark={dark} />
        <span className={sepClass}>:</span>
        <TimeBlock value={time.hours} label="ч" compact={compact} dark={dark} />
        <span className={sepClass}>:</span>
        <TimeBlock value={time.minutes} label="мин" compact={compact} dark={dark} />
        <span className={sepClass}>:</span>
        <TimeBlock value={time.seconds} label="сек" compact={compact} dark={dark} />
      </div>
      {!compact && (
        <p className={`text-xs ${dark ? "text-tgu-muted" : "text-tgu-ink-secondary"}`}>
          до начала круглого стола
        </p>
      )}
    </div>
  );
}
