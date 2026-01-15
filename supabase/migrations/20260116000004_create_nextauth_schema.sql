-- Ensure Auth.js schema exists and matches adapter expectations
create schema if not exists next_auth;

create table if not exists next_auth.users (
  id uuid not null default gen_random_uuid() primary key,
  name text,
  email text unique,
  "emailVerified" timestamptz,
  image text
);

create table if not exists next_auth.accounts (
  id uuid not null default gen_random_uuid() primary key,
  "userId" uuid not null references next_auth.users(id) on delete cascade,
  type text not null,
  provider text not null,
  "providerAccountId" text not null,
  refresh_token text,
  access_token text,
  expires_at bigint,
  token_type text,
  scope text,
  id_token text,
  session_state text,
  constraint provider_unique unique(provider, "providerAccountId")
);

create table if not exists next_auth.sessions (
  id uuid not null default gen_random_uuid() primary key,
  "sessionToken" text not null unique,
  "userId" uuid not null references next_auth.users(id) on delete cascade,
  expires timestamptz not null
);

create table if not exists next_auth.verification_tokens (
  identifier text not null,
  token text not null unique,
  expires timestamptz not null,
  constraint token_unique unique(identifier, token)
);

create index if not exists accounts_user_id_idx on next_auth.accounts("userId");
create index if not exists sessions_user_id_idx on next_auth.sessions("userId");

do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public'
      and table_name = 'users'
  ) then
    insert into next_auth.users (id, name, email, "emailVerified", image)
    select id, name, email, email_verified, image
    from public.users
    on conflict (id) do nothing;
  end if;
end $$;

insert into next_auth.users (id, name, email, "emailVerified", image)
select
  id,
  coalesce(
    raw_user_meta_data->>'full_name',
    raw_user_meta_data->>'name',
    raw_user_meta_data->>'nickname'
  ),
  email,
  email_confirmed_at,
  raw_user_meta_data->>'avatar_url'
from auth.users
on conflict (id) do nothing;

alter table if exists next_auth.users disable row level security;
alter table if exists next_auth.accounts disable row level security;
alter table if exists next_auth.sessions disable row level security;
alter table if exists next_auth.verification_tokens disable row level security;

drop trigger if exists on_auth_user_created on auth.users;

alter table public.profiles drop constraint if exists profiles_id_fkey;
alter table public.profiles
  add constraint profiles_id_fkey
  foreign key (id) references next_auth.users(id) on delete cascade;

alter table public.approval_requests drop constraint if exists approval_requests_user_id_fkey;
alter table public.approval_requests
  add constraint approval_requests_user_id_fkey
  foreign key (user_id) references next_auth.users(id) on delete cascade;

alter table public.approval_requests drop constraint if exists approval_requests_reviewed_by_fkey;
alter table public.approval_requests
  add constraint approval_requests_reviewed_by_fkey
  foreign key (reviewed_by) references next_auth.users(id);

alter table public.invitations drop constraint if exists invitations_user_id_fkey;
alter table public.invitations
  add constraint invitations_user_id_fkey
  foreign key (user_id) references next_auth.users(id) on delete set null;
