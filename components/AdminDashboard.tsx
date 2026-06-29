"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { categoryItems, defaultContactSettings, defaultSettings, heroSlides, products as defaultProducts, type Category, type ContactSettings, type HeroSlide, type Product, type SiteSettings } from "@/lib/data";

type Tab = "products" | "hero" | "categories" | "settings" | "contact";

type CmsState = {
  products: Product[];
  heroSlides: HeroSlide[];
  categories: Category[];
  settings: SiteSettings;
  contactSettings: ContactSettings;
  source?: string;
};

const fallbackCms: CmsState = {
  products: defaultProducts,
  heroSlides,
  categories: categoryItems,
  settings: defaultSettings,
  contactSettings: defaultContactSettings,
  source: "static",
};

function splitLines(value: string) {
  return value.split("\n").map((x) => x.trim()).filter(Boolean);
}
function joinLines(value?: string[]) {
  return (value || []).join("\n");
}

function whatsappDigits(value: string) {
  return value.replace(/\D/g, "");
}

async function adminSave(table: string, payload: Record<string, unknown>) {
  const res = await fetch("/api/admin/cms", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ table, action: "upsert", payload }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || "Save failed");
  return json;
}

async function adminDelete(table: string, id: string | number) {
  const res = await fetch("/api/admin/cms", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ table, action: "delete", id }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || "Delete failed");
  return json;
}

async function uploadAdminFile(file: File, folder: "products" | "heroes" | "interactive" | "orders" | "general") {
  const form = new FormData();
  form.append("file", file);
  form.append("folder", folder);
  const res = await fetch("/api/admin/upload", { method: "POST", body: form });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || "Upload failed");
  return json.url as string;
}

function UploadField({
  label,
  folder,
  accept,
  currentUrl,
  onUploaded,
}: {
  label: string;
  folder: "products" | "heroes" | "interactive" | "orders" | "general";
  accept?: string;
  currentUrl?: string;
  onUploaded: (url: string) => void;
}) {
  const [status, setStatus] = useState("");

  return (
    <div className="admin-upload-field">
      <div className="admin-upload-head">
        <span>{label}</span>
        {status && <small>{status}</small>}
      </div>
      <input
        type="file"
        accept={accept}
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          setStatus("جاري الرفع...");
          try {
            const url = await uploadAdminFile(file, folder);
            onUploaded(url);
            setStatus("تم الرفع والحفظ بالرابط");
          } catch (err: any) {
            setStatus(err.message || "فشل الرفع");
          } finally {
            e.currentTarget.value = "";
          }
        }}
      />
      {currentUrl && <code dir="ltr">{currentUrl}</code>}
    </div>
  );
}

function productToDb(p: Product) {
  return {
    slug: p.slug,
    name_ar: p.name,
    name_en: p.nameEn || p.name,
    price: p.price,
    image: p.image,
    category_ar: p.category || "",
    category_en: p.categoryEn || "",
    tag_ar: p.tag,
    tag_en: p.tagEn || p.tag,
    material_ar: p.material,
    material_en: p.materialEn || p.material,
    description_ar: p.description,
    description_en: p.descriptionEn || p.description,
    features_ar: p.features || [],
    features_en: p.featuresEn || [],
    delivery_days_ar: p.deliveryDays,
    delivery_days_en: p.deliveryDaysEn || p.deliveryDays,
    order_types_ar: p.orderTypes || [],
    order_types_en: p.orderTypesEn || [],
    active: p.active !== false,
    sort_order: p.sortOrder || 999,
    show_interactive: Boolean(p.showInteractive),
    interactive_video_url: p.interactiveVideoUrl || "",
    interactive_title_ar: p.interactiveTitle || "",
    interactive_title_en: p.interactiveTitleEn || "",
  };
}

