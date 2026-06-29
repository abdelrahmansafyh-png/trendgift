"use client";

import { useEffect, useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import { heroSlides as fallbackSlides, type HeroSlide, type Locale, type SiteSettings } from "@/lib/data";
import { getLocaleFromDocument, pick, pickList } from "@/lib/ui";

export default function HeroSlider({
  slides = fallbackSlides,
  settings,
}: {
  slides?: HeroSlide[];
  settings?: SiteSettings;
}) {
  const cleanSlides = useMemo(() => {
    const list = slides.filter((s) => s.active !== false);
    return list.length ? list : fallbackSlides;
  }, [slides]);

  const [active, setActive] = useState(0);
  const [locale, setLocale] = useState<Locale>("ar");
  const [isLight, setIsLight] = useState(false);

  const slide = cleanSlides[active] || cleanSlides[0];
  const isRTL = locale === "ar";
  const image = isLight && slide.lightImage ? slide.lightImage : slide.image;
  const bullets = pickList(locale, slide.bullets, slide.bulletsEn).slice(0, 3);

  useEffect(() => {
    const readUI = () => {
      setLocale(getLocaleFromDocument());
      setIsLight(document.body.classList.contains("light"));
    };

    readUI();
    window.addEventListener("trend-lang-change", readUI);
    window.addEventListener("trend-theme-change", readUI);

    return () => {
      window.removeEventListener("trend-lang-change", readUI);
      window.removeEventListener("trend-theme-change", readUI);
    };
  }, []);

  useEffect(() => {
    if (active > cleanSlides.length - 1) setActive(0);
  }, [active, cleanSlides.length]);

  useEffect(() => {
    if (cleanSlides.length <= 1) return;

    const id = window.setInterval(() => {
      setActive((p) => (p + 1) % cleanSlides.length);
    }, settings?.heroAutoplayMs || 6500);

    return () => window.clearInterval(id);
  }, [cleanSlides.length, settings?.heroAutoplayMs]);

  const next = () => setActive((p) => (p + 1) % cleanSlides.length);
  const prev = () => setActive((p) => (p - 1 + cleanSlides.length) % cleanSlides.length);

  return (
    <section className="hero" id="home" dir={isRTL ? "rtl" : "ltr"}>
      <div className="heroShell">
        <div className="heroMedia" key={`${slide.id}-image`}>
          <img src={image} alt={pick(locale, slide.title, slide.titleEn)} />
          <div className="imageLabel">
            <span />
            {pick(locale, slide.badge, slide.badgeEn)}
          </div>
        </div>

        <div className="heroContent" key={`${slide.id}-content`}>
          <span className="badge">{pick(locale, slide.badge, slide.badgeEn)}</span>

          <h1 className={!isRTL ? "heroTitleEn" : undefined}>
            {pick(locale, slide.title, slide.titleEn)}
          </h1>

          <p>{pick(locale, slide.subtitle, slide.subtitleEn)}</p>

          {!!bullets.length && (
            <div className="chips">
              {bullets.map((b) => (
                <span key={b}>{b}</span>
              ))}
            </div>
          )}

          <div className="heroActions">
            <a className="primaryBtn" href={slide.ctaHref || "#order"}>
              {pick(locale, slide.cta, slide.ctaEn)}
              <Sparkles size={18} />
            </a>

            <a className="secondaryBtn" href="/#products">
              {pick(locale, slide.secondaryCta || "تصفح المنتجات", slide.secondaryCtaEn || "Browse products")}
            </a>
          </div>

          <div className="heroBottom">
            <div className="heroControls">
              <button onClick={isRTL ? next : prev} aria-label={isRTL ? "التالي" : "previous"}>
                {isRTL ? "→" : "←"}
              </button>

              <button onClick={isRTL ? prev : next} aria-label={isRTL ? "السابق" : "next"}>
                {isRTL ? "←" : "→"}
              </button>
            </div>

            <div className="dots">
              {cleanSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={i === active ? "active" : ""}
                  aria-label={`slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
