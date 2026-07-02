interface TguLogoProps {
  className?: string;
}

export default function TguLogo({ className = "h-8 w-8" }: TguLogoProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <rect
        width="32"
        height="32"
        rx="6"
        fill="currentColor"
        fillOpacity="0.12"
      />
      <path
        d="M8 9h16v2.5H17.5v11.5h-3V11.5H8V9z"
        fill="currentColor"
      />
    </svg>
  );
}
