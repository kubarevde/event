"use client";

import { Clock } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionTitle from "@/components/ui/SectionTitle";
import type { SiteContent } from "@/lib/content";
import { getIcon } from "@/lib/icons";

export default function WhyImportant({ why }: { why: SiteContent["why"] }) {
  const hasAside = Boolean(why.asideTitle || why.asideText || why.stats.length);

  return (
    <AnimatedSection id="why" className="border-b border-tgu-border bg-tgu-surface py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-6">
        <SectionTitle eyebrow={why.eyebrow} title={why.title} subtitle={why.subtitle} accent align="left" />

        <div className={`grid gap-10 ${hasAside ? "lg:grid-cols-[1fr_280px]" : ""}`}>
          <div className="grid gap-6 sm:grid-cols-2">
            {why.reasons.map(({ icon, title, text }) => {
              const Icon = getIcon(icon);
              return (
                <article
                  key={title}
                  className="border border-tgu-border bg-tgu-light p-6 transition-shadow duration-200 hover:shadow-card-hover"
                >
                  <Icon className="h-5 w-5 text-tgu-brand" strokeWidth={1.75} aria-hidden />
                  <h3 className="mt-4 font-heading text-base font-semibold text-tgu-dark-text">{title}</h3>
                  <p className="mt-2 font-body text-sm leading-relaxed text-tgu-ink-secondary">{text}</p>
                </article>
              );
            })}
          </div>

          {hasAside && (
            <aside className="flex flex-col justify-between border border-tgu-border bg-tgu-brand p-6 text-white">
              <div>
                <Clock className="h-5 w-5 opacity-80" strokeWidth={1.75} aria-hidden />
                <p className="mt-4 font-heading text-lg font-semibold leading-snug">{why.asideTitle}</p>
                <p className="mt-3 font-body text-sm leading-relaxed text-white/75">{why.asideText}</p>
              </div>
              {why.stats.length > 0 && (
                <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-white/20 pt-6">
                  {why.stats.map(({ value, label }) => (
                    <div key={label}>
                      <dt className="font-heading text-xl font-semibold">{value}</dt>
                      <dd className="mt-1 font-body text-[11px] leading-tight text-white/65">{label}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </aside>
          )}
        </div>
      </div>
    </AnimatedSection>
  );
}
