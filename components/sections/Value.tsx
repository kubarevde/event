"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";
import SectionTitle from "@/components/ui/SectionTitle";
import type { SiteContent } from "@/lib/content";
import { scrollToSection } from "@/lib/track";

export default function Value({ value, showCta }: { value: SiteContent["value"]; showCta: boolean }) {
  return (
    <AnimatedSection id="value" className="bg-tgu-light py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-6">
        <div className="grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionTitle eyebrow={value.eyebrow} title={value.title} subtitle={value.subtitle} accent align="left" />
            {value.quote && (
              <blockquote className="mt-2 border-l-2 border-tgu-brand pl-5 font-heading text-xl font-semibold leading-snug text-tgu-dark-text md:text-2xl">
                {value.quote}
              </blockquote>
            )}
            {showCta && value.ctaLabel && (
              <Button variant="primary" className="mt-8" onClick={() => scrollToSection("registration", value.ctaLabel)}>
                {value.ctaLabel}
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </Button>
            )}
          </div>

          <motion.ul
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.07 } },
            }}
            className="divide-y divide-tgu-border border border-tgu-border bg-tgu-surface"
          >
            {value.benefits.map((text) => (
              <motion.li
                key={text}
                variants={{
                  hidden: { opacity: 0, x: 12 },
                  show: { opacity: 1, x: 0 },
                }}
                className="flex gap-4 p-5"
              >
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-tgu-brand" strokeWidth={2} aria-hidden />
                <span className="font-body text-sm leading-relaxed text-tgu-dark-text">{text}</span>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </AnimatedSection>
  );
}
