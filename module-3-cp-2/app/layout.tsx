import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";

import { Suspense } from "react";
import { Toaster } from "react-hot-toast";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ConditionalHeader, ConditionalFooter, ConditionalMain } from "@/components/layout/AppShell";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import { CartProvider } from "@/context/CartContext";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "RevoShop",
    template: "%s | RevoShop",
  },
  description:
    "Your destination for automotive parts, replacement components, and performance accessories.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${poppins.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Toaster />

        <CartProvider>
          {/* Header lives outside Suspense so usePathname() resolves correctly */}
          <ConditionalHeader>
            <Header />
          </ConditionalHeader>

          <Suspense
            fallback={
              <div className="min-h-[60vh] flex-1 animate-pulse bg-slate-50" />
            }
          >
            <ConditionalMain>
              {children}
            </ConditionalMain>
          </Suspense>

          {/* Footer lives outside Suspense for the same reason */}
          <ConditionalFooter>
            <Footer />
          </ConditionalFooter>

          {/* Mobile bottom navigation — only on public pages, hidden on sm+ */}
          <ConditionalFooter>
            <MobileBottomNav />
          </ConditionalFooter>
        </CartProvider>
      </body>
    </html>
  );
}
