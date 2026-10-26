/** "#0072BC" → "0 114 188" для CSS-переменных Tailwind. */
export function hexToRgb(hex: string, fallback: string) {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return fallback;
  const h = m[1].length === 3 ? m[1].replace(/./g, (c) => c + c) : m[1];
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)).join(" ");
}

export function brandVars(theme: { primary: string; primaryDark: string; primaryLight: string }) {
  return {
    "--brand": hexToRgb(theme.primary, "0 114 188"),
    "--brand-dark": hexToRgb(theme.primaryDark, "0 90 150"),
    "--brand-light": hexToRgb(theme.primaryLight, "232 244 252"),
  } as React.CSSProperties;
}
