import Link from "next/link";
import AdminGate from "@/components/AdminGate";

const cards = [
  { href: "/admin/products", title: "المنتجات", desc: "إضافة وتعديل المنتجات، الصور، الأسعار، والفيديو التفاعلي" },
  { href: "/admin/hero", title: "الهيرو", desc: "إدارة سلايدات الصفحة الرئيسية عربي/إنجليزي" },
  { href: "/admin/categories", title: "التصنيفات", desc: "إضافة وترتيب تصنيفات المتجر" },
  { href: "/admin/settings", title: "الإعدادات", desc: "واتساب، اسم المتجر، وسرعة السلايدر" },
  { href: "/admin/story-builder", title: "Story Builder", desc: "صفحات مخصصة تفاعلية للهدایا والـ QR/NFC" },
];

export default function AdminHomePage() {
  return (
    <AdminGate>
      <div className="admin-wrap">
        <nav className="admin-nav">
          <div className="admin-nav-logo"><span>Trend</span><small>لوحة التحكم</small></div>
          <div className="admin-nav-actions">
            <Link href="/" className="view-site-btn" target="_blank">عرض الموقع ↗</Link>
            <Link href="/admin/login" className="logout-btn">تبديل الحساب</Link>
          </div>
        </nav>
        <main className="admin-main admin-home">
          <div className="admin-section-head">
            <span className="miniBadge">Dashboard</span>
            <h1>إدارة Trend</h1>
            <p>كل قسم صار له رابط مستقل وواضح.</p>
          </div>
          <div className="admin-dashboard-grid">
            {cards.map((c) => (
              <Link className="admin-dashboard-card" href={c.href} key={c.href}>
                <strong>{c.title}</strong>
                <span>{c.desc}</span>
                <b>فتح القسم ←</b>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </AdminGate>
  );
}