function heroToDb(h: HeroSlide) {
  return {
    id: h.id,
    image: h.image,
    light_image: h.lightImage || "",
    badge_ar: h.badge,
    badge_en: h.badgeEn || h.badge,
    title_ar: h.title,
    title_en: h.titleEn || h.title,
    subtitle_ar: h.subtitle,
    subtitle_en: h.subtitleEn || h.subtitle,
    cta_ar: h.cta,
    cta_en: h.ctaEn || h.cta,
    cta_href: h.ctaHref || "#order",
    secondary_cta_ar: h.secondaryCta || "تصفح المنتجات",
    secondary_cta_en: h.secondaryCtaEn || "Browse products",
    bullets_ar: h.bullets || [],
    bullets_en: h.bulletsEn || [],
    active: h.active !== false,
    sort_order: h.sortOrder || 999,
  };
}

function categoryToDb(c: Category) {
  return {
    id: c.id,
    name_ar: c.name,
    name_en: c.nameEn,
    active: c.active !== false,
    sort_order: c.sortOrder || 999,
  };
}

function settingsToDb(s: SiteSettings) {
  return {
    id: 1,
    site_name: s.siteName,
    tagline: s.tagline,
    whatsapp: s.whatsapp,
    hero_autoplay_ms: s.heroAutoplayMs,
  };
}

function contactToDb(c: ContactSettings) {
  return {
    id: 1,
    title_ar: c.title,
    title_en: c.titleEn || c.title,
    subtitle_ar: c.subtitle,
    subtitle_en: c.subtitleEn || c.subtitle,
    whatsapp: c.whatsapp,
    email: c.email,
    address_ar: c.address,
    address_en: c.addressEn || c.address,
    instagram: c.instagram || "",
    facebook: c.facebook || "",
    tiktok: c.tiktok || "",
    website: c.website || "",
    show_contact_page: c.showContactPage !== false,
    show_floating_whatsapp: c.showFloatingWhatsapp !== false,
  };
}

