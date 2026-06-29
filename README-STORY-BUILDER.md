# Story Builder Integration

## Routes

- Admin Builder: `/admin/story-builder`
- Public Story: `/custom/[slug]`
- Demo slug after seed: `/custom/ahmad-birthday`

## Supabase setup

Run in Supabase SQL Editor:

1. `supabase/schema.sql`
2. Optional demo data: `supabase/seed-demo.sql`

## Storage

Use the existing public bucket:

`trend-media`

Story Builder uploads are stored under:

`stories/`

The upload is done automatically from the admin builder when selecting files.

## Env

`.env.local` needs:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_ADMIN_PASSWORD=trend2024
```
