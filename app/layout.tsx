import type { Metadata } from "next";
import { IBM_Plex_Sans, Inter } from "next/font/google";
import { brandVars } from "@/lib/color";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const vars = brandVars(getContent().theme);

  return (
    <html lang="ru" style={vars}>
      <body className={`${ibmPlex.variable} ${inter.variable} font-body`}>{children}</body>
    </html>
  );
}
