"use client";

import { Star } from "lucide-react";
import { getIcon } from "@/lib/icons";
import { ItemControls, List, Section, T, useSite } from "./edit";
import IconPicker from "./IconPicker";

export default function Program() {
  const { c, editing, set } = useSite();
  const showFormats = c.formats.enabled || editing;

  return (
    <Section id="program" className="bg-tgu-dark py-12 text-white md:py-[72px]">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4 md:mb-8">
          <div>
            <T path="program.eyebrow" as="p" className="eyebrow !text-sky-300" />
            <T path="program.title" as="h2" className="section-title" />
          </div>
          <T path="program.subtitle" as="p" multiline className="hidden max-w-[46ch] text-white/65 sm:block" />
        </div>

        <div className={`grid items-start gap-8 ${showFormats ? "lg:grid-cols-[1.4fr_1fr]" : ""}`}>
          <List
            path="program.items"
            newItem={{ icon: "Check", title: "Новый пункт", text: "", highlight: false }}
            addLabel="Пункт программы"
            as="ul"
            className="grid gap-2.5 sm:grid-cols-2"
            addClassName="!border-white/30 !bg-white/5 !text-white"
          >
            {(item, i, _c, p) => {
              const Icon = getIcon(item.icon);
              return (
                <li
                  key={i}
                  className={`relative flex gap-3.5 rounded-2xl border p-4 ${
                    item.highlight ? "border-tgu-brand bg-tgu-brand/15 sm:col-span-2" : "border-white/[0.08] bg-tgu-dark-elevated"
                  }`}
                >
                  {editing && (
                    <ItemControls
                      path="program.items"
                      index={i}
                      length={c.program.items.length}
                      extra={
                        <button type="button" title="Выделить пункт" onClick={() => set(`${p}.highlight`, !item.highlight)}>
                          <Star className="h-3.5 w-3.5" fill={item.highlight ? "currentColor" : "none"} />
                        </button>
                      }
                    />
                  )}
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-white/[0.06] text-sky-300">
                    {editing ? <IconPicker path={`${p}.icon`} /> : <Icon className="h-[18px] w-[18px]" aria-hidden />}
                  </span>
                  <div className="min-w-0">
                    <b className="block font-semibold">
                      <T path={`${p}.title`} />
                      {item.highlight && (
                        <span className="ml-2 whitespace-nowrap rounded-full bg-tgu-brand px-2 py-0.5 align-[2px] text-[11px] font-semibold">
                          <T path="program.highlightLabel" />
                        </span>
                      )}
                    </b>
                    <T path={`${p}.text`} as="span" multiline className="mt-0.5 block text-sm text-white/60" />
                  </div>
                </li>
              );
            }}
          </List>

          {showFormats && (
            <div className={!c.formats.enabled ? "opacity-40" : ""}>
              {editing && (
                <button type="button" className="edit-chip mb-2" onClick={() => set("formats.enabled", !c.formats.enabled)}>
                  {c.formats.enabled ? "Скрыть форматы" : "Показать форматы"}
                </button>
              )}
              <List
                path="formats.cards"
                newItem={{ title: "Новый формат", subtitle: "", items: [] }}
                addLabel="Формат"
                className="grid grid-cols-2 gap-3 lg:grid-cols-1"
                addClassName="!border-white/30 !bg-white/5 !text-white"
              >
                {(_, i, controls, p) => (
                  <article key={i} className="relative rounded-2xl border border-white/[0.08] bg-tgu-dark-elevated p-4 md:p-5">
                    {controls}
                    <T path={`${p}.title`} as="h3" className="font-heading text-[17px] font-semibold" />
                    <T path={`${p}.subtitle`} as="p" className="mt-1 text-[13.5px] text-white/60" />
                    <List path={`${p}.items`} newItem="Новый пункт" addLabel="Пункт" as="ul" className="mt-3 hidden gap-1.5 text-sm text-white/80 sm:grid" addClassName="!min-h-0 !border-white/30 !bg-transparent !py-1 !text-xs !text-white">
                      {(_, j, ctl) => (
                        <li key={j} className="relative">
                          {ctl}
                          <span className="text-tgu-brand">— </span>
                          <T path={`${p}.items.${j}`} />
                        </li>
                      )}
                    </List>
                  </article>
                )}
              </List>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
