"use client";

// Отправка событий во внутреннюю аналитику (/api/track).
export function track(type: "pageview" | "cta_click" | "form_view" | "form_start", extra: Record<string, unknown> = {}) {
  try {
    const body = JSON.stringify({ type, path: window.location.pathname, ...extra });
    fetch("/api/track", {
      method: "POST",
      body,
      keepalive: true,
      headers: { "Content-Type": "application/json" },
    }).catch(() => {});
  } catch {
    // аналитика не должна ломать страницу
  }
}

export function scrollToSection(id: string, ctaLabel?: string) {
  if (id === "registration" && ctaLabel) track("cta_click", { label: ctaLabel });
  document.getElementById(id.replace(/^#/, ""))?.scrollIntoView({ behavior: "smooth" });
}
