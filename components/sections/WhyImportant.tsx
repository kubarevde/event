"use client";

import {
  Briefcase,
  Clock,
  Handshake,
  LineChart,
  Shield,
} from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionTitle from "@/components/ui/SectionTitle";

const REASONS = [
  {
    icon: LineChart,
    title: "Закупки без сюрпризов",
    text: "Поймёте приоритеты бюджета до выхода документации на торговые площадки — и сможете подготовить релевантное предложение заранее.",
  },
  {
    icon: Handshake,
    title: "Диалог вместо холодного входа",
    text: "Встреча с представителями ТГУ в формате доверительного круглого стола, а не через общий email или тендер на поздней стадии.",
  },
  {
    icon: Briefcase,
    title: "Коммерческий фокус",
    text: "Круглый стол создан для sales, аккаунтов и коммерческих директоров — с языком бизнеса, а не только технических спецификаций.",
  },
  {
    icon: Shield,
    title: "Институциональный статус",
    text: "Участие в закрытой программе ТГУ — сигнал серьёзности для клиентов и партнёров вашей компании.",
  },
];

const STATS = [
  { value: "2×", label: "круглых стола в год" },
  { value: "2027", label: "горизонт планирования" },
  { value: "1 день", label: "подтверждение заявки" },
];

export default function WhyImportant() {
  return (
    <AnimatedSection id="why" className="border-b border-tgu-border bg-tgu-surface py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-6">
        <SectionTitle
          eyebrow="Для ИТ-компаний"
          title="Почему это важно для вашего бизнеса"
          subtitle="ТГУ формирует цифровую повестку на годы вперёд. Участие даёт коммерческому блоку преимущество времени, контекста и доступа."
          accent
          align="left"
        />

        <div className="grid gap-10 lg:grid-cols-[1fr_280px]">
          <div className="grid gap-6 sm:grid-cols-2">
            {REASONS.map(({ icon: Icon, title, text }) => (
              <article
                key={title}
                className="border border-tgu-border bg-tgu-light p-6 transition-shadow duration-200 hover:shadow-card-hover"
              >
                <Icon
                  className="h-5 w-5 text-tgu-brand"
                  strokeWidth={1.75}
                  aria-hidden
                />
                <h3 className="mt-4 font-heading text-base font-semibold text-tgu-dark-text">
                  {title}
                </h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-tgu-ink-secondary">
                  {text}
                </p>
              </article>
            ))}
          </div>

          <aside className="flex flex-col justify-between border border-tgu-border bg-tgu-brand p-6 text-white">
            <div>
              <Clock className="h-5 w-5 opacity-80" strokeWidth={1.75} aria-hidden />
              <p className="mt-4 font-heading text-lg font-semibold leading-snug">
                Окно возможностей ограничено
              </p>
              <p className="mt-3 font-body text-sm leading-relaxed text-white/75">
                Закрытый формат и лимит мест. Компании, которые подключатся
                сейчас, получают приоритет в коммуникации с командой цифровой
                трансформации.
              </p>
            </div>
            <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-white/20 pt-6">
              {STATS.map(({ value, label }) => (
                <div key={label}>
                  <dt className="font-heading text-xl font-semibold">{value}</dt>
                  <dd className="mt-1 font-body text-[11px] leading-tight text-white/65">
                    {label}
                  </dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </div>
    </AnimatedSection>
  );
}
