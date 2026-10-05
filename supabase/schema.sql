-- Missed Call Calculator: leads table.
-- Run this once in the Supabase SQL editor (Dashboard -> SQL Editor -> New query).

create extension if not exists pgcrypto;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  business_name text,
  phone text,
  email text not null,
  calls_per_week int,
  miss_rate int,
  booking_rate int,
  job_value int,
  monthly_loss int,
  source text
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);

-- RLS on with no policies: the public anon key can't read or write.
-- Inserts happen only from the server via the service role key, which bypasses RLS.
alter table public.leads enable row level security;
