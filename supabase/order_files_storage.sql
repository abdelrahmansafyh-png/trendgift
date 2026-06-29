-- Optional setup for custom order attachments.
-- The API route can create this bucket automatically using SUPABASE_SERVICE_ROLE_KEY.
-- Run this manually if you prefer preparing Storage from Supabase SQL Editor.

insert into storage.buckets (id, name, public, file_size_limit)
values ('order-files', 'order-files', true, 31457280)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit;
