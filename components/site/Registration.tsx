"use client";

import DynamicForm from "@/components/ui/DynamicForm";
import type { FormSchema } from "@/lib/forms";
import { List, Section, T, useSite } from "./edit";

export default function Registration({ form }: { form: { id: string; schema: FormSchema } | null }) {
  const { c, editing } = useSite();
  return (
    <Section id="registration" className="py-12 md:py-[72px]">
      <div className="mx-auto grid max-w-7xl items-start gap-7 px-5 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
        <div>
          <T path="registration.eyebrow" as="p" className="eyebrow" />
          <T path="registration.title" as="h2" className="section-title" />
          <T path="registration.subtitle" as="p" multiline className="mt-3 hidden max-w-[46ch] text-tgu-ink-secondary sm:block" />
          <List path="registration.offerItems" newItem="Новый пункт" addLabel="Пункт" as="ul" className="mt-4 grid gap-2 text-[15px] sm:mt-6">
            {(_, i, controls) => (
              <li key={i} className="relative flex gap-2.5">
                {controls}
                <span className="font-bold text-tgu-brand">✓</span>
                <T path={`registration.offerItems.${i}`} />
              </li>
            )}
          </List>
          {(c.registration.privacyNote || editing) && (
            <p className="mt-6 hidden rounded-xl border border-tgu-border bg-white px-4 py-3.5 text-[13px] text-tgu-ink-secondary sm:block">
              <T path="registration.privacyNote" multiline />{" "}
              {editing ? (
                <T path="registration.privacyLinkLabel" className="text-tgu-brand" />
              ) : (
                c.event.privacyPolicyUrl && (
                  <a href={c.event.privacyPolicyUrl} target="_blank" rel="noopener noreferrer" className="text-tgu-brand hover:underline">
                    {c.registration.privacyLinkLabel}
                  </a>
                )
              )}
              .
            </p>
          )}
        </div>
        <div className="rounded-[18px] border border-tgu-border bg-white p-5 shadow-[0_20px_50px_-20px_rgba(15,23,36,0.15)] sm:p-7">
          {form ? (
            <>
              {editing && (
                <p className="mb-4 rounded-lg bg-tgu-brand-light px-3 py-2 text-xs text-tgu-brand">
                  Поля формы настраиваются в админке, раздел «Формы».
                </p>
              )}
              <DynamicForm formId={form.id} schema={form.schema} preview={editing} />
            </>
          ) : (
            <p className="text-sm text-tgu-ink-secondary">Приём заявок временно закрыт.</p>
          )}
        </div>
      </div>
    </Section>
  );
}
