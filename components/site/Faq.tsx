"use client";

import { MapPin } from "lucide-react";
import { List, Section, T, VisibilityToggle, useSite } from "./edit";

export default function Faq() {
  const { c, editing } = useSite();
  const { event } = c;
  const lat = encodeURIComponent(event.mapLat.trim());
  const lon = encodeURIComponent(event.mapLon.trim());
  const hasMap = Boolean(lat && lon);
  const mapUrl = `https://yandex.ru/maps/?ll=${lon},${lat}&z=17&pt=${lon},${lat}`;
  const mapWidget = `https://yandex.ru/map-widget/v1/?ll=${lon}%2C${lat}&z=16&pt=${lon}%2C${lat},pm2rdm`;
  const showVenue = c.faq.showVenue;

  return (
    <Section id="faq" className="pb-12 md:pb-[72px]">
      <div className={`mx-auto grid max-w-7xl items-start gap-8 px-5 ${showVenue || editing ? "lg:grid-cols-[1.3fr_0.7fr]" : "max-w-3xl"}`}>
        <div>
          <T path="faq.eyebrow" as="p" className="eyebrow" />
          <T path="faq.title" as="h2" className="section-title mb-6" />
          <List path="faq.items" newItem={{ q: "Новый вопрос?", a: "Ответ" }} addLabel="Вопрос" className="grid gap-2">
            {(_, i, controls, p) => (
              <details key={i} open={editing || i === 0} className="group relative rounded-xl border border-tgu-border bg-white px-[18px]">
                {controls}
                <summary className="flex cursor-pointer list-none justify-between gap-4 py-4 font-heading text-base font-semibold [&::-webkit-details-marker]:hidden">
                  <T path={`${p}.q`} />
                  <span className="text-[22px] leading-none text-tgu-brand transition-transform group-open:rotate-45" aria-hidden>
                    +
                  </span>
                </summary>
                <T path={`${p}.a`} as="p" multiline className="block max-w-[65ch] pb-4 text-[15px] text-tgu-ink-secondary" />
              </details>
            )}
          </List>
        </div>

        {(showVenue || editing) && (
          <aside id="venue" className={`grid gap-3 rounded-2xl bg-tgu-dark p-5 text-white md:p-6 ${!showVenue ? "opacity-40" : ""}`}>
            <VisibilityToggle path="faq.showVenue" label="площадка" />
            {hasMap && (
              <iframe
                src={mapWidget}
                title={`Карта — ${event.venue}`}
                className="h-[220px] w-full rounded-[10px] border-0 bg-tgu-mid"
                loading="lazy"
                allowFullScreen
              />
            )}
            <h3 className="flex items-center gap-2 font-heading text-xl font-semibold">
              <MapPin className="h-5 w-5 shrink-0 text-sky-300" aria-hidden />
              <T path="event.venue" />
            </h3>
            <p className="text-sm text-white/70">
              <T path="event.address" />
              <br />
              <T path="event.dateLabel" />, <T path="event.timeLabel" />
            </p>
            {hasMap &&
              (editing ? (
                <span className="btn btn-ghost btn-sm justify-self-start">
                  <T path="faq.mapButtonLabel" />
                </span>
              ) : (
                <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm justify-self-start">
                  {c.faq.mapButtonLabel}
                </a>
              ))}
          </aside>
        )}
      </div>
    </Section>
  );
}
