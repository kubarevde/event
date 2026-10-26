"use client";

import { ArrowDown, ArrowUp, Copy, Eye, EyeOff, ImageUp, Loader2, Plus, Trash2 } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
} from "react";
import { SECTION_LABELS, type SectionId, type SiteContent } from "@/lib/content";
import { getAt, setAt } from "@/lib/paths";
import { track } from "@/lib/track";

// ---------- контекст сайта ----------

export type SaveState = "saved" | "saving" | "pending" | "error";

interface SiteCtx {
  c: SiteContent;
  editing: boolean;
  set: (path: string, value: unknown) => void;
  replace: (content: SiteContent) => void;
  saveState: SaveState;
  hasChanges: boolean;
  setHasChanges: (v: boolean) => void;
  flush: () => Promise<void>;
  formOpen: boolean;
  openForm: (label?: string) => void;
  closeForm: () => void;
}

const Ctx = createContext<SiteCtx | null>(null);

export function useSite() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSite outside SiteProvider");
  return ctx;
}

export function SiteProvider({
  initial,
  editing,
  initialHasChanges = false,
  children,
}: {
  initial: SiteContent;
  editing: boolean;
  initialHasChanges?: boolean;
  children: ReactNode;
}) {
  const [c, setC] = useState(initial);
  const [saveState, setSaveState] = useState<SaveState>("saved");
  const [hasChanges, setHasChanges] = useState(initialHasChanges);
  const [formOpen, setFormOpen] = useState(false);
  const latest = useRef(c);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const save = useCallback(async () => {
    timer.current = null;
    setSaveState("saving");
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(latest.current),
      });
      if (!res.ok) throw new Error();
      const json = await res.json();
      setHasChanges(json.hasChanges);
      setSaveState(timer.current ? "pending" : "saved");
    } catch {
      setSaveState("error");
    }
  }, []);

  const set = useCallback(
    (path: string, value: unknown) => {
      setC((prev) => {
        const next = setAt(prev, path, value);
        latest.current = next;
        return next;
      });
      if (!editing) return;
      setSaveState("pending");
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(save, 700);
    },
    [editing, save]
  );

  const replace = useCallback((content: SiteContent) => {
    latest.current = content;
    setC(content);
  }, []);

  const flush = useCallback(async () => {
    if (timer.current) {
      clearTimeout(timer.current);
      await save();
    }
  }, [save]);

  useEffect(() => {
    if (!editing) return;
    const warn = (e: BeforeUnloadEvent) => {
      if (timer.current) e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [editing]);

  const openForm = useCallback(
    (label?: string) => {
      if (editing) return;
      if (label) track("cta_click", { label });
      setFormOpen(true);
    },
    [editing]
  );

  return (
    <Ctx.Provider
      value={{
        c,
        editing,
        set,
        replace,
        saveState,
        hasChanges,
        setHasChanges,
        flush,
        formOpen,
        openForm,
        closeForm: () => setFormOpen(false),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

// ---------- редактируемый текст ----------

interface TProps {
  path: string;
  as?: ElementType;
  className?: string;
  /** Разрешить переносы строк */
  multiline?: boolean;
  placeholder?: string;
}

/** Текст из контента. В режиме правки — редактируется кликом прямо на странице. */
export function T({ path, as: Tag = "span", className = "", multiline = false, placeholder = "Текст" }: TProps) {
  const { c, editing, set } = useSite();
  const value = String(getAt(c, path) ?? "");
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (el && document.activeElement !== el && el.innerText !== value) el.innerText = value;
  }, [value, editing]);

  if (!editing) {
    return <Tag className={`${multiline ? "whitespace-pre-line" : ""} ${className}`}>{value}</Tag>;
  }

  return (
    <Tag
      ref={ref}
      className={`edit-text ${multiline ? "whitespace-pre-line" : ""} ${className}`}
      contentEditable="plaintext-only"
      suppressContentEditableWarning
      spellCheck
      data-placeholder={placeholder}
      onClick={(e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
        if (e.key === "Enter" && !multiline) {
          e.preventDefault();
          e.currentTarget.blur();
        }
        if (e.key === "Escape") {
          e.currentTarget.innerText = value;
          e.currentTarget.blur();
        }
        e.stopPropagation();
      }}
      onPaste={(e: React.ClipboardEvent<HTMLElement>) => {
        e.preventDefault();
        const text = e.clipboardData.getData("text/plain");
        document.execCommand("insertText", false, multiline ? text : text.replace(/\s*\n\s*/g, " "));
      }}
      onBlur={(e: React.FocusEvent<HTMLElement>) => {
        const next = e.currentTarget.innerText.replace(/ /g, " ").replace(/\n{3,}/g, "\n\n").trim();
        if (next !== value) set(path, next);
      }}
    />
  );
}

// ---------- редактируемая картинка ----------

export function Img({ path, className = "", alt, fallback }: { path: string; className?: string; alt: string; fallback?: ReactNode }) {
  const { c, editing, set } = useSite();
  const src = String(getAt(c, path) ?? "");
  const [busy, setBusy] = useState(false);
  const [broken, setBroken] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => setBroken(false), [src]);

  const img =
    src && !broken ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} className={className} loading="lazy" onError={() => setBroken(true)} />
    ) : (
      fallback ?? null
    );

  if (!editing) return img;

  const upload = async (file: File) => {
    setBusy(true);
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body });
    const json = await res.json().catch(() => ({}));
    setBusy(false);
    if (res.ok) set(path, json.url);
    else alert(json.error || "Не удалось загрузить файл");
  };

  return (
    <span className="edit-img relative block">
      {img ?? <span className={`flex items-center justify-center bg-slate-200 text-xs text-slate-500 ${className}`}>Нет фото</span>}
      <button type="button" className="edit-img__btn" onClick={() => input.current?.click()} title="Заменить картинку">
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageUp className="h-4 w-4" />}
        Заменить
      </button>
      <input
        ref={input}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) upload(f);
          e.target.value = "";
        }}
      />
    </span>
  );
}

