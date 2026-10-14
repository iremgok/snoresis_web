-- Snoresis AI — web / uygulama içi (iyzico) siparişleri.
--
-- Mobil uygulamanın Supabase projesine uygulanır (aynı proje): bu dosyayı snoresis_app/supabase/migrations
-- klasörüne kopyalayıp `supabase db push` çalıştırın ya da Supabase panelinde SQL Editor'den çalıştırın.
--
-- Erişim yalnızca sunucudan (Vercel Functions, service role) yapılır: RLS açık ve hiçbir politika
-- tanımlı değil, yani anon / authenticated anahtarlarla tablo okunamaz ve yazılamaz. Sipariş
-- sorgulama, sipariş no + e-posta eşleşmesiyle /api/orders/lookup üzerinden yapılır.

create table if not exists public.orders (
  id                  text primary key,                       -- SNR-2026-4K9X2Q (iyzico basketId)
  email               text not null,
  user_id             uuid references auth.users (id) on delete set null,
  source              text not null default 'web' check (source in ('web', 'app')),

  -- Ödeme: 'pending' (iyzico sayfasına yönlendirildi) → 'paid' | 'failed'
  payment_status      text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed')),
  payment_id          text unique,                            -- iyzico paymentId
  paid_at             timestamptz,
  refund_status       text check (refund_status in ('refunded', 'manual_required')),

  -- Teslimat: Sipariş Takip ekranındaki durum
  status              text not null default 'preparing' check (status in ('preparing', 'shipped', 'delivered', 'cancelled')),
  items               jsonb not null,                         -- [{ productId, name, color, quantity, price }]
  total               numeric(10, 2) not null check (total > 0),
  currency            text not null default 'TRY',
  shipping            jsonb not null,                         -- { firstName, lastName, phone, city, address }
  carrier             text,
  tracking_number     text,
  location            text not null default 'Snoresis Depo · İzmir',
  estimated_delivery  date,
  events              jsonb not null default '[]'::jsonb,     -- yeniden eskiye [{ at, label, location }]
  cancellation        jsonb,                                  -- { reason, note, at }

  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists orders_email_idx on public.orders (lower(email));
create index if not exists orders_tracking_number_idx on public.orders (tracking_number);
create index if not exists orders_user_id_idx on public.orders (user_id);

alter table public.orders enable row level security;

create or replace function public.orders_touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists orders_touch_updated_at on public.orders;
create trigger orders_touch_updated_at
  before update on public.orders
  for each row execute function public.orders_touch_updated_at();
