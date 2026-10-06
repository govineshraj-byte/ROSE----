import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ROSÉ — Where Beauty Blooms | Cinematic 3D Rose Experience",
  description:
    "A luxury digital experience inspired by the timeless elegance, emotion and mystery of a rose. Interactive 3D, falling petals, day & night garden.",
  keywords: ["rose", "3D", "luxury", "botanical", "cinematic", "editorial"],
  authors: [{ name: "ROSÉ" }],
  openGraph: {
    title: "ROSÉ — Where Beauty Blooms",
    description:
      "A digital experience inspired by the timeless elegance of a rose.",
    type: "website",
  },
  robots: "index, follow",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fffbf5" },
    { media: "(prefers-color-scheme: dark)", color: "#141010" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body
        className={`${cormorant.variable} ${montserrat.variable} theme-anim grain flex min-h-full flex-col antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
