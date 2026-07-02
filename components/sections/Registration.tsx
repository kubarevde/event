"use client";

import { useForm } from "@formspree/react";
import { motion } from "framer-motion";
import {
  CalendarPlus,
  Check,
  CheckCircle2,
  ClipboardList,
  Loader2,
  Shield,
} from "lucide-react";
import { FormEvent, useState } from "react";
import Button from "@/components/ui/Button";
import CountdownTimer from "@/components/ui/CountdownTimer";
import SectionTitle from "@/components/ui/SectionTitle";
import { EVENT } from "@/data/event";

const INPUT_CLASS =
  "w-full border border-tgu-border bg-tgu-surface px-4 py-3 font-body text-sm text-tgu-dark-text transition-colors duration-200 focus:border-tgu-brand focus:outline-none focus:ring-2 focus:ring-tgu-brand/20";

const FORMAT_OPTIONS = ["Очно", "Онлайн", "Пока не определился"] as const;

const OFFER_ITEMS = [
  "Доступ к закрытой сессии и материалам",
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
LOCATION:Ауд. 209, Главный корпус ТГУ, пр. Ленина 36, Томск
DESCRIPTION:Закрытая сессия для ИТ-вендоров ТГУ
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

function SuccessState({ email }: { email: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-8 text-center"
    >
      <CheckCircle2 className="mx-auto h-12 w-12 text-tgu-brand" aria-hidden />
      <h3 className="mt-4 font-heading text-xl font-semibold text-tgu-dark-text">
        Заявка принята
      </h3>
      <p className="mt-2 font-body text-sm text-tgu-ink-secondary">
        Свяжемся с вами на <span className="font-medium text-tgu-dark-text">{email}</span> в
        течение 1 рабочего дня.
      </p>
      <Button
        variant="outline"
        className="mt-6 border-tgu-border text-tgu-dark-text"
        onClick={downloadCalendar}
      >
        <CalendarPlus className="mr-2 h-4 w-4" aria-hidden />
        Добавить в календарь
      </Button>
    </motion.div>
  );
}

function RegistrationForm({ formId }: { formId: string }) {
  const [state, handleSubmit] = useForm(formId);
  const [email, setEmail] = useState("");
  const [format, setFormat] = useState<string>(FORMAT_OPTIONS[0]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    const input = e.currentTarget.elements.namedItem("email") as HTMLInputElement;
    if (input?.value) setEmail(input.value);
    handleSubmit(e);
  };

  const hasErrors =
    state.errors != null &&
    (Array.isArray(state.errors)
      ? state.errors.length > 0
      : Object.keys(state.errors).length > 0);

  if (state.succeeded) {
    return <SuccessState email={email || "указанный email"} />;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <input type="hidden" name="_subject" value="Новая заявка: Цифра ТГУ 2026" />

      <label className="block">
        <span className="mb-1.5 block font-body text-sm font-medium text-tgu-dark-text">
          Название компании *
        </span>
        <input name="company" type="text" required placeholder="ООО Ромашка" autoComplete="organization" className={INPUT_CLASS} />
      </label>

      <label className="block">
        <span className="mb-1.5 block font-body text-sm font-medium text-tgu-dark-text">
          Контактное лицо *
        </span>
        <input name="name" type="text" required placeholder="Иван Иванов" autoComplete="name" className={INPUT_CLASS} />
      </label>

      <label className="block">
        <span className="mb-1.5 block font-body text-sm font-medium text-tgu-dark-text">
          Email *
        </span>
        <input name="email" type="email" required placeholder="ivan@company.ru" autoComplete="email" className={INPUT_CLASS} />
      </label>

      <fieldset>
        <legend className="mb-2 font-body text-sm font-medium text-tgu-dark-text">
          Формат участия *
        </legend>
        <div className="flex flex-wrap gap-2">
          {FORMAT_OPTIONS.map((opt) => (
            <label key={opt} className="cursor-pointer">
              <input
                type="radio"
                name="format"
                value={opt}
                required
                checked={format === opt}
                onChange={() => setFormat(opt)}
                className="peer sr-only"
              />
              <span className="inline-block border border-tgu-border px-3 py-2 font-body text-sm text-tgu-ink-secondary transition-colors peer-checked:border-tgu-brand peer-checked:bg-tgu-brand peer-checked:text-white">
                {opt}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="flex cursor-pointer items-start gap-2.5">
        <input type="checkbox" name="consent" required className="mt-1 h-4 w-4 accent-tgu-brand" />
        <span className="font-body text-sm text-tgu-ink-secondary">
          Даю согласие на{" "}
          <a href="#" className="text-tgu-brand hover:underline">
            обработку персональных данных
          </a>{" "}
          *
        </span>
      </label>

      <Button type="submit" variant="primary" size="lg" className="w-full" disabled={state.submitting}>
        {state.submitting ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Отправляем...
          </span>
        ) : (
          "Подать заявку"
        )}
      </Button>

      {hasErrors && (
        <p className="text-center font-body text-sm text-red-600" role="alert">
          Произошла ошибка. Попробуйте ещё раз.
        </p>
      )}
    </form>
  );
}

export default function Registration() {
  const formId = process.env.NEXT_PUBLIC_FORMSPREE_ID;

  return (
    <section id="registration" className="relative bg-tgu-dark py-20 md:py-28">
      <div className="absolute inset-x-0 top-0 h-px bg-tgu-brand" aria-hidden />

      <div className="mx-auto max-w-7xl px-5 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <SectionTitle
              eyebrow="Регистрация"
              title="Забронируйте место на сессии"
              subtitle="Следующая сессия — 14 октября 2026. Количество участников ограничено для сохранения формата закрытого диалога."
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
              <p className="font-body text-xs leading-relaxed text-white/50">
                Подача заявки бесплатна. Мы связываемся только по деловым вопросам
                участия. Данные обрабатываются в соответствии с политикой ТГУ.
              </p>
            </div>

            <div className="mt-8">
              <p className="mb-3 font-body text-xs text-white/45">До начала сессии</p>
              <CountdownTimer targetDate={EVENT.date} compact dark />
            </div>
          </div>

          <div className="border border-tgu-border bg-tgu-surface p-7 md:p-8">
            <div className="mb-6 flex items-center gap-2 border-b border-tgu-border pb-4">
              <ClipboardList className="h-4 w-4 text-tgu-brand" strokeWidth={1.75} aria-hidden />
              <p className="font-body text-sm font-medium text-tgu-dark-text">
                Заявка на участие
              </p>
            </div>

            {formId ? (
              <RegistrationForm formId={formId} />
            ) : (
              <p className="font-body text-sm text-tgu-ink-secondary">
                Укажите <code className="text-tgu-brand">NEXT_PUBLIC_FORMSPREE_ID</code> в{" "}
                <code>.env.local</code> для активации формы.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
