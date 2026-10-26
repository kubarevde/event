"use client";

import { getIcon } from "@/lib/icons";
import { Cta, ItemControls, List, Section, T, useSite } from "./edit";
import IconPicker from "./IconPicker";

const PRIORITY: Record<string, { label: string; cls: string } | null> = {
  high: { label: "Высокий приоритет", cls: "bg-tgu-brand-light text-tgu-brand" },
  medium: { label: "Средний", cls: "bg-slate-100 text-tgu-ink-secondary" },
  none: null,
};

function Directions() {
  const { c, editing, set } = useSite();
  if (!c.directions.enabled && !editing) return null;
  return (
    <article className={`tile ${!c.directions.enabled ? "opacity-40" : ""}`} id="agenda">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <T path="directions.eyebrow" as="p" className="eyebrow" />
        {editing && (
          <button type="button" className="edit-chip" onClick={() => set("directions.enabled", !c.directions.enabled)}>
            {c.directions.enabled ? "Скрыть повестку" : "Показать повестку"}
          </button>
        )}
      </div>
      <T path="directions.title" as="h3" className="font-heading text-lg font-semibold" />
      <List
        path="directions.items"
        newItem={{ title: "Новое направление", description: "", priority: "medium" }}
        addLabel="Направление"
        as="ul"
        className="mt-1 grid"
      >
        {(item, i, _controls, p) => (
          <li key={i} className="relative grid grid-cols-[1fr_auto] items-center gap-3 border-b border-tgu-border py-2.5 last:border-b-0">
            {editing && (
              <ItemControls
                path="directions.items"
                index={i}
                length={c.directions.items.length}
                extra={
                  <button
                    type="button"
                    title="Сменить приоритет"
                    onClick={() =>
                      set(`${p}.priority`, item.priority === "high" ? "medium" : item.priority === "medium" ? "none" : "high")
                    }
                  >
                    Приоритет
                  </button>
                }
              />
            )}
            <div className="min-w-0">
              <T path={`${p}.title`} as="b" className="block text-[15px] font-semibold" />
              <T path={`${p}.description`} as="small" className="hidden text-[13px] text-tgu-ink-secondary sm:block" />
            </div>
            {PRIORITY[item.priority] ? (
              <span className={`whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold ${PRIORITY[item.priority]!.cls}`}>
                {PRIORITY[item.priority]!.label}
              </span>
            ) : (
              <span />
            )}
          </li>
        )}
      </List>
    </article>
  );
}

export default function Why() {
  const { c, editing } = useSite();
  const reg = c.registration.enabled;

  return (
    <Section id="why" className="py-12 md:py-[72px]">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4 md:mb-7">
          <div>
            <T path="why.eyebrow" as="p" className="eyebrow" />
            <T path="why.title" as="h2" className="section-title" />
          </div>
          <T path="why.subtitle" as="p" multiline className="hidden max-w-[46ch] text-tgu-ink-secondary sm:block" />
        </div>

        {/* Bento: на телефоне — горизонтальная лента карточек */}
        <div className="-mx-5 grid snap-x snap-mandatory auto-cols-[82%] grid-flow-col gap-3.5 overflow-x-auto px-5 pb-1.5 sm:mx-0 sm:auto-cols-auto sm:grid-flow-row sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
          <article className="tile snap-start justify-between border-tgu-dark bg-tgu-dark text-white hover:translate-y-0 sm:col-span-2 sm:row-span-2">
            <div>
              <T path="why.featureTitle" as="h3" className="font-heading text-2xl font-semibold md:text-[26px]" />
              <T path="why.featureText" as="p" multiline className="mt-2.5 block text-[15.5px] text-white/70" />
            </div>
            <List path="why.featurePoints" newItem="Новый пункт" addLabel="Пункт" as="ul" className="grid gap-2">
              {(_, i, controls) => (
                <li key={i} className="relative flex gap-2.5 text-[15px] text-white/85">
                  {controls}
                  <span className="text-sky-300">→</span>
                  <T path={`why.featurePoints.${i}`} />
                </li>
              )}
            </List>
            {(c.why.quote || editing) && (
              <T
                path="why.quote"
                as="p"
                className="hidden border-l-2 border-tgu-brand pl-3.5 font-heading text-xl font-medium leading-snug sm:block"
              />
            )}
          </article>

          <article className="tile snap-start justify-between border-tgu-brand bg-tgu-brand text-white">
            <T path="why.highlightValue" className="font-heading text-5xl font-bold leading-none" />
            <T path="why.highlightText" as="p" multiline className="text-white/80" />
          </article>

          <List
            path="why.reasons"
            newItem={{ icon: "Check", title: "Заголовок", text: "Описание" }}
            addLabel="Карточка"
            as="div"
            className="contents"
          >
            {(item, i, controls, p) => {
              const Icon = getIcon(item.icon);
              return (
                <article key={i} className="tile relative snap-start">
                  {controls}
                  <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-tgu-brand-light text-tgu-brand">
                    {editing ? <IconPicker path={`${p}.icon`} /> : <Icon className="h-[18px] w-[18px]" aria-hidden />}
                  </span>
                  <T path={`${p}.title`} as="h3" className="font-heading text-lg font-semibold leading-snug" />
                  <T path={`${p}.text`} as="p" multiline className="text-[14.5px] text-tgu-ink-secondary" />
                </article>
              );
            }}
          </List>
        </div>
        <p className="mt-2 text-xs text-slate-400 sm:hidden">Листайте карточки →</p>

        <div className="mt-3.5 grid gap-3.5 lg:grid-cols-[1.5fr_1fr]">
          <Directions />
          <article className="tile hidden justify-between gap-4 border-tgu-brand bg-tgu-brand text-white sm:flex">
            <T path="why.windowText" as="p" multiline className="font-heading text-xl font-semibold leading-snug" />
            <List
              path="why.stats"
              newItem={{ value: "10", label: "подпись" }}
              addLabel="Цифра"
              className="grid grid-cols-3 gap-2.5 border-t border-white/20 pt-3.5"
              addClassName="!border-white/50 !text-white"
            >
              {(_, i, controls) => (
                <div key={i} className="relative">
                  {controls}
                  <T path={`why.stats.${i}.value`} as="b" className="block font-heading text-[22px] font-semibold" />
                  <T path={`why.stats.${i}.label`} className="block text-[11px] leading-tight text-white/70" />
                </div>
              )}
            </List>
            {reg && (
              <Cta
                path="why.windowCta"
                action="form"
                className="btn bg-white text-tgu-brand hover:bg-tgu-brand-light"
              />
            )}
          </article>
        </div>
      </div>
    </Section>
  );
}
