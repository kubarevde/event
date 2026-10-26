"use client";

import { useEffect, useState } from "react";
import { useSite } from "./edit";

/** Кнопка заявки внизу экрана на телефоне; прячется, когда форма уже на экране. */
export default function MobileCta() {
  const { c, editing, openForm } = useSite();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const el = document.getElementById("registration");
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setHidden(e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (editing || !c.registration.enabled) return null;
  const label = [c.nav.ctaLabel, c.event.price].filter(Boolean).join(" · ");

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-tgu-border bg-white/95 px-5 pb-[calc(10px+env(safe-area-inset-bottom))] pt-2.5 backdrop-blur-md transition-transform duration-300 md:hidden ${
        hidden ? "translate-y-[110%]" : ""
      }`}
    >
      <button type="button" className="btn btn-primary w-full" onClick={() => openForm(c.nav.ctaLabel)}>
        {label}
      </button>
    </div>
  );
}
