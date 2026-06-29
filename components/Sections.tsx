"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { categoryItems as fallbackCategories, defaultSettings, products as fallbackProducts, type Category, type ContactSettings, type Locale, type Product, type SiteSettings } from "@/lib/data";
import { cleanWhatsAppPhone, getLocaleFromDocument, pick, pickList } from "@/lib/ui";

function useLocale() {
  const [locale, setLocale] = useState<Locale>("ar");
  useEffect(() => {
    setLocale(getLocaleFromDocument());
    const onLang = () => setLocale(getLocaleFromDocument());
    window.addEventListener("trend-lang-change", onLang);
    return () => window.removeEventListener("trend-lang-change", onLang);
  }, []);
  return locale;
}

const CUSTOMER_PHONE_PREFIX = "+974";
const CUSTOMER_PHONE_DIGITS = 8;

function onlyDigits(value: string) {
  return value.replace(/\D/g, "").slice(0, CUSTOMER_PHONE_DIGITS);
}

const copy = {
  ar: {
    all: "الكل",
    categories: "التصنيفات",
    categoryTitle: "كل منتجات Trend بمكان واحد",
    products: "المنتجات",
    productsTitle: "منتجات جاهزة للتخصيص",
    productsText: "كل المنتجات بخامات تناسب الطلب: PLA، أكريليك، PVC أو حسب الفكرة.",
    orderNow: "اطلب الآن",
    customBadge: "خصص طلبك",
    customTitle: "أرسل فكرتك كاملة",
    customText: "اكتب تفاصيل طلبك، وأرفق الصور أو الفيديوهات، وسنتواصل معك عبر واتساب لتأكيد التصميم والسعر.",
    steps: ["أرسل الطلب", "نراجع الملفات", "نبدأ التصميم", "توصيل سريع"],
    name: "اسمك",
    phone: "رقم الواتساب",
    phoneHint: "المفتاح ثابت +974 — اكتب 8 أرقام فقط",
    type: "نوع الطلب",
    qty: "الكمية (مثال: 1 أو 50)",
    desc: "اكتب تفاصيل الطلب، الألوان، الاسم المطلوب، رابط الأغنية أو أي فكرة...",
    files: "مرفقات الطلب: صور / فيديو / صوت",
    send: "إرسال الطلب على واتساب",
    uploading: "جاري رفع الملفات...",
    uploadNote: "سيتم رفع الملفات على Supabase وإرسال روابطها داخل رسالة واتساب تلقائيًا.",
    uploadFail: "تعذر رفع الملفات تلقائيًا. تم إرسال أسماء الملفات فقط.",
    special: "طلب خاص / فكرة جديدة",
    businessBadge: "TrendLink",
    businessTitle: "بطاقة NFC للبزنس بدون مشاركة بياناتك يدويًا",
    businessText: "العميل يلمس الكرت بالموبايل ويفتح بروفايلك وروابطك وواتسابك، مع إحصائيات للزيارات والنقرات.",
    businessFeatures: ["✓ لمسة واحدة تفتح كل شيء", "✓ تحديث البيانات بدون طباعة جديدة", "✓ إحصائيات الزوار والنقرات", "✓ واتساب، إنستغرام، موقع، وأكثر"],
    businessCta: "اطلب كرتك الآن →",
    visits: "زيارة",
    waClicks: "ضغط واتساب",
    instagram: "إنستغرام",
  },
  en: {
    all: "All",
    categories: "Categories",
    categoryTitle: "All Trend products in one place",
    products: "Products",
    productsTitle: "Products ready for customization",
    productsText: "Products can be made with suitable materials: PLA, acrylic, PVC, or based on your idea.",
    orderNow: "Order now",
    customBadge: "Custom Order",
    customTitle: "Send your full idea",
    customText: "Write your request, attach photos or videos, and we will confirm the design and price on WhatsApp.",
    steps: ["Send request", "Review files", "Start design", "Fast delivery"],
    name: "Your name",
    phone: "WhatsApp number",
    phoneHint: "Fixed country code +974 — enter 8 digits only",
    type: "Order type",
    qty: "Quantity (example: 1 or 50)",
    desc: "Write details, colors, required name, song link, or any idea...",
    files: "Order attachments: photos / video / audio",
    send: "Send order on WhatsApp",
    uploading: "Uploading files...",
    uploadNote: "Files will be uploaded to Supabase and their links will be added to the WhatsApp message automatically.",
    uploadFail: "File upload failed. Only selected file names were sent.",
    special: "Special order / new idea",
    businessBadge: "TrendLink",
    businessTitle: "NFC business card without sharing your details manually",
    businessText: "Clients tap the card to open your profile, links, WhatsApp, visits, and click analytics.",
    businessFeatures: ["✓ One tap opens everything", "✓ Update details without reprinting", "✓ Visitor and click analytics", "✓ WhatsApp, Instagram, website, and more"],
    businessCta: "Order your card now →",
    visits: "Visits",
    waClicks: "WhatsApp clicks",
    instagram: "Instagram",
  },
};


