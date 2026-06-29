export type Locale = "ar" | "en";

export type LocalizedText = {
  ar: string;
  en: string;
};

export type HeroSlide = {
  id: string;
  image: string;
  lightImage?: string;
  badge: string;
  badgeEn?: string;
  title: string;
  titleEn?: string;
  subtitle: string;
  subtitleEn?: string;
  cta: string;
  ctaEn?: string;
  ctaHref?: string;
  secondaryCta?: string;
  secondaryCtaEn?: string;
  bullets: string[];
  bulletsEn?: string[];
  active?: boolean;
  sortOrder?: number;
};

export type Product = {
  slug: string;
  name: string;
  nameEn?: string;
  price: number;
  image: string;
  category?: string;
  categoryEn?: string;
  tag: string;
  tagEn?: string;
  material: string;
  materialEn?: string;
  description: string;
  descriptionEn?: string;
  features: string[];
  featuresEn?: string[];
  deliveryDays: string;
  deliveryDaysEn?: string;
  orderTypes: string[];
  orderTypesEn?: string[];
  active?: boolean;
  sortOrder?: number;
  showInteractive?: boolean;
  interactiveVideoUrl?: string;
  interactiveTitle?: string;
  interactiveTitleEn?: string;
};

export type Category = {
  id: string;
  name: string;
  nameEn: string;
  active?: boolean;
  sortOrder?: number;
};

export type SiteSettings = {
  siteName: string;
  tagline: string;
  whatsapp: string;
  heroAutoplayMs: number;
};

export type ContactSettings = {
  id?: number;
  title: string;
  titleEn: string;
  subtitle: string;
  subtitleEn: string;
  whatsapp: string;
  email: string;
  address: string;
  addressEn: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  website: string;
  showContactPage: boolean;
  showFloatingWhatsapp: boolean;
};

export const defaultSettings: SiteSettings = {
  siteName: "TrendGift",
  tagline: "Custom · NFC · Gifts",
  whatsapp: "97400000000",
  heroAutoplayMs: 6500,
};

export const defaultContactSettings: ContactSettings = {
  id: 1,
  title: "تواصل معنا",
  titleEn: "Contact us",
  subtitle: "جاهزين نسمع فكرتك ونحوّلها لهدية ذكية مخصصة.",
  subtitleEn: "We are ready to hear your idea and turn it into a custom smart gift.",
  whatsapp: "97400000000",
  email: "hello@trendgift.qa",
  address: "الدوحة، قطر",
  addressEn: "Doha, Qatar",
  instagram: "",
  facebook: "",
  tiktok: "",
  website: "",
  showContactPage: true,
  showFloatingWhatsapp: true,
};

