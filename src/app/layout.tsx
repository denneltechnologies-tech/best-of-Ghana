import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Best of Ghana | Curated Tourism Guide",
  description:
    "An all-in-one curated tourism guide for DIY travellers in Ghana. Discover cultural monuments, beach resorts, fine dining, and verified transport options.",
  keywords: [
    "Ghana travel",
    "Accra tourism",
    "Cape Coast Castle",
    "Ghana resorts",
    "Ghana restaurants",
    "Ghana nightlife",
    "Getting around Ghana",
  ],
  authors: [{ name: "Best of Ghana Editorial Team" }],
};

export const viewport: Viewport = {
  themeColor: "#0B6623",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-ghana-surface text-neutral-900 antialiased selection:bg-ghana-gold/30 selection:text-ghana-dark">
        {/* Skip to content link for keyboard accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-ghana-dark focus:px-4 focus:py-2 focus:text-white focus:shadow-lg focus:outline-none"
        >
          Skip to main content
        </a>

        <Navbar />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

