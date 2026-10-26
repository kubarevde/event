"use client";

import { Cta, Img, List, T, useSite } from "./edit";

export default function Header() {
  const { c, editing } = useSite();
  const enabled = (target: string) => {
    const section = (c as unknown as Record<string, { enabled?: boolean }>)[target];
    return editing || section?.enabled !== false;
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-tgu-dark/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5">
        <a href="#top" aria-label="На главную" className="shrink-0">
          <Img path="theme.logo" alt={c.theme.logoAlt} className="block h-7 w-auto md:h-[34px]" />
        </a>
        <List
          path="nav.links"
          newItem={{ label: "Новый пункт", target: "faq" }}
          addLabel="Пункт"
          as="nav"
          className="hidden items-center gap-6 lg:flex"
          addClassName="!min-h-0 !py-1 !text-xs"
        >
          {(link, i, controls) =>
            enabled(link.target) && (
              <span key={i} className="relative">
                {controls}
                {editing ? (
                  <T path={`nav.links.${i}.label`} className="text-sm text-white/70" />
                ) : (
                  <a href={`#${link.target}`} className="text-sm text-white/70 no-underline transition-colors hover:text-white">
                    {link.label}
                  </a>
                )}
              </span>
            )
          }
        </List>
        {c.registration.enabled && <Cta path="nav.ctaLabel" action="form" className="btn btn-primary btn-sm" />}
      </div>
    </header>
  );
}
