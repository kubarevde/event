"use client";

import { Check, MapPin, Monitor, Wallet } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";
import SectionTitle from "@/components/ui/SectionTitle";
import { EVENT } from "@/data/event";

const IN_PERSON = [
  "Ауд. 209, Главный корпус ТГУ",
  "Нетворкинг с коллегами отрасли",
  "Прямой диалог с ЛПР",
  "Кофе-пауза и неформальное общение",
];

const ONLINE = [
  "Прямая трансляция сессии",
  "Запись и материалы после мероприятия",
  "Чат Q&A в реальном времени",
  "Доступ для удалённой команды",
];

function List({ items }: { items: string[] }) {
  return (
    <ul className="mt-5 space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5 font-body text-sm text-tgu-ink-secondary">
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-tgu-brand" strokeWidth={2} aria-hidden />
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function Formats() {
  return (
    <AnimatedSection id="formats" className="bg-tgu-dark py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-6">
        <SectionTitle
          eyebrow="Форматы"
          title="Как участвовать"
          subtitle="Выберите модель присутствия для вашей команды. Оба формата дают доступ к содержанию сессии и материалам."
          light
          accent
        />

        <div className="grid gap-5 lg:grid-cols-2">
          <article className="border border-white/10 bg-tgu-dark-elevated p-7">
            <MapPin className="h-5 w-5 text-tgu-brand" strokeWidth={1.75} aria-hidden />
            <h3 className="mt-4 font-heading text-lg font-semibold text-white">
              Очное участие
            </h3>
            <p className="mt-2 font-body text-sm text-white/55">
              Рекомендуется для коммерческих директоров и аккаунт-лидов
            </p>
            <List items={IN_PERSON} />
          </article>

          <article className="border border-white/10 bg-tgu-dark-elevated p-7">
            <Monitor className="h-5 w-5 text-tgu-brand" strokeWidth={1.75} aria-hidden />
            <h3 className="mt-4 font-heading text-lg font-semibold text-white">
              Онлайн-участие
            </h3>
            <p className="mt-2 font-body text-sm text-white/55">
              Для распределённых команд и технических специалистов
            </p>
            <List items={ONLINE} />
          </article>
        </div>

        <div className="mt-8 grid gap-6 border border-tgu-brand/30 bg-tgu-brand/10 p-7 md:grid-cols-[1fr_auto] md:items-center">
          <div className="flex gap-4">
            <Wallet className="h-5 w-5 shrink-0 text-tgu-brand" strokeWidth={1.75} aria-hidden />
            <div>
              <p className="font-heading text-2xl font-semibold text-white md:text-3xl">
                {EVENT.price}
              </p>
              <p className="mt-1 font-body text-sm text-white/65">{EVENT.priceNote}</p>
              <p className="mt-2 font-body text-xs text-white/45">
                Одна квалифицированная встреча с ЛПР окупает годовой взнос
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            size="lg"
            onClick={() =>
              document.getElementById("registration")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Подать заявку
          </Button>
        </div>
      </div>
    </AnimatedSection>
  );
}
