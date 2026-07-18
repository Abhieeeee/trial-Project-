import type { Metadata } from "next";
import { Syne, JetBrains_Mono, Inter } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import AiAssistant from "@/components/AiAssistant";
import CommandMenu from "@/components/CommandMenu";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  variable: "--font-display",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-mono",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "AURA STREET | Luxury Streetwear",
  description: "Ultra-premium luxury streetwear brand landing page. Experience high-end clothing through interactive 3D modeling and cinematic web design.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${syne.variable} ${jetbrainsMono.variable} ${inter.variable}`}
    >
      <body className="min-h-full flex flex-col bg-brand-black text-white selection:bg-brand-sky/30 selection:text-white font-sans">
        <ScrollProgressBar />
        <SmoothScroll>{children}</SmoothScroll>
        <AiAssistant />
        <CommandMenu />
      </body>
    </html>
  );
}
