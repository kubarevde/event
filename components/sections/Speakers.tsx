"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionTitle from "@/components/ui/SectionTitle";
import type { SiteContent } from "@/lib/content";

type Speaker = SiteContent["speakers"]["items"][number];

function initials(name: string) {
  return name.trim().charAt(0).toUpperCase();
}

function SpeakerAvatar({ speaker }: { speaker: Speaker }) {
  const [err, setErr] = useState(false);

  if (speaker.photo && !err) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={speaker.photo}
        alt={speaker.name}
        loading="lazy"
        className="h-full w-full object-cover object-[center_18%]"
        onError={() => setErr(true)}
      />
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-tgu-brand-light font-heading text-3xl font-semibold text-tgu-brand">
      {initials(speaker.name)}
    </div>
  );
}

export default function Speakers({ speakers }: { speakers: SiteContent["speakers"] }) {
  return (
    <AnimatedSection id="speakers" className="bg-tgu-light py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-6">
        <SectionTitle eyebrow={speakers.eyebrow} title={speakers.title} subtitle={speakers.subtitle} accent />

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
          {speakers.items.map((speaker, i) => (
            <motion.article
              key={`${speaker.name}-${i}`}
              variants={{
                hidden: { opacity: 0, y: 10 },
                show: { opacity: 1, y: 0 },
              }}
              className="border border-tgu-border bg-tgu-surface p-5 text-center transition-shadow hover:shadow-card"
            >
              <div className="mx-auto aspect-[5/6] w-1/2 min-w-[88px] max-w-[140px] overflow-hidden rounded-lg bg-tgu-brand-light">
                <SpeakerAvatar speaker={speaker} />
              </div>
              <h3 className="mt-4 font-heading text-sm font-semibold leading-snug text-tgu-dark-text md:text-base">
                {speaker.name}
              </h3>
              {speaker.role && (
                <p className="mt-2 font-body text-xs leading-relaxed text-tgu-ink-secondary">{speaker.role}</p>
              )}
            </motion.article>
          ))}
        </motion.div>
      </div>
    </AnimatedSection>
  );
}
