-- Store the student's branch and enforce branch/year access in database policies.
-- LabMate currently has SPPU E&TC curriculum data, stored with branch code ENTC.

alter table public.profiles
  add column if not exists branch text;

update public.profiles
set branch = 'ENTC'
where role = 'student' and branch is null;

alter table public.profiles
  drop constraint if exists profiles_student_branch_fields;

alter table public.profiles
  add constraint profiles_student_branch_fields check (
    (role = 'student' and branch = 'ENTC'
      and nullif(btrim(roll_number), '') is not null
      and academic_year in (2, 3, 4))
    or (role <> 'student' and branch is null
      and roll_number is null and academic_year is null)
  );

alter table public.labmate_experiments
  add column if not exists branch text not null default 'ENTC';

alter table public.labmate_files
  add column if not exists branch text not null default 'ENTC';

alter table public.labmate_experiments
  drop constraint if exists labmate_experiments_number_unique;

alter table public.labmate_experiments
  add constraint labmate_experiments_number_unique
  unique (branch, academic_year, semester, course_code, subject_name, experiment_number);

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
  requested_branch text := upper(btrim(coalesce(new.raw_user_meta_data ->> 'branch', 'ENTC')));
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
    if requested_branch <> 'ENTC' then
      raise exception 'The selected branch is not available yet';
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
    requested_branch := null;
    assigned_status := 'pending';
  else
    raise exception 'That account type cannot be self-registered';
  end if;

  insert into public.profiles (id, full_name, email, role, account_status, roll_number, academic_year, branch)
  values (
    new.id,
    requested_name,
    lower(new.email),
    requested_role,
    assigned_status,
    requested_roll,
    requested_year,
    requested_branch
  );
  return new;
end;
$$;

drop policy if exists "Approved LabMate users can read experiments" on public.labmate_experiments;
create policy "Approved LabMate users can read experiments"
  on public.labmate_experiments for select to authenticated
  using (exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid())
      and p.account_status in ('active', 'approved')
      and (
        p.role <> 'student'
        or (p.branch = labmate_experiments.branch
          and p.academic_year = labmate_experiments.academic_year)
      )
  ));

drop policy if exists "Approved LabMate users can read materials" on public.labmate_files;
create policy "Approved LabMate users can read materials"
  on public.labmate_files for select to authenticated
  using (exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid())
      and p.account_status in ('active', 'approved')
      and (
        p.role <> 'student'
        or (p.branch = labmate_files.branch
          and p.academic_year = labmate_files.academic_year)
      )
  ));

drop policy if exists "Approved users can upload their own materials" on public.labmate_files;
create policy "Approved users can upload their own materials"
  on public.labmate_files for insert to authenticated
  with check (
    uploaded_by = (select auth.uid())
    and exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid())
        and p.account_status in ('active', 'approved')
        and (
          p.role <> 'student'
          or (p.branch = labmate_files.branch
            and p.academic_year = labmate_files.academic_year)
        )
    )
  );

drop policy if exists "Approved users can view shared LabMate materials" on storage.objects;
create policy "Approved users can view shared LabMate materials"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'labmate-materials'
    and exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid())
        and p.account_status in ('active', 'approved')
        and (
          p.role <> 'student'
          or exists (
            select 1 from public.labmate_files f
            where f.storage_path = storage.objects.name
              and f.branch = p.branch
              and f.academic_year = p.academic_year
          )
        )
    )
  );

create index if not exists labmate_files_branch_year_course_idx
  on public.labmate_files (branch, academic_year, semester, course_code, subject_name, created_at desc);
