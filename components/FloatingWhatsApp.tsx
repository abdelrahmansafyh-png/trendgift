"use client";

export default function FloatingWhatsApp({ phone = "97400000000" }: { phone?: string }) {
  const message = "مرحبا، بدي أستفسر عن منتجات Trend";
  return (
    <a
      href={`https://wa.me/${phone}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="floating-whatsapp"
      aria-label="WhatsApp"
    >
      <img src="/icons/whatsapp.png" alt="WhatsApp" />
    </a>
  );
}
