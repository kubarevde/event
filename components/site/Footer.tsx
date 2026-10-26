"use client";

import { List, T, useSite } from "./edit";

export default function Footer() {
  const { c, editing } = useSite();
  return (
    <footer className="border-t border-white/[0.08] bg-tgu-dark pb-28 pt-7 text-[13px] text-white/60 md:pb-7">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5">
        <span>
          <T path="footer.copyright" />
          {c.event.contactEmail && (
            <>
              {" · "}
              {editing ? (
                <T path="event.contactEmail" />
              ) : (
                <a href={`mailto:${c.event.contactEmail}`} className="text-white/75 no-underline hover:text-white">
                  {c.event.contactEmail}
                </a>
              )}
            </>
          )}
        </span>
        <List
          path="footer.links"
          newItem={{ label: "Ссылка", href: "https://" }}
          addLabel="Ссылка"
          as="nav"
          className="flex flex-wrap gap-x-5 gap-y-2"
          addClassName="!min-h-0 !py-1 !text-xs"
        >
          {(link, i, controls, p) => (
            <span key={i} className="relative">
              {controls}
              {editing ? (
                <T path={`${p}.label`} className="text-white/75" />
              ) : (
                <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-white/75 no-underline hover:text-white">
                  {link.label}
                </a>
              )}
            </span>
          )}
        </List>
      </div>
    </footer>
  );
}
