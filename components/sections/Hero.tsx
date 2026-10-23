"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calendar, Lock, MapPin, Monitor } from "lucide-react";
import Button from "@/components/ui/Button";
import CountdownTimer from "@/components/ui/CountdownTimer";
import LogoSlot from "@/components/ui/LogoSlot";
import type { SiteContent } from "@/lib/content";
import { getIcon } from "@/lib/icons";
import { scrollToSection } from "@/lib/track";

interface HeroProps {
  hero: SiteContent["hero"];
  event: SiteContent["event"];
  theme: SiteContent["theme"];
  startIso: string;
  showRegistration: boolean;
}

export default function Hero({ hero, event, theme, startIso, showRegistration }: HeroProps) {
  return (
    <section id="hero" className="relative min-h-screen bg-tgu-dark pt-28 md:pt-32">
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgb(var(--brand)/0.08)_0%,transparent_40%)]"
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-5 py-12 md:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <LogoSlot src={theme.logo} alt={theme.logoAlt} size="hero" />
            {hero.badge && (
              <span className="inline-block border border-white/20 px-2.5 py-0.5 font-body text-[11px] font-medium uppercase tracking-wide text-white/80">
                {hero.badge}
              </span>
            )}
            {hero.audienceNote && (
              <span className="flex items-center gap-1.5 font-body text-xs text-white/65">
                <Lock className="h-3.5 w-3.5" aria-hidden />
                {hero.audienceNote}
              </span>
            )}
          </div>

          <h1 className="max-w-xl font-heading text-3xl font-semibold leading-[1.15] tracking-tight text-white sm:text-4xl lg:text-[2.75rem]">
            {event.title}
          </h1>

          {hero.subtitle && (
            <p className="mt-5 max-w-lg whitespace-pre-line font-body text-base leading-relaxed text-white/75 md:text-lg">
              {hero.subtitle}
            </p>
          )}

          <ul className="mt-8 space-y-3">
            {hero.bullets.map(({ icon, text }) => {
              const Icon = getIcon(icon);
              return (
                <li key={text} className="flex items-start gap-3">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-tgu-brand" strokeWidth={1.75} aria-hidden />
                  <span className="font-body text-sm text-white/80">{text}</span>
                </li>
              );
            })}
          </ul>

          <div className="mt-10 flex flex-wrap gap-3">
            {showRegistration && hero.primaryCta && (
              <Button variant="primary" size="lg" onClick={() => scrollToSection("registration", hero.primaryCta)}>
                {hero.primaryCta}
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </Button>
            )}
            {hero.secondaryCta && (
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/5"
                onClick={() => scrollToSection(hero.secondaryTarget)}
              >
                {hero.secondaryCta}
              </Button>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="border border-white/10 bg-tgu-dark-elevated/80 p-6 md:p-8"
        >
          <p className="font-body text-xs font-semibold uppercase tracking-widest text-tgu-brand">
            {hero.cardTitle}
          </p>

          <div className="mt-6 space-y-4">
            <div className="flex gap-4 border-b border-white/10 pb-4">
              <Calendar className="h-5 w-5 shrink-0 text-tgu-brand" strokeWidth={1.75} aria-hidden />
              <div>
                <p className="font-body text-sm text-white/65">Дата и время</p>
                <p className="mt-0.5 font-body text-sm font-medium text-white">
                  {event.dateLabel} · {event.timeLabel}
                </p>
              </div>
            </div>

            <div className="flex gap-4 border-b border-white/10 pb-4">
              <MapPin className="h-5 w-5 shrink-0 text-tgu-brand" strokeWidth={1.75} aria-hidden />
              <div>
                <p className="font-body text-sm text-white/65">Локация</p>
                <p className="mt-0.5 font-body text-sm font-medium text-white">{event.venue}</p>
                <p className="font-body text-xs text-white/60">{event.address}</p>
              </div>
            </div>

            {event.format && (
              <div className="flex gap-4 border-b border-white/10 pb-4">
                <Monitor className="h-5 w-5 shrink-0 text-tgu-brand" strokeWidth={1.75} aria-hidden />
                <div>
                  <p className="font-body text-sm text-white/65">Формат</p>
                  <p className="mt-0.5 font-body text-sm font-medium text-white">{event.format}</p>
                </div>
              </div>
            )}

            {event.price && (
              <div className="flex items-baseline justify-between gap-4 pt-1">
                <div>
                  <p className="font-body text-sm text-white/65">Участие</p>
                  <p className="mt-0.5 font-heading text-xl font-semibold text-white">{event.price}</p>
                  <p className="font-body text-xs text-white/60">{event.priceNote}</p>
                </div>
                {event.limitedNote && (
                  <p className="text-right font-body text-xs text-tgu-warm">{event.limitedNote}</p>
                )}
              </div>
            )}
          </div>

          <div className="mt-8 border-t border-white/10 pt-6">
            <p className="mb-3 font-body text-xs text-white/65">{hero.countdownLabel}</p>
            <CountdownTimer targetDate={startIso} compact dark />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
