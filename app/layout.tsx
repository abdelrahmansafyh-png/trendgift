import type { Metadata } from "next";
import "./globals.css";

export const metadata = {
  title: "TrendGift",
  description: "Custom gifts, NFC, QR and 3D printing",
  icons: {
    icon: [
      {
        url: "/favicon.png?v=210",
        type: "image/png",
        sizes: "32x32",
      },
    ],
    shortcut: "/favicon.png?v=210",
    apple: "/apple-touch-icon.png?v=210",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="light">{children}</body>
    </html>
  );
}
