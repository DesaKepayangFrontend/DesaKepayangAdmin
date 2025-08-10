// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import { disableConsoleInProduction } from "@/lib/disableConsole";
import "./globals.css";

// Jalankan disable console di production (client-side)
if (typeof window !== "undefined") {
  disableConsoleInProduction();
}

// Font Outfit
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Admin Desa Kepayang",
  description: "Panel admin desa kepayang",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" translate="no" className={`${outfit.variable} ${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
