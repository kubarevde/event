"use client";

import { ChevronDown, Download, Trash2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Fragment, useState } from "react";
import { SUBMISSION_STATUSES, formatValue, type FormField, type SubmissionValue } from "@/lib/forms";
import { RANGE_OPTIONS } from "@/lib/ranges";
import { btnCls, inputCls, selectCls } from "./ui";

export interface Row {
  id: number;
  formId: string;
  formName: string;
  date: string;
  status: string;
  note: string;
  data: Record<string, SubmissionValue>;
  source: string;
  geo: string;
}

interface Props {
  rows: Row[];
  forms: { id: string; name: string; fields: FormField[] }[];
  filters: { form: string; status: string; range: string };
}

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-50 text-blue-700 ring-blue-200",
  in_progress: "bg-amber-50 text-amber-700 ring-amber-200",
  approved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  paid: "bg-emerald-100 text-emerald-800 ring-emerald-300",
  rejected: "bg-slate-100 text-slate-500 ring-slate-200",
};

export default function SubmissionsTable({ rows: initialRows, forms, filters }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [rows, setRows] = useState(initialRows);
  const [open, setOpen] = useState<number | null>(null);

  const setFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  };

  const patch = async (id: number, body: { status?: string; note?: string }) => {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...body } : r)));
    await fetch(`/api/admin/submissions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (body.status) router.refresh();
  };

  const remove = async (id: number) => {
    if (!confirm("Удалить заявку? Это необратимо.")) return;
    await fetch(`/api/admin/submissions/${id}`, { method: "DELETE" });
    setRows((rs) => rs.filter((r) => r.id !== id));
    router.refresh();
  };

  // Колонки таблицы: первые текстовые поля выбранной формы (или общие для всех).
  const selected = forms.find((f) => f.id === filters.form);
  const fieldsFor = (formId: string) => forms.find((f) => f.id === formId)?.fields ?? [];
  const columns = (selected ? selected.fields : forms[0]?.fields ?? [])
    .filter((f) => !["consent", "checkbox", "textarea"].includes(f.type))
    .slice(0, 4);

  const exportParams = new URLSearchParams();
  if (filters.form) exportParams.set("form", filters.form);
  if (filters.status) exportParams.set("status", filters.status);
  if (filters.range) exportParams.set("range", filters.range);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <select className={selectCls} value={filters.form} onChange={(e) => setFilter("form", e.target.value)}>
          <option value="">Все формы</option>
          {forms.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
        <select className={selectCls} value={filters.status} onChange={(e) => setFilter("status", e.target.value)}>
          <option value="">Все статусы</option>
          {SUBMISSION_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <select className={selectCls} value={filters.range} onChange={(e) => setFilter("range", e.target.value)}>
          {RANGE_OPTIONS.map((r) => (
            <option key={r.value} value={r.value === "all" ? "" : r.value}>
              {r.label}
            </option>
          ))}
        </select>
        <a href={`/api/admin/submissions/export?${exportParams.toString()}`} className={`${btnCls.primary} ml-auto`}>
          <Download className="h-4 w-4" />
          Выгрузить в Excel (CSV)
        </a>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="w-8 px-3 py-2.5" />
              <th className="px-3 py-2.5 font-medium">Дата</th>
              {columns.map((c) => (
                <th key={c.id} className="px-3 py-2.5 font-medium">
                  {c.label}
                </th>
              ))}
              {!selected && forms.length > 1 && <th className="px-3 py-2.5 font-medium">Форма</th>}
              <th className="px-3 py-2.5 font-medium">Статус</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((r) => (
              <Fragment key={r.id}>
                <tr className={`cursor-pointer hover:bg-slate-50 ${r.status === "new" ? "font-medium" : ""}`} onClick={() => setOpen(open === r.id ? null : r.id)}>
                  <td className="px-3 py-2.5 text-slate-400">
                    <ChevronDown className={`h-4 w-4 transition ${open === r.id ? "rotate-180" : ""}`} />
                  </td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-slate-500">{r.date}</td>
                  {columns.map((c) => (
                    <td key={c.id} className="max-w-[220px] truncate px-3 py-2.5 text-slate-800">
                      {formatValue(r.data[c.id])}
                    </td>
                  ))}
                  {!selected && forms.length > 1 && <td className="px-3 py-2.5 text-slate-500">{r.formName}</td>}
                  <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={r.status}
                      onChange={(e) => patch(r.id, { status: e.target.value })}
                      className={`rounded-full border-0 px-2.5 py-1 text-xs font-medium ring-1 ${STATUS_COLORS[r.status] ?? ""}`}
                    >
                      {SUBMISSION_STATUSES.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
                {open === r.id && (
                  <tr className="bg-slate-50/70">
                    <td />
                    <td colSpan={columns.length + 3} className="px-3 pb-5 pt-2">
                      <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                        {fieldsFor(r.formId).map((f) => (
                          <div key={f.id}>
                            <dt className="text-xs text-slate-500">{f.label}</dt>
                            <dd className="whitespace-pre-line break-words text-sm text-slate-900">
                              {formatValue(r.data[f.id]) || "—"}
                            </dd>
                          </div>
                        ))}
                        <div>
                          <dt className="text-xs text-slate-500">Источник</dt>
                          <dd className="text-sm text-slate-900">{r.source || "прямой заход"}</dd>
                        </div>
                        <div>
                          <dt className="text-xs text-slate-500">География</dt>
                          <dd className="text-sm text-slate-900">{r.geo || "не определена"}</dd>
                        </div>
                        <div>
                          <dt className="text-xs text-slate-500">Форма</dt>
                          <dd className="text-sm text-slate-900">{r.formName}</dd>
                        </div>
                      </dl>
                      <label className="mt-4 block max-w-2xl">
                        <span className="mb-1 block text-xs text-slate-500">Комментарий менеджера (виден только в админке и выгрузке)</span>
                        <textarea
                          rows={2}
                          className={`${inputCls} resize-y`}
                          defaultValue={r.note}
                          onBlur={(e) => e.target.value !== r.note && patch(r.id, { note: e.target.value })}
                        />
                      </label>
                      <button type="button" className={`${btnCls.danger} mt-3`} onClick={() => remove(r.id)}>
                        <Trash2 className="h-4 w-4" />
                        Удалить заявку
                      </button>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length + 4} className="px-3 py-10 text-center text-slate-500">
                  Заявок нет
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-slate-500">Всего: {rows.length}</p>
    </div>
  );
}
