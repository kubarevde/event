"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  Lock,
  MapPin,
  Monitor,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import Button from "@/components/ui/Button";
import CountdownTimer from "@/components/ui/CountdownTimer";
import LogoSlot from "@/components/ui/LogoSlot";
import { EVENT } from "@/data/event";

const BULLETS = [
  {
    icon: Target,
    text: "Планы ИТ-закупок 2027 до публикации тендеров",
  },
  {
    icon: Users,
    text: "Прямой контакт с ЛПР цифровой повестки ТГУ",
  },
  {
    icon: TrendingUp,
    text: "Ранний вход в приоритетные направления развития",
  },
];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen bg-tgu-dark pt-28 md:pt-32"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,114,188,0.08)_0%,transparent_40%)]"
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-5 py-12 md:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <LogoSlot size="hero" />
            <span className="inline-block border border-white/20 px-2.5 py-0.5 font-body text-[11px] font-medium uppercase tracking-wide text-white/80">
              Закрытая B2B-сессия
            </span>
            <span className="flex items-center gap-1.5 font-body text-xs text-white/50">
              <Lock className="h-3.5 w-3.5" aria-hidden />
              Только для ИТ-вендоров и интеграторов
            </span>
          </div>

          <h1 className="max-w-xl font-heading text-3xl font-semibold leading-[1.15] tracking-tight text-white sm:text-4xl lg:text-[2.75rem]">
            {EVENT.title}
          </h1>

          <p className="mt-5 max-w-lg font-body text-base leading-relaxed text-white/65 md:text-lg">
            Стратегическая сессия для коммерческих команд: узнайте, куда ТГУ
            направляет ИТ-бюджеты в 2027 году, и выстройте диалог до этапа
            тендера.
          </p>

          <ul className="mt-8 space-y-3">
            {BULLETS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3">
                <Icon
                  className="mt-0.5 h-4 w-4 shrink-0 text-tgu-brand"
                  strokeWidth={1.75}
                  aria-hidden
                />
                <span className="font-body text-sm text-white/80">{text}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button
              variant="primary"
              size="lg"
              onClick={() => scrollTo("registration")}
            >
              Подать заявку
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/5"
              onClick={() => scrollTo("formats")}
            >
              Форматы участия
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="border border-white/10 bg-tgu-dark-elevated/80 p-6 md:p-8"
        >
          <p className="font-body text-xs font-semibold uppercase tracking-widest text-tgu-brand">
            Параметры сессии
          </p>

          <div className="mt-6 space-y-4">
            <div className="flex gap-4 border-b border-white/10 pb-4">
              <Calendar className="h-5 w-5 shrink-0 text-tgu-brand" strokeWidth={1.75} aria-hidden />
              <div>
                <p className="font-body text-sm text-white/50">Дата и время</p>
                <p className="mt-0.5 font-body text-sm font-medium text-white">
                  {EVENT.dateLabel} · 10:00 (Томск)
                </p>
              </div>
            </div>

            <div className="flex gap-4 border-b border-white/10 pb-4">
              <MapPin className="h-5 w-5 shrink-0 text-tgu-brand" strokeWidth={1.75} aria-hidden />
              <div>
                <p className="font-body text-sm text-white/50">Локация</p>
                <p className="mt-0.5 font-body text-sm font-medium text-white">
                  {EVENT.venue}
                </p>
                <p className="font-body text-xs text-white/45">{EVENT.address}</p>
              </div>
            </div>

            <div className="flex gap-4 border-b border-white/10 pb-4">
              <Monitor className="h-5 w-5 shrink-0 text-tgu-brand" strokeWidth={1.75} aria-hidden />
              <div>
                <p className="font-body text-sm text-white/50">Формат</p>
                <p className="mt-0.5 font-body text-sm font-medium text-white">
                  Очно + онлайн-трансляция
                </p>
              </div>
            </div>

            <div className="flex items-baseline justify-between gap-4 pt-1">
              <div>
                <p className="font-body text-sm text-white/50">Участие</p>
                <p className="mt-0.5 font-heading text-xl font-semibold text-white">
                  {EVENT.price}
                </p>
                <p className="font-body text-xs text-white/45">{EVENT.priceNote}</p>
              </div>
              <p className="text-right font-body text-xs text-tgu-warm">
                Мест ограничено
              </p>
            </div>
          </div>

          <div className="mt-8 border-t border-white/10 pt-6">
            <p className="mb-3 font-body text-xs text-white/50">До начала сессии</p>
            <CountdownTimer targetDate={EVENT.date} compact dark />
          </div>
        </motion.div>
      </div>
    </section>
  );
}