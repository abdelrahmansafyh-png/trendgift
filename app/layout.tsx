import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TrendGift | Custom Gifts, NFC & QR Gifts",
  description: "TrendGift متجر هدايا مخصصة ومنتجات NFC و QR وصفحات ذكية للهدايا والبزنس.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="light">{children}</body>
    </html>
  );
}
