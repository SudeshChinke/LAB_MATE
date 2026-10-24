-- Experiment schedules and private, shared LabMate materials.
create table if not exists public.labmate_experiments (
  id uuid primary key default gen_random_uuid(),
  academic_year smallint not null check (academic_year in (2, 3, 4)),
  semester smallint not null check (semester between 3 and 8),
  course_code text not null,
  lab_course text not null,
  subject_name text not null,
  elective_name text,
  experiment_number integer not null check (experiment_number > 0),
  title text not null check (char_length(btrim(title)) between 1 and 500),
  scheduled_on date,
  notes text,
  created_by uuid references public.profiles(id) on delete set null default auth.uid(),
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint labmate_experiments_number_unique
    unique (academic_year, semester, course_code, subject_name, experiment_number)
);

create index if not exists labmate_experiments_schedule_idx
  on public.labmate_experiments (academic_year, semester, scheduled_on);
create index if not exists labmate_experiments_course_idx
  on public.labmate_experiments (academic_year, semester, course_code, subject_name);

create table if not exists public.labmate_files (
  id uuid primary key default gen_random_uuid(),
  uploaded_by uuid not null references public.profiles(id) on delete cascade default auth.uid(),
  experiment_id uuid references public.labmate_experiments(id) on delete set null,
  academic_year smallint,
  semester smallint,
  course_code text,
  original_name text not null check (char_length(original_name) between 1 and 255),
  storage_path text not null unique,
  content_type text not null,
  file_size bigint not null check (file_size between 1 and 52428800),
  created_at timestamptz not null default now()
);

create index if not exists labmate_files_course_idx
  on public.labmate_files (academic_year, semester, course_code, created_at desc);

alter table public.labmate_experiments enable row level security;
alter table public.labmate_files enable row level security;
revoke all on public.labmate_experiments, public.labmate_files from anon, authenticated;
grant select, insert, update, delete on public.labmate_experiments to authenticated;
grant select, insert, delete on public.labmate_files to authenticated;

create policy "Approved LabMate users can read experiments"
  on public.labmate_experiments for select to authenticated
  using (exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid())
      and p.account_status in ('active', 'approved')
  ));
create policy "Approved faculty can add experiments"
  on public.labmate_experiments for insert to authenticated
  with check (exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid())
      and p.role in ('faculty', 'assistant_professor', 'admin')
      and p.account_status in ('active', 'approved')
  ));
create policy "Approved faculty can edit experiments"
  on public.labmate_experiments for update to authenticated
  using (exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid())
      and p.role in ('faculty', 'assistant_professor', 'admin')
      and p.account_status in ('active', 'approved')
  ))
  with check (exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid())
      and p.role in ('faculty', 'assistant_professor', 'admin')
      and p.account_status in ('active', 'approved')
  ));
create policy "Approved faculty can remove experiments"
  on public.labmate_experiments for delete to authenticated
  using (exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid())
      and p.role in ('faculty', 'assistant_professor', 'admin')
      and p.account_status in ('active', 'approved')
  ));

create policy "Approved LabMate users can read materials"
  on public.labmate_files for select to authenticated
  using (exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid())
      and p.account_status in ('active', 'approved')
  ));
create policy "Approved users can upload their own materials"
  on public.labmate_files for insert to authenticated
  with check (
    uploaded_by = (select auth.uid())
    and exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid())
        and p.account_status in ('active', 'approved')
    )
  );
create policy "Owners and faculty can remove materials"
  on public.labmate_files for delete to authenticated
  using (
    uploaded_by = (select auth.uid())
    or exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid())
        and p.role in ('faculty', 'assistant_professor', 'admin')
        and p.account_status in ('active', 'approved')
    )
  );

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'labmate-materials',
  'labmate-materials',
  false,
  52428800,
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'application/zip',
    'image/png',
    'image/jpeg'
  ]
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy "Approved users can view shared LabMate materials"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'labmate-materials'
    and exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid())
        and p.account_status in ('active', 'approved')
    )
  );
create policy "Approved users can upload own LabMate materials"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'labmate-materials'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid())
        and p.account_status in ('active', 'approved')
    )
  );
create policy "Owners or faculty remove LabMate materials"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'labmate-materials'
    and (
      (storage.foldername(name))[1] = (select auth.uid())::text
      or exists (
        select 1 from public.profiles p
        where p.id = (select auth.uid())
          and p.role in ('faculty', 'assistant_professor', 'admin')
          and p.account_status in ('active', 'approved')
      )
    )
  );

