"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRef } from "react";
import { Img, List, Section, T } from "./edit";

export default function Speakers() {
  const strip = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => strip.current?.scrollBy({ left: dir * strip.current.clientWidth * 0.8, behavior: "smooth" });

  return (
    <Section id="speakers" className="pb-12 md:pb-[72px]">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4 md:mb-7">
          <div>
            <T path="speakers.eyebrow" as="p" className="eyebrow" />
            <T path="speakers.title" as="h2" className="section-title" />
          </div>
          <div className="flex gap-2">
            {[-1, 1].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => scroll(d)}
                aria-label={d < 0 ? "Предыдущие спикеры" : "Следующие спикеры"}
                className="grid h-10 w-10 place-items-center rounded-full border border-tgu-border bg-white transition-colors hover:border-tgu-brand hover:text-tgu-brand"
              >
                {d < 0 ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
              </button>
            ))}
          </div>
        </div>
        <div ref={strip} className="no-scrollbar overflow-x-auto pb-2 pt-3">
          <List
            path="speakers.items"
            newItem={{ name: "Фамилия Имя Отчество", role: "Должность", photo: "" }}
            addLabel="Спикер"
            className="grid snap-x snap-mandatory auto-cols-[46%] grid-flow-col gap-3.5 sm:auto-cols-[220px] xl:auto-cols-[calc((100%-70px)/6)]"
          >
            {(s, i, controls, p) => (
              <article key={i} className="relative snap-start overflow-hidden rounded-2xl border border-tgu-border bg-white">
                {controls}
                <Img
                  path={`${p}.photo`}
                  alt={s.name}
                  className="block aspect-[5/6] w-full bg-tgu-brand-light object-cover object-[center_18%]"
                  fallback={
                    <div className="grid aspect-[5/6] w-full place-items-center bg-tgu-brand-light font-heading text-4xl font-semibold text-tgu-brand">
                      {s.name.trim().charAt(0)}
                    </div>
                  }
                />
                <div className="p-2.5 sm:p-3.5">
                  <T path={`${p}.name`} as="b" className="block font-heading text-[13.5px] font-semibold leading-tight sm:text-[15px]" />
                  <T path={`${p}.role`} as="span" multiline className="mt-1.5 block text-[11.5px] leading-snug text-tgu-ink-secondary sm:text-[12.5px]" />
                </div>
              </article>
            )}
          </List>
        </div>
      </div>
    </Section>
  );
}
