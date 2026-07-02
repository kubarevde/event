"use client";

import {
  CalendarPlus,
  Check,
  Shield,
} from "lucide-react";
import Button from "@/components/ui/Button";
import CountdownTimer from "@/components/ui/CountdownTimer";
import SectionTitle from "@/components/ui/SectionTitle";
import YandexFormEmbed from "@/components/ui/YandexFormEmbed";
import { EVENT } from "@/data/event";
const OFFER_ITEMS = [
  "Доступ к закрытому круглому столу и материалам",
  "Подтверждение заявки за 1 рабочий день",
  "Оплата только после согласования участия",
  "Запись и презентации для вашей команды",
];

const ICS = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:Цифра ТГУ: роадмэп, закупки и приоритеты 2027
DTSTART:20261014T030000Z
DTEND:20261014T070000Z
LOCATION:Главный корпус ТГУ, пр. Ленина 36, Томск
DESCRIPTION:Круглый стол для ИТ-вендоров ТГУ
END:VEVENT
END:VCALENDAR`;

function downloadCalendar() {
  const blob = new Blob([ICS], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "tgu-digital-2026.ics";
  a.click();
  URL.revokeObjectURL(url);
}

export default function Registration() {
  return (
    <section id="registration" className="relative bg-tgu-dark py-20 md:py-28">
      <div className="absolute inset-x-0 top-0 h-px bg-tgu-brand" aria-hidden />
      <div className="mx-auto max-w-7xl px-5 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <SectionTitle
              eyebrow="Регистрация"
              title="Забронируйте место за круглым столом"
              subtitle="Следующий круглый стол — 14 октября 2026. Количество участников ограничено для сохранения формата закрытого диалога."
              light
              accent
              align="left"
            />

            <ul className="space-y-3">
              {OFFER_ITEMS.map((text) => (
                <li key={text} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-tgu-brand" strokeWidth={2} aria-hidden />
                  <span className="font-body text-sm text-white/75">{text}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex items-start gap-3 border border-white/10 p-4">
              <Shield className="h-4 w-4 shrink-0 text-tgu-brand" strokeWidth={1.75} aria-hidden />
              <p className="font-body text-xs leading-relaxed text-white/65">
                Подача заявки бесплатна. Мы связываемся только по деловым вопросам
                участия. Данные обрабатываются в соответствии с политикой ТГУ.
              </p>
            </div>

            <Button
              variant="outline"
              className="mt-6 border-white/30 text-white hover:bg-white/5"
              onClick={downloadCalendar}
            >
              <CalendarPlus className="mr-2 h-4 w-4" aria-hidden />
              Добавить в календарь
            </Button>

            <div className="mt-8">
              <p className="mb-3 font-body text-xs text-white/65">До начала круглого стола</p>
              <CountdownTimer targetDate={EVENT.date} compact dark />
            </div>
          </div>

          <div className="border border-white/10 bg-tgu-dark-elevated/80 p-6 md:p-8">
            <p className="font-body text-xs font-semibold uppercase tracking-widest text-tgu-brand">
              Заявка на участие
            </p>

            <div className="mt-6 border-t border-white/10 pt-6">
              <YandexFormEmbed />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
