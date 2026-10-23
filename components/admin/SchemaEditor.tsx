"use client";

import { ArrowDown, ArrowUp, ChevronDown, Loader2, Plus, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import type { SchemaField } from "@/lib/content-schema";
import { ICON_NAMES, getIcon } from "@/lib/icons";
import { Label, btnCls, inputCls } from "./ui";

type Obj = Record<string, unknown>;

export interface EditorContext {
  forms: { id: string; name: string }[];
}

function move<T>(arr: T[], from: number, to: number) {
  if (to < 0 || to >= arr.length) return arr;
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function ItemControls({
  index,
  length,
  onMove,
  onRemove,
}: {
  index: number;
  length: number;
  onMove: (to: number) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex shrink-0 items-center">
      <button type="button" className={btnCls.ghost} disabled={index === 0} onClick={() => onMove(index - 1)} title="Выше">
        <ArrowUp className="h-4 w-4" />
      </button>
      <button
        type="button"
        className={btnCls.ghost}
        disabled={index === length - 1}
        onClick={() => onMove(index + 1)}
        title="Ниже"
      >
        <ArrowDown className="h-4 w-4" />
      </button>
      <button type="button" className={btnCls.danger} onClick={onRemove} title="Удалить">
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

export function ImageInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const upload = async (file: File) => {
    setLoading(true);
    setError("");
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body });
    const json = await res.json().catch(() => ({}));
    setLoading(false);
    if (res.ok) onChange(json.url);
    else setError(json.error || "Не удалось загрузить файл");
  };

  return (
    <div className="flex items-start gap-3">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-slate-800">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="max-h-full max-w-full object-contain" />
        ) : (
          <span className="text-[10px] text-slate-400">нет</span>
        )}
      </div>
      <div className="min-w-0 flex-1 space-y-2">
        <input className={inputCls} value={value} onChange={(e) => onChange(e.target.value)} placeholder="/uploads/… или https://…" />
        <div className="flex items-center gap-2">
          <button type="button" className={btnCls.secondary} onClick={() => fileRef.current?.click()} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            Загрузить файл
          </button>
          {value && (
            <button type="button" className={btnCls.danger} onClick={() => onChange("")}>
              Убрать
            </button>
          )}
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) upload(file);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}

function IconPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const Current = getIcon(value);
  return (
    <div>
      <button type="button" className={btnCls.secondary} onClick={() => setOpen((v) => !v)}>
        <Current className="h-4 w-4 text-tgu-brand" />
        {value || "Выбрать"}
        <ChevronDown className="h-3.5 w-3.5" />
      </button>
      {open && (
        <div className="mt-2 grid grid-cols-8 gap-1 rounded-md border border-slate-200 bg-white p-2 sm:grid-cols-12">
          {ICON_NAMES.map((name) => {
            const Icon = getIcon(name);
            return (
              <button
                key={name}
                type="button"
                title={name}
                onClick={() => {
                  onChange(name);
                  setOpen(false);
                }}
                className={`flex h-9 items-center justify-center rounded ${
                  name === value ? "bg-tgu-brand/15 text-tgu-brand" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Icon className="h-4 w-4" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StringsInput({ value, onChange, itemLabel }: { value: string[]; onChange: (v: string[]) => void; itemLabel: string }) {
  return (
    <div className="space-y-2">
      {value.map((item, i) => (
        <div key={i} className="flex items-start gap-1">
          <textarea
            rows={1}
            className={`${inputCls} min-h-[38px] resize-y`}
            value={item}
            onChange={(e) => onChange(value.map((v, j) => (j === i ? e.target.value : v)))}
          />
          <ItemControls
            index={i}
            length={value.length}
            onMove={(to) => onChange(move(value, i, to))}
            onRemove={() => onChange(value.filter((_, j) => j !== i))}
          />
        </div>
      ))}
      <button type="button" className={btnCls.secondary} onClick={() => onChange([...value, ""])}>
        <Plus className="h-4 w-4" />
        {itemLabel}
      </button>
    </div>
  );
}

function ListInput({
  field,
  value,
  onChange,
  ctx,
}: {
  field: Extract<SchemaField, { kind: "list" }>;
  value: Obj[];
  onChange: (v: Obj[]) => void;
  ctx: EditorContext;
}) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="space-y-2">
      {value.map((item, i) => (
        <div key={i} className="rounded-md border border-slate-200 bg-slate-50/60">
          <div className="flex items-center gap-2 px-3 py-1.5">
            <button
              type="button"
              className="flex min-w-0 flex-1 items-center gap-2 py-1 text-left text-sm"
              onClick={() => setOpen(open === i ? null : i)}
            >
              <ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 transition ${open === i ? "rotate-180" : ""}`} />
              <span className="truncate font-medium text-slate-800">
                {String(item[field.titleKey] || `${field.itemLabel} ${i + 1}`)}
              </span>
            </button>
            <ItemControls
              index={i}
              length={value.length}
              onMove={(to) => {
                onChange(move(value, i, to));
                setOpen(open === i ? to : open);
              }}
              onRemove={() => {
                if (confirm(`Удалить «${String(item[field.titleKey] || field.itemLabel)}»?`)) {
                  onChange(value.filter((_, j) => j !== i));
                  setOpen(null);
                }
              }}
            />
          </div>
          {open === i && (
            <div className="border-t border-slate-200 bg-white p-4">
              <FieldsEditor
                fields={field.fields}
                value={item}
                onChange={(next) => onChange(value.map((v, j) => (j === i ? next : v)))}
                ctx={ctx}
              />
            </div>
          )}
        </div>
      ))}
      <button
        type="button"
        className={btnCls.secondary}
        onClick={() => {
          onChange([...value, structuredClone(field.newItem)]);
          setOpen(value.length);
        }}
      >
        <Plus className="h-4 w-4" />
        {field.itemLabel}
      </button>
    </div>
  );
}

function FieldInput({ field, value, onChange, ctx }: { field: SchemaField; value: unknown; onChange: (v: unknown) => void; ctx: EditorContext }) {
  switch (field.kind) {
    case "boolean":
      return (
        <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-slate-800">
          <input
            type="checkbox"
            className="h-4 w-4 accent-tgu-brand"
            checked={value === true}
            onChange={(e) => onChange(e.target.checked)}
          />
          {field.label}
        </label>
      );
    case "textarea":
      return (
        <Label label={field.label} help={field.help}>
          <textarea rows={3} className={`${inputCls} resize-y`} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />
        </Label>
      );
    case "datetime":
      return (
        <Label label={field.label} help={field.help}>
          <input type="datetime-local" className={inputCls} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />
        </Label>
      );
    case "color":
      return (
        <Label label={field.label} help={field.help}>
          <div className="flex gap-2">
            <input
              type="color"
              className="h-[38px] w-14 cursor-pointer rounded-md border border-slate-300 bg-white p-1"
              value={/^#[0-9a-f]{6}$/i.test(String(value)) ? String(value) : "#000000"}
              onChange={(e) => onChange(e.target.value.toUpperCase())}
            />
            <input className={inputCls} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />
          </div>
        </Label>
      );
    case "image":
      return (
        <Label label={field.label} help={field.help}>
          <ImageInput value={String(value ?? "")} onChange={onChange} />
        </Label>
      );
    case "icon":
      return (
        <div>
          <span className="mb-1 block text-xs font-medium text-slate-700">{field.label}</span>
          <IconPicker value={String(value ?? "")} onChange={onChange} />
        </div>
      );
    case "select":
      return (
        <Label label={field.label} help={field.help}>
          <select className={inputCls} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)}>
            {field.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Label>
      );
    case "form":
      return (
        <Label label={field.label} help={field.help}>
          <select className={inputCls} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)}>
            {ctx.forms.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </Label>
      );
    case "strings":
      return (
        <div>
          <span className="mb-1.5 block text-xs font-medium text-slate-700">{field.label}</span>
          <StringsInput value={(value as string[]) ?? []} onChange={onChange} itemLabel={field.itemLabel ?? "Добавить"} />
        </div>
      );
    case "list":
      return (
        <div>
          <span className="mb-1.5 block text-xs font-medium text-slate-700">{field.label}</span>
          <ListInput field={field} value={(value as Obj[]) ?? []} onChange={onChange} ctx={ctx} />
        </div>
      );
    default:
      return (
        <Label label={field.label} help={field.help}>
          <input
            type={field.kind === "url" ? "url" : "text"}
            className={inputCls}
            value={String(value ?? "")}
            onChange={(e) => onChange(e.target.value)}
          />
        </Label>
      );
  }
}

export function FieldsEditor({
  fields,
  value,
  onChange,
  ctx,
}: {
  fields: SchemaField[];
  value: Obj;
  onChange: (v: Obj) => void;
  ctx: EditorContext;
}) {
  return (
    <div className="space-y-4">
      {fields.map((field) => (
        <FieldInput
          key={field.key}
          field={field}
          value={value[field.key]}
          onChange={(v) => onChange({ ...value, [field.key]: v })}
          ctx={ctx}
        />
      ))}
    </div>
  );
}
