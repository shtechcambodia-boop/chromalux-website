create extension if not exists pgcrypto;
create table if not exists public.orders (
 id uuid primary key default gen_random_uuid(),
 order_number text unique not null,
 invoice_number text unique not null,
 customer_name text not null,
 phone text not null,
 telegram_username text,
 delivery_address text,
 size text not null,
 quantity integer not null check(quantity between 1 and 50),
 unit_price numeric(10,2) not null,
 total numeric(10,2) not null,
 photo_storage_path text,
 receipt_storage_path text,
 invoice_storage_path text,
 invoice_created_at timestamptz,
 payment_status text not null default 'PENDING_VERIFICATION',
 notification_status text not null default 'PENDING',
 created_at timestamptz not null default now()
);
alter table public.orders enable row level security;
-- No public policies: only the server with service-role key may access orders.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('order-files','order-files',false,4194304,array['image/jpeg','image/png','image/webp'])
on conflict(id) do nothing;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('invoices','invoices',false,5242880,array['application/pdf'])
on conflict(id) do nothing;
