"use client";

import { ArrowDown, ArrowUp, Check, ChevronDown, Copy, Loader2, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DynamicForm from "@/components/ui/DynamicForm";
import {
  FIELD_TYPES,
  TYPES_WITH_OPTIONS,
  newField,
  type FieldType,
  type FormField,
  type FormSchema,
} from "@/lib/forms";
import { Card, Label, PageHeader, btnCls, inputCls, selectCls } from "./ui";

interface Props {
  id: string;
  initialName: string;
  initialSchema: FormSchema;
  isLanding: boolean;
  submissionCount: number;
}

function FieldEditor({ field, onChange }: { field: FormField; onChange: (f: FormField) => void }) {
  const set = <K extends keyof FormField>(key: K, value: FormField[K]) => onChange({ ...field, [key]: value });
  const hasOptions = TYPES_WITH_OPTIONS.includes(field.type);
  const isCheck = field.type === "checkbox" || field.type === "consent";

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Label label="Тип поля">
        <select
          className={inputCls}
          value={field.type}
          onChange={(e) => {
            const type = e.target.value as FieldType;
            onChange({
              ...field,
              type,
              options: TYPES_WITH_OPTIONS.includes(type) && field.options.length === 0 ? ["Вариант 1", "Вариант 2"] : field.options,
            });
          }}
        >
          {FIELD_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </Label>
      <Label label="Ключ в выгрузке" help="Латиница, цифры и _">
        <input
          className={inputCls}
          value={field.id}
          onChange={(e) => set("id", e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))}
        />
      </Label>
      <div className="sm:col-span-2">
        <Label label={field.type === "consent" ? "Текст согласия" : "Название поля"}>
          <input className={inputCls} value={field.label} onChange={(e) => set("label", e.target.value)} />
        </Label>
      </div>
      {field.type === "consent" && (
        <div className="sm:col-span-2">
          <Label label="Ссылка на документ" help="Текст согласия станет ссылкой">
            <input className={inputCls} value={field.linkUrl} onChange={(e) => set("linkUrl", e.target.value)} />
          </Label>
        </div>
      )}
      {!isCheck && field.type !== "radio" && field.type !== "checkboxes" && (
        <Label label="Подсказка внутри поля (placeholder)">
          <input className={inputCls} value={field.placeholder} onChange={(e) => set("placeholder", e.target.value)} />
        </Label>
      )}
      <Label label="Пояснение под полем">
        <input className={inputCls} value={field.help} onChange={(e) => set("help", e.target.value)} />
      </Label>
      {hasOptions && (
        <div className="sm:col-span-2">
          <Label label="Варианты ответа" help="Каждый вариант с новой строки">
            <textarea
              rows={Math.max(3, field.options.length + 1)}
              className={`${inputCls} resize-y`}
              value={field.options.join("\n")}
              onChange={(e) => set("options", e.target.value.split("\n"))}
              onBlur={() => set("options", field.options.map((o) => o.trim()).filter(Boolean))}
            />
          </Label>
        </div>
      )}
      <div className="flex flex-wrap gap-5 sm:col-span-2">
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" className="h-4 w-4 accent-tgu-brand" checked={field.required} onChange={(e) => set("required", e.target.checked)} />
          Обязательное
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" className="h-4 w-4 accent-tgu-brand" checked={field.half} onChange={(e) => set("half", e.target.checked)} />
          В половину ширины
        </label>
      </div>
    </div>
  );
}

