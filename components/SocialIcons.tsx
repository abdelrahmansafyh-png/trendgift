import type { ContactSettings } from "@/lib/data";

type SocialKey = "instagram" | "facebook" | "tiktok" | "website";

type SocialItem = {
  key: SocialKey;
  label: string;
  href: string;
};

function cleanValue(value?: string) {
  return (value || "").trim();
}

function normalizeSocialUrl(key: SocialKey, value?: string) {
  const raw = cleanValue(value);
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  if (raw.startsWith("@")) {
    const handle = raw.slice(1);
    if (key === "instagram") return `https://instagram.com/${handle}`;
    if (key === "tiktok") return `https://www.tiktok.com/@${handle}`;
    if (key === "facebook") return `https://facebook.com/${handle}`;
  }
  if (key === "instagram") return `https://instagram.com/${raw}`;
  if (key === "tiktok") return `https://www.tiktok.com/@${raw.replace(/^@/, "")}`;
  if (key === "facebook") return `https://facebook.com/${raw}`;
  return `https://${raw}`;
}

function getSocialItems(contact: ContactSettings): SocialItem[] {
  const items: SocialItem[] = [
    { key: "instagram", label: "Instagram", href: normalizeSocialUrl("instagram", contact.instagram) },
    { key: "facebook", label: "Facebook", href: normalizeSocialUrl("facebook", contact.facebook) },
    { key: "tiktok", label: "TikTok", href: normalizeSocialUrl("tiktok", contact.tiktok) },
    { key: "website", label: "Website", href: normalizeSocialUrl("website", contact.website) },
  ];

  return items.filter((item) => Boolean(item.href));
}

function Icon({ type }: { type: SocialKey }) {
  if (type === "instagram") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="4" width="16" height="16" rx="5" />
        <circle cx="12" cy="12" r="3.4" />
        <circle cx="17" cy="7" r="1" className="socialIconDot" />
      </svg>
    );
  }

  if (type === "facebook") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M14.4 8.2h2V5.1c-.35-.05-1.55-.15-2.95-.15-2.9 0-4.9 1.75-4.9 5v2.8H5.3v3.45h3.25V24h3.9v-7.8h3.05l.5-3.45h-3.55v-2.45c0-1 .28-2.1 1.95-2.1Z" />
      </svg>
    );
  }

  if (type === "tiktok") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M15 4c.45 2.65 2.05 4.25 4.65 4.55v3.25c-1.75.05-3.25-.45-4.65-1.45v5.15c0 3.4-2.25 5.9-5.45 5.9-3.05 0-5.2-2.05-5.2-4.95 0-3.05 2.35-5.15 5.65-5.15.42 0 .82.04 1.2.12v3.38a3.7 3.7 0 0 0-1.25-.22c-1.35 0-2.25.72-2.25 1.85 0 1.08.82 1.82 1.95 1.82 1.32 0 2.15-.88 2.15-2.4V4H15Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3.6 12h16.8" />
      <path d="M12 3c2.2 2.4 3.3 5.4 3.3 9S14.2 18.6 12 21c-2.2-2.4-3.3-5.4-3.3-9S9.8 5.4 12 3Z" />
    </svg>
  );
}

export default function SocialIcons({
  contact,
  variant = "default",
  showTitle = false,
}: {
  contact: ContactSettings;
  variant?: "default" | "home" | "contact";
  showTitle?: boolean;
}) {
  const items = getSocialItems(contact);
  if (!items.length) return null;

  return (
    <section className={`socialBlock socialBlock-${variant}`}>
      {showTitle && (
        <div className="socialHead">
          <span className="arOnly">تابعنا على السوشيال ميديا</span>
          <span className="enOnly">Follow us on social media</span>
        </div>
      )}

      <div className="socialIconRow">
        {items.map((item) => (
          <a
            key={item.key}
            className={`socialIconBtn social-${item.key}`}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.label}
            title={item.label}
          >
            <Icon type={item.key} />
            <span>{item.label}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