// ---------- списки ----------

export function ItemControls({
  path,
  index,
  length,
  extra,
  className = "",
}: {
  path: string;
  index: number;
  length: number;
  extra?: ReactNode;
  className?: string;
}) {
  const { c, set } = useSite();
  const list = (getAt(c, path) as unknown[]) ?? [];
  const move = (to: number) => {
    const next = [...list];
    const [item] = next.splice(index, 1);
    next.splice(to, 0, item);
    set(path, next);
  };
  return (
    <span className={`edit-controls ${className}`} onClick={(e) => e.stopPropagation()}>
      {extra}
      <button type="button" disabled={index === 0} onClick={() => move(index - 1)} title="Раньше">
        <ArrowUp className="h-3.5 w-3.5" />
      </button>
      <button type="button" disabled={index === length - 1} onClick={() => move(index + 1)} title="Позже">
        <ArrowDown className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={() => set(path, [...list.slice(0, index + 1), structuredClone(list[index]), ...list.slice(index + 1)])}
        title="Дублировать"
      >
        <Copy className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        className="danger"
        onClick={() => {
          if (confirm("Удалить элемент?")) set(path, list.filter((_, i) => i !== index));
        }}
        title="Удалить"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </span>
  );
}

/** Список из контента. В режиме правки у каждого элемента появляются кнопки, в конце — «Добавить». */
export function List<T>({
  path,
  newItem,
  addLabel = "Добавить",
  children,
  as: Tag = "div",
  className = "",
  addClassName = "",
}: {
  path: string;
  newItem: T;
  addLabel?: string;
  children: (item: T, index: number, controls: ReactNode, itemPath: string) => ReactNode;
  as?: ElementType;
  className?: string;
  addClassName?: string;
}) {
  const { c, editing, set } = useSite();
  const items = ((getAt(c, path) as T[]) ?? []) as T[];
  return (
    <Tag className={className}>
      {items.map((item, i) =>
        children(
          item,
          i,
          editing ? <ItemControls path={path} index={i} length={items.length} /> : null,
          `${path}.${i}`
        )
      )}
      {editing && (
        <button
          type="button"
          className={`edit-add ${addClassName}`}
          onClick={() => set(path, [...items, structuredClone(newItem)])}
        >
          <Plus className="h-4 w-4" />
          {addLabel}
        </button>
      )}
    </Tag>
  );
}

// ---------- блоки страницы ----------

export function Section({
  id,
  className = "",
  children,
}: {
  id: SectionId;
  className?: string;
  children: ReactNode;
}) {
  const { c, editing, set } = useSite();
  const enabled = (c[id] as { enabled: boolean }).enabled;
  if (!enabled && !editing) return null;

  const order = c.order;
  const pos = order.indexOf(id);
  const move = (to: number) => {
    const next = [...order];
    next.splice(pos, 1);
    next.splice(to, 0, id);
    set("order", next);
  };

  return (
    <section id={id} className={`relative ${className} ${editing && !enabled ? "edit-hidden" : ""}`}>
      {editing && (
        <div className="edit-section-bar">
          <span className="font-semibold">{SECTION_LABELS[id]}</span>
          {!enabled && <span className="opacity-70">скрыт</span>}
          <button type="button" disabled={pos === 0} onClick={() => move(pos - 1)} title="Блок выше">
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
          <button type="button" disabled={pos === order.length - 1} onClick={() => move(pos + 1)} title="Блок ниже">
            <ArrowDown className="h-3.5 w-3.5" />
          </button>
          <button type="button" onClick={() => set(`${id}.enabled`, !enabled)} title={enabled ? "Скрыть блок" : "Показать блок"}>
            {enabled ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {enabled ? "Скрыть" : "Показать"}
          </button>
        </div>
      )}
      {children}
    </section>
  );
}

/** Переключатель «показывать / скрыть» для части блока (например, карточки площадки). */
export function VisibilityToggle({ path, label }: { path: string; label: string }) {
  const { c, editing, set } = useSite();
  if (!editing) return null;
  const on = getAt(c, path) === true;
  return (
    <button type="button" className="edit-chip" onClick={() => set(path, !on)}>
      {on ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
      {on ? `Скрыть: ${label}` : `Показать: ${label}`}
    </button>
  );
}

// ---------- кнопки ----------

/** Кнопка с текстом из контента: открывает форму или прокручивает к блоку. В режиме правки — редактируемый текст. */
export function Cta({
  path,
  className,
  action,
}: {
  path: string;
  className: string;
  action: "form" | { scrollTo: string };
}) {
  const { c, editing, openForm } = useSite();
  if (editing) {
    return (
      <span className={className}>
        <T path={path} />
      </span>
    );
  }
  const label = String(getAt(c, path) ?? "");
  if (!label) return null;
  if (action === "form") {
    return (
      <button type="button" className={className} onClick={() => openForm(label)}>
        {label}
      </button>
    );
  }
  return (
    <a href={`#${action.scrollTo}`} className={className}>
      {label}
    </a>
  );
}
