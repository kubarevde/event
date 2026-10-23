"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { FormField, FormSchema, SubmissionValue } from "@/lib/forms";
import { track } from "@/lib/track";

interface DynamicFormProps {
  formId: string;
  schema: FormSchema;
  /** Режим предпросмотра в админке: без отправки и аналитики. */
  preview?: boolean;
}

const inputClass =
  "w-full border border-white/15 bg-white/5 px-3.5 py-2.5 font-body text-sm text-white placeholder:text-white/35 outline-none transition-colors focus:border-tgu-brand focus:bg-white/[0.07]";

function initialValues(schema: FormSchema) {
  const values: Record<string, SubmissionValue> = {};
  for (const f of schema.fields) {
    values[f.id] = f.type === "checkbox" || f.type === "consent" ? false : f.type === "checkboxes" ? [] : "";
  }
  return values;
}

function ConsentLabel({ field }: { field: FormField }) {
  if (!field.linkUrl) return <>{field.label}</>;
  return (
    <a href={field.linkUrl} target="_blank" rel="noopener noreferrer" className="text-tgu-brand hover:underline">
      {field.label}
    </a>
  );
}

export default function DynamicForm({ formId, schema, preview = false }: DynamicFormProps) {
  const [values, setValues] = useState(() => initialValues(schema));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const startedAt = useRef<number | null>(null);
  const rootRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (preview) setValues(initialValues(schema));
  }, [preview, schema]);

  useEffect(() => {
    if (preview || !rootRef.current) return;
    const el = rootRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          track("form_view", { label: formId });
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [formId, preview]);

  const markStarted = () => {
    if (startedAt.current === null) {
      startedAt.current = Date.now();
      if (!preview) track("form_start", { label: formId });
    }
  };

  const set = (id: string, value: SubmissionValue) => {
    markStarted();
    setValues((v) => ({ ...v, [id]: value }));
    if (errors[id]) setErrors(({ [id]: _, ...rest }) => rest);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (preview) return;
    setStatus("sending");
    setMessage("");
    const website = (new FormData(e.currentTarget).get("website") as string) || "";
    try {
      const res = await fetch(`/api/forms/${formId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: values, website, startedAt: startedAt.current }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus("done");
        return;
      }
      if (json.errors) setErrors(json.errors);
      setMessage(json.error || "Проверьте правильность заполнения полей");
      setStatus("error");
    } catch {
      setMessage("Не удалось отправить заявку. Проверьте подключение к интернету.");
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <div className="py-6 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-tgu-brand" strokeWidth={1.5} aria-hidden />
        <p className="mt-4 font-heading text-lg font-semibold text-white">{schema.successTitle}</p>
        <p className="mt-2 whitespace-pre-line font-body text-sm text-white/70">{schema.successMessage}</p>
      </div>
    );
  }

  return (
    <form ref={rootRef} onSubmit={onSubmit} noValidate className="space-y-5">
      {schema.title && <p className="font-heading text-lg font-semibold text-white">{schema.title}</p>}
      {schema.description && (
        <p className="-mt-2 whitespace-pre-line font-body text-sm text-white/65">{schema.description}</p>
      )}

      {/* Скрытое поле-ловушка для ботов */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
        {schema.fields.map((field) => {
          const error = errors[field.id];
          const id = `${formId}-${field.id}`;
          const span = field.half ? "" : "sm:col-span-2";
          const label = (
            <span className="mb-1.5 block font-body text-xs font-medium text-white/75">
              {field.label}
              {field.required && <span className="text-tgu-brand"> *</span>}
            </span>
          );
          const help = field.help && <span className="mt-1 block font-body text-xs text-white/45">{field.help}</span>;
          const err = error && <span className="mt-1 block font-body text-xs text-red-400">{error}</span>;

          if (field.type === "checkbox" || field.type === "consent") {
            return (
              <div key={field.id} className={span}>
                <label className="flex cursor-pointer items-start gap-2.5">
                  <input
                    type="checkbox"
                    checked={values[field.id] === true}
                    onChange={(e) => set(field.id, e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-tgu-brand"
                  />
                  <span className="font-body text-xs leading-relaxed text-white/70">
                    {field.type === "consent" ? <ConsentLabel field={field} /> : field.label}
                    {field.required && <span className="text-tgu-brand"> *</span>}
                  </span>
                </label>
                {help}
                {err}
              </div>
            );
          }

          if (field.type === "radio" || field.type === "checkboxes") {
            const multi = field.type === "checkboxes";
            const current = values[field.id] ?? (multi ? [] : "");
            return (
              <fieldset key={field.id} className={span}>
                <legend className="mb-1.5 block font-body text-xs font-medium text-white/75">
                  {field.label}
                  {field.required && <span className="text-tgu-brand"> *</span>}
                </legend>
                <div className="flex flex-wrap gap-2">
                  {field.options.map((opt) => {
                    const checked = multi ? (current as string[]).includes(opt) : current === opt;
                    return (
                      <label
                        key={opt}
                        className={`cursor-pointer border px-3.5 py-2 font-body text-sm transition-colors ${
                          checked
                            ? "border-tgu-brand bg-tgu-brand/15 text-white"
                            : "border-white/15 text-white/70 hover:border-white/30"
                        }`}
                      >
                        <input
                          type={multi ? "checkbox" : "radio"}
                          name={id}
                          className="sr-only"
                          checked={checked}
                          onChange={() =>
                            set(
                              field.id,
                              multi
                                ? checked
                                  ? (current as string[]).filter((v) => v !== opt)
                                  : [...(current as string[]), opt]
                                : opt
                            )
                          }
                        />
                        {opt}
                      </label>
                    );
                  })}
                </div>
                {help}
                {err}
              </fieldset>
            );
          }

          return (
            <label key={field.id} htmlFor={id} className={`block ${span}`}>
              {label}
              {field.type === "textarea" ? (
                <textarea
                  id={id}
                  rows={4}
                  value={(values[field.id] as string) ?? ""}
                  placeholder={field.placeholder}
                  onChange={(e) => set(field.id, e.target.value)}
                  className={`${inputClass} resize-y`}
                />
              ) : field.type === "select" ? (
                <select
                  id={id}
                  value={(values[field.id] as string) ?? ""}
                  onChange={(e) => set(field.id, e.target.value)}
                  className={`${inputClass} [&>option]:text-tgu-dark-text`}
                >
                  <option value="">{field.placeholder || "Выберите…"}</option>
                  {field.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={id}
                  type={field.type === "number" ? "text" : field.type}
                  inputMode={field.type === "number" ? "decimal" : undefined}
                  autoComplete={
                    field.type === "email" ? "email" : field.type === "tel" ? "tel" : field.id === "name" ? "name" : undefined
                  }
                  value={(values[field.id] as string) ?? ""}
                  placeholder={field.placeholder}
                  onChange={(e) => set(field.id, e.target.value)}
                  className={inputClass}
                />
              )}
              {help}
              {err}
            </label>
          );
        })}
      </div>

      {message && <p className="font-body text-sm text-red-400">{message}</p>}

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex w-full items-center justify-center rounded-md bg-tgu-brand px-6 py-3 font-body text-base font-medium text-white shadow-sm transition-colors hover:bg-tgu-brand-dark disabled:opacity-60"
      >
        {status === "sending" && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />}
        {schema.submitLabel}
      </button>
    </form>
  );
}
