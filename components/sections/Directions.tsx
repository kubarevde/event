"use client";

import { motion } from "framer-motion";
import {
  Building2,
  Database,
  GraduationCap,
  LayoutDashboard,
  LucideIcon,
  ShieldCheck,
} from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Badge from "@/components/ui/Badge";
import SectionTitle from "@/components/ui/SectionTitle";
import { DIRECTIONS } from "@/data/directions";

const ICONS: Record<string, LucideIcon> = {
  Building2,
  LayoutDashboard,
  Database,
  ShieldCheck,
  GraduationCap,
};

export default function Directions() {
  return (
    <AnimatedSection
      id="directions"
      className="border-y border-tgu-border bg-tgu-surface py-20 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-6">
        <SectionTitle
          eyebrow="Повестка 2027"
          title="Направления цифрового развития ТГУ"
          subtitle="Приоритеты, по которым университет ищет технологических партнёров. Понимание этой карты — основа для точного коммерческого предложения."
          accent
        />

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
          {DIRECTIONS.map((direction, index) => {
            const Icon = ICONS[direction.icon];
            const isFeatured = index === 0;

            return (
              <motion.article
                key={direction.id}
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  show: { opacity: 1, y: 0 },
                }}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
                className={`flex flex-col border border-tgu-border bg-tgu-light p-6 transition-shadow hover:shadow-card-hover ${
                  isFeatured ? "md:row-span-2 md:flex md:justify-between" : ""
                } ${index === 3 ? "lg:col-start-2" : ""} ${
                  index === 4 ? "lg:col-start-3" : ""
                }`}
              >
                <div>
                  {Icon && (
                    <Icon
                      className="h-5 w-5 text-tgu-brand"
                      strokeWidth={1.75}
                      aria-hidden
                    />
                  )}
                  <h3 className="mt-4 font-heading text-base font-semibold text-tgu-dark-text">
                    {direction.title}
                  </h3>
                  <p className="mt-2 font-body text-sm leading-relaxed text-tgu-ink-secondary">
                    {direction.description}
                  </p>
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  {direction.tags.map((tag) => (
                    <Badge key={tag} variant="neutral" label={tag} />
                  ))}
                  <Badge
                    variant={direction.priority === "high" ? "brand" : "outline"}
                    label={
                      direction.priority === "high"
                        ? "Высокий приоритет"
                        : "Средний приоритет"
                    }
                  />
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </AnimatedSection>
  );
}
