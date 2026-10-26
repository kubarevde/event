"use client";

import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import DynamicForm from "@/components/ui/DynamicForm";
import type { FormSchema } from "@/lib/forms";
import { useSite } from "./edit";

/** Выезжающая панель с формой заявки — открывается любой кнопкой «Подать заявку». */
export default function FormDrawer({ form }: { form: { id: string; schema: FormSchema } | null }) {
  const { c, formOpen, closeForm } = useSite();
  const panel = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<Element | null>(null);

  useEffect(() => {
    if (!formOpen) return;
    lastFocus.current = document.activeElement;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => panel.current?.querySelector<HTMLElement>("input, button")?.focus(), 250);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeForm();
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      (lastFocus.current as HTMLElement | null)?.focus?.();
    };
  }, [formOpen, closeForm]);

  if (!form) return null;

  return (
    <div className={`fixed inset-0 z-[70] overflow-hidden ${formOpen ? "visible" : "invisible"}`} aria-hidden={!formOpen}>
      <div
        className={`absolute inset-0 bg-tgu-dark/55 transition-opacity duration-300 ${formOpen ? "opacity-100" : "opacity-0"}`}
        onClick={closeForm}
      />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        className={`absolute right-0 top-0 h-full w-full max-w-[520px] overflow-y-auto bg-white p-6 transition-transform duration-300 ease-[cubic-bezier(.2,.8,.2,1)] ${
          formOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 id="drawer-title" className="font-heading text-2xl font-semibold">
              {c.registration.formTitle}
            </h2>
            <p className="mt-1 text-sm text-tgu-ink-secondary">
              {[c.event.dateLabel, c.registration.formSubtitle].filter(Boolean).join(" · ")}
            </p>
          </div>
          <button
            type="button"
            onClick={closeForm}
            aria-label="Закрыть"
            className="grid h-[38px] w-[38px] shrink-0 place-items-center rounded-full border border-tgu-border hover:border-tgu-brand"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {formOpen && <DynamicForm formId={form.id} schema={form.schema} />}
      </div>
    </div>
  );
}
