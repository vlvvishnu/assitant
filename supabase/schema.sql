create extension if not exists pgcrypto;

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  created_at timestamptz not null default now()
);

create table public.integrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  type text not null check (type in ('gmail','slack','ocr','ai_summary','webhook','upload','save_note')),
  name text not null,
  config jsonb not null default '{}',
  encrypted_secrets jsonb not null default '{}',
  connected boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.workflows (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  description text not null default '',
  trigger text not null check (trigger in ('file_shared','text_shared','url_shared','manual')),
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.workflow_actions (
  id uuid primary key default gen_random_uuid(),
  workflow_id uuid not null references public.workflows(id) on delete cascade,
  type text not null check (type in ('gmail','slack','ocr','ai_summary','webhook','upload','save_note')),
  label text not null,
  position integer not null,
  enabled boolean not null default true,
  config jsonb not null default '{}'
);

create table public.templates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  type text not null check (type in ('email','workflow','ai_prompt','slack')),
  name text not null,
  subject text,
  body text not null,
  variables text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  workflow_id uuid references public.workflows(id) on delete set null,
  payload jsonb not null default '{}',
  results jsonb not null default '{}',
  status text not null check (status in ('success','queued','error')),
  error text,
  created_at timestamptz not null default now()
);

create table public.attachments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  history_id uuid references public.history(id) on delete cascade,
  storage_path text not null,
  filename text not null,
  mime_type text not null,
  size_bytes bigint not null check (size_bytes > 0 and size_bytes <= 26214400),
  extracted_text text,
  created_at timestamptz not null default now()
);

alter table public.users enable row level security;
alter table public.integrations enable row level security;
alter table public.workflows enable row level security;
alter table public.workflow_actions enable row level security;
alter table public.templates enable row level security;
alter table public.history enable row level security;
alter table public.attachments enable row level security;

create policy "users own profile" on public.users for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "users own integrations" on public.integrations for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users own workflows" on public.workflows for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users own workflow actions" on public.workflow_actions for all using (exists (select 1 from public.workflows w where w.id = workflow_id and w.user_id = auth.uid())) with check (exists (select 1 from public.workflows w where w.id = workflow_id and w.user_id = auth.uid()));
create policy "users own templates" on public.templates for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users own history" on public.history for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users own attachments" on public.attachments for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
