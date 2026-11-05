import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BottomNav } from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "Explore Ghana | Best of Ghana Guide",
  description:
    "An all-in-one curated tourism guide for DIY travellers in Ghana. Heritage sites, beach resorts, nightlife, dining, and verified transport.",
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#C2410C",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen justify-center bg-black/10 dark:bg-black/60">
        <div
          id="app"
          className="flex min-h-screen w-full max-w-[460px] flex-col bg-[var(--bg)] shadow-2xl text-[var(--ink)] relative"
        >
          <main id="m" className="flex-1 flex flex-col gap-4 p-5 pb-6">
            {children}
          </main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
