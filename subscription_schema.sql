-- 1. Buat tabel 'user_subscriptions'
-- Tabel ini akan menjadi "Single Source of Truth" untuk status Pro user.
-- Semua project (App A, App B, dll) akan mengecek tabel ini.

create table public.user_subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) not null unique,
  status text not null check (status in ('active', 'inactive', 'past_due')),
  tier text not null default 'free', -- 'researcher', 'enterprise'
  valid_until timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Aktifkan RLS (Row Level Security) agar aman
alter table public.user_subscriptions enable row level security;

-- 3. Policy: User bisa melihat status langganannya sendiri
create policy "Users can view own subscription"
  on public.user_subscriptions for select
  using (auth.uid() = user_id);

-- 4. Policy: Hanya Service Role (Backend/Edge Function) yang bisa mengubah status
-- (Opsional: Jika ingin frontend bisa update sementara tanpa backend proper)
-- create policy "Users can update own subscription"
--   on public.user_subscriptions for insert
--   with check (auth.uid() = user_id);

-- 5. Fungsi Helper: Update 'updated_at' otomatis
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language 'plpgsql';

create trigger update_user_subscriptions_updated_at
    before update on public.user_subscriptions
    for each row
    execute procedure update_updated_at_column();
