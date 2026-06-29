create table if not exists public.contact_settings (
  id integer primary key default 1,
  title_ar text not null default 'تواصل معنا',
  title_en text not null default 'Contact us',
  subtitle_ar text not null default 'جاهزين نسمع فكرتك ونحوّلها لهدية ذكية مخصصة.',
  subtitle_en text not null default 'We are ready to hear your idea and turn it into a custom smart gift.',
  whatsapp text not null default '97400000000',
  email text default '',
  address_ar text default '',
  address_en text default '',
  instagram text default '',
  facebook text default '',
  tiktok text default '',
  website text default '',
  show_contact_page boolean not null default true,
  show_floating_whatsapp boolean not null default true,
  updated_at timestamptz not null default now()
);

insert into public.contact_settings (id, title_ar, title_en, subtitle_ar, subtitle_en, whatsapp, email, address_ar, address_en)
values (1, 'تواصل معنا', 'Contact us', 'جاهزين نسمع فكرتك ونحوّلها لهدية ذكية مخصصة.', 'We are ready to hear your idea and turn it into a custom smart gift.', '97400000000', 'hello@trendgift.qa', 'الدوحة، قطر', 'Doha, Qatar')
on conflict (id) do nothing;
