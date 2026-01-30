-- FIX: Izinkan User Insert/Update data langganan mereka sendiri.
-- (Ini diperlukan karena kita melakukan update dari Client Side sementara belum ada Edge Function).

-- 1. Berikan hak akses INSERT untuk user yang login
create policy "Users can insert own subscription"
  on public.user_subscriptions for insert
  with check (auth.uid() = user_id);

-- 2. Berikan hak akses UPDATE untuk user yang login
create policy "Users can update own subscription"
  on public.user_subscriptions for update
  using (auth.uid() = user_id);

-- Note: Policy 'Select' sudah dibuat sebelumnya, jadi tidak perlu dibuat lagi.
