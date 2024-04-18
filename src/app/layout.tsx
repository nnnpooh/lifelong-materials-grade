import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import '@picocss/pico/css/pico.min.css';

export const metadata: Metadata = {
  title: "Lifelong Materials Grade",
  description: "Grading Calculator for Lifelong Materials",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