export const heroSlides: HeroSlide[] = [
  {
    id: "car-adhkar",
    image: "/heroes/car-adhkar.jpg",
    lightImage: "/heroes/hero-car-adhkar-light.jpg",
    badge: "تعليقة سيارة NFC",
    badgeEn: "NFC Car Hanger",
    title: "اجعل الذكر معك في كل طريق",
    titleEn: "Keep your adhkar with you on every road",
    subtitle: "ميدالية بلاستيك مخصصة للسيارة تفتح صفحة الأذكار بلمسة NFC أو عبر QR.",
    subtitleEn: "A custom plastic car hanger that opens your adhkar page by NFC tap or QR scan.",
    cta: "اطلب تعليقة",
    ctaEn: "Order hanger",
    ctaHref: "#order",
    secondaryCta: "تصفح المنتجات",
    secondaryCtaEn: "Browse products",
    bullets: ["NFC + QR", "صفحة أذكار", "تصميم بلاستيك مخصص"],
    bulletsEn: ["NFC + QR", "Adhkar page", "Custom plastic design"],
    active: true,
    sortOrder: 1,
  },
  {
    id: "moon-memory",
    image: "/heroes/moon-memory.jpg",
    lightImage: "/heroes/hero-moon-memory-light.jpg",
    badge: "هدايا ذكريات",
    badgeEn: "Memory Gifts",
    title: "حوّل ذكرياتك إلى هدية تنبض بالحياة",
    titleEn: "Turn memories into a living gift",
    subtitle: "صورة، فيديو، رسالة ورابط خاص داخل هدية واحدة مخصصة.",
    subtitleEn: "Photo, video, message, and a private link inside one personalized gift.",
    cta: "اصنع هديتك",
    ctaEn: "Create gift",
    ctaHref: "#order",
    secondaryCta: "تصفح المنتجات",
    secondaryCtaEn: "Browse products",
    bullets: ["صفحة خاصة", "صور وفيديو", "QR أو NFC"],
    bulletsEn: ["Private page", "Photos & video", "QR or NFC"],
    active: true,
    sortOrder: 2,
  },
  {
    id: "business-nfc",
    image: "/heroes/business-nfc.jpg",
    lightImage: "/heroes/hero-nfc-card-light.jpg",
    badge: "بطاقات بزنس NFC",
    badgeEn: "Business NFC",
    title: "هل ما زلت تشارك بياناتك يدويًا؟",
    titleEn: "Still sharing your number manually?",
    subtitle: "كرت ذكي يفتح بروفايلك وروابطك وواتسابك، مع إحصائيات للزيارات والنقرات.",
    subtitleEn: "A smart card that opens your profile, links, WhatsApp, visits, and click analytics.",
    cta: "أنشئ بطاقتك",
    ctaEn: "Create card",
    ctaHref: "#business",
    secondaryCta: "تصفح المنتجات",
    secondaryCtaEn: "Browse products",
    bullets: ["بروفايل TrendLink", "إحصائيات", "مشاركة بلمسة"],
    bulletsEn: ["Business profile", "Analytics", "Tap to share"],
    active: true,
    sortOrder: 3,
  },
  {
    id: "spotify-gift",
    image: "/heroes/spotify-gift.jpg",
    lightImage: "/heroes/hero-spotify-plaque-light.jpg",
    badge: "هدية أغنية",
    badgeEn: "Song Gift",
    title: "اجعل أغنيتكم ذكرى دائمة",
    titleEn: "Make your song live forever",
    subtitle: "لوحة أو ميدالية مخصصة بصورة ورابط أغنية و QR يفتح الذكرى.",
    subtitleEn: "A custom plaque or medal with a photo, song link, and QR that opens the memory.",
    cta: "صممها الآن",
    ctaEn: "Design now",
    ctaHref: "#order",
    secondaryCta: "تصفح المنتجات",
    secondaryCtaEn: "Browse products",
    bullets: ["صورة", "رابط أغنية", "QR خاص"],
    bulletsEn: ["Photo", "Song link", "Private QR"],
    active: true,
    sortOrder: 4,
  },
  {
    id: "birthday",
    image: "/heroes/birthday-gift.jpg",
    lightImage: "/heroes/hero-birthday-gift-light.jpg",
    badge: "أعياد ميلاد",
    badgeEn: "Birthdays",
    title: "هدايا عيد ميلاد بلمسة ذكية",
    titleEn: "Birthday gifts with a smart touch",
    subtitle: "اجعل الهدية تفتح فيديو تهنئة أو صفحة صور ورسائل خاصة.",
    subtitleEn: "Let the gift open a birthday video, photo gallery, or private messages.",
    cta: "اطلب هدية",
    ctaEn: "Order gift",
    ctaHref: "#order",
    secondaryCta: "تصفح المنتجات",
    secondaryCtaEn: "Browse products",
    bullets: ["فيديو تهنئة", "صور", "رسالة خاصة"],
    bulletsEn: ["Greeting video", "Photos", "Private message"],
    active: true,
    sortOrder: 5,
  },
  {
    id: "name-medal",
    image: "/heroes/name-medal-plastic.jpg",
    lightImage: "/heroes/hero-name-medal-light.jpg",
    badge: "ميداليات بلاستيك",
    badgeEn: "Plastic Medals",
    title: "صمم هديتك قبل ما تطلبها",
    titleEn: "Preview your gift before ordering",
    subtitle: "اكتب الاسم، اختر اللون، وشاهد معاينة مباشرة قبل إرسال الطلب.",
    subtitleEn: "Type the name, pick a color, and see a live preview before placing the order.",
    cta: "خصص الآن",
    ctaEn: "Customize now",
    ctaHref: "#order",
    secondaryCta: "تصفح المنتجات",
    secondaryCtaEn: "Browse products",
    bullets: ["PLA / Acrylic", "ألوان متعددة", "معاينة مباشرة"],
    bulletsEn: ["PLA / Acrylic", "Multiple colors", "Live preview"],
    active: true,
    sortOrder: 6,
  },
];

