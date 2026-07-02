import Image from "next/image";

export const TSU_LOGO_RU = "/tsu-logo-ru.png?v=3";

/** Экспорт из tsu_logo_basic_horizontal_2line.ai (верхний RU-блок), ~1995×322 */
const LOGO_ASPECT = 1995 / 322;

type LogoSize = "header" | "footer" | "hero";

interface LogoSlotProps {
  className?: string;
  src?: string;
  size?: LogoSize;
}

const sizeStyles: Record<LogoSize, string> = {
  header:
    "h-[42px] w-auto min-w-[200px] max-w-[min(100vw-8rem,420px)] sm:h-12 md:h-[52px]",
  footer:
    "h-14 w-auto min-w-[220px] max-w-[min(100%,480px)] sm:h-16 md:h-[72px]",
  hero:
    "h-12 w-auto min-w-[200px] max-w-[min(100%,440px)] sm:h-14 md:h-16",
};

const sizeDimensions: Record<LogoSize, { width: number; height: number }> = {
  header: { width: 420, height: Math.round(420 / LOGO_ASPECT) },
  footer: { width: 480, height: Math.round(480 / LOGO_ASPECT) },
  hero: { width: 440, height: Math.round(440 / LOGO_ASPECT) },
};

export default function LogoSlot({
  className = "",
  src = TSU_LOGO_RU,
  size = "footer",
}: LogoSlotProps) {
  const { width, height } = sizeDimensions[size];

  return (
    <Image
      src={src}
      alt="Национальный исследовательский Томский государственный университет"
      width={width}
      height={height}
      quality={100}
      sizes={size === "header" ? "(max-width: 768px) 280px, 420px" : "(max-width: 768px) 320px, 480px"}
      className={`object-contain object-left ${sizeStyles[size]} ${className}`}
      priority={size === "header" || size === "hero"}
    />
  );
}
