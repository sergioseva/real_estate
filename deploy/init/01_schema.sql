-- ============================================================
-- Combined schema for fresh PostgreSQL deploy
-- Based on supabase/migrations 001-005
-- ============================================================

-- Properties table (001 + 002 + 004 merged)
create table properties (
  id uuid default gen_random_uuid() primary key,
  titulo text not null,
  slug text not null unique,
  descripcion text not null default '',
  precio numeric not null default 0,
  moneda text not null default 'USD' check (moneda in ('ARS', 'USD')),
  operacion text not null default 'venta' check (operacion in ('venta', 'alquiler')),
  tipo_propiedad text not null default 'Casa',
  direccion text not null default '',
  ciudad text not null default '',
  provincia text not null default '',
  dormitorios integer not null default 0,
  banos integer not null default 0,
  ambientes integer not null default 0,
  toilettes integer not null default 0,
  cocheras integer not null default 0,
  superficie_cubierta numeric not null default 0,
  superficie_total numeric not null default 0,
  antiguedad text not null default 'a_estrenar' check (antiguedad in ('a_estrenar', 'anos', 'en_construccion')),
  antiguedad_anos integer not null default 0,
  expensas numeric not null default 0,
  expensas_moneda text not null default 'ARS' check (expensas_moneda in ('ARS', 'USD')),
  apto_credito boolean not null default false,
  latitud numeric,
  longitud numeric,
  amenities text[] not null default '{}',
  destacada boolean not null default false,
  activa boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Property images table (001 + 003 merged)
create table property_images (
  id uuid default gen_random_uuid() primary key,
  property_id uuid not null references properties(id) on delete cascade,
  storage_path text not null,
  url text not null,
  display_order integer not null default 0,
  descripcion text not null default ''
);

-- Tasacion requests table (001)
create table tasacion_requests (
  id uuid default gen_random_uuid() primary key,
  nombre text not null,
  email text not null,
  telefono text not null,
  direccion text not null,
  mensaje text not null default '',
  leido boolean not null default false,
  created_at timestamptz not null default now()
);

-- Site settings table (005)
create table site_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

-- Indexes
create index idx_properties_slug on properties(slug);
create index idx_properties_operacion on properties(operacion);
create index idx_properties_activa on properties(activa);
create index idx_properties_destacada on properties(destacada);
create index idx_properties_ciudad on properties(ciudad);
create index idx_property_images_property_id on property_images(property_id);
create index idx_property_images_order on property_images(property_id, display_order);

-- Updated at trigger
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger properties_updated_at
  before update on properties
  for each row execute function update_updated_at();

-- Admin users table
create table admin_users (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  password_hash text not null,
  created_at timestamptz not null default now()
);

-- Seed default contact info
insert into site_settings (key, value) values
  ('contact_phone', '+54 9 11 1234-5678'),
  ('contact_email', 'info@matiasperezinmuebles.com'),
  ('contact_address', 'Buenos Aires, Argentina'),
  ('whatsapp_number', '5491112345678');
