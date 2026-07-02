interface SectionTitleProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  light?: boolean;
  accent?: boolean;
  align?: "left" | "center";
}

export default function SectionTitle({
  title,
  subtitle,
  eyebrow,
  light = false,
  accent = false,
  align = "center",
}: SectionTitleProps) {
  const alignClass = align === "left" ? "text-left" : "text-center";
  const accentAlign = align === "left" ? "" : "mx-auto";

  return (
    <div className={`mb-10 ${alignClass}`}>
      {eyebrow && (
        <p
          className={`mb-3 font-body text-xs font-semibold uppercase tracking-widest ${
            light ? "text-tgu-brand-light" : "text-tgu-brand"
          }`}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={`font-heading text-2xl font-semibold tracking-tight md:text-3xl lg:text-[2rem] ${
          light ? "text-tgu-text" : "text-tgu-dark-text"
        }`}
      >
        {title}
      </h2>
      {accent && (
        <div
          className={`mt-4 h-0.5 w-10 bg-tgu-brand ${accentAlign}`}
          aria-hidden
        />
      )}
      {subtitle && (
        <p
          className={`mt-4 max-w-2xl font-body text-base leading-relaxed ${
            align === "center" ? "mx-auto" : ""
          } ${light ? "text-tgu-muted" : "text-tgu-ink-secondary"}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
