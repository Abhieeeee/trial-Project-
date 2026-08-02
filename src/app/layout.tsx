import type { Metadata } from "next";
import { Syne, JetBrains_Mono, Inter } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import AiAssistant from "@/components/AiAssistant";
import CommandMenu from "@/components/CommandMenu";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import { CartProvider } from "@/lib/cartContext";
import { CartDrawer } from "@/components/CartDrawer";
import { WishlistProvider } from "@/lib/wishlistContext";
import { WishlistDrawer } from "@/components/WishlistDrawer";
import CustomCursor from "@/components/CustomCursor";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-mono",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://trial-project-bice.vercel.app"),
  title: {
    default: "AURA STREET | Paris-Originated 450GSM Heavyweight Luxury Streetwear",
    template: "%s | AURA STREET",
  },
  description:
    "Architectural 450GSM matte cotton streetwear, PBR studio lighting renders, and domestic/international checkout portal. Paris-originated designs with global shipping.",
  keywords: [
    "Aura Street",
    "Luxury Streetwear",
    "450GSM Hoodie",
    "Heavyweight Cotton",
    "Paris Fashion Streetwear",
    "Cyberpunk Fashion",
    "High-Fashion Clothing",
    "Nepal Streetwear",
    "eSewa Streetwear Checkout",
  ],
  authors: [{ name: "AURA STREET Studio" }],
  creator: "AURA STREET",
  publisher: "AURA STREET Ltd",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "AURA STREET | Luxury Heavyweight Streetwear",
    description:
      "Ultra-premium 450GSM matte cotton apparel, physical wrinkle styling, and interactive 3D digital studio. Domestic (Nepal eSewa/Khalti) & International checkout.",
    url: "https://trial-project-bice.vercel.app",
    siteName: "AURA STREET",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AURA STREET Drop 01 Lookbook Backdrop",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AURA STREET | Paris-Originated 450GSM Luxury Streetwear",
    description:
      "Architectural 450GSM matte cotton apparel with interactive 3D showroom and instant domestic/international payment processing.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://trial-project-bice.vercel.app/#organization",
      "name": "AURA STREET",
      "url": "https://trial-project-bice.vercel.app",
      "logo": "https://trial-project-bice.vercel.app/logo.png",
      "sameAs": [
        "https://instagram.com/aurastreet",
        "https://twitter.com/aurastreet",
      ],
      "description": "Ultra-premium 450GSM Paris-originated luxury streetwear brand.",
    },
    {
      "@type": "WebSite",
      "@id": "https://trial-project-bice.vercel.app/#website",
      "url": "https://trial-project-bice.vercel.app",
      "name": "AURA STREET",
      "publisher": {
        "@id": "https://trial-project-bice.vercel.app/#organization",
      },
    },
  ],
};

import { ToastProvider } from "@/components/Toast";

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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-brand-black text-white selection:bg-brand-sky/30 selection:text-white font-sans">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[99999] focus:px-4 focus:py-2.5 focus:bg-[#00D2FF] focus:text-black focus:font-mono focus:text-xs focus:uppercase focus:tracking-wider focus:font-bold focus:rounded-lg focus:shadow-2xl"
        >
          Skip to main content
        </a>
        <ToastProvider>
          <CartProvider>
            <WishlistProvider>
              <ScrollProgressBar />
              <CustomCursor />
              <SmoothScroll>{children}</SmoothScroll>
              <CartDrawer />
              <WishlistDrawer />
              <AiAssistant />
              <CommandMenu />
            </WishlistProvider>
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
