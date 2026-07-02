"use client";

import { useState } from "react";
import { ChevronDown, MapPin } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";
import SectionTitle from "@/components/ui/SectionTitle";
import { EVENT } from "@/data/event";

const FAQ_ITEMS = [
  {
    q: "Кто может подать заявку?",
    a: "Закрытый круглый стол предназначен для представителей ИТ-компаний: вендоров, интеграторов, разработчиков ПО и поставщиков инфраструктурных решений. Формат B2B — не для частных лиц и студентов.",
  },
  {
    q: "Как проходит отбор участников?",
    a: "После подачи заявки мы связываемся в течение 1 рабочего дня, уточняем профиль компании и формат участия. Оплата производится только после подтверждения.",
  },
  {
    q: "Что входит в стоимость участия?",
    a: "Доступ к круглому столу (очно или онлайн), запись мероприятия, презентационные материалы и возможность задать вопросы напрямую представителям ТГУ.",
  },
  {
    q: "Куда поступает взнос?",
    a: "Средства направляются в Эндаумент-фонд ТГУ в рамках программы поддержки цифровой трансформации университета.",
  },
  {
    q: "Можно ли направить несколько сотрудников?",
    a: "Да. Укажите в заявке контактное лицо — мы согласуем состав делегации и формат присутствия для каждого участника.",
  },
];

const MAP_LON = 84.947568;
const MAP_LAT = 56.469463;
const MAP_URL = `https://yandex.ru/maps/?ll=${MAP_LON},${MAP_LAT}&z=17&pt=${MAP_LON},${MAP_LAT}`;
const MAP_WIDGET = `https://yandex.ru/map-widget/v1/?ll=${MAP_LON}%2C${MAP_LAT}&z=17&pt=${MAP_LON}%2C${MAP_LAT},pm2rdm`;

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <AnimatedSection id="faq" className="border-t border-tgu-border bg-tgu-surface py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-6">
        <SectionTitle
          eyebrow="Организация"
          title="Вопросы и детали проведения"
          subtitle="Ответы на типичные вопросы коммерческих команд и информация о площадке."
          accent
        />

        <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
          <div className="divide-y divide-tgu-border border border-tgu-border">
            {FAQ_ITEMS.map((item, i) => (
              <div key={item.q}>
                <button
                  type="button"
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="font-heading text-sm font-semibold text-tgu-dark-text">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-tgu-brand transition-transform ${
                      open === i ? "rotate-180" : ""
                    }`}
                    aria-hidden
                  />
                </button>
                {open === i && (
                  <p className="px-5 pb-4 font-body text-sm leading-relaxed text-tgu-ink-secondary">
                    {item.a}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div id="venue">
            <div className="border border-tgu-border bg-tgu-light p-6">
              <MapPin className="h-5 w-5 text-tgu-brand" strokeWidth={1.75} aria-hidden />
              <h3 className="mt-3 font-heading text-base font-semibold text-tgu-dark-text">
                {EVENT.venue}
              </h3>
              <p className="mt-1 font-body text-sm text-tgu-ink-secondary">{EVENT.address}</p>
              <p className="mt-3 font-body text-sm text-tgu-dark-text">
                {EVENT.dateLabel}, 10:00
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 border-tgu-border text-tgu-dark-text"
                onClick={() => window.open(MAP_URL, "_blank", "noopener")}
              >
                Открыть на карте
              </Button>
            </div>
            <iframe
              src={MAP_WIDGET}
              width="100%"
              height={280}
              className="mt-4 border border-tgu-border"
              allowFullScreen
              title="Карта — ТГУ"
            />
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
