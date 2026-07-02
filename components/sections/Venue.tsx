"use client";

import { Calendar, MapPin } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";
import { EVENT } from "@/data/event";

const YANDEX_MAPS_URL =
  "https://yandex.ru/maps/?ll=84.947600,56.467700&z=16&pt=84.947600,56.467700";

const YANDEX_MAP_WIDGET =
  "https://yandex.ru/map-widget/v1/?ll=84.947600%2C56.467700&z=16&pt=84.947600%2C56.467700~pmwtm1";

export default function Venue() {
  return (
    <AnimatedSection id="venue" className="bg-tgu-light py-16">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <MapPin className="h-8 w-8 text-tgu-gold" aria-hidden />
          <h3 className="mt-4 font-heading text-xl font-bold text-tgu-dark-text">
            Место проведения
          </h3>
          <p className="mt-3 font-heading text-lg font-bold text-tgu-dark-text">
            Главный корпус ТГУ, ауд. 209
          </p>
          <p className="mt-1 font-body text-sm text-tgu-dark-text/60">
            {EVENT.address}
          </p>
          <p className="mt-1 font-body text-sm text-tgu-dark-text/50">
            2 этаж, ауд. 209
          </p>

          <hr className="my-6 border-gray-100" />

          <div className="flex items-start gap-3">
            <Calendar
              className="mt-0.5 h-5 w-5 shrink-0 text-tgu-accent"
              aria-hidden
            />
            <p className="font-body text-tgu-dark-text">
              {EVENT.dateLabel}, {EVENT.time.replace(" по томскому времени", "")}
            </p>
          </div>

          <Button
            variant="outline"
            className="mt-6 text-tgu-dark-text"
            onClick={() => window.open(YANDEX_MAPS_URL, "_blank", "noopener")}
          >
            Открыть на карте →
          </Button>
        </div>

        <iframe
          src={YANDEX_MAP_WIDGET}
          width="100%"
          height={360}
          className="rounded-2xl border-0"
          allowFullScreen
          title="Карта — Главный корпус ТГУ"
        />
      </div>
    </AnimatedSection>
  );
}