export default function AdminDashboard({ initialTab = "products" }: { initialTab?: Tab }) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const [cms, setCms] = useState<CmsState>(fallbackCms);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingHero, setEditingHero] = useState<HeroSlide | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [saved, setSaved] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/cms")
      .then((r) => r.json())
      .then((data) => setCms({
        products: data.products?.length ? data.products : fallbackCms.products,
        heroSlides: data.heroSlides?.length ? data.heroSlides : fallbackCms.heroSlides,
        categories: data.categories?.length ? data.categories : fallbackCms.categories,
        settings: data.settings || fallbackCms.settings,
        contactSettings: data.contactSettings || fallbackCms.contactSettings,
        source: data.source,
      }))
      .catch(() => setCms(fallbackCms));
  }, []);

  const flash = (msg: string) => {
    setSaved(msg);
    setTimeout(() => setSaved(""), 2500);
  };

  const saveProduct = async (p: Product) => {
    setLoading(true);
    const updated = cms.products.some((x) => x.slug === p.slug)
      ? cms.products.map((x) => x.slug === p.slug ? p : x)
      : [...cms.products, p];
    setCms({ ...cms, products: updated });
    localStorage.setItem("trend_admin_products", JSON.stringify(updated));
    try { await adminSave("products", productToDb(p)); flash("تم حفظ المنتج في Supabase"); }
    catch (e: any) { flash(`تم حفظه محليًا فقط: ${e.message}`); }
    finally { setEditingProduct(null); setLoading(false); }
  };

  const saveHero = async (h: HeroSlide) => {
    setLoading(true);
    const updated = cms.heroSlides.some((x) => x.id === h.id)
      ? cms.heroSlides.map((x) => x.id === h.id ? h : x)
      : [...cms.heroSlides, h];
    setCms({ ...cms, heroSlides: updated });
    try { await adminSave("hero_slides", heroToDb(h)); flash("تم حفظ الهيرو في Supabase"); }
    catch (e: any) { flash(`تم حفظه محليًا فقط: ${e.message}`); }
    finally { setEditingHero(null); setLoading(false); }
  };

  const saveCategory = async (c: Category) => {
    setLoading(true);
    const updated = cms.categories.some((x) => x.id === c.id)
      ? cms.categories.map((x) => x.id === c.id ? c : x)
      : [...cms.categories, c];
    setCms({ ...cms, categories: updated });
    try { await adminSave("categories", categoryToDb(c)); flash("تم حفظ التصنيف في Supabase"); }
    catch (e: any) { flash(`تم حفظه محليًا فقط: ${e.message}`); }
    finally { setEditingCategory(null); setLoading(false); }
  };

  const saveSettings = async () => {
    setLoading(true);
    try { await adminSave("site_settings", settingsToDb(cms.settings)); flash("تم حفظ الإعدادات في Supabase"); }
    catch (e: any) { flash(`تم حفظها محليًا فقط: ${e.message}`); }
    finally { setLoading(false); }
  };

  const saveContact = async () => {
    setLoading(true);
    try { await adminSave("contact_settings", contactToDb(cms.contactSettings)); flash("تم حفظ صفحة التواصل في Supabase"); }
    catch (e: any) { flash(`تم حفظها محليًا فقط: ${e.message}`); }
    finally { setLoading(false); }
  };

  return (
    <div className="admin-wrap">
      <nav className="admin-nav">
        <div className="admin-nav-logo"><span>Trend</span><small>لوحة التحكم • {cms.source || "static"}</small></div>
        <div className="admin-nav-tabs">
          <Link className={tab === "products" ? "active" : ""} href="/admin/products">المنتجات</Link>
          <Link className={tab === "hero" ? "active" : ""} href="/admin/hero">الهيرو</Link>
          <Link className={tab === "categories" ? "active" : ""} href="/admin/categories">التصنيفات</Link>
          <Link className={tab === "settings" ? "active" : ""} href="/admin/settings">الإعدادات</Link>
          <Link className={tab === "contact" ? "active" : ""} href="/admin/contact">تواصل معنا</Link>
          <Link href="/admin/story-builder">Story Builder</Link>
        </div>
        <div className="admin-nav-actions">
          {saved && <span className="saved-badge">{saved}</span>}
          {loading && <span className="saved-badge">جار الحفظ...</span>}
          <Link href="/" className="view-site-btn" target="_blank">عرض الموقع ↗</Link>
          <button className="logout-btn" onClick={() => { localStorage.removeItem("trend_admin_auth"); window.location.href = "/admin/login"; }}>خروج</button>
        </div>
      </nav>

      <main className="admin-main">
        {tab === "products" && !editingProduct && (
          <div>
            <div className="admin-section-head">
              <h1>المنتجات</h1>
              <p>تحكم بكل تفاصيل المنتج عربي/إنجليزي + الفيديو التفاعلي</p>
              <button className="primaryBtn" onClick={() => setEditingProduct({
                slug: `product-${Date.now()}`,
                name: "منتج جديد",
                nameEn: "New Product",
                price: 0,
                image: "/heroes/name-medal-plastic.jpg",
                category: "هدايا مخصصة",
                categoryEn: "Personalized Gifts",
                tag: "Tag",
                tagEn: "Tag",
                material: "PLA Plastic",
                materialEn: "PLA Plastic",
                description: "وصف المنتج",
                descriptionEn: "Product description",
                features: [],
                featuresEn: [],
                deliveryDays: "3–5 أيام",
                deliveryDaysEn: "3–5 days",
                orderTypes: [],
                orderTypesEn: [],
                active: true,
                sortOrder: cms.products.length + 1,
                showInteractive: false,
                interactiveVideoUrl: "",
                interactiveTitle: "",
                interactiveTitleEn: "",
              })}>+ إضافة منتج</button>
            </div>
            <div className="admin-products-grid">
              {cms.products.map(p => (
                <div className="admin-product-card" key={p.slug} onClick={() => setEditingProduct({ ...p })}>
                  <img src={p.image} alt={p.name} />
                  <div className="apc-body">
                    <strong>{p.name}</strong>
                    <span className="apc-price">{p.price} QAR</span>
                    <span className="apc-tag">{p.active === false ? "مخفي" : "ظاهر"} • {p.showInteractive ? "فيديو تفاعلي" : "بدون فيديو"}</span>
                  </div>
                  <button className="apc-edit-btn">تعديل</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "products" && editingProduct && <ProductEditor product={editingProduct} setProduct={setEditingProduct} onSave={saveProduct} onCancel={() => setEditingProduct(null)} />}

        {tab === "hero" && !editingHero && (
          <div>
            <div className="admin-section-head">
              <h1>الهيرو</h1>
              <p>تحكم في كل سلايد: الصور، النصوص، الأزرار، الترتيب، والظهور</p>
              <button className="primaryBtn" onClick={() => setEditingHero({
                id: `hero-${Date.now()}`,
                image: "/heroes/birthday-gift.jpg",
                lightImage: "/heroes/hero-birthday-gift-light.jpg",
                badge: "سلايد جديد",
                badgeEn: "New Slide",
                title: "عنوان جديد",
                titleEn: "New title",
                subtitle: "وصف قصير",
                subtitleEn: "Short description",
                cta: "اطلب الآن",
                ctaEn: "Order now",
                ctaHref: "#order",
                secondaryCta: "تصفح المنتجات",
                secondaryCtaEn: "Browse products",
                bullets: [],
                bulletsEn: [],
                active: true,
                sortOrder: cms.heroSlides.length + 1,
              })}>+ إضافة سلايد</button>
            </div>
            <div className="admin-products-grid">
              {cms.heroSlides.map(h => (
                <div className="admin-product-card" key={h.id} onClick={() => setEditingHero({ ...h })}>
                  <img src={h.image} alt={h.title} />
                  <div className="apc-body">
                    <strong>{h.title}</strong>
                    <span className="apc-price">#{h.sortOrder || 0}</span>
                    <span className="apc-tag">{h.active === false ? "مخفي" : "ظاهر"}</span>
                  </div>
                  <button className="apc-edit-btn">تعديل</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "hero" && editingHero && <HeroEditor hero={editingHero} setHero={setEditingHero} onSave={saveHero} onCancel={() => setEditingHero(null)} />}

        {tab === "categories" && !editingCategory && (
          <div>
            <div className="admin-section-head">
              <h1>التصنيفات</h1>
              <p>التصنيفات تظهر عربي/إنجليزي في الرئيسية</p>
              <button className="primaryBtn" onClick={() => setEditingCategory({ id: `category-${Date.now()}`, name: "تصنيف جديد", nameEn: "New Category", active: true, sortOrder: cms.categories.length + 1 })}>+ إضافة تصنيف</button>
            </div>
            <div className="adminTable compactTable">
              {cms.categories.map((c) => (
                <div key={c.id}>
                  <span>{c.name}</span><small>{c.nameEn}</small><b>#{c.sortOrder}</b><span className="status-active">{c.active === false ? "مخفي" : "ظاهر"}</span><button onClick={() => setEditingCategory({ ...c })}>تعديل</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "categories" && editingCategory && <CategoryEditor category={editingCategory} setCategory={setEditingCategory} onSave={saveCategory} onCancel={() => setEditingCategory(null)} />}

        {tab === "settings" && (
          <div className="admin-settings">
            <div className="admin-section-head"><h1>إعدادات الموقع</h1></div>
            <div className="settings-form">
              <label>رقم الواتساب بدون +
                <input value={cms.settings.whatsapp} onChange={e => setCms({ ...cms, settings: { ...cms.settings, whatsapp: whatsappDigits(e.target.value) } })} placeholder="97412345678" dir="ltr" />
              </label>
              <label>اسم المتجر
                <input value={cms.settings.siteName} onChange={e => setCms({ ...cms, settings: { ...cms.settings, siteName: e.target.value } })} />
              </label>
              <label>الشعار الفرعي
                <input value={cms.settings.tagline} onChange={e => setCms({ ...cms, settings: { ...cms.settings, tagline: e.target.value } })} />
              </label>
              <label>سرعة تغيير الهيرو بالمللي ثانية
                <input type="number" value={cms.settings.heroAutoplayMs} onChange={e => setCms({ ...cms, settings: { ...cms.settings, heroAutoplayMs: Number(e.target.value) } })} />
              </label>
              <div className="settings-info">
                <h3>ملاحظات مهمة</h3>
                <p>لو ظهر “تم حفظه محليًا فقط”، تأكد من ملف `.env.local` وقاعدة Supabase.</p>
                <div className="info-row"><span>عدد المنتجات</span><b>{cms.products.length}</b></div>
                <div className="info-row"><span>عدد سلايدات الهيرو</span><b>{cms.heroSlides.length}</b></div>
                <div className="info-row"><span>كلمة سر الأدمن</span><b>trend2024</b></div>
              </div>
              <button className="primaryBtn" onClick={saveSettings}>حفظ الإعدادات</button>
            </div>
          </div>
        )}


        {tab === "contact" && (
          <div className="admin-settings">
            <div className="admin-section-head"><h1>صفحة تواصل معنا</h1><p>تحكم بكل بيانات صفحة التواصل عربي/إنجليزي.</p></div>
            <div className="settings-form">
              <div className="twoCols"><label>العنوان عربي<input value={cms.contactSettings.title} onChange={e => setCms({ ...cms, contactSettings: { ...cms.contactSettings, title: e.target.value } })} /></label><label>Title English<input value={cms.contactSettings.titleEn} onChange={e => setCms({ ...cms, contactSettings: { ...cms.contactSettings, titleEn: e.target.value } })} dir="ltr" /></label></div>
              <label>الوصف عربي<textarea rows={3} value={cms.contactSettings.subtitle} onChange={e => setCms({ ...cms, contactSettings: { ...cms.contactSettings, subtitle: e.target.value } })} /></label>
              <label>Description English<textarea rows={3} value={cms.contactSettings.subtitleEn} onChange={e => setCms({ ...cms, contactSettings: { ...cms.contactSettings, subtitleEn: e.target.value } })} dir="ltr" /></label>
              <div className="twoCols"><label>واتساب<input value={cms.contactSettings.whatsapp} onChange={e => setCms({ ...cms, contactSettings: { ...cms.contactSettings, whatsapp: whatsappDigits(e.target.value) } })} dir="ltr" /></label><label>Email<input value={cms.contactSettings.email} onChange={e => setCms({ ...cms, contactSettings: { ...cms.contactSettings, email: e.target.value } })} dir="ltr" /></label></div>
              <div className="twoCols"><label>العنوان عربي<input value={cms.contactSettings.address} onChange={e => setCms({ ...cms, contactSettings: { ...cms.contactSettings, address: e.target.value } })} /></label><label>Address English<input value={cms.contactSettings.addressEn} onChange={e => setCms({ ...cms, contactSettings: { ...cms.contactSettings, addressEn: e.target.value } })} dir="ltr" /></label></div>
              <div className="twoCols"><label>Instagram<input value={cms.contactSettings.instagram} onChange={e => setCms({ ...cms, contactSettings: { ...cms.contactSettings, instagram: e.target.value } })} dir="ltr" /></label><label>Facebook<input value={cms.contactSettings.facebook} onChange={e => setCms({ ...cms, contactSettings: { ...cms.contactSettings, facebook: e.target.value } })} dir="ltr" /></label></div>
              <div className="twoCols"><label>TikTok<input value={cms.contactSettings.tiktok} onChange={e => setCms({ ...cms, contactSettings: { ...cms.contactSettings, tiktok: e.target.value } })} dir="ltr" /></label><label>Website<input value={cms.contactSettings.website} onChange={e => setCms({ ...cms, contactSettings: { ...cms.contactSettings, website: e.target.value } })} dir="ltr" /></label></div>
              <label className="checkLine"><input type="checkbox" checked={cms.contactSettings.showContactPage !== false} onChange={e => setCms({ ...cms, contactSettings: { ...cms.contactSettings, showContactPage: e.target.checked } })} /> إظهار صفحة التواصل</label>
              <label className="checkLine"><input type="checkbox" checked={cms.contactSettings.showFloatingWhatsapp !== false} onChange={e => setCms({ ...cms, contactSettings: { ...cms.contactSettings, showFloatingWhatsapp: e.target.checked } })} /> إظهار زر واتساب العائم</label>
              <button className="primaryBtn" onClick={saveContact}>حفظ صفحة التواصل</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function ProductEditor({ product, setProduct, onSave, onCancel }: { product: Product; setProduct: (p: Product) => void; onSave: (p: Product) => void; onCancel: () => void }) {
  return (
    <div className="admin-edit-wrap">
      <button className="back-to-list" onClick={onCancel}>← رجوع للمنتجات</button>
      <h2>تعديل المنتج</h2>
      <div className="edit-grid">
        <div className="edit-preview"><img src={product.image} alt="" />{product.showInteractive && <div className="adminVideoBadge">الفيديو التفاعلي ظاهر</div>}</div>
        <div className="edit-fields">
          <label>Slug<input value={product.slug} onChange={e => setProduct({ ...product, slug: e.target.value })} dir="ltr" /></label>
          <div className="twoCols"><label>اسم المنتج عربي<input value={product.name} onChange={e => setProduct({ ...product, name: e.target.value })} /></label><label>Product name English<input value={product.nameEn || ""} onChange={e => setProduct({ ...product, nameEn: e.target.value })} dir="ltr" /></label></div>
          <div className="twoCols"><label>السعر<input type="number" value={product.price} onChange={e => setProduct({ ...product, price: Number(e.target.value) })} /></label><label>الترتيب<input type="number" value={product.sortOrder || 0} onChange={e => setProduct({ ...product, sortOrder: Number(e.target.value) })} /></label></div>
          <div className="twoCols"><label>التصنيف عربي<input value={product.category || ""} onChange={e => setProduct({ ...product, category: e.target.value })} /></label><label>Category English<input value={product.categoryEn || ""} onChange={e => setProduct({ ...product, categoryEn: e.target.value })} dir="ltr" /></label></div>
          <div className="twoCols"><label>الوسم عربي<input value={product.tag} onChange={e => setProduct({ ...product, tag: e.target.value })} /></label><label>Tag English<input value={product.tagEn || ""} onChange={e => setProduct({ ...product, tagEn: e.target.value })} dir="ltr" /></label></div>
          <div className="twoCols"><label>الخامة عربي<input value={product.material} onChange={e => setProduct({ ...product, material: e.target.value })} /></label><label>Material English<input value={product.materialEn || ""} onChange={e => setProduct({ ...product, materialEn: e.target.value })} dir="ltr" /></label></div>
          <div className="twoCols"><label>مدة التسليم عربي<input value={product.deliveryDays} onChange={e => setProduct({ ...product, deliveryDays: e.target.value })} /></label><label>Delivery English<input value={product.deliveryDaysEn || ""} onChange={e => setProduct({ ...product, deliveryDaysEn: e.target.value })} dir="ltr" /></label></div>
          <UploadField label="رفع صورة المنتج إلى Supabase Storage" folder="products" accept="image/*" currentUrl={product.image} onUploaded={(url) => setProduct({ ...product, image: url })} />
          <label>رابط الصورة<input value={product.image} onChange={e => setProduct({ ...product, image: e.target.value })} dir="ltr" /></label>
          <label>الوصف عربي<textarea rows={4} value={product.description} onChange={e => setProduct({ ...product, description: e.target.value })} /></label>
          <label>Description English<textarea rows={4} value={product.descriptionEn || ""} onChange={e => setProduct({ ...product, descriptionEn: e.target.value })} dir="ltr" /></label>
          <div className="twoCols"><label>المميزات عربي<textarea rows={5} value={joinLines(product.features)} onChange={e => setProduct({ ...product, features: splitLines(e.target.value) })} /></label><label>Features English<textarea rows={5} value={joinLines(product.featuresEn)} onChange={e => setProduct({ ...product, featuresEn: splitLines(e.target.value) })} dir="ltr" /></label></div>
          <div className="twoCols"><label>أنواع الطلب عربي<textarea rows={4} value={joinLines(product.orderTypes)} onChange={e => setProduct({ ...product, orderTypes: splitLines(e.target.value) })} /></label><label>Order types English<textarea rows={4} value={joinLines(product.orderTypesEn)} onChange={e => setProduct({ ...product, orderTypesEn: splitLines(e.target.value) })} dir="ltr" /></label></div>
          <label className="checkLine"><input type="checkbox" checked={product.active !== false} onChange={e => setProduct({ ...product, active: e.target.checked })} /> المنتج ظاهر في الموقع</label>
          <label className="checkLine"><input type="checkbox" checked={Boolean(product.showInteractive)} onChange={e => setProduct({ ...product, showInteractive: e.target.checked })} /> عرض التجربة التفاعلية لهذا المنتج</label>
          <div className="twoCols"><label>عنوان الفيديو عربي<input value={product.interactiveTitle || ""} onChange={e => setProduct({ ...product, interactiveTitle: e.target.value })} /></label><label>Interactive title English<input value={product.interactiveTitleEn || ""} onChange={e => setProduct({ ...product, interactiveTitleEn: e.target.value })} dir="ltr" /></label></div>
          <UploadField label="رفع الفيديو التفاعلي إلى Supabase Storage" folder="interactive" accept="video/*" currentUrl={product.interactiveVideoUrl || ""} onUploaded={(url) => setProduct({ ...product, interactiveVideoUrl: url })} />
          <label>رابط الفيديو التفاعلي<input value={product.interactiveVideoUrl || ""} onChange={e => setProduct({ ...product, interactiveVideoUrl: e.target.value })} dir="ltr" placeholder="/videos/demo.mp4 أو رابط خارجي" /></label>
          <div className="edit-actions"><button className="primaryBtn" onClick={() => onSave(product)}>حفظ المنتج</button><button className="cancel-btn" onClick={onCancel}>إلغاء</button></div>
        </div>
      </div>
    </div>
  );
}

function HeroEditor({ hero, setHero, onSave, onCancel }: { hero: HeroSlide; setHero: (h: HeroSlide) => void; onSave: (h: HeroSlide) => void; onCancel: () => void }) {
  return (
    <div className="admin-edit-wrap">
      <button className="back-to-list" onClick={onCancel}>← رجوع للهيرو</button>
      <h2>تعديل سلايد الهيرو</h2>
      <div className="edit-grid">
        <div className="edit-preview"><img src={hero.image} alt="" /></div>
        <div className="edit-fields">
          <label>ID<input value={hero.id} onChange={e => setHero({ ...hero, id: e.target.value })} dir="ltr" /></label>
          <div className="twoCols"><label>عنوان عربي<input value={hero.title} onChange={e => setHero({ ...hero, title: e.target.value })} /></label><label>Title English<input value={hero.titleEn || ""} onChange={e => setHero({ ...hero, titleEn: e.target.value })} dir="ltr" /></label></div>
          <div className="twoCols"><label>Badge عربي<input value={hero.badge} onChange={e => setHero({ ...hero, badge: e.target.value })} /></label><label>Badge English<input value={hero.badgeEn || ""} onChange={e => setHero({ ...hero, badgeEn: e.target.value })} dir="ltr" /></label></div>
          <label>وصف عربي<textarea rows={3} value={hero.subtitle} onChange={e => setHero({ ...hero, subtitle: e.target.value })} /></label>
          <label>Subtitle English<textarea rows={3} value={hero.subtitleEn || ""} onChange={e => setHero({ ...hero, subtitleEn: e.target.value })} dir="ltr" /></label>
          <div className="twoCols"><label>CTA عربي<input value={hero.cta} onChange={e => setHero({ ...hero, cta: e.target.value })} /></label><label>CTA English<input value={hero.ctaEn || ""} onChange={e => setHero({ ...hero, ctaEn: e.target.value })} dir="ltr" /></label></div>
          <div className="twoCols"><label>Secondary CTA عربي<input value={hero.secondaryCta || ""} onChange={e => setHero({ ...hero, secondaryCta: e.target.value })} /></label><label>Secondary CTA English<input value={hero.secondaryCtaEn || ""} onChange={e => setHero({ ...hero, secondaryCtaEn: e.target.value })} dir="ltr" /></label></div>
          <div className="twoCols"><label>رابط زر CTA<input value={hero.ctaHref || "#order"} onChange={e => setHero({ ...hero, ctaHref: e.target.value })} dir="ltr" /></label><label>الترتيب<input type="number" value={hero.sortOrder || 0} onChange={e => setHero({ ...hero, sortOrder: Number(e.target.value) })} /></label></div>
          <UploadField label="رفع صورة Dark للهيرو" folder="heroes" accept="image/*" currentUrl={hero.image} onUploaded={(url) => setHero({ ...hero, image: url })} />
          <label>صورة Dark<input value={hero.image} onChange={e => setHero({ ...hero, image: e.target.value })} dir="ltr" /></label>
          <UploadField label="رفع صورة Light للهيرو" folder="heroes" accept="image/*" currentUrl={hero.lightImage || ""} onUploaded={(url) => setHero({ ...hero, lightImage: url })} />
          <label>صورة Light<input value={hero.lightImage || ""} onChange={e => setHero({ ...hero, lightImage: e.target.value })} dir="ltr" /></label>
          <div className="twoCols"><label>Bullets عربي<textarea rows={4} value={joinLines(hero.bullets)} onChange={e => setHero({ ...hero, bullets: splitLines(e.target.value) })} /></label><label>Bullets English<textarea rows={4} value={joinLines(hero.bulletsEn)} onChange={e => setHero({ ...hero, bulletsEn: splitLines(e.target.value) })} dir="ltr" /></label></div>
          <label className="checkLine"><input type="checkbox" checked={hero.active !== false} onChange={e => setHero({ ...hero, active: e.target.checked })} /> السلايد ظاهر</label>
          <div className="edit-actions"><button className="primaryBtn" onClick={() => onSave(hero)}>حفظ السلايد</button><button className="cancel-btn" onClick={onCancel}>إلغاء</button></div>
        </div>
      </div>
    </div>
  );
}

function CategoryEditor({ category, setCategory, onSave, onCancel }: { category: Category; setCategory: (c: Category) => void; onSave: (c: Category) => void; onCancel: () => void }) {
  return (
    <div className="admin-edit-wrap smallEdit">
      <button className="back-to-list" onClick={onCancel}>← رجوع للتصنيفات</button>
      <h2>تعديل التصنيف</h2>
      <div className="edit-fields">
        <label>ID<input value={category.id} onChange={e => setCategory({ ...category, id: e.target.value })} dir="ltr" /></label>
        <label>الاسم عربي<input value={category.name} onChange={e => setCategory({ ...category, name: e.target.value })} /></label>
        <label>Name English<input value={category.nameEn} onChange={e => setCategory({ ...category, nameEn: e.target.value })} dir="ltr" /></label>
        <label>الترتيب<input type="number" value={category.sortOrder || 0} onChange={e => setCategory({ ...category, sortOrder: Number(e.target.value) })} /></label>
        <label className="checkLine"><input type="checkbox" checked={category.active !== false} onChange={e => setCategory({ ...category, active: e.target.checked })} /> التصنيف ظاهر</label>
        <div className="edit-actions"><button className="primaryBtn" onClick={() => onSave(category)}>حفظ التصنيف</button><button className="cancel-btn" onClick={onCancel}>إلغاء</button></div>
      </div>
    </div>
  );
}
