import type { Metadata } from "next";
import { IBM_Plex_Sans, Inter } from "next/font/google";
import { getContent } from "@/lib/store";
import "./globals.css";

const ibmPlex = IBM_Plex_Sans({
  subsets: ["cyrillic", "latin"],
  weight: ["500", "600", "700"],
  variable: "--font-ibm-plex",
});

const inter = Inter({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
});

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = getContent();
  let metadataBase: URL | undefined;
  try {
    metadataBase = meta.siteUrl ? new URL(meta.siteUrl) : undefined;
  } catch {
    metadataBase = undefined;
  }
  return {
    metadataBase,
    title: meta.title,
    description: meta.description,
    icons: {
      icon: [
        { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      ],
      apple: "/apple-touch-icon.png",
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: "website",
      images: meta.ogImage ? [{ url: meta.ogImage, width: 1200, height: 630 }] : [],
    },
  };
}

/** "#0072BC" → "0 114 188" для CSS-переменных Tailwind. */
function hexToRgb(hex: string, fallback: string) {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return fallback;
  const h = m[1].length === 3 ? m[1].replace(/./g, (c) => c + c) : m[1];
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)).join(" ");
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { theme } = getContent();
  const vars = {
    "--brand": hexToRgb(theme.primary, "0 114 188"),
    "--brand-dark": hexToRgb(theme.primaryDark, "0 90 150"),
    "--brand-light": hexToRgb(theme.primaryLight, "232 244 252"),
  } as React.CSSProperties;

  return (
    <html lang="ru" style={vars}>
      <body className={`${ibmPlex.variable} ${inter.variable} font-body`}>{children}</body>
    </html>
  );
}
