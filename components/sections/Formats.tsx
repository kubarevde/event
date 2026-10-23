"use client";

import { Check, Wallet } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";
import SectionTitle from "@/components/ui/SectionTitle";
import type { SiteContent } from "@/lib/content";
import { getIcon } from "@/lib/icons";
import { scrollToSection } from "@/lib/track";

interface FormatsProps {
  formats: SiteContent["formats"];
  event: SiteContent["event"];
  showCta: boolean;
}

export default function Formats({ formats, event, showCta }: FormatsProps) {
  return (
    <AnimatedSection id="formats" className="bg-tgu-dark py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-6">
        <SectionTitle eyebrow={formats.eyebrow} title={formats.title} subtitle={formats.subtitle} light accent />

        <div className={`grid gap-5 ${formats.cards.length > 2 ? "lg:grid-cols-3" : "lg:grid-cols-2"}`}>
          {formats.cards.map((card) => {
            const Icon = getIcon(card.icon);
            return (
              <article key={card.title} className="border border-white/10 bg-tgu-dark-elevated p-7">
                <Icon className="h-5 w-5 text-tgu-brand" strokeWidth={1.75} aria-hidden />
                <h3 className="mt-4 font-heading text-lg font-semibold text-white">{card.title}</h3>
                {card.subtitle && <p className="mt-2 font-body text-sm text-white/70">{card.subtitle}</p>}
                <ul className="mt-5 space-y-2.5">
                  {card.items.map((item) => (
                    <li key={item} className="flex gap-2.5 font-body text-sm text-white/75">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-tgu-brand" strokeWidth={2} aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>

        {formats.showPrice && event.price && (
          <div className="mt-8 grid gap-6 border border-tgu-brand/30 bg-tgu-brand/10 p-7 md:grid-cols-[1fr_auto] md:items-center">
            <div className="flex gap-4">
              <Wallet className="h-5 w-5 shrink-0 text-tgu-brand" strokeWidth={1.75} aria-hidden />
              <div>
                <p className="font-heading text-2xl font-semibold text-white md:text-3xl">{event.price}</p>
                <p className="mt-1 font-body text-sm text-white/75">{event.priceNote}</p>
              </div>
            </div>
            {showCta && formats.ctaLabel && (
              <Button variant="primary" size="lg" onClick={() => scrollToSection("registration", formats.ctaLabel)}>
                {formats.ctaLabel}
              </Button>
            )}
          </div>
        )}
      </div>
    </AnimatedSection>
  );
}
