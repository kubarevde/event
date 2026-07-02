type BadgeVariant = "brand" | "neutral" | "outline";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

const variants: Record<BadgeVariant, string> = {
  brand: "bg-tgu-brand-light text-tgu-brand",
  neutral: "bg-slate-100 text-tgu-ink-secondary",
  outline: "border border-tgu-border bg-transparent text-tgu-ink-secondary",
};

export default function Badge({ label, variant = "brand" }: BadgeProps) {
  return (
    <span
      className={`inline-block rounded px-2.5 py-0.5 font-body text-[11px] font-medium uppercase tracking-wide ${variants[variant]}`}
    >
      {label}
    </span>
  );
}
