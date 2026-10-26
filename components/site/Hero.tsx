"use client";

import { eventStart } from "@/lib/content";
import Countdown from "./Countdown";
import { Cta, List, T, useSite } from "./edit";

/** Дата из "2026-10-14T10:00": число, месяц с годом и день недели. */
function dateParts(startLocal: string) {
  const d = new Date(`${startLocal}:00Z`);
  if (Number.isNaN(d.getTime())) return { day: "", month: "", weekday: "" };
  const opts = { timeZone: "UTC" } as const;
  const dayMonth = d.toLocaleDateString("ru-RU", { ...opts, day: "numeric", month: "long" });
  return {
    day: String(d.getUTCDate()),
    month: `${dayMonth.replace(/^\d+\s*/, "")} ${d.getUTCFullYear()}`,
    weekday: d.toLocaleDateString("ru-RU", { ...opts, weekday: "long" }),
  };
}

function Title() {
  const { c, editing } = useSite();
  if (editing) return <T path="event.title" />;
  const { title, titleAccent } = c.event;
  const i = titleAccent ? title.indexOf(titleAccent) : -1;
  if (i < 0) return <>{title}</>;
  return (
    <>
      {title.slice(0, i)}
      <span className="text-sky-300">{titleAccent}</span>
      {title.slice(i + titleAccent.length)}
    </>
  );
}

export default function Hero() {
  const { c, editing } = useSite();
  const { event } = c;
  const { day, month, weekday } = dateParts(event.startLocal);
  const total = Number(event.seatsTotal);
  const left = Number(event.seatsLeft);
  const showSeats = event.seatsTotal !== "" && event.seatsLeft !== "" && total > 0 && left >= 0;
  const reg = c.registration.enabled;

  return (
    <section className="relative overflow-hidden bg-tgu-dark text-white">
      <div className="hero-bg pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-5 py-9 md:py-14 lg:grid-cols-[1.25fr_0.9fr] lg:gap-12 lg:pb-16">
        <div>
          <div className="mb-5 flex flex-wrap gap-2">
            {(c.hero.badge || editing) && (
              <span className="rounded-full border border-white/20 px-2.5 py-1 text-xs font-medium text-white/85">
                <T path="hero.badge" />
              </span>
            )}
            {(c.hero.audienceNote || editing) && (
              <span className="rounded-full border border-white/20 px-2.5 py-1 text-xs font-medium text-white/85">
                <span className="mr-1.5 text-[9px] text-tgu-warm">●</span>
                <T path="hero.audienceNote" />
              </span>
            )}
          </div>
          <h1 className="max-w-[15ch] font-heading text-[clamp(30px,4.4vw,52px)] font-semibold leading-[1.12] tracking-tight text-balance">
            <Title />
          </h1>
          {editing && (
            <p className="mt-2 text-xs text-white/50">
              Выделенная цветом часть: <T path="event.titleAccent" className="text-sky-300" />
            </p>
          )}
          <T path="hero.subtitle" as="p" multiline className="mt-4 block max-w-[54ch] text-[15.5px] text-white/75 md:text-[17px]" />
          <List path="hero.points" newItem="Новый тезис" addLabel="Тезис" as="ul" className="mt-6 grid gap-2.5">
            {(_, i, controls) => (
              <li key={i} className="relative flex items-start gap-2.5 text-[15px] text-white/90">
                {controls}
                <span className="check-dot" aria-hidden />
                <T path={`hero.points.${i}`} />
              </li>
            )}
          </List>
          <div className="mt-8 flex flex-wrap gap-3">
            {reg && <Cta path="hero.primaryCta" action="form" className="btn btn-primary" />}
            <Cta path="hero.secondaryCta" action={{ scrollTo: c.hero.secondaryTarget }} className="btn btn-ghost hidden sm:inline-flex" />
          </div>
        </div>

        <aside className="overflow-hidden rounded-2xl border border-white/10 bg-tgu-dark-elevated" aria-label="Параметры круглого стола">
          <div className="ticket-cut grid grid-cols-[auto_1fr] items-end gap-x-5 gap-y-1 border-b border-dashed border-white/20 px-5 py-4 md:px-6 md:py-5">
            <span className="row-span-2 font-heading text-5xl font-bold leading-[0.9] tracking-tight md:text-[64px]">{day}</span>
            <span className="font-heading text-xl font-semibold">{month}</span>
            <span className="text-sm text-white/65">
              {weekday} · <T path="event.timeLabel" />
            </span>
          </div>
          <div className="hidden px-6 py-2 sm:block">
            <div className="flex justify-between gap-4 border-b border-white/[0.07] py-3 text-sm">
              <span className="text-white/55">Место</span>
              <b className="text-right font-medium">
                <T path="event.venue" />, <T path="event.address" />
              </b>
            </div>
            <div className="flex justify-between gap-4 py-3 text-sm">
              <span className="text-white/55">Формат</span>
              <b className="text-right font-medium">
                <T path="event.format" />
              </b>
            </div>
          </div>
          <div className="grid gap-3.5 bg-tgu-brand/[0.12] px-5 pb-5 pt-4 md:px-6">
            {(event.price || editing) && (
              <div className="flex items-baseline justify-between gap-3">
                <T path="event.price" className="font-heading text-[28px] font-semibold" />
                <T path="event.priceNote" className="max-w-[22ch] text-right text-xs text-white/60" />
              </div>
            )}
            {showSeats && (
              <div className="text-[13px] text-white/75">
                Осталось <b>{left} мест</b> из {total}
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10" role="img" aria-label={`Занято ${total - left} из ${total} мест`}>
                  <i
                    className="block h-full rounded-full bg-gradient-to-r from-tgu-brand to-sky-400"
                    style={{ width: `${Math.min(100, Math.max(4, ((total - left) / total) * 100))}%` }}
                  />
                </div>
              </div>
            )}
            {editing && !showSeats && (
              <p className="text-xs text-white/50">Счётчик мест скрыт — заполните «Всего мест» и «Осталось мест» в настройках.</p>
            )}
            <div className="hidden sm:block">
              <Countdown target={eventStart(c).toISOString()} />
            </div>
            {reg && <Cta path="hero.ticketCta" action="form" className="btn btn-primary hidden w-full sm:flex" />}
          </div>
        </aside>
      </div>
    </section>
  );
}