export const products: Product[] = [
  {
    slug: "car-adhkar",
    name: "تعليقة أذكار للسيارة",
    nameEn: "Car Adhkar Hanger",
    price: 45,
    image: "/heroes/car-adhkar.jpg",
    category: "أذكار السيارة",
    categoryEn: "Car Adhkar",
    tag: "NFC + QR",
    tagEn: "NFC + QR",
    material: "بلاستيك مخصص",
    materialEn: "Custom plastic",
    description: "تعليقة سيارة مطبوعة ثلاثي الأبعاد بتفتح صفحة أذكار الصباح والمساء بمجرد لمسة NFC أو مسح QR. تصميم مخصص باسمك أو اسم عيلتك.",
    descriptionEn: "A 3D printed car hanger that opens morning/evening adhkar by NFC tap or QR scan, customized with your name or family name.",
    features: ["NFC مدمج", "رمز QR", "صفحة أذكار", "اسم أو دعاء مخصص", "ألوان متعددة"],
    featuresEn: ["Built-in NFC", "QR Code", "Adhkar page", "Custom name or dua", "Multiple colors"],
    deliveryDays: "3–5 أيام",
    deliveryDaysEn: "3–5 days",
    orderTypes: ["تعليقة أذكار للسيارة", "تعليقة دعاء مخصص", "تعليقة اسم + أذكار"],
    orderTypesEn: ["Car adhkar hanger", "Custom dua hanger", "Name + adhkar hanger"],
    active: true,
    sortOrder: 1,
    showInteractive: true,
    interactiveTitle: "شاهد تجربة فتح صفحة الأذكار",
    interactiveTitleEn: "Watch the adhkar page experience",
    interactiveVideoUrl: "",
  },
  {
    slug: "moon-memory",
    name: "هدية قمر الذكريات",
    nameEn: "Moon Memory Gift",
    price: 89,
    image: "/heroes/moon-memory.jpg",
    category: "هدايا مخصصة",
    categoryEn: "Personalized Gifts",
    tag: "صور وفيديو",
    tagEn: "Photos & Video",
    material: "بلاستيك/إضاءة",
    materialEn: "Plastic / light",
    description: "هدية مضيئة على شكل قمر بداخلها صفحة خاصة تفتح بـ QR تحتوي على صور وفيديو ورسالة مخصصة. مثالية لأعياد الميلاد والذكريات.",
    descriptionEn: "A glowing moon-style gift with a private QR page containing photos, video, and a custom message.",
    features: ["إضاءة LED", "صفحة خاصة", "صور وفيديو", "رسالة مكتوبة", "QR مدمج"],
    featuresEn: ["LED light", "Private page", "Photos & video", "Written message", "Built-in QR"],
    deliveryDays: "5–7 أيام",
    deliveryDaysEn: "5–7 days",
    orderTypes: ["هدية قمر ذكريات", "هدية قمر عيد ميلاد", "هدية قمر زواج"],
    orderTypesEn: ["Moon memory gift", "Birthday moon gift", "Wedding moon gift"],
    active: true,
    sortOrder: 2,
    showInteractive: true,
    interactiveTitle: "شاهد كيف تفتح صفحة الذكرى",
    interactiveTitleEn: "See how the memory page opens",
    interactiveVideoUrl: "",
  },
  {
    slug: "business-nfc",
    name: "كرت بزنس NFC",
    nameEn: "NFC Business Card",
    price: 60,
    image: "/heroes/business-nfc.jpg",
    category: "بطاقات بزنس NFC",
    categoryEn: "Business NFC",
    tag: "TrendLink",
    tagEn: "TrendLink",
    material: "PVC / Plastic",
    materialEn: "PVC / Plastic",
    description: "بطاقة أعمال ذكية من PVC مع NFC مدمج. العميل يلمس الكرت بموبايله ويفتح بروفايل TrendLink الكامل — واتساب، إنستغرام، موقعك، وكل روابطك.",
    descriptionEn: "A smart PVC business card with built-in NFC. Clients tap it to open your full profile, WhatsApp, Instagram, website, and links.",
    features: ["NFC مدمج", "بروفايل TrendLink", "واتساب مباشر", "إحصائيات نقرات", "تحديث بدون طباعة جديدة"],
    featuresEn: ["Built-in NFC", "Business profile", "Direct WhatsApp", "Click analytics", "Update without reprinting"],
    deliveryDays: "3–5 أيام",
    deliveryDaysEn: "3–5 days",
    orderTypes: ["كرت بزنس NFC", "كرت بزنس QR", "باقة 10 كروت"],
    orderTypesEn: ["NFC business card", "QR business card", "Pack of 10 cards"],
    active: true,
    sortOrder: 3,
    showInteractive: true,
    interactiveTitle: "شاهد تجربة فتح البروفايل",
    interactiveTitleEn: "Watch the profile opening experience",
    interactiveVideoUrl: "",
  },
  {
    slug: "spotify-gift",
    name: "هدية أغنية QR",
    nameEn: "QR Song Gift",
    price: 55,
    image: "/heroes/spotify-gift.jpg",
    category: "هدايا أغاني",
    categoryEn: "Song Gifts",
    tag: "Song Gift",
    tagEn: "Song Gift",
    material: "أكريليك/بلاستيك",
    materialEn: "Acrylic / Plastic",
    description: "لوحة أكريليك شفافة بصورة الزوجين أو الأصدقاء مع بار الأغنية وQR يفتح الأغنية مباشرة.",
    descriptionEn: "A clear acrylic plaque with a photo, song bar, and QR that opens the song directly.",
    features: ["بار أغنية", "QR للأغنية", "صورة مخصصة", "أكريليك شفاف", "حامل خشبي"],
    featuresEn: ["Song bar", "Song QR", "Custom photo", "Clear acrylic", "Wooden stand"],
    deliveryDays: "3–5 أيام",
    deliveryDaysEn: "3–5 days",
    orderTypes: ["لوحة أغنية أكريليك", "ميدالية أغنية QR", "هدية أغنية مع صورة"],
    orderTypesEn: ["Acrylic song plaque", "QR song medal", "Song gift with photo"],
    active: true,
    sortOrder: 4,
    showInteractive: true,
    interactiveTitle: "شاهد تجربة فتح الأغنية",
    interactiveTitleEn: "Watch the song opening experience",
    interactiveVideoUrl: "",
  },
  {
    slug: "birthday-gift",
    name: "هدية عيد ميلاد ذكية",
    nameEn: "Smart Birthday Gift",
    price: 75,
    image: "/heroes/birthday-gift.jpg",
    category: "أعياد ميلاد",
    categoryEn: "Birthdays",
    tag: "Video Page",
    tagEn: "Video Page",
    material: "حسب الطلب",
    materialEn: "Custom",
    description: "هدية مخصصة تفتح صفحة فيديو تهنئة أو البوم صور خاص بعيد الميلاد.",
    descriptionEn: "A personalized gift that opens a birthday video page or private photo album.",
    features: ["صفحة فيديو تهنئة", "البوم صور", "رسائل من الأصحاب", "QR أو NFC", "تصميم حسب الطلب"],
    featuresEn: ["Greeting video page", "Photo album", "Friends messages", "QR or NFC", "Custom design"],
    deliveryDays: "4–6 أيام",
    deliveryDaysEn: "4–6 days",
    orderTypes: ["هدية عيد ميلاد فيديو", "هدية عيد ميلاد صور", "هدية عيد ميلاد مفاجأة"],
    orderTypesEn: ["Birthday video gift", "Birthday photo gift", "Birthday surprise gift"],
    active: true,
    sortOrder: 5,
    showInteractive: true,
    interactiveTitle: "شاهد تجربة صفحة الهدية",
    interactiveTitleEn: "Watch the gift page experience",
    interactiveVideoUrl: "",
  },
  {
    slug: "name-medal",
    name: "ميدالية اسم بلاستيك",
    nameEn: "Plastic Name Medal",
    price: 35,
    image: "/heroes/name-medal-plastic.jpg",
    category: "ميداليات بلاستيك",
    categoryEn: "Plastic Medals",
    tag: "معاينة مباشرة",
    tagEn: "Live Preview",
    material: "PLA Plastic",
    materialEn: "PLA Plastic",
    description: "ميدالية اسم مطبوعة ثلاثي الأبعاد من PLA بأشكال وألوان متعددة.",
    descriptionEn: "A 3D printed PLA name medal in multiple shapes and colors.",
    features: ["معاينة مباشرة", "PLA عالي الجودة", "أشكال: دائري، مستطيل، قلب", "ألوان لا محدودة", "اسم بالعربي أو الإنجليزي"],
    featuresEn: ["Live preview", "High-quality PLA", "Circle, rectangle, or heart", "Many colors", "Arabic or English name"],
    deliveryDays: "2–4 أيام",
    deliveryDaysEn: "2–4 days",
    orderTypes: ["ميدالية اسم دائرية", "ميدالية اسم مستطيل", "ميدالية اسم قلب"],
    orderTypesEn: ["Round name medal", "Rectangle name medal", "Heart name medal"],
    active: true,
    sortOrder: 6,
    showInteractive: false,
    interactiveTitle: "",
    interactiveTitleEn: "",
    interactiveVideoUrl: "",
  },
  {
    slug: "logo-medal",
    name: "ميدالية شعار شركة",
    nameEn: "Company Logo Medal",
    price: 30,
    image: "/heroes/logo-medals-plastic.jpg",
    category: "شعارات شركات",
    categoryEn: "Company Logos",
    tag: "Logo",
    tagEn: "Logo",
    material: "PLA Plastic",
    materialEn: "PLA Plastic",
    description: "ميدالية بشعار شركتك أو مؤسستك مطبوعة ثلاثي الأبعاد.",
    descriptionEn: "A 3D printed medal with your company or organization logo.",
    features: ["شعار مخصص", "PLA بألوان متعددة", "مناسبة للهدايا المؤسسية", "طلبات بالجملة", "تغليف احترافي"],
    featuresEn: ["Custom logo", "PLA in multiple colors", "Corporate gifts", "Bulk orders", "Professional packaging"],
    deliveryDays: "3–5 أيام",
    deliveryDaysEn: "3–5 days",
    orderTypes: ["ميدالية شعار شركة", "ميدالية شعار فعالية", "باقة ميداليات مؤسسية"],
    orderTypesEn: ["Company logo medal", "Event logo medal", "Corporate medals pack"],
    active: true,
    sortOrder: 7,
    showInteractive: false,
  },
  {
    slug: "wedding-favors",
    name: "توزيعات مناسبات",
    nameEn: "Event Favors",
    price: 20,
    image: "/heroes/wedding-favors.jpg",
    category: "مناسبات",
    categoryEn: "Events",
    tag: "Bulk",
    tagEn: "Bulk",
    material: "تغليف + بلاستيك",
    materialEn: "Packaging + plastic",
    description: "توزيعات مخصصة لأعراسك أو مناسبتك بأسماء الضيوف أو تاريخ المناسبة.",
    descriptionEn: "Custom favors for weddings or events with guest names or event date.",
    features: ["تصميم موحد", "أسماء الضيوف", "تغليف احترافي", "خصم الكميات", "توصيل جماعي"],
    featuresEn: ["Unified design", "Guest names", "Professional packaging", "Bulk discount", "Group delivery"],
    deliveryDays: "7–10 أيام",
    deliveryDaysEn: "7–10 days",
    orderTypes: ["توزيعات زواج", "توزيعات عقيقة", "توزيعات تخرج", "توزيعات تسمية"],
    orderTypesEn: ["Wedding favors", "Baby favors", "Graduation favors", "Naming favors"],
    active: true,
    sortOrder: 8,
    showInteractive: false,
  },
  {
    slug: "wedding-card",
    name: "كرت عرس إلكتروني",
    nameEn: "Digital Wedding Card",
    price: 35,
    image: "/heroes/wedding-favors.jpg",
    category: "كروت العرس",
    categoryEn: "Wedding Cards",
    tag: "رابط خاص",
    tagEn: "Private link",
    material: "رقمي + بطاقة NFC",
    materialEn: "Digital + NFC card",
    description: "بطاقة دعوة رقمية فاخرة. الضيف يمسح QR أو NFC فيفتح صفحة كرت العرس مباشرة.",
    descriptionEn: "A premium digital wedding invitation. Guests scan QR or tap NFC to open the wedding page.",
    features: ["تصميم فاخر", "عد تنازلي مباشر", "رابط الخريطة", "اسمي العروسين", "بطاقة NFC أو QR"],
    featuresEn: ["Premium design", "Live countdown", "Map link", "Couple names", "NFC or QR card"],
    deliveryDays: "1–2 أيام",
    deliveryDaysEn: "1–2 days",
    orderTypes: ["كرت عرس إلكتروني NFC", "كرت عرس QR فقط", "باقة ١٠ كروت"],
    orderTypesEn: ["NFC digital wedding card", "QR wedding card", "Pack of 10 cards"],
    active: true,
    sortOrder: 9,
    showInteractive: true,
    interactiveTitle: "شاهد تجربة كرت العرس",
    interactiveTitleEn: "Watch the wedding card experience",
    interactiveVideoUrl: "",
  },
];

export const categoryItems: Category[] = [
  { id: "custom-gifts", name: "هدايا مخصصة", nameEn: "Personalized Gifts", active: true, sortOrder: 1 },
  { id: "plastic-medals", name: "ميداليات بلاستيك", nameEn: "Plastic Medals", active: true, sortOrder: 2 },
  { id: "business-nfc", name: "بطاقات بزنس NFC", nameEn: "Business NFC", active: true, sortOrder: 3 },
  { id: "car-adhkar", name: "أذكار السيارة", nameEn: "Car Adhkar", active: true, sortOrder: 4 },
  { id: "song-gifts", name: "هدايا أغاني", nameEn: "Song Gifts", active: true, sortOrder: 5 },
  { id: "birthdays", name: "أعياد ميلاد", nameEn: "Birthdays", active: true, sortOrder: 6 },
  { id: "events", name: "مناسبات", nameEn: "Events", active: true, sortOrder: 7 },
  { id: "company-logos", name: "شعارات شركات", nameEn: "Company Logos", active: true, sortOrder: 8 },
  { id: "wedding-cards", name: "كروت العرس", nameEn: "Wedding Cards", active: true, sortOrder: 9 },
];

export const categories = categoryItems.map((c) => c.name);
