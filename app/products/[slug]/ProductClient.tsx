"use client";
import { type ContactSettings, type Product, type SiteSettings } from "@/lib/data";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { getLocaleFromDocument, pick } from "@/lib/ui";

/* ─── ADHKAR DEMO ─── */
function AdhkarDemo() {
  const categories = ["أذكار الصباح", "أذكار المساء", "أذكار النوم", "أذكار الركوب"];
  const lists: Record<string, {text: string; count: number}[]> = {
    "أذكار الصباح": [
      { text: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ", count: 1 },
      { text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", count: 100 },
      { text: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ", count: 10 },
      { text: "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا", count: 1 },
    ],
    "أذكار المساء": [
      { text: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ", count: 1 },
      { text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", count: 100 },
      { text: "اللَّهُمَّ بِكَ أَمْسَيْنَا", count: 1 },
    ],
    "أذكار النوم": [
      { text: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا", count: 1 },
      { text: "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ", count: 3 },
    ],
    "أذكار الركوب": [
      { text: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ", count: 1 },
      { text: "وَإِنَّا إِلَى رَبِّنَا لَمُنقَلِبُونَ", count: 1 },
    ],
  };
  const [cat, setCat] = useState("أذكار الصباح");
  const [done, setDone] = useState<number[]>([]);

  const items = lists[cat] || [];
  return (
    <div className="demo-adhkar">
      <div className="demo-label">↓ هكذا تبدو صفحة الأذكار عند مسح QR</div>
      <div className="adhkar-mockup">
        {/* phone outer */}
        <div className="phone-outer">
          <div className="phone-inner">
            <div className="phone-status">
              <span>9:41</span><span>◼◼◼</span>
            </div>
            <div className="phone-app-header">
              <div className="app-icon">☪</div>
              <div>
                <p className="app-title">حصن المسلم</p>
                <p className="app-sub">{cat}</p>
              </div>
            </div>
            <div className="phone-cats">
              {categories.map(c => (
                <button
                  key={c}
                  className={`cat-pill ${cat === c ? "cat-active" : ""}`}
                  onClick={() => { setCat(c); setDone([]); }}
                >{c}</button>
              ))}
            </div>
            <div className="phone-dhikr-list">
              {items.map((item, i) => (
                <div
                  key={i}
                  className={`dhikr-row ${done.includes(i) ? "dhikr-done" : ""}`}
                  onClick={() => setDone(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i])}
                >
                  <p className="dhikr-text">{item.text}</p>
                  <span className="dhikr-count">{item.count}×</span>
                </div>
              ))}
            </div>
            <div className="phone-progress">
              <div className="prog-bar">
                <div className="prog-fill" style={{ width: `${(done.length / items.length) * 100}%` }} />
              </div>
              <span>{done.length}/{items.length} مكتمل</span>
            </div>
          </div>
          <div className="phone-chin" />
        </div>

        {/* pendant next to phone */}
        <div className="adhkar-pendant-wrap">
          <div className="pendant-string" />
          <div className="pendant-body">
            <div className="pendant-inner">
              <span className="pendant-title">أذكاري</span>
              <div className="pendant-qr">
                <div className="qr-grid" />
              </div>
              <span className="pendant-scan">امسح للأذكار</span>
            </div>
          </div>
        </div>
      </div>
      <p className="demo-hint">اضغط على أي ذكر لتعليمه كمكتمل ✓</p>
    </div>
  );
}

/* ─── BIRTHDAY DEMO ─── */
function BirthdayDemo() {
  const [name, setName] = useState("أميرتنا");
  const [from, setFrom] = useState("ماما وبابا");
  const [msg, setMsg] = useState("أنت فرحة حياتنا 🌟");

  return (
    <div className="demo-birthday">
      <div className="demo-label">↓ هكذا تبدو صفحة الهدية على موبايل المُهدى إليه</div>
      <div className="bday-layout">
        {/* phone mockup */}
        <div className="phone-outer bday-phone">
          <div className="phone-inner bday-screen-inner">
            <div className="phone-status dark-status">
              <span>9:41</span><span>◼◼◼</span>
            </div>
            <div className="bday-page-content">
              <div className="bday-confetti">🎉 🎈 🎉 🎈 🎉</div>
              <div className="bday-card-display">
                <p className="bday-card-from">من: {from || "ماما وبابا"}</p>
                <h2 className="bday-card-title">عيد ميلاد سعيد</h2>
                <p className="bday-card-name">{name || "أميرتنا"}</p>
                <p className="bday-card-msg">{msg || "رسالة خاصة"}</p>
              </div>
              <div className="bday-video-block">
                <div className="bday-video-thumb-full">
                  <div className="bday-play-btn">▶</div>
                </div>
                <p className="bday-video-label">فيديو تهنئة خاص 🎬</p>
              </div>
              <div className="bday-photos-row">
                <div className="bday-pic" style={{background:"#f0ddc8"}} />
                <div className="bday-pic" style={{background:"#c8d8f0"}} />
                <div className="bday-pic" style={{background:"#dcc8f0"}} />
                <div className="bday-pic" style={{background:"#c8f0d8"}} />
              </div>
              <p className="bday-msgs-label">💌 رسائل من الأصحاب</p>
            </div>
          </div>
          <div className="phone-chin" />
        </div>

        {/* customizer */}
        <div className="bday-customizer">
          <p className="customizer-title">جرّب خصص الهدية</p>
          <label>اسم المُهدى إليه
            <input value={name} onChange={e => setName(e.target.value)} placeholder="اسمك" maxLength={20} />
          </label>
          <label>من
            <input value={from} onChange={e => setFrom(e.target.value)} placeholder="من المُهدي" maxLength={30} />
          </label>
          <label>رسالة مخصصة
            <textarea value={msg} onChange={e => setMsg(e.target.value)} placeholder="رسالتك..." rows={3} maxLength={80} />
          </label>
          <p className="customizer-note">التغييرات تظهر مباشرة على الموبايل ← </p>
        </div>
      </div>
    </div>
  );
}

/* ─── SPOTIFY DEMO ─── */
function SpotifyDemo() {
  const [song, setSong] = useState("Perfect");
  const [artist, setArtist] = useState("Ed Sheeran");
  return (
    <div className="demo-spotify">
      <div className="demo-label">↓ هكذا تبدو اللوحة الأكريليك</div>
      <div className="spotify-layout">
        <div className="acrylic-card-big">
          <div className="acrylic-photo-big">
            <span className="acrylic-photo-icon">📸</span>
          </div>
          <div className="acrylic-song-info">
            <p className="acrylic-song-name">{song || "اسم الأغنية"}</p>
            <p className="acrylic-song-artist">{artist || "الفنان"}</p>
          </div>
          <div className="acrylic-progress-big">
            <span className="acrylic-time">1:45</span>
            <div className="acrylic-bar-big"><div className="acrylic-fill-big" /></div>
            <span className="acrylic-time">4:23</span>
          </div>
          <div className="acrylic-btns">⏮ &nbsp; ▶ &nbsp; ⏭</div>
          <div className="acrylic-bottom-row">
            <div className="acrylic-spotify-mark">
              <span className="green-dot">●</span> Spotify
            </div>
            <div className="acrylic-qr-block">
              <div className="qr-grid-big" />
            </div>
          </div>
          <p className="acrylic-scan-label">Scan to play our song</p>
        </div>
        <div className="spotify-customizer">
          <p className="customizer-title">خصص اللوحة</p>
          <label>اسم الأغنية
            <input value={song} onChange={e => setSong(e.target.value)} placeholder="اسم الأغنية" maxLength={30} />
          </label>
          <label>اسم الفنان
            <input value={artist} onChange={e => setArtist(e.target.value)} placeholder="الفنان" maxLength={30} />
          </label>
          <p className="customizer-note">الصورة والرابط ترسلها عند الطلب</p>
        </div>
      </div>
    </div>
  );
}

/* ─── MEDAL DEMO ─── */
function MedalDemo() {
  const [name, setName] = useState("سلمى");
  const [color, setColor] = useState("#d6a945");
  const [shape, setShape] = useState("circle");
  const shapes = [
    { id: "circle", label: "دائري", r: "50%" },
    { id: "square", label: "مربع", r: "18px" },
    { id: "heart", label: "قلب", r: "55% 55% 45% 45%" },
  ];
  const colors = ["#d6a945","#c0c0c0","#b87333","#f8f8f8","#222","#e87c7c","#7cbde8"];
  const shapeStyle = shapes.find(s => s.id === shape);
  return (
    <div className="demo-medal">
      <div className="demo-label">↓ جرّب صمّم ميداليتك الآن</div>
      <div className="medal-demo-layout">
        <div className="medal-display-wrap">
          <div className="medal-string-wrap">
            <div className="medal-string-line" />
          </div>
          <div
            className="medal-display"
            style={{
              background: color,
              borderRadius: shapeStyle?.r,
              transform: shape === "heart" ? "rotate(45deg)" : "none",
              boxShadow: `0 12px 40px ${color}44, inset 0 0 0 8px rgba(255,255,255,0.2)`
            }}
          >
            <span style={{ transform: shape === "heart" ? "rotate(-45deg)" : "none" }}>
              {name || "اسمك"}
            </span>
          </div>
        </div>
        <div className="medal-customizer">
          <p className="customizer-title">خصص ميداليتك</p>
          <label>الاسم
            <input value={name} onChange={e => setName(e.target.value)} placeholder="اكتب الاسم" maxLength={12} />
          </label>
          <label>الشكل
            <div className="shape-btns">
              {shapes.map(s => (
                <button key={s.id} className={`shape-btn ${shape === s.id ? "active" : ""}`} onClick={() => setShape(s.id)}>
                  {s.label}
                </button>
              ))}
            </div>
          </label>
          <label>اللون
            <div className="color-picker-row">
              {colors.map(c => (
                <button key={c} className={`color-swatch ${color === c ? "selected" : ""}`} style={{ background: c }} onClick={() => setColor(c)} />
              ))}
            </div>
          </label>
          <p className="customizer-note">هذه معاينة تقريبية — الخامة الفعلية أجمل</p>
        </div>
      </div>
    </div>
  );
}

/* ─── MOON DEMO ─── */
function MoonDemo() {
  return (
    <div className="demo-moon">
      <div className="demo-label">↓ هكذا تبدو الهدية — قمر مضيء مع صفحة ذكريات</div>
      <div className="moon-demo-layout">
        <div className="moon-display">
          <div className="moon-glow-outer" />
          <div className="moon-ball">
            <div className="moon-photo-area">📸</div>
            <p className="moon-caption">You & Me forever ♥</p>
          </div>
          <div className="moon-base" />
          <div className="moon-stand-triangle" />
        </div>
        <div className="phone-outer moon-side-phone">
          <div className="phone-inner">
            <div className="phone-status">
              <span>9:41</span><span>◼◼◼</span>
            </div>
            <div className="moon-page-content">
              <div className="moon-page-photos">
                <div className="moon-pg-photo" style={{background:"#dcc8e8"}} />
                <div className="moon-pg-photo" style={{background:"#c8dce8"}} />
              </div>
              <p className="moon-pg-title">ذكرياتنا 🌙</p>
              <div className="moon-video-row">
                <div className="moon-pg-play">▶</div>
                <div className="moon-pg-bar"><div className="moon-pg-fill" /></div>
              </div>
              <p className="moon-pg-time">01:43 / 02:56</p>
              <p className="moon-pg-msg">رسالة مكتوبة بالقلب ♥</p>
            </div>
          </div>
          <div className="phone-chin" />
        </div>
      </div>
    </div>
  );
}

/* ─── NFC DEMO ─── */
function NfcDemo() {
  const [name, setName] = useState("محمد الأحمد");
  const [title, setTitle] = useState("مدير تقني");
  return (
    <div className="demo-nfc">
      <div className="demo-label">↓ هكذا يبدو البروفايل عند لمس الكرت</div>
      <div className="nfc-demo-layout">
        <div className="nfc-card-display">
          <div className="nfc-card-big">
            <span className="nfc-card-logo">T</span>
            <div className="nfc-card-lines">
              <div className="nfc-line" style={{width:"60%"}} />
              <div className="nfc-line" style={{width:"40%", opacity:.5}} />
            </div>
            <span className="nfc-symbol">))</span>
          </div>
          <div className="nfc-tap-hint">← العميل يلمس الكرت بموبايله</div>
        </div>
        <div className="phone-outer nfc-side-phone">
          <div className="phone-inner">
            <div className="phone-status">
              <span>9:41</span><span>◼◼◼</span>
            </div>
            <div className="nfc-profile-page">
              <div className="nfc-avatar-big">{name.charAt(0)}</div>
              <p className="nfc-page-name">{name || "اسمك"}</p>
              <p className="nfc-page-title">{title || "المسمى الوظيفي"}</p>
              <div className="nfc-page-links">
                <div className="nfc-page-link">📱 واتساب</div>
                <div className="nfc-page-link">📷 إنستغرام</div>
                <div className="nfc-page-link">🌐 موقعي</div>
                <div className="nfc-page-link">💼 لينكدإن</div>
              </div>
              <button className="nfc-page-save">حفظ جهة الاتصال</button>
              <div className="nfc-page-stats">
                <div><b>47</b><span>زيارة</span></div>
                <div><b>12</b><span>واتساب</span></div>
              </div>
            </div>
          </div>
          <div className="phone-chin" />
        </div>
        <div className="nfc-customizer">
          <p className="customizer-title">جرّب خصص</p>
          <label>اسمك
            <input value={name} onChange={e => setName(e.target.value)} maxLength={25} />
          </label>
          <label>المسمى الوظيفي
            <input value={title} onChange={e => setTitle(e.target.value)} maxLength={30} />
          </label>
        </div>
      </div>
    </div>
  );
}

function getDemo(slug: string) {
  if (slug === "car-adhkar") return <AdhkarDemo />;
  if (slug === "birthday-gift") return <BirthdayDemo />;
  if (slug === "spotify-gift") return <SpotifyDemo />;
  if (slug === "name-medal" || slug === "logo-medal" || slug === "wedding-favors") return <MedalDemo />;
  if (slug === "moon-memory") return <MoonDemo />;
  if (slug === "business-nfc") return <NfcDemo />;
  return null;
}

export default function ProductClient({ product, settings, contactSettings }: { product: Product; settings: SiteSettings; contactSettings?: ContactSettings }) {
  const [locale, setLocale] = useState<"ar" | "en">("ar");
  useEffect(() => {
    setLocale(getLocaleFromDocument());
    const onLang = () => setLocale(getLocaleFromDocument());
    window.addEventListener("trend-lang-change", onLang);
    return () => window.removeEventListener("trend-lang-change", onLang);
  }, []);
  const demo = product.showInteractive === false ? null : getDemo(product.slug);

  const sendWhatsApp = () => {
    const msg = locale === "en"
      ? `Hello, I would like to ask about: ${pick(locale, product.name, product.nameEn)} (${product.price} QAR)`
      : `مرحبا، أريد الاستفسار عن: ${pick(locale, product.name, product.nameEn)} (${product.price} QAR)`;
    window.open(`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <>
      <Navbar settings={settings} showContact={contactSettings?.showContactPage !== false} />

      <main className="product-page">
        {/* ─── hero section ─── */}
        <div className="pp-hero">
          <div className="pp-hero-image">
            <img src={product.image} alt={pick(locale, product.name, product.nameEn)} />
          </div>
          <div className="pp-hero-info">
            <Link href="/#products" className="pp-breadcrumb-link">{locale === "en" ? "← All products" : "← جميع المنتجات"}</Link>
            <h1>{pick(locale, product.name, product.nameEn)}</h1>
            <p className="pp-desc">{pick(locale, product.description, product.descriptionEn)}</p>
            <div className="pp-features">
              {(locale === "en" ? product.featuresEn?.length ? product.featuresEn : product.features : product.features).map(f => <span key={f}>✓ {f}</span>)}
            </div>
            <div className="pp-price-box">
              <span className="pp-unit">{product.price} QAR</span>
              <span className="pp-delivery">{locale === "en" ? "Delivery within " : "التسليم خلال "}{pick(locale, product.deliveryDays, product.deliveryDaysEn)}</span>
            </div>
            <button className="pp-order-btn primaryBtn" onClick={sendWhatsApp}>
              {locale === "en" ? "Order on WhatsApp 📱" : "اطلب عبر واتساب 📱"}
            </button>
            <p className="pp-note">{locale === "en" ? "Our team will contact you to confirm details." : "سيتواصل معك فريقنا خلال ساعتين لتأكيد التفاصيل."}</p>
          </div>
        </div>

        {/* ─── interactive demo ─── */}
        {product.showInteractive !== false && (demo || product.interactiveVideoUrl) && (
          <div className="pp-demo-section">
            <div className="pp-demo-badge">{locale === "en" ? "Interactive experience" : "تجربة تفاعلية"}</div>
            <h2 className="pp-demo-title">{pick(locale, product.interactiveTitle || "شاهد كيف يبدو المنتج النهائي", product.interactiveTitleEn || "See how the final product looks")}</h2>
            {product.interactiveVideoUrl ? (
              <video className="pp-interactive-video" src={product.interactiveVideoUrl} controls playsInline />
            ) : demo}
          </div>
        )}
      </main>

      <footer className="footer footerWithLogo"><img src="/logo/trend-logo.png" alt="Trend" className="footerLogo" />{locale === "en" ? "TrendGift — Custom Gifts, NFC & QR" : "TrendGift — هدايا مخصصة، NFC و QR"}</footer>
    </>
  );
}
