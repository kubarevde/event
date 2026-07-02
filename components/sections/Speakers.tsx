"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Badge from "@/components/ui/Badge";
import SectionTitle from "@/components/ui/SectionTitle";
import { SPEAKERS, Speaker } from "@/data/speakers";

const isTbd = (v: string) => v === "TBD";

function SpeakerAvatar({ speaker }: { speaker: Speaker }) {
  const [err, setErr] = useState(false);

  if (speaker.avatar && !err) {
    return (
      <Image
        src={speaker.avatar}
        alt={speaker.name}
        width={72}
        height={72}
        className="h-[72px] w-[72px] object-cover"
        onError={() => setErr(true)}
      />
    );
  }

  return (
    <div className="flex h-[72px] w-[72px] items-center justify-center bg-tgu-brand-light font-heading text-lg font-semibold text-tgu-brand">
      {speaker.initials}
    </div>
  );
}

export default function Speakers() {
  return (
    <AnimatedSection id="speakers" className="bg-tgu-light py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-6">
        <SectionTitle
          eyebrow="Представители ТГУ"
          title="Люди, которые принимают решения"
          subtitle="Говорите напрямую с теми, кто определяет цифровую повестку и подписывает ИТ-контракты университета."
          accent
        />

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.06 } },
          }}
          className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:gap-5"
        >
          {SPEAKERS.map((speaker) => (
            <motion.article
              key={speaker.id}
              variants={{
                hidden: { opacity: 0, y: 10 },
                show: { opacity: 1, y: 0 },
              }}
              className="border border-tgu-border bg-tgu-surface p-5 text-center transition-shadow hover:shadow-card"
            >
              <div className="mx-auto w-fit">
                <SpeakerAvatar speaker={speaker} />
              </div>
              <h3 className="mt-4 font-heading text-base font-semibold text-tgu-dark-text">
                {speaker.name}
              </h3>
              {!isTbd(speaker.role) && (
                <p className="mt-1 font-body text-xs text-tgu-ink-secondary">
                  {speaker.role}
                </p>
              )}
              {!isTbd(speaker.department) && (
                <p className="mt-0.5 font-body text-[11px] text-tgu-muted">
                  {speaker.department}
                </p>
              )}
              <div className="mt-3">
                {isTbd(speaker.area) ? (
                  <Badge variant="neutral" label="Скоро" />
                ) : (
                  <Badge variant={speaker.areaVariant} label={speaker.area} />
                )}
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </AnimatedSection>
  );
}
