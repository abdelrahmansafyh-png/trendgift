import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TrendGift | Custom Gifts, NFC & QR Gifts",
  description: "TrendGift متجر هدايا مخصصة ومنتجات NFC و QR وصفحات ذكية للهدايا والبزنس.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="light">{children}</body>
    </html>
  );
}
