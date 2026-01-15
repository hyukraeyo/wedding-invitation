do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'accounts'
      and column_name = 'user_id'
  ) then
    alter table public.accounts rename column user_id to "userId";
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'accounts'
      and column_name = 'provider_account_id'
  ) then
    alter table public.accounts rename column provider_account_id to "providerAccountId";
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'sessions'
      and column_name = 'session_token'
  ) then
    alter table public.sessions rename column session_token to "sessionToken";
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'sessions'
      and column_name = 'user_id'
  ) then
    alter table public.sessions rename column user_id to "userId";
  end if;
end $$;
