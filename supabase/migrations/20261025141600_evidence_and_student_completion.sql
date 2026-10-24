-- Evidence uploads and self-reported completion; attendance stays faculty-only.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'labmate-evidence',
  'labmate-evidence',
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
on conflict (id) do update set
  name = excluded.name,
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create table public.labmate_practical_evidence (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  experiment_id uuid not null references public.labmate_experiments(id) on delete cascade,
  original_name text not null check (length(original_name) between 1 and 255),
  storage_path text not null unique,
  content_type text not null,
  file_size bigint not null check (file_size between 1 and 52428800),
  created_at timestamptz not null default now(),
  constraint labmate_practical_evidence_path_owner_check
    check (split_part(storage_path, '/', 1) = student_id::text
      and split_part(storage_path, '/', 2) = experiment_id::text)
);

create index labmate_practical_evidence_experiment_idx
  on public.labmate_practical_evidence (experiment_id, student_id, created_at desc);

alter table public.labmate_practical_evidence enable row level security;
revoke all on public.labmate_practical_evidence from anon, authenticated;
grant select, insert on public.labmate_practical_evidence to authenticated;

create policy "Students upload their practical evidence"
  on public.labmate_practical_evidence for insert to authenticated
  with check (
    student_id = (select auth.uid())
    and private.labmate_practical_target_matches(student_id, experiment_id)
    and content_type in (
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'application/zip',
      'image/png',
      'image/jpeg'
    )
    and exists (
      select 1 from public.profiles actor
      where actor.id = (select auth.uid())
        and actor.role = 'student'
        and actor.account_status in ('active', 'approved')
    )
  );

create policy "Students see own evidence and faculty see their branch evidence"
  on public.labmate_practical_evidence for select to authenticated
  using (
    exists (
      select 1
      from public.profiles actor
      join public.labmate_experiments e on e.id = labmate_practical_evidence.experiment_id
      where actor.id = (select auth.uid())
        and actor.account_status in ('active', 'approved')
        and (
          (actor.role = 'student' and labmate_practical_evidence.student_id = actor.id)
          or (
            actor.role in ('faculty', 'assistant_professor', 'admin')
            and (actor.branch is null or actor.branch = e.branch)
          )
        )
    )
  );

create policy "Students upload evidence to their own experiment folder"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'labmate-evidence'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and (storage.foldername(name))[2] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    and private.labmate_practical_target_matches(
      (select auth.uid()),
      ((storage.foldername(name))[2])::uuid
    )
    and exists (
      select 1 from public.profiles actor
      where actor.id = (select auth.uid())
        and actor.role = 'student'
        and actor.account_status in ('active', 'approved')
    )
  );

create policy "Students remove their own evidence files"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'labmate-evidence'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and (storage.foldername(name))[2] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    and private.labmate_practical_target_matches(
      (select auth.uid()),
      ((storage.foldername(name))[2])::uuid
    )
  );

create policy "Evidence is readable only by its student and faculty"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'labmate-evidence'
    and exists (
      select 1
      from public.labmate_practical_evidence evidence
      where evidence.storage_path = storage.objects.name
    )
  );

drop trigger if exists labmate_guard_practical_record_update on public.labmate_practical_records;

alter table public.labmate_practical_records
  drop constraint labmate_practical_records_completion_status_check;
update public.labmate_practical_records
set completion_status = 'not_started'
where completion_status in ('submitted', 'verified');
alter table public.labmate_practical_records
  add constraint labmate_practical_records_completion_status_check
  check (completion_status in ('not_started', 'completed'));

create or replace function private.guard_labmate_practical_record_update()
returns trigger
language plpgsql
security definer
set search_path = ''
set row_security = off
as $$
declare
  actor_role text;
begin
  if new.student_id is distinct from old.student_id
    or new.experiment_id is distinct from old.experiment_id then
    raise exception 'Practical records cannot be moved to another student or experiment';
  end if;

  select actor.role into actor_role
  from public.profiles actor
  where actor.id = (select auth.uid())
    and actor.account_status in ('active', 'approved');

  if actor_role = 'student' then
    if tg_op = 'UPDATE' then
      if new.attendance_status is distinct from old.attendance_status
        or new.attendance_date is distinct from old.attendance_date
        or new.marked_by is distinct from old.marked_by then
        raise exception 'Only faculty can change attendance';
      end if;
    elsif new.attendance_status <> 'not_marked'
      or new.attendance_date is not null
      or new.marked_by is not null then
        raise exception 'Students cannot set their own attendance';
    end if;
    if new.completion_status not in ('not_started', 'completed') then
      raise exception 'Invalid practical completion status';
    end if;
    if new.completion_status = 'completed' and not exists (
      select 1 from public.labmate_practical_evidence evidence
      where evidence.student_id = new.student_id
        and evidence.experiment_id = new.experiment_id
    ) then
      raise exception 'Upload practical evidence before marking it complete';
    end if;
  elsif actor_role in ('faculty', 'assistant_professor', 'admin') then
    if tg_op = 'UPDATE' and new.completion_status is distinct from old.completion_status then
      raise exception 'Students mark their own practical work complete';
    end if;
    if tg_op = 'INSERT' and new.completion_status <> 'not_started' then
      raise exception 'Faculty cannot set student completion';
    end if;
  else
    raise exception 'Approved LabMate access is required';
  end if;

  return new;
end;
$$;

create trigger labmate_guard_practical_record_update
  before insert or update on public.labmate_practical_records
  for each row execute function private.guard_labmate_practical_record_update();

drop policy if exists "Students can submit own practical completion and faculty can add records"
  on public.labmate_practical_records;
create policy "Students can complete own practicals and faculty can add attendance records"
  on public.labmate_practical_records for insert to authenticated
  with check (
    private.labmate_practical_target_matches(student_id, experiment_id)
    and exists (
      select 1 from public.profiles actor
      where actor.id = (select auth.uid())
        and actor.account_status in ('active', 'approved')
        and (
          (
            actor.role = 'student'
            and student_id = actor.id
            and attendance_status = 'not_marked'
            and attendance_date is null
            and marked_by is null
            and completion_status in ('not_started', 'completed')
          )
          or (
            actor.role in ('faculty', 'assistant_professor', 'admin')
            and completion_status = 'not_started'
          )
        )
    )
  );

drop policy if exists "Students update own completion; faculty manage practical records"
  on public.labmate_practical_records;
create policy "Students update completion and faculty update attendance"
  on public.labmate_practical_records for update to authenticated
  using (
    private.labmate_practical_target_matches(student_id, experiment_id)
    and exists (
      select 1 from public.profiles actor
      where actor.id = (select auth.uid())
        and actor.account_status in ('active', 'approved')
        and (
          (actor.role = 'student' and student_id = actor.id)
          or actor.role in ('faculty', 'assistant_professor', 'admin')
        )
    )
  )
  with check (
    private.labmate_practical_target_matches(student_id, experiment_id)
    and exists (
      select 1 from public.profiles actor
      where actor.id = (select auth.uid())
        and actor.account_status in ('active', 'approved')
        and (
          (
            actor.role = 'student'
            and student_id = actor.id
            and completion_status in ('not_started', 'completed')
            and attendance_status = 'not_marked'
            and attendance_date is null
            and marked_by is null
          )
          or actor.role in ('faculty', 'assistant_professor', 'admin')
        )
    )
  );
