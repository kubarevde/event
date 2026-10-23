"use client";

import { Check, ExternalLink, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { SiteContent } from "@/lib/content";
import { CONTENT_SCHEMA } from "@/lib/content-schema";
import { FieldsEditor } from "./SchemaEditor";
import { Card, PageHeader, btnCls } from "./ui";

type Obj = Record<string, unknown>;

export default function ContentEditor({
  initial,
  forms,
}: {
  initial: SiteContent;
  forms: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [saved, setSaved] = useState(initial);
  const [content, setContent] = useState(initial);
  const [tab, setTab] = useState(CONTENT_SCHEMA[0].id);
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const dirty = JSON.stringify(saved) !== JSON.stringify(content);

  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  const save = async () => {
    setState("saving");
    const res = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });
    if (res.ok) {
      setSaved(content);
      setState("saved");
      router.refresh();
      setTimeout(() => setState("idle"), 2000);
    } else {
      setState("error");
    }
  };

  const section = CONTENT_SCHEMA.find((s) => s.id === tab)!;
  const sectionValue = (content as unknown as Record<string, Obj>)[section.path];

  return (
    <div>
      <PageHeader
        title="Контент сайта"
        description="Все тексты, картинки и блоки лендинга. Изменения появляются на сайте сразу после сохранения."
        actions={
          <>
            <a href="/" target="_blank" className={btnCls.secondary}>
              <ExternalLink className="h-4 w-4" />
              Открыть сайт
            </a>
            {dirty && (
              <button type="button" className={btnCls.secondary} onClick={() => setContent(saved)}>
                Отменить изменения
              </button>
            )}
            <button type="button" className={btnCls.primary} onClick={save} disabled={!dirty || state === "saving"}>
              {state === "saving" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : state === "saved" ? (
                <Check className="h-4 w-4" />
              ) : null}
              {state === "saved" ? "Сохранено" : "Сохранить"}
            </button>
          </>
        }
      />
      {state === "error" && <p className="mb-4 text-sm text-red-600">Не удалось сохранить. Обновите страницу и попробуйте снова.</p>}

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
          {CONTENT_SCHEMA.map((s) => {
            const value = (content as unknown as Record<string, Obj>)[s.path];
            const hidden = value && value.enabled === false;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setTab(s.id)}
                className={`shrink-0 rounded-md px-3 py-2 text-left text-sm transition ${
                  tab === s.id ? "bg-white font-medium text-tgu-brand shadow-sm ring-1 ring-slate-200" : "text-slate-600 hover:bg-white"
                }`}
              >
                {s.title}
                {hidden && <span className="ml-1.5 text-xs text-slate-400">(скрыт)</span>}
              </button>
            );
          })}
        </nav>

        <Card title={section.title}>
          {section.description && <p className="-mt-1 mb-5 text-sm text-slate-500">{section.description}</p>}
          <div className="max-w-3xl">
            <FieldsEditor
              fields={section.fields}
              value={sectionValue}
              onChange={(next) => setContent({ ...content, [section.path]: next } as SiteContent)}
              ctx={{ forms }}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
