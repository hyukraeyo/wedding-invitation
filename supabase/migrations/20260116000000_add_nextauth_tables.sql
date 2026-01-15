-- NextAuth.js Schema for Supabase
-- Based on: https://authjs.dev/reference/adapter/supabase

-- 1. Enable pgcrypto extension for UUID generation (if not already enabled)
create extension if not exists pgcrypto;

-- 2. Create schema for Auth.js tables
create schema if not exists next_auth;

-- 3. Create users table
create table if not exists next_auth.users (
  id uuid not null default gen_random_uuid() primary key,
  name text,
  email text unique,
  "emailVerified" timestamptz,
  image text
);

-- 4. Create accounts table
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

-- 5. Create sessions table
create table if not exists next_auth.sessions (
  id uuid not null default gen_random_uuid() primary key,
  "sessionToken" text not null unique,
  "userId" uuid not null references next_auth.users(id) on delete cascade,
  expires timestamptz not null
);

-- 6. Create verification_tokens table
create table if not exists next_auth.verification_tokens (
  identifier text not null,
  token text not null unique,
  expires timestamptz not null,
  
  constraint token_unique unique(identifier, token)
);

-- 7. Add indexes for better performance
create index if not exists accounts_user_id_idx on next_auth.accounts("userId");
create index if not exists sessions_user_id_idx on next_auth.sessions("userId");
