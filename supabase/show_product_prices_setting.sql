-- Add admin control to show/hide product prices across the public website.
-- Run this once in Supabase SQL Editor.

alter table if exists public.site_settings
add column if not exists show_product_prices boolean not null default true;

update public.site_settings
set show_product_prices = true
where show_product_prices is null;
