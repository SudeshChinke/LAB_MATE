-- Subject practical tracking: attendance is recorded by approved faculty;
-- students can submit completion and faculty can verify it.
create table public.labmate_practical_records (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  experiment_id uuid not null references public.labmate_experiments(id) on delete cascade,
  attendance_status text not null default 'not_marked'
    check (attendance_status in ('not_marked', 'present', 'absent', 'late')),
  attendance_date date,
  completion_status text not null default 'not_started'
    check (completion_status in ('not_started', 'submitted', 'verified')),
  marked_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint labmate_practical_attendance_date_check
    check (attendance_status = 'not_marked' or attendance_date is not null),
  constraint labmate_practical_records_student_experiment_unique
    unique (student_id, experiment_id)
);

create index labmate_practical_records_experiment_idx
  on public.labmate_practical_records (experiment_id, attendance_status, completion_status);
create index labmate_practical_records_student_idx
  on public.labmate_practical_records (student_id, updated_at desc);

alter table public.labmate_practical_records enable row level security;
revoke all on public.labmate_practical_records from anon, authenticated;
grant select, insert on public.labmate_practical_records to authenticated;
grant update (completion_status) on public.labmate_practical_records to authenticated;
grant update (attendance_status, attendance_date, completion_status, marked_by, updated_at)
  on public.labmate_practical_records to authenticated;

create or replace function private.guard_labmate_practical_record_update()
returns trigger
language plpgsql
security definer
set search_path = ''
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
    if new.attendance_status is distinct from old.attendance_status
      or new.attendance_date is distinct from old.attendance_date
      or new.marked_by is distinct from old.marked_by then
      raise exception 'Only faculty can change attendance';
    end if;
    if new.completion_status not in ('not_started', 'submitted') then
      raise exception 'Students may submit practical work for faculty review';
    end if;
  elsif actor_role is null or actor_role not in ('faculty', 'assistant_professor', 'admin') then
    raise exception 'Approved LabMate access is required';
  end if;

  return new;
end;
$$;

revoke all on function private.guard_labmate_practical_record_update() from public, anon, authenticated;
drop trigger if exists labmate_guard_practical_record_update on public.labmate_practical_records;
create trigger labmate_guard_practical_record_update
  before update on public.labmate_practical_records
  for each row execute function private.guard_labmate_practical_record_update();

create policy "Students and faculty can read practical records"
  on public.labmate_practical_records for select to authenticated
  using (exists (
    select 1 from public.profiles actor
    where actor.id = (select auth.uid())
      and actor.account_status in ('active', 'approved')
      and (
        actor.role in ('faculty', 'assistant_professor', 'admin')
        or (
          actor.role = 'student'
          and labmate_practical_records.student_id = actor.id
          and exists (
            select 1 from public.labmate_experiments e
            where e.id = labmate_practical_records.experiment_id
              and e.branch = actor.branch
              and e.academic_year = actor.academic_year
          )
        )
      )
  ));

create policy "Students can submit own practical completion and faculty can add records"
  on public.labmate_practical_records for insert to authenticated
  with check (exists (
    select 1 from public.profiles actor
    join public.profiles student on student.id = labmate_practical_records.student_id
    join public.labmate_experiments e on e.id = labmate_practical_records.experiment_id
    where actor.id = (select auth.uid())
      and actor.account_status in ('active', 'approved')
      and student.role = 'student'
      and student.account_status in ('active', 'approved')
      and student.branch = e.branch
      and student.academic_year = e.academic_year
      and (
        (
          actor.role = 'student'
          and student.id = actor.id
          and labmate_practical_records.attendance_status = 'not_marked'
          and labmate_practical_records.attendance_date is null
          and labmate_practical_records.marked_by is null
          and labmate_practical_records.completion_status in ('not_started', 'submitted')
        )
        or actor.role in ('faculty', 'assistant_professor', 'admin')
      )
  ));

create policy "Students update own completion; faculty manage practical records"
  on public.labmate_practical_records for update to authenticated
  using (exists (
    select 1 from public.profiles actor
    join public.profiles student on student.id = labmate_practical_records.student_id
    join public.labmate_experiments e on e.id = labmate_practical_records.experiment_id
    where actor.id = (select auth.uid())
      and actor.account_status in ('active', 'approved')
      and student.role = 'student'
      and student.branch = e.branch
      and student.academic_year = e.academic_year
      and (
        (actor.role = 'student' and student.id = actor.id)
        or actor.role in ('faculty', 'assistant_professor', 'admin')
      )
  ))
  with check (exists (
    select 1 from public.profiles actor
    join public.profiles student on student.id = labmate_practical_records.student_id
    join public.labmate_experiments e on e.id = labmate_practical_records.experiment_id
    where actor.id = (select auth.uid())
      and actor.account_status in ('active', 'approved')
      and student.role = 'student'
      and student.branch = e.branch
      and student.academic_year = e.academic_year
      and (
        (
          actor.role = 'student'
          and student.id = actor.id
          and labmate_practical_records.completion_status in ('not_started', 'submitted')
        )
        or actor.role in ('faculty', 'assistant_professor', 'admin')
      )
  ));

create or replace function public.labmate_student_roster(p_branch text, p_year smallint)
returns table (id uuid, full_name text, roll_number text)
language plpgsql
stable
security definer
set search_path = ''
set row_security = off
as $$
begin
  if not exists (
    select 1 from public.profiles actor
    where actor.id = (select auth.uid())
      and actor.role in ('faculty', 'assistant_professor', 'admin')
      and actor.account_status in ('active', 'approved')
  ) then
    raise exception 'Approved faculty access is required to view the class roster'
      using errcode = '42501';
  end if;

  return query
  select student.id, student.full_name, student.roll_number
  from public.profiles student
  where student.role = 'student'
    and student.account_status in ('active', 'approved')
    and student.branch = p_branch
    and student.academic_year = p_year
  order by lower(student.full_name), lower(student.roll_number);
end;
$$;

revoke all on function public.labmate_student_roster(text, smallint) from public, anon;
grant execute on function public.labmate_student_roster(text, smallint) to authenticated;
