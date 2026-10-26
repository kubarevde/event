"use client";

import { Check, CloudOff, ExternalLink, History, Loader2, LogOut, RotateCcw, Settings2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { FieldsEditor } from "@/components/admin/SchemaEditor";
import type { SiteContent } from "@/lib/content";
import { CONTENT_SCHEMA } from "@/lib/content-schema";
import { getAt } from "@/lib/paths";
import { useSite } from "./edit";

type Obj = Record<string, unknown>;

function formatTs(ts: number) {
  return new Date(ts).toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function SettingsPanel({ forms, onClose }: { forms: { id: string; name: string }[]; onClose: () => void }) {
  const { c, set } = useSite();
  const [tab, setTab] = useState(CONTENT_SCHEMA[0].id);
  const section = CONTENT_SCHEMA.find((s) => s.id === tab)!;
  return (
    <div className="fixed inset-0 z-[80] flex justify-end bg-slate-900/40" onClick={onClose}>
      <div className="flex h-full w-full max-w-[640px] bg-slate-50 text-slate-900 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <nav className="w-44 shrink-0 overflow-y-auto border-r border-slate-200 bg-white p-2">
          {CONTENT_SCHEMA.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setTab(s.id)}
              className={`block w-full rounded-md px-3 py-2 text-left text-sm ${
                tab === s.id ? "bg-tgu-brand/10 font-medium text-tgu-brand" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {s.title}
            </button>
          ))}
        </nav>
        <div className="min-w-0 flex-1 overflow-y-auto p-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 className="font-heading text-lg font-semibold">{section.title}</h2>
              {section.description && <p className="mt-1 text-sm text-slate-500">{section.description}</p>}
            </div>
            <button type="button" onClick={onClose} className="rounded-md p-1.5 text-slate-500 hover:bg-slate-200" aria-label="Закрыть">
              <X className="h-5 w-5" />
            </button>
          </div>
          <FieldsEditor
            fields={section.fields}
            value={getAt(c, section.path) as Obj}
            onChange={(next) => set(section.path, next)}
            ctx={{ forms }}
          />
        </div>
      </div>
    </div>
  );
}

function VersionsPanel({ onClose }: { onClose: () => void }) {
  const { replace, setHasChanges, flush } = useSite();
  const [versions, setVersions] = useState<{ id: number; createdAt: number }[] | null>(null);
  const [busy, setBusy] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/admin/content/versions")
      .then((r) => r.json())
      .then(setVersions)
      .catch(() => setVersions([]));
  }, []);

  const restore = async (id: number) => {
    if (!confirm("Заменить текущий черновик этой версией? Сайт изменится только после публикации.")) return;
    setBusy(id);
    await flush();
    const res = await fetch(`/api/admin/content/versions/${id}`, { method: "POST" });
    const json = await res.json();
    setBusy(null);
    if (res.ok) {
      replace(json.content as SiteContent);
      setHasChanges(json.hasChanges);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center bg-slate-900/40 p-4 pt-20" onClick={onClose}>
      <div className="w-full max-w-md rounded-xl bg-white p-5 text-slate-900 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold">История публикаций</h2>
          <button type="button" onClick={onClose} className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100" aria-label="Закрыть">
            <X className="h-5 w-5" />
          </button>
        </div>
        {versions === null ? (
          <Loader2 className="mx-auto my-6 h-5 w-5 animate-spin text-slate-400" />
        ) : versions.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-500">Публикаций пока не было.</p>
        ) : (
          <ul className="max-h-[60vh] divide-y divide-slate-100 overflow-y-auto">
            {versions.map((v, i) => (
              <li key={v.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                <span>
                  {formatTs(v.createdAt)}
                  {i === 0 && <span className="ml-2 rounded bg-emerald-50 px-1.5 py-0.5 text-xs text-emerald-700">на сайте</span>}
                </span>
                <button
                  type="button"
                  onClick={() => restore(v.id)}
                  disabled={busy !== null}
                  className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-tgu-brand hover:bg-tgu-brand/10 disabled:opacity-50"
                >
                  {busy === v.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RotateCcw className="h-3.5 w-3.5" />}
                  В черновик
                </button>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-3 text-xs text-slate-500">Хранятся последние 50 публикаций.</p>
      </div>
    </div>
  );
}

/** Панель режима правки: статус сохранения, настройки, история и публикация. */
export default function EditBar({ forms }: { forms: { id: string; name: string }[] }) {
  const { c, saveState, hasChanges, setHasChanges, replace, flush } = useSite();
  const [panel, setPanel] = useState<"settings" | "versions" | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  const dirty = hasChanges || saveState === "pending" || saveState === "saving";

  const publish = async () => {
    setPublishing(true);
    await flush();
    const res = await fetch("/api/admin/content/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(c),
    });
    setPublishing(false);
    if (res.ok) {
      setHasChanges(false);
      setPublished(true);
      setTimeout(() => setPublished(false), 2500);
    } else {
      alert("Не удалось опубликовать. Обновите страницу и попробуйте снова.");
    }
  };

  const discard = async () => {
    if (!confirm("Отменить все неопубликованные изменения и вернуть то, что сейчас на сайте?")) return;
    await flush();
    const res = await fetch("/api/admin/content", { method: "DELETE" });
    if (res.ok) {
      const json = await res.json();
      replace(json.content as SiteContent);
      setHasChanges(false);
    }
  };

  const status =
    saveState === "error" ? (
      <span className="flex items-center gap-1.5 text-red-300">
        <CloudOff className="h-4 w-4" /> Не сохранилось — проверьте связь
      </span>
    ) : saveState === "saved" ? (
      <span className="flex items-center gap-1.5 text-white/60">
        <Check className="h-4 w-4" /> {hasChanges ? "Черновик сохранён, не опубликован" : "Опубликовано"}
      </span>
    ) : (
      <span className="flex items-center gap-1.5 text-white/60">
        <Loader2 className="h-4 w-4 animate-spin" /> Сохранение…
      </span>
    );

  const btn = "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-white/85 hover:bg-white/10";

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[60] flex h-14 items-center gap-2 border-b border-white/10 bg-slate-900 px-3 text-white shadow-lg md:px-5">
        <span className="hidden font-heading text-sm font-semibold sm:inline">Правка страницы</span>
        <span className="hidden text-xs md:inline">{status}</span>
        <div className="ml-auto flex items-center gap-1">
          <button type="button" className={btn} onClick={() => setPanel("settings")}>
            <Settings2 className="h-4 w-4" />
            <span className="hidden sm:inline">Настройки</span>
          </button>
          <button type="button" className={btn} onClick={() => setPanel("versions")}>
            <History className="h-4 w-4" />
            <span className="hidden lg:inline">История</span>
          </button>
          {hasChanges && (
            <button type="button" className={btn} onClick={discard}>
              <RotateCcw className="h-4 w-4" />
              <span className="hidden lg:inline">Отменить изменения</span>
            </button>
          )}
          <a href="/" target="_blank" className={`${btn} hidden md:inline-flex`}>
            <ExternalLink className="h-4 w-4" />
            <span className="hidden lg:inline">Сайт</span>
          </a>
          <button
            type="button"
            onClick={publish}
            disabled={!dirty || publishing}
            className="ml-1 inline-flex items-center gap-1.5 rounded-md bg-tgu-brand px-3.5 py-1.5 text-sm font-semibold hover:bg-tgu-brand-dark disabled:opacity-40"
          >
            {publishing ? <Loader2 className="h-4 w-4 animate-spin" /> : published ? <Check className="h-4 w-4" /> : null}
            {published ? "Опубликовано" : "Опубликовать"}
          </button>
          <a href="/admin" className={btn} title="В админку">
            <LogOut className="h-4 w-4" />
          </a>
        </div>
      </div>
      {panel === "settings" && <SettingsPanel forms={forms} onClose={() => setPanel(null)} />}
      {panel === "versions" && <VersionsPanel onClose={() => setPanel(null)} />}
      <div className="pointer-events-none fixed bottom-4 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-slate-900/90 px-4 py-2 text-xs text-white/80 shadow-lg">
        Кликните по тексту, чтобы изменить его · наведите на картинку, чтобы заменить
      </div>
    </>
  );
}
