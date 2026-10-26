"use client";

import { useState } from "react";
import { getAt } from "@/lib/paths";
import { ICON_NAMES, getIcon } from "@/lib/icons";
import { useSite } from "./edit";

/** Выбор иконки в режиме правки: клик по иконке открывает сетку вариантов. */
export default function IconPicker({ path }: { path: string }) {
  const { c, set } = useSite();
  const [open, setOpen] = useState(false);
  const Current = getIcon(String(getAt(c, path) ?? ""));
  return (
    <span className="relative">
      <button type="button" title="Сменить иконку" onClick={() => setOpen((v) => !v)} className="grid h-9 w-9 place-items-center rounded-[10px] outline-dashed outline-1 outline-tgu-brand/50">
        <Current className="h-[18px] w-[18px]" />
      </button>
      {open && (
        <span className="absolute left-0 top-11 z-30 grid w-[280px] grid-cols-7 gap-1 rounded-lg border border-tgu-border bg-white p-2 shadow-xl">
          {ICON_NAMES.map((name) => {
            const Icon = getIcon(name);
            return (
              <button
                key={name}
                type="button"
                title={name}
                onClick={() => {
                  set(path, name);
                  setOpen(false);
                }}
                className="grid h-8 place-items-center rounded text-slate-600 hover:bg-tgu-brand-light hover:text-tgu-brand"
              >
                <Icon className="h-4 w-4" />
              </button>
            );
          })}
        </span>
      )}
    </span>
  );
}