type CategoryFilter = { id: string; name: string; nameEn: string };

function normalizeText(value?: string) {
  return (value || "").toLowerCase().replace(/\s+/g, " ").trim();
}

function productMatchesCategory(product: Product, category: CategoryFilter) {
  if (category.id === "all") return true;
  const productCategoryAr = normalizeText(product.category);
  const productCategoryEn = normalizeText(product.categoryEn);
  const catAr = normalizeText(category.name);
  const catEn = normalizeText(category.nameEn);

  return (
    product.slug === category.id ||
    productCategoryAr === catAr ||
    productCategoryEn === catEn ||
    productCategoryAr === normalizeText(category.id) ||
    productCategoryEn === normalizeText(category.id)
  );
}

export function Categories({ categories = fallbackCategories }: { categories?: Category[] }) {
  const locale = useLocale();
  const t = copy[locale];
  const [activeId, setActiveId] = useState("all");
  const activeCategories = categories.filter((c) => c.active !== false);
  const all: CategoryFilter[] = [{ id: "all", name: t.all, nameEn: t.all }, ...activeCategories.map((c) => ({ id: c.id, name: c.name, nameEn: c.nameEn }))];

  function selectCategory(category: CategoryFilter) {
    setActiveId(category.id);
    window.dispatchEvent(new CustomEvent("trend-category-change", { detail: category }));
  }

  return (
    <section className="section">
      <div className="sectionHead">
        <span>{t.categories}</span>
        <h2>{t.categoryTitle}</h2>
      </div>
      <div className="categoryGrid">
        {all.map((c) => {
          const label = c.id === "all" ? t.all : pick(locale, c.name, c.nameEn);
          return (
            <button
              key={c.id}
              className={`category${activeId === c.id ? " cat-active" : ""}`}
              onClick={() => selectCategory(c)}
            >
              {label}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export function Products({ products = fallbackProducts, showPrices = true }: { products?: Product[]; showPrices?: boolean }) {
  const locale = useLocale();
  const t = copy[locale];
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>({ id: "all", name: t.all, nameEn: t.all });

  useEffect(() => {
    const onCategory = (event: Event) => {
      const detail = (event as CustomEvent<CategoryFilter>).detail;
      if (detail?.id) setSelectedCategory(detail);
    };
    window.addEventListener("trend-category-change", onCategory);
    return () => window.removeEventListener("trend-category-change", onCategory);
  }, []);

  useEffect(() => {
    setSelectedCategory((current) => current.id === "all" ? { id: "all", name: t.all, nameEn: t.all } : current);
  }, [locale, t.all]);

  const activeProducts = useMemo(
    () => products.filter((p) => p.active !== false && productMatchesCategory(p, selectedCategory)),
    [products, selectedCategory],
  );

  return (
    <section id="products" className="section">
      <div className="sectionHead">
        <span>{t.products}</span>
        <h2>{t.productsTitle}</h2>
        <p>{t.productsText}</p>
      </div>
      <div className="productGrid">
        {activeProducts.map((p) => (
          <article className="product" key={p.slug}>
            <Link href={`/products/${p.slug}`}>
              <img src={p.image} alt={pick(locale, p.name, p.nameEn)} />
            </Link>
            <div>
              <strong>{pick(locale, p.name, p.nameEn)}</strong>
              <small>{pick(locale, p.tag, p.tagEn)} • {pick(locale, p.material, p.materialEn)}</small>
              <div className="product-bottom">
                {showPrices && <b>QAR {p.price}</b>}
                <Link href={`/products/${p.slug}`} className="product-btn">{t.orderNow}</Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Customizer() {
  const locale = useLocale();
  const [name, setName] = useState("Ahmed");
  const [color, setColor] = useState("#f2c46d");
  const [shape, setShape] = useState("circle");
  return (
    <section id="custom" className="section customSection">
      <div className="sectionHead">
        <span>{locale === "en" ? "Live Preview" : "معاينة مباشرة"}</span>
        <h2>{locale === "en" ? "Customize a plastic medal and preview it live" : "خصص ميدالية بلاستيك وشاهدها مباشرة"}</h2>
      </div>
      <div className="customBox">
        <div className="formCard">
          <label>
            {locale === "en" ? "Name" : "الاسم"}
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder={locale === "en" ? "Type the name" : "اكتب الاسم"} />
          </label>
          <label>
            {locale === "en" ? "Shape" : "الشكل"}
            <select value={shape} onChange={(e) => setShape(e.target.value)}>
              <option value="circle">{locale === "en" ? "Circle" : "دائري"}</option>
              <option value="rounded">{locale === "en" ? "Rounded rectangle" : "مستطيل ناعم"}</option>
              <option value="heart">{locale === "en" ? "Heart" : "قلب"}</option>
            </select>
          </label>
          <label>
            {locale === "en" ? "Color" : "اللون"}
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
          </label>
          <label>
            {locale === "en" ? "Order notes" : "ملاحظات الطلب"}
            <textarea placeholder={locale === "en" ? "Write request details, required images, song link, or any note..." : "اكتب تفاصيل طلبك، الصور المطلوبة، رابط الأغنية أو أي ملاحظة..."} />
          </label>
        </div>
        <div className="previewCard">
          <div className={`medal ${shape}`} style={{ background: color }}>
            <span>{name || "Name"}</span>
            <small>Trend</small>
          </div>
          <p>{locale === "en" ? "Approximate design preview. Final production depends on material and size." : "معاينة تقريبية للتصميم. التنفيذ النهائي حسب الخامة والمقاس."}</p>
        </div>
      </div>
    </section>
  );
}

export function CustomOrder({ products = fallbackProducts, settings = defaultSettings, contactSettings }: { products?: Product[]; settings?: SiteSettings; contactSettings?: ContactSettings }) {
  const locale = useLocale();
  const t = copy[locale];
  const activeProducts = products.filter((p) => p.active !== false);
  const [isUploading, setIsUploading] = useState(false);

  return (
    <section className="section order" id="order">
      <div>
        <span className="miniBadge">{t.customBadge}</span>
        <h2>{t.customTitle}</h2>
        <p>{t.customText}</p>
        <div className="order-steps">
          {t.steps.map((step, i) => <div key={step}><b>{i + 1}</b><span>{step}</span></div>)}
        </div>
      </div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const f = new FormData(form);
          const fileInput = form.querySelector<HTMLInputElement>('input[name="files"]');
          const selectedFiles = fileInput?.files ? Array.from(fileInput.files) : [];
          const filenames = selectedFiles.map((file) => file.name).join(", ");

          let uploadedFiles: { name: string; url: string }[] = [];
          let uploadError = "";

          if (selectedFiles.length) {
            setIsUploading(true);
            try {
              const uploadForm = new FormData();
              selectedFiles.forEach((file) => uploadForm.append("files", file));

              const res = await fetch("/api/order-files", {
                method: "POST",
                body: uploadForm,
              });

              const data = await res.json().catch(() => null);
              if (!res.ok) throw new Error(data?.error || "Upload failed");

              uploadedFiles = Array.isArray(data?.files) ? data.files : [];
            } catch {
              uploadError = t.uploadFail;
            } finally {
              setIsUploading(false);
            }
          }

          const filesMessage = uploadedFiles.length
            ? [
                locale === "ar" ? "روابط المرفقات:" : "Attachment links:",
                ...uploadedFiles.map((file, index) => `${index + 1}. ${file.name}: ${file.url}`),
              ].join("\n")
            : filenames
              ? `${locale === "ar" ? "المرفقات المختارة" : "Selected attachments"}: ${filenames}${uploadError ? `\n${uploadError}` : ""}`
              : "";

          const phoneDigits = onlyDigits(String(f.get("phone") || ""));
          const fullCustomerPhone = `${CUSTOMER_PHONE_PREFIX}${phoneDigits}`;

          const msg = [
            `🛍️ طلب جديد من TrendGift`,
            `──────────────`,
            `الاسم: ${f.get("name")}`,
            `الرقم: ${fullCustomerPhone}`,
            `نوع الطلب: ${f.get("type")}`,
            `الكمية: ${f.get("qty")}`,
            `الوصف: ${f.get("desc")}`,
            filesMessage,
          ].filter(Boolean).join("\n");
          const whatsappPhone = cleanWhatsAppPhone(contactSettings?.whatsapp || settings.whatsapp);
          window.open(`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(msg)}`, "_blank");
        }}
      >
        <input name="name" placeholder={t.name} required />
        <label className="phoneFixedField">
          <span>{t.phone}</span>
          <div className="phoneFixedInput" dir="ltr">
            <strong>{CUSTOMER_PHONE_PREFIX}</strong>
            <input
              name="phone"
              type="tel"
              inputMode="numeric"
              pattern="[0-9]{8}"
              maxLength={CUSTOMER_PHONE_DIGITS}
              placeholder="XXXXXXXX"
              required
              onInput={(e) => {
                e.currentTarget.value = onlyDigits(e.currentTarget.value);
              }}
            />
          </div>
          <small>{t.phoneHint}</small>
        </label>
        <select name="type">
          {activeProducts.map((p) => (
            <option key={p.slug} value={pick(locale, p.name, p.nameEn)}>{pick(locale, p.name, p.nameEn)}</option>
          ))}
          <option value={t.special}>{t.special}</option>
        </select>
        <input name="qty" placeholder={t.qty} defaultValue="1" />
        <textarea name="desc" placeholder={t.desc} />
        <label className="fileUploadLabel">
          <span>{t.files}</span>
          <input name="files" type="file" multiple accept="image/*,video/*,audio/*,.pdf" disabled={isUploading} />
          <small>{t.uploadNote}</small>
        </label>
        <button type="submit" disabled={isUploading}>{isUploading ? t.uploading : t.send}</button>
      </form>
    </section>
  );
}

export function Business() {
  const locale = useLocale();
  const t = copy[locale];
  return (
    <section id="business" className="section business">
      <div>
        <span className="miniBadge">{t.businessBadge}</span>
        <h2>{t.businessTitle}</h2>
        <p>{t.businessText}</p>
        <div className="business-features">
          {t.businessFeatures.map((f) => <span key={f}>{f}</span>)}
        </div>
        <Link href="/products/business-nfc" className="primaryBtn" style={{ marginTop: "24px", display: "inline-flex" }}>
          {t.businessCta}
        </Link>
      </div>
      <div className="stats">
        <div><b>125</b><span>{t.visits}</span></div>
        <div><b>34</b><span>{t.waClicks}</span></div>
        <div><b>18</b><span>{t.instagram}</span></div>
      </div>
    </section>
  );
}

export function AdminMock() {
  const [items, setItems] = useState(fallbackProducts);
  return (
    <section id="admin" className="section">
      <div className="sectionHead">
        <span>Admin</span>
        <h2>لوحة تحكم المنتجات</h2>
        <p>Static الآن، جاهزة للتحويل إلى Supabase لاحقًا.</p>
      </div>
      <div className="adminTable">
        <div className="adminTable-header">
          <span>الصورة</span><span>المنتج</span><span>الخامة</span><span>السعر</span><span>الحالة</span><span>إجراء</span>
        </div>
        {items.map((p) => (
          <div key={p.slug}>
            <img src={p.image} alt="" />
            <span>{p.name}</span>
            <small>{p.material}</small>
            <b>{p.price} QAR</b>
            <span className="status-active">متاح</span>
            <button onClick={() => setItems(items.filter((x) => x.slug !== p.slug))}>حذف</button>
          </div>
        ))}
      </div>
    </section>
  );
}
