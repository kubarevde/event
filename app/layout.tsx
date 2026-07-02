import type { Metadata } from "next";
import { IBM_Plex_Sans, Inter } from "next/font/google";
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

const title = "Цифра ТГУ: роадмэп, закупки и приоритеты 2027 | 14 октября";
const description =
  "Закрытый B2G круглый стол для ИТ-вендоров ТГУ. Стратегия цифровой трансформации, приоритеты закупок 2027. 14 октября, Томск.";

export const metadata: Metadata = {
  metadataBase: new URL("https://digital.tsu.ru"),
  title,
  description,
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title,
    description,
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${ibmPlex.variable} ${inter.variable} font-body`}>
        {children}
      </body>
    </html>
  );
}
