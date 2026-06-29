import { categoryItems, defaultContactSettings, defaultSettings, heroSlides, products, type Category, type ContactSettings, type HeroSlide, type Product, type SiteSettings } from "@/lib/data";
import { getAdminSupabase } from "@/lib/supabase";

export type CmsData = {
  settings: SiteSettings;
  contactSettings: ContactSettings;
  heroSlides: HeroSlide[];
  products: Product[];
  categories: Category[];
  source: "supabase" | "static";
};

function sortByOrder<T extends { sortOrder?: number }>(items: T[]) {
  return [...items].sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999));
}

function onlyActive<T extends { active?: boolean }>(items: T[]) {
  return items.filter((item) => item.active !== false);
}

export const staticCmsData: CmsData = {
  settings: defaultSettings,
  contactSettings: defaultContactSettings,
  heroSlides: sortByOrder(onlyActive(heroSlides)),
  products: sortByOrder(onlyActive(products)),
  categories: sortByOrder(onlyActive(categoryItems)),
  source: "static",
};

export async function getCmsData(): Promise<CmsData> {
  const supabase = getAdminSupabase();
  if (!supabase) return staticCmsData;

  try {
    const [settingsRes, contactRes, heroRes, productRes, categoryRes] = await Promise.all([
      supabase.from("site_settings").select("*").eq("id", 1).maybeSingle(),
      supabase.from("contact_settings").select("*").eq("id", 1).maybeSingle(),
      supabase.from("hero_slides").select("*").order("sort_order", { ascending: true }),
      supabase.from("products").select("*").order("sort_order", { ascending: true }),
      supabase.from("categories").select("*").order("sort_order", { ascending: true }),
    ]);

    if (heroRes.error || productRes.error || categoryRes.error) return staticCmsData;

    const mappedHero: HeroSlide[] = (heroRes.data ?? []).map((h: any) => ({
      id: h.id,
      image: h.image,
      lightImage: h.light_image,
      badge: h.badge_ar,
      badgeEn: h.badge_en,
      title: h.title_ar,
      titleEn: h.title_en,
      subtitle: h.subtitle_ar,
      subtitleEn: h.subtitle_en,
      cta: h.cta_ar,
      ctaEn: h.cta_en,
      ctaHref: h.cta_href || "#order",
      secondaryCta: h.secondary_cta_ar,
      secondaryCtaEn: h.secondary_cta_en,
      bullets: h.bullets_ar ?? [],
      bulletsEn: h.bullets_en ?? [],
      active: h.active,
      sortOrder: h.sort_order,
    }));

    const mappedProducts: Product[] = (productRes.data ?? []).map((p: any) => ({
      slug: p.slug,
      name: p.name_ar,
      nameEn: p.name_en,
      price: Number(p.price ?? 0),
      image: p.image,
      category: p.category_ar,
      categoryEn: p.category_en,
      tag: p.tag_ar,
      tagEn: p.tag_en,
      material: p.material_ar,
      materialEn: p.material_en,
      description: p.description_ar,
      descriptionEn: p.description_en,
      features: p.features_ar ?? [],
      featuresEn: p.features_en ?? [],
      deliveryDays: p.delivery_days_ar,
      deliveryDaysEn: p.delivery_days_en,
      orderTypes: p.order_types_ar ?? [],
      orderTypesEn: p.order_types_en ?? [],
      active: p.active,
      sortOrder: p.sort_order,
      showInteractive: p.show_interactive,
      interactiveVideoUrl: p.interactive_video_url,
      interactiveTitle: p.interactive_title_ar,
      interactiveTitleEn: p.interactive_title_en,
    }));

    const mappedCategories: Category[] = (categoryRes.data ?? []).map((c: any) => ({
      id: c.id,
      name: c.name_ar,
      nameEn: c.name_en,
      active: c.active,
      sortOrder: c.sort_order,
    }));

    const s: SiteSettings = settingsRes.data ? {
      siteName: settingsRes.data.site_name || defaultSettings.siteName,
      tagline: settingsRes.data.tagline || defaultSettings.tagline,
      whatsapp: settingsRes.data.whatsapp || defaultSettings.whatsapp,
      heroAutoplayMs: settingsRes.data.hero_autoplay_ms || defaultSettings.heroAutoplayMs,
    } : defaultSettings;

    const contact: ContactSettings = contactRes.data ? {
      id: contactRes.data.id || 1,
      title: contactRes.data.title_ar || defaultContactSettings.title,
      titleEn: contactRes.data.title_en || defaultContactSettings.titleEn,
      subtitle: contactRes.data.subtitle_ar || defaultContactSettings.subtitle,
      subtitleEn: contactRes.data.subtitle_en || defaultContactSettings.subtitleEn,
      whatsapp: contactRes.data.whatsapp || s.whatsapp || defaultContactSettings.whatsapp,
      email: contactRes.data.email || defaultContactSettings.email,
      address: contactRes.data.address_ar || defaultContactSettings.address,
      addressEn: contactRes.data.address_en || defaultContactSettings.addressEn,
      instagram: contactRes.data.instagram || "",
      facebook: contactRes.data.facebook || "",
      tiktok: contactRes.data.tiktok || "",
      website: contactRes.data.website || "",
      showContactPage: contactRes.data.show_contact_page !== false,
      showFloatingWhatsapp: contactRes.data.show_floating_whatsapp !== false,
    } : { ...defaultContactSettings, whatsapp: s.whatsapp || defaultContactSettings.whatsapp };

    return {
      settings: s,
      contactSettings: contact,
      heroSlides: mappedHero.length ? onlyActive(mappedHero) : staticCmsData.heroSlides,
      products: mappedProducts.length ? onlyActive(mappedProducts) : staticCmsData.products,
      categories: mappedCategories.length ? onlyActive(mappedCategories) : staticCmsData.categories,
      source: "supabase",
    };
  } catch {
    return staticCmsData;
  }
}
