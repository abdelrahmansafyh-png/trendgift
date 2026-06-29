"use client";

import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import SocialIcons from "@/components/SocialIcons";
import type { ContactSettings, SiteSettings } from "@/lib/data";
import { cleanWhatsAppPhone, getLocaleFromDocument, pick } from "@/lib/ui";
import { useEffect, useMemo, useState } from "react";


const copy = {
  ar: {
    badge: "TrendGift",
    whatsapp: "واتساب",
    email: "البريد الإلكتروني",
    location: "الموقع",
    whatsappCta: "تواصل عبر واتساب",
    emailCta: "إرسال بريد إلكتروني",
    formTitle: "أرسل فكرتك مباشرة",
    formText: "اكتب طلبك وسيفتح واتساب برسالة مرتبة وجاهزة للإرسال.",
    openWhatsapp: "فتح واتساب الآن",
    message: "مرحبا، أريد الاستفسار عن منتجات TrendGift",
    footer: "TrendGift — هدايا مخصصة، NFC و QR",
  },
  en: {
    badge: "TrendGift",
    whatsapp: "WhatsApp",
    email: "Email",
    location: "Location",
    whatsappCta: "Contact on WhatsApp",
    emailCta: "Send email",
    formTitle: "Send your idea directly",
    formText: "Write your request and WhatsApp will open with a ready-to-send message.",
    openWhatsapp: "Open WhatsApp now",
    message: "Hello, I would like to ask about TrendGift products",
    footer: "TrendGift — Custom Gifts, NFC & QR",
  },
};

export default function ContactClient({
  settings,
  contact,
}: {
  settings: SiteSettings;
  contact: ContactSettings;
}) {
  const [locale, setLocale] = useState<"ar" | "en">("ar");

  useEffect(() => {
    setLocale(getLocaleFromDocument());
    const onLang = () => setLocale(getLocaleFromDocument());
    window.addEventListener("trend-lang-change", onLang);
    return () => window.removeEventListener("trend-lang-change", onLang);
  }, []);

  const t = copy[locale];
  const whatsappPhone = cleanWhatsAppPhone(contact.whatsapp || settings.whatsapp);
  const whatsappHref = useMemo(() => `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(t.message)}`, [whatsappPhone, t.message]);

  return (
    <>
      <main className="contact-page">
        <section className="contact-hero-card">
          <div>
            <span className="miniBadge">{t.badge}</span>
            <h1>{pick(locale, contact.title, contact.titleEn)}</h1>
            <p className="contact-subtitle">{pick(locale, contact.subtitle, contact.subtitleEn)}</p>
            <div className="contact-actions">
              <a className="primaryBtn" href={whatsappHref} target="_blank" rel="noopener noreferrer">{t.whatsappCta}</a>
              {contact.email && <a className="contact-secondary" href={`mailto:${contact.email}`}>{t.emailCta}</a>}
            </div>
          </div>
          <div className="contact-info-card">
            <div><b>{t.whatsapp}</b><span dir="ltr">+{whatsappPhone}</span></div>
            {contact.email && <div><b>{t.email}</b><span dir="ltr">{contact.email}</span></div>}
            <div><b>{t.location}</b><span>{pick(locale, contact.address, contact.addressEn)}</span></div>
          </div>
        </section>

        <section className="contact-form-card">
          <div>
            <h2>{t.formTitle}</h2>
            <p>{t.formText}</p>
          </div>
          <a className="primaryBtn" href={whatsappHref} target="_blank" rel="noopener noreferrer">{t.openWhatsapp}</a>
        </section>

        <SocialIcons contact={contact} variant="contact" showTitle />
      </main>
      {contact.showFloatingWhatsapp !== false && <FloatingWhatsApp phone={contact.whatsapp} />}
      <footer className="footer footerWithLogo"><img src="/logo/trend-logo.png" alt="Trend" className="footerLogo" />{t.footer}</footer>
    </>
  );
}
