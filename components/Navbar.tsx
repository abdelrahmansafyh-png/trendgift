"use client";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import type { SiteSettings } from "@/lib/data";

const labels = {
  ar: {
    home: "الرئيسية",
    products: "المنتجات",
    custom: "خصص طلبك",
    business: "البطاقات الذكية",
    contact: "تواصل معنا",
    order: "اطلب الآن",
  },
  en: {
    home: "Home",
    products: "Products",
    custom: "Custom Order",
    business: "Smart Cards",
    contact: "Contact",
    order: "Order now",
  },
};

export default function Navbar({ settings, showContact = true }: { settings?: SiteSettings; showContact?: boolean }) {
  // Default theme is light. If the user saved dark before, we restore it after load.
  const [dark, setDark] = useState(false);
  const [en, setEn] = useState(false);
  const [ready, setReady] = useState(false);
  const t = en ? labels.en : labels.ar;

  useEffect(() => {
    const savedTheme = localStorage.getItem("trend_theme");
    const savedLang = localStorage.getItem("trend_lang");
    const nextDark = savedTheme === "dark";
    const nextEn = savedLang === "en";

    setDark(nextDark);
    setEn(nextEn);
    document.body.classList.toggle("light", !nextDark);
    document.documentElement.lang = nextEn ? "en" : "ar";
    document.documentElement.dir = nextEn ? "ltr" : "rtl";
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.body.classList.toggle("light", !dark);
    localStorage.setItem("trend_theme", dark ? "dark" : "light");
    window.dispatchEvent(new CustomEvent("trend-theme-change", { detail: { dark } }));
  }, [dark, ready]);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.lang = en ? "en" : "ar";
    document.documentElement.dir = en ? "ltr" : "rtl";
    localStorage.setItem("trend_lang", en ? "en" : "ar");
    window.dispatchEvent(new CustomEvent("trend-lang-change", { detail: { locale: en ? "en" : "ar" } }));
  }, [en, ready]);

  return (
    <nav className="nav">
      <a href="/#home" className="logo logoWithImage" aria-label="TrendGift home">
        <img
          src="/logo/trend-logo.png"
          alt="Trend - Gift & Custom giveaways, wedding favors & 3D Printing"
          className="siteLogoImg"
        />
        <span className="logoFallback">{settings?.siteName || "TrendGift"}</span>
      </a>
      <div className="links">
        <a href="/#home">{t.home}</a>
        <a href="/#products">{t.products}</a>
        <a href="/#order">{t.custom}</a>
        <a href="/#business">{t.business}</a>
        {showContact && <a href="/contact">{t.contact}</a>}
      </div>
      <div className="navActions">
        <a className="navOrderBtn" href="/#order">{t.order}</a>
        <button onClick={() => setEn(!en)}>{en ? "AR" : "EN"}</button>
        <button
          type="button"
          className="themeIconBtn"
          onClick={() => setDark(!dark)}
          aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
          title={dark ? "Light" : "Dark"}
        >
          {dark ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>
    </nav>
  );
}
