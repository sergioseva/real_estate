-- Site settings key-value table
create table site_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

-- Seed default contact info
insert into site_settings (key, value) values
  ('contact_phone', '+54 9 11 1234-5678'),
  ('contact_email', 'info@matiasperezinmuebles.com'),
  ('contact_address', 'Buenos Aires, Argentina'),
  ('whatsapp_number', '5491112345678');

-- RLS
alter table site_settings enable row level security;

-- Public can read settings
create policy "Public can read site settings"
  on site_settings for select
  using (true);

-- Admin can update settings
create policy "Admin full access site settings"
  on site_settings for all
  to authenticated
  using (true)
  with check (true);
