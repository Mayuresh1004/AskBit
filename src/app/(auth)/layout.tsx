// src/app/layout.tsx
"use client"

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { useEffect } from "react";
import { useAuthStore } from "../store/Auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function RootLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { hydrated, verifySession } = useAuthStore();

  useEffect(() => {
    if (hydrated) {
      verifySession();
    }
  }, [hydrated, verifySession]);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RootLayoutContent>{children}</RootLayoutContent>;
}