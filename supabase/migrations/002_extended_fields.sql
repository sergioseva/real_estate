-- Add new columns
alter table properties add column ambientes integer not null default 0;
alter table properties add column toilettes integer not null default 0;
alter table properties add column cocheras integer not null default 0;
alter table properties add column superficie_cubierta numeric not null default 0;
alter table properties add column superficie_total numeric not null default 0;
alter table properties add column antiguedad text not null default 'a_estrenar' check (antiguedad in ('a_estrenar', 'anos', 'en_construccion'));
alter table properties add column antiguedad_anos integer not null default 0;
alter table properties add column expensas numeric not null default 0;
alter table properties add column expensas_moneda text not null default 'ARS' check (expensas_moneda in ('ARS', 'USD'));
alter table properties add column apto_credito boolean not null default false;

-- Migrate data from old columns
update properties set superficie_total = superficie where superficie > 0;
update properties set cocheras = case when cochera then 1 else 0 end;

-- Drop old columns
alter table properties drop column superficie;
alter table properties drop column cochera;
