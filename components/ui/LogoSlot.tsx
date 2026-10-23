type LogoSize = "header" | "footer" | "hero";

interface LogoSlotProps {
  src: string;
  alt: string;
  className?: string;
  size?: LogoSize;
}

const sizeStyles: Record<LogoSize, string> = {
  header: "h-[42px] w-auto max-w-[min(100vw-8rem,420px)] sm:h-12 md:h-[52px]",
  footer: "h-14 w-auto max-w-[min(100%,480px)] sm:h-16 md:h-[72px]",
  hero: "h-12 w-auto max-w-[min(100%,440px)] sm:h-14 md:h-16",
};

export default function LogoSlot({ src, alt, className = "", size = "footer" }: LogoSlotProps) {
  if (!src) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={`object-contain object-left ${sizeStyles[size]} ${className}`}
      loading={size === "footer" ? "lazy" : "eager"}
    />
  );
}
