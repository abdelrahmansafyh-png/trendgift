"use client";

import { cleanWhatsAppPhone } from "@/lib/ui";

export default function FloatingWhatsApp({ phone = "97400000000" }: { phone?: string }) {
  const message = "مرحبا، بدي أستفسر عن منتجات TrendGift";
  const whatsappPhone = cleanWhatsAppPhone(phone);

  return (
    <a
      href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="floating-whatsapp"
      aria-label="WhatsApp"
    >
      <img src="/icons/whatsapp.png" alt="WhatsApp" />
    </a>
  );
}
