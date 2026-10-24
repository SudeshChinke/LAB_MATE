-- LabMate account profiles, faculty approval, and row-level security.
-- Supabase Auth verifies email addresses before users can sign in.

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null check (char_length(btrim(full_name)) between 2 and 120),
  email text not null,
  role text not null check (role in ('student', 'faculty', 'assistant_professor', 'admin')),
  account_status text not null check (account_status in ('active', 'pending', 'approved', 'rejected')),
  roll_number text,
  academic_year smallint,
  created_at timestamptz not null default now(),
  constraint profiles_student_fields check (
    (role = 'student' and nullif(btrim(roll_number), '') is not null and academic_year in (2, 3, 4))
    or (role <> 'student' and roll_number is null and academic_year is null)
  )
);

create unique index if not exists profiles_student_roll_number_unique
  on public.profiles (lower(roll_number))
  where roll_number is not null;

create index if not exists profiles_pending_approval_idx
  on public.profiles (created_at)
  where account_status = 'pending';

alter table public.profiles enable row level security;
revoke all on public.profiles from anon, authenticated;
grant select, update on public.profiles to authenticated;

create or replace function private.is_labmate_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles as p
    where p.id = (select auth.uid())
      and p.role = 'admin'
      and p.account_status = 'approved'
  );
$$;

revoke all on function private.is_labmate_admin() from public, anon, authenticated;
grant execute on function private.is_labmate_admin() to authenticated;

create policy "Users can read their own profile; admins can read all"
  on public.profiles
  for select
  to authenticated
  using ((select auth.uid()) = id or (select private.is_labmate_admin()));

create policy "Only admins can approve or reject accounts"
  on public.profiles
  for update
  to authenticated
  using ((select private.is_labmate_admin()))
  with check ((select private.is_labmate_admin()));

create or replace function private.create_labmate_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  requested_name text := nullif(btrim(coalesce(new.raw_user_meta_data ->> 'full_name', '')), '');
  requested_role text := coalesce(new.raw_user_meta_data ->> 'account_type', 'student');
  requested_roll text := nullif(btrim(coalesce(new.raw_user_meta_data ->> 'roll_number', '')), '');
  requested_year integer;
  assigned_status text;
begin
  if requested_name is null then
    raise exception 'A full name is required';
  end if;

  if requested_role = 'student' then
    if requested_roll is null then
      raise exception 'A college roll number is required for students';
    end if;
    begin
      requested_year := (new.raw_user_meta_data ->> 'academic_year')::integer;
    exception when others then
      raise exception 'Students must select second, third, or fourth year';
    end;
    if requested_year not in (2, 3, 4) then
      raise exception 'Students must select second, third, or fourth year';
    end if;
    assigned_status := 'active';
  elsif requested_role in ('faculty', 'assistant_professor') then
    requested_roll := null;
    requested_year := null;
    assigned_status := 'pending';
  else
    raise exception 'That account type cannot be self-registered';
  end if;

  insert into public.profiles (id, full_name, email, role, account_status, roll_number, academic_year)
  values (
    new.id,
    requested_name,
    lower(new.email),
    requested_role,
    assigned_status,
    requested_roll,
    requested_year
  );
  return new;
end;
$$;

revoke all on function private.create_labmate_profile() from public, anon, authenticated;

drop trigger if exists labmate_create_profile_after_signup on auth.users;
create trigger labmate_create_profile_after_signup
  after insert on auth.users
  for each row execute function private.create_labmate_profile();

create or replace function private.sync_labmate_profile_email()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.email is distinct from old.email then
    update public.profiles
    set email = lower(new.email)
    where id = new.id;
  end if;
  return new;
end;
$$;

revoke all on function private.sync_labmate_profile_email() from public, anon, authenticated;

drop trigger if exists labmate_sync_profile_email_after_auth_change on auth.users;
create trigger labmate_sync_profile_email_after_auth_change
  after update of email on auth.users
  for each row execute function private.sync_labmate_profile_email();
