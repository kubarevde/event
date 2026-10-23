"use client";

import { BarChart3, ExternalLink, FileText, Inbox, LogOut, PenSquare } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Статистика", icon: BarChart3 },
  { href: "/admin/submissions", label: "Заявки", icon: Inbox },
  { href: "/admin/forms", label: "Формы", icon: FileText },
  { href: "/admin/content", label: "Контент сайта", icon: PenSquare },
];

export default function AdminNav({ newCount }: { newCount: number }) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside className="border-b border-slate-200 bg-white md:sticky md:top-0 md:flex md:h-screen md:w-60 md:shrink-0 md:flex-col md:border-b-0 md:border-r">
      <div className="px-5 py-4 md:py-6">
        <p className="font-heading text-base font-semibold text-slate-900">Админка</p>
        <p className="text-xs text-slate-500">управление лендингом</p>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-1 md:flex-col md:overflow-visible">
        {LINKS.map(({ href, label, icon: Icon }) => {
          const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex shrink-0 items-center gap-2.5 rounded-md px-3 py-2 text-sm transition ${
                active ? "bg-tgu-brand/10 font-medium text-tgu-brand" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden />
              {label}
              {href === "/admin/submissions" && newCount > 0 && (
                <span className="ml-auto rounded-full bg-tgu-brand px-1.5 text-[11px] font-semibold text-white">
                  {newCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="flex gap-1 border-t border-slate-100 p-2 md:block md:space-y-1 md:p-3">
        <a
          href="/"
          target="_blank"
          className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
        >
          <ExternalLink className="h-4 w-4" aria-hidden />
          Открыть сайт
        </a>
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
        >
          <LogOut className="h-4 w-4" aria-hidden />
          Выйти
        </button>
      </div>
    </aside>
  );
}
