-- Properties table
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
  superficie numeric not null default 0,
  cochera boolean not null default false,
  amenities text[] not null default '{}',
  destacada boolean not null default false,
  activa boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Property images table
create table property_images (
  id uuid default gen_random_uuid() primary key,
  property_id uuid not null references properties(id) on delete cascade,
  storage_path text not null,
  url text not null,
  display_order integer not null default 0
);

-- Tasacion requests table
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

-- RLS
alter table properties enable row level security;
alter table property_images enable row level security;
alter table tasacion_requests enable row level security;

-- Public can read active properties
create policy "Public can read active properties"
  on properties for select
  using (activa = true);

-- Public can read images of active properties
create policy "Public can read property images"
  on property_images for select
  using (
    exists (
      select 1 from properties
      where properties.id = property_images.property_id
      and properties.activa = true
    )
  );

-- Public can insert tasacion requests
create policy "Public can insert tasacion requests"
  on tasacion_requests for insert
  with check (true);

-- Authenticated users (admin) have full access
create policy "Admin full access properties"
  on properties for all
  to authenticated
  using (true)
  with check (true);

create policy "Admin full access images"
  on property_images for all
  to authenticated
  using (true)
  with check (true);

create policy "Admin full access tasaciones"
  on tasacion_requests for all
  to authenticated
  using (true)
  with check (true);

-- Storage bucket for property images
insert into storage.buckets (id, name, public)
values ('property-images', 'property-images', true)
on conflict (id) do nothing;

-- Storage policies
create policy "Public can read property images storage"
  on storage.objects for select
  using (bucket_id = 'property-images');

create policy "Admin can upload property images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'property-images');

create policy "Admin can update property images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'property-images');

create policy "Admin can delete property images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'property-images');