export default function FormBuilder({ id, initialName, initialSchema, isLanding, submissionCount }: Props) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [schema, setSchema] = useState(initialSchema);
  const [savedSnapshot, setSavedSnapshot] = useState(JSON.stringify({ name: initialName, schema: initialSchema }));
  const [open, setOpen] = useState<number | null>(null);
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");
  const [error, setError] = useState("");
  const [addType, setAddType] = useState<FieldType>("text");
  const dirty = JSON.stringify({ name, schema }) !== savedSnapshot;

  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  const setFields = (fields: FormField[]) => setSchema({ ...schema, fields });
  const moveField = (from: number, to: number) => {
    if (to < 0 || to >= schema.fields.length) return;
    const fields = [...schema.fields];
    const [f] = fields.splice(from, 1);
    fields.splice(to, 0, f);
    setFields(fields);
    setOpen(open === from ? to : open);
  };

  const save = async () => {
    setState("saving");
    setError("");
    const clean = {
      ...schema,
      fields: schema.fields.map((f) => ({ ...f, options: f.options.map((o) => o.trim()).filter(Boolean) })),
    };
    const res = await fetch(`/api/admin/forms/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, schema: clean }),
    });
    if (res.ok) {
      setSchema(clean);
      setSavedSnapshot(JSON.stringify({ name, schema: clean }));
      setState("saved");
      router.refresh();
      setTimeout(() => setState("idle"), 2000);
    } else {
      const json = await res.json().catch(() => ({}));
      setError(json.error || "Не удалось сохранить");
      setState("idle");
    }
  };

  const duplicate = async () => {
    const res = await fetch("/api/admin/forms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ copyFrom: id }),
    });
    if (res.ok) router.push(`/admin/forms/${(await res.json()).id}`);
  };

  const remove = async () => {
    const msg = submissionCount
      ? `Удалить форму и все ${submissionCount} заявок по ней? Это необратимо.`
      : "Удалить форму?";
    if (!confirm(msg)) return;
    const res = await fetch(`/api/admin/forms/${id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin/forms");
      router.refresh();
    } else {
      setError((await res.json().catch(() => ({}))).error || "Не удалось удалить");
    }
  };

  const idCounts = schema.fields.reduce<Record<string, number>>((acc, f) => ({ ...acc, [f.id]: (acc[f.id] ?? 0) + 1 }), {});

  return (
    <div>
      <PageHeader
        title={name || "Форма"}
        description={isLanding ? "Эта форма сейчас показывается на лендинге." : "Форма не привязана к лендингу — выбрать её можно в «Контент сайта → Регистрация»."}
        actions={
          <>
            <Link href={`/admin/submissions?form=${id}`} className={btnCls.secondary}>
              Заявки ({submissionCount})
            </Link>
            <button type="button" className={btnCls.secondary} onClick={duplicate}>
              <Copy className="h-4 w-4" />
              Копия
            </button>
            <button type="button" className={btnCls.secondary} onClick={remove}>
              <Trash2 className="h-4 w-4" />
            </button>
            <button type="button" className={btnCls.primary} onClick={save} disabled={!dirty || state === "saving"}>
              {state === "saving" ? <Loader2 className="h-4 w-4 animate-spin" /> : state === "saved" ? <Check className="h-4 w-4" /> : null}
              {state === "saved" ? "Сохранено" : "Сохранить"}
            </button>
          </>
        }
      />
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
      {submissionCount > 0 && (
        <p className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-800">
          По форме уже есть заявки. Если поменять ключ поля, старые ответы на него пропадут из выгрузки.
        </p>
      )}

      <div className="grid gap-6 xl:grid-cols-[1fr_440px]">
        <div className="space-y-6">
          <Card title="Настройки">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label label="Название формы (видно только в админке)">
                  <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} />
                </Label>
              </div>
              <Label label="Заголовок в форме" help="Можно оставить пустым">
                <input className={inputCls} value={schema.title} onChange={(e) => setSchema({ ...schema, title: e.target.value })} />
              </Label>
              <Label label="Текст кнопки">
                <input className={inputCls} value={schema.submitLabel} onChange={(e) => setSchema({ ...schema, submitLabel: e.target.value })} />
              </Label>
              <div className="sm:col-span-2">
                <Label label="Описание над полями">
                  <textarea rows={2} className={`${inputCls} resize-y`} value={schema.description} onChange={(e) => setSchema({ ...schema, description: e.target.value })} />
                </Label>
              </div>
              <Label label="Заголовок после отправки">
                <input className={inputCls} value={schema.successTitle} onChange={(e) => setSchema({ ...schema, successTitle: e.target.value })} />
              </Label>
              <Label label="Сообщение после отправки">
                <textarea rows={2} className={`${inputCls} resize-y`} value={schema.successMessage} onChange={(e) => setSchema({ ...schema, successMessage: e.target.value })} />
              </Label>
            </div>
          </Card>

          <Card title={`Поля (${schema.fields.length})`}>
            <div className="space-y-2">
              {schema.fields.map((field, i) => (
                <div key={i} className="rounded-md border border-slate-200 bg-slate-50/60">
                  <div className="flex items-center gap-2 px-3 py-1.5">
                    <button type="button" className="flex min-w-0 flex-1 items-center gap-2 py-1 text-left" onClick={() => setOpen(open === i ? null : i)}>
                      <ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 transition ${open === i ? "rotate-180" : ""}`} />
                      <span className="truncate text-sm font-medium text-slate-800">
                        {field.label}
                        {field.required && <span className="text-tgu-brand"> *</span>}
                      </span>
                      <span className="hidden shrink-0 rounded bg-slate-200/70 px-1.5 py-0.5 text-[11px] text-slate-600 sm:inline">
                        {FIELD_TYPES.find((t) => t.value === field.type)?.label}
                      </span>
                      {idCounts[field.id] > 1 && <span className="shrink-0 text-xs text-red-600">ключ повторяется</span>}
                    </button>
                    <button type="button" className={btnCls.ghost} disabled={i === 0} onClick={() => moveField(i, i - 1)} title="Выше">
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button type="button" className={btnCls.ghost} disabled={i === schema.fields.length - 1} onClick={() => moveField(i, i + 1)} title="Ниже">
                      <ArrowDown className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className={btnCls.danger}
                      title="Удалить"
                      onClick={() => {
                        if (confirm(`Удалить поле «${field.label}»?`)) {
                          setFields(schema.fields.filter((_, j) => j !== i));
                          setOpen(null);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  {open === i && (
                    <div className="border-t border-slate-200 bg-white p-4">
                      <FieldEditor field={field} onChange={(f) => setFields(schema.fields.map((x, j) => (j === i ? f : x)))} />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <select className={selectCls} value={addType} onChange={(e) => setAddType(e.target.value as FieldType)}>
                {FIELD_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className={btnCls.secondary}
                onClick={() => {
                  setFields([...schema.fields, newField(addType)]);
                  setOpen(schema.fields.length);
                }}
              >
                <Plus className="h-4 w-4" />
                Добавить поле
              </button>
            </div>
          </Card>
        </div>

        <div className="xl:sticky xl:top-6 xl:self-start">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Предпросмотр</p>
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <DynamicForm formId={`preview-${id}`} schema={schema} preview />
          </div>
        </div>
      </div>
    </div>
  );
}
