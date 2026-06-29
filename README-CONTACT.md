# TrendGift Final Updates

Added:
- `/contact` public contact page.
- `/admin/contact` admin contact settings.
- Supabase table SQL: `supabase/contact_settings.sql`.
- Contact settings are AR/EN and include WhatsApp, email, address, socials, and floating WhatsApp visibility.

Run in Supabase SQL Editor:
```sql
-- run this file
supabase/contact_settings.sql
```

Required env:
```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_ADMIN_PASSWORD=trend2024
```
