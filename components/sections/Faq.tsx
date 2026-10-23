"use client";

import { useState } from "react";
import { ChevronDown, MapPin } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";
import SectionTitle from "@/components/ui/SectionTitle";
import type { SiteContent } from "@/lib/content";

interface FaqProps {
  faq: SiteContent["faq"];
  event: SiteContent["event"];
}

export default function Faq({ faq, event }: FaqProps) {
  const [open, setOpen] = useState<number | null>(0);
  const lat = encodeURIComponent(event.mapLat.trim());
  const lon = encodeURIComponent(event.mapLon.trim());
  const hasMap = Boolean(lat && lon);
  const mapUrl = `https://yandex.ru/maps/?ll=${lon},${lat}&z=17&pt=${lon},${lat}`;
  const mapWidget = `https://yandex.ru/map-widget/v1/?ll=${lon}%2C${lat}&z=17&pt=${lon}%2C${lat},pm2rdm`;

  return (
    <AnimatedSection id="faq" className="border-t border-tgu-border bg-tgu-surface py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-6">
        <SectionTitle eyebrow={faq.eyebrow} title={faq.title} subtitle={faq.subtitle} accent />

        <div className={`grid gap-10 ${faq.showVenue ? "lg:grid-cols-[1fr_1fr]" : "mx-auto max-w-3xl"}`}>
          <div className="divide-y divide-tgu-border self-start border border-tgu-border">
            {faq.items.map((item, i) => (
              <div key={item.q}>
                <button
                  type="button"
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="font-heading text-sm font-semibold text-tgu-dark-text">{item.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-tgu-brand transition-transform ${
                      open === i ? "rotate-180" : ""
                    }`}
                    aria-hidden
                  />
                </button>
                {open === i && (
                  <p className="whitespace-pre-line px-5 pb-4 font-body text-sm leading-relaxed text-tgu-ink-secondary">
                    {item.a}
                  </p>
                )}
              </div>
            ))}
          </div>

          {faq.showVenue && (
            <div id="venue">
              <div className="border border-tgu-border bg-tgu-light p-6">
                <MapPin className="h-5 w-5 text-tgu-brand" strokeWidth={1.75} aria-hidden />
                <h3 className="mt-3 font-heading text-base font-semibold text-tgu-dark-text">{event.venue}</h3>
                <p className="mt-1 font-body text-sm text-tgu-ink-secondary">{event.address}</p>
                <p className="mt-3 font-body text-sm text-tgu-dark-text">
                  {event.dateLabel}, {event.timeLabel}
                </p>
                {hasMap && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 border-tgu-border text-tgu-dark-text"
                    onClick={() => window.open(mapUrl, "_blank", "noopener")}
                  >
                    {faq.mapButtonLabel}
                  </Button>
                )}
              </div>
              {hasMap && (
                <iframe
                  src={mapWidget}
                  width="100%"
                  height={280}
                  className="mt-4 border border-tgu-border"
                  allowFullScreen
                  title={`Карта — ${event.venue}`}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </AnimatedSection>
  );
}
