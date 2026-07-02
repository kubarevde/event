"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";
import SectionTitle from "@/components/ui/SectionTitle";

const BENEFITS = [
  "Возможность предложить собственные продукты и решения напрямую команде цифровой трансформации ТГУ",
  "10-минутный временной слот для представления вашей компании и ключевых кейсов",
  "Технологический роадмэп ТГУ на 2027 — конкретные задачи и направления закупок",
  "Прямой контакт с лицами, принимающими решения по ИТ-контрактам",
  "Понимание бюджетных приоритетов до выхода тендерной документации",
  "Запись круглого стола и презентационные материалы для вашей команды",
];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function Value() {
  return (
    <AnimatedSection id="value" className="bg-tgu-light py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-6">
        <div className="grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionTitle
              eyebrow="Результат участия"
              title="Что получает ваша компания"
              subtitle="Не networking ради networking — а реальный слот для презентации, прямой диалог с ЛПР и понимание приоритетов закупок одного из крупнейших вузов страны."
              accent
              align="left"
            />
            <blockquote className="mt-2 border-l-2 border-tgu-brand pl-5 font-heading text-xl font-semibold leading-snug text-tgu-dark-text md:text-2xl">
              Закупки 2027 начинаются с разговора, а не с протокола
            </blockquote>
            <Button
              variant="primary"
              className="mt-8"
              onClick={() => scrollTo("registration")}
            >
              Оставить заявку
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </Button>
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
            {BENEFITS.map((text) => (
              <motion.li
                key={text}
                variants={{
                  hidden: { opacity: 0, x: 12 },
                  show: { opacity: 1, x: 0 },
                }}
                className="flex gap-4 p-5"
              >
                <Check
                  className="mt-0.5 h-4 w-4 shrink-0 text-tgu-brand"
                  strokeWidth={2}
                  aria-hidden
                />
                <span className="font-body text-sm leading-relaxed text-tgu-dark-text">
                  {text}
                </span>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </AnimatedSection>
  );
}
