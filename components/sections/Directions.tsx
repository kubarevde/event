"use client";

import { motion } from "framer-motion";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Badge from "@/components/ui/Badge";
import SectionTitle from "@/components/ui/SectionTitle";
import type { SiteContent } from "@/lib/content";
import { getIcon } from "@/lib/icons";

export default function Directions({ directions }: { directions: SiteContent["directions"] }) {
  return (
    <AnimatedSection id="directions" className="border-y border-tgu-border bg-tgu-surface py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-6">
        <SectionTitle eyebrow={directions.eyebrow} title={directions.title} subtitle={directions.subtitle} accent />

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08 } },
          }}
          className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {directions.items.map((direction, index) => {
            const Icon = getIcon(direction.icon);
            const isFeatured = index === 0 && directions.items.length >= 5;

            return (
              <motion.article
                key={`${direction.title}-${index}`}
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  show: { opacity: 1, y: 0 },
                }}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
                className={`flex flex-col border border-tgu-border bg-tgu-light p-6 transition-shadow hover:shadow-card-hover ${
                  isFeatured ? "md:row-span-2 md:flex md:justify-between" : ""
                }`}
              >
                <div>
                  <Icon className="h-5 w-5 text-tgu-brand" strokeWidth={1.75} aria-hidden />
                  <h3 className="mt-4 font-heading text-base font-semibold text-tgu-dark-text">{direction.title}</h3>
                  <p className="mt-2 font-body text-sm leading-relaxed text-tgu-ink-secondary">
                    {direction.description}
                  </p>
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  {direction.tags.map((tag) => (
                    <Badge key={tag} variant="neutral" label={tag} />
                  ))}
                  {direction.priority !== "none" && (
                    <Badge
                      variant={direction.priority === "high" ? "brand" : "outline"}
                      label={direction.priority === "high" ? "Высокий приоритет" : "Средний приоритет"}
                    />
                  )}
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </AnimatedSection>
  );
}
