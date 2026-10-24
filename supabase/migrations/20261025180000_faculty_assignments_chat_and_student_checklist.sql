-- Restrict staff actions to shared subject assignments and add private saved Gemini chats.
create table if not exists public.labmate_faculty_subjects (
  id uuid primary key default gen_random_uuid(),
  faculty_id uuid not null references public.profiles(id) on delete cascade,
  branch text not null default 'ENTC',
  academic_year smallint not null check (academic_year in (2, 3, 4)),
  semester smallint not null check (semester between 3 and 8),
  course_code text not null,
  subject_name text not null,
  created_at timestamptz not null default now(),
  unique (faculty_id, branch, academic_year, semester, course_code, subject_name)
);
create index if not exists labmate_faculty_subjects_lookup_idx
  on public.labmate_faculty_subjects (faculty_id, branch, academic_year, semester, course_code, subject_name);
alter table public.labmate_faculty_subjects enable row level security;
revoke all on public.labmate_faculty_subjects from anon, authenticated;
grant select, insert, delete on public.labmate_faculty_subjects to authenticated;

create or replace function private.labmate_is_approved_staff()
returns boolean language sql stable security definer set search_path = '' set row_security = off as $$
  select exists (
    select 1 from public.profiles p where p.id = (select auth.uid())
      and p.role in ('faculty', 'assistant_professor', 'admin')
      and p.account_status in ('active', 'approved')
  );
$$;

create or replace function private.labmate_is_subject_staff(
  p_branch text, p_year smallint, p_semester smallint, p_course_code text, p_subject_name text
)
returns boolean language sql stable security definer set search_path = '' set row_security = off as $$
  select exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.role = 'admin' and p.account_status in ('active', 'approved')
  ) or exists (
    select 1 from public.labmate_faculty_subjects a
    join public.profiles p on p.id = a.faculty_id
    where a.faculty_id = (select auth.uid())
      and p.role in ('faculty', 'assistant_professor') and p.account_status in ('active', 'approved')
      and a.branch = p_branch and a.academic_year = p_year and a.semester = p_semester
      and a.course_code = p_course_code and a.subject_name = p_subject_name
  );
$$;

revoke all on function private.labmate_is_approved_staff() from public, anon, authenticated;
revoke all on function private.labmate_is_subject_staff(text, smallint, smallint, text, text) from public, anon, authenticated;
grant execute on function private.labmate_is_approved_staff() to authenticated;
grant execute on function private.labmate_is_subject_staff(text, smallint, smallint, text, text) to authenticated;

create or replace function private.labmate_is_subject_path_staff(
  p_branch text, p_year smallint, p_semester smallint, p_course_code text, p_subject_slug text
)
returns boolean language sql stable security definer set search_path = '' set row_security = off as $$
  select exists (
    select 1 from public.profiles p where p.id = (select auth.uid())
      and p.role = 'admin' and p.account_status in ('active', 'approved')
  ) or exists (
    select 1 from public.labmate_faculty_subjects a
    join public.profiles p on p.id = a.faculty_id
    where a.faculty_id = (select auth.uid()) and p.role in ('faculty', 'assistant_professor')
      and p.account_status in ('active', 'approved') and a.branch = p_branch
      and a.academic_year = p_year and a.semester = p_semester and a.course_code = p_course_code
      and regexp_replace(a.subject_name, '[^a-zA-Z0-9._-]', '_', 'g') = p_subject_slug
  );
$$;
revoke all on function private.labmate_is_subject_path_staff(text, smallint, smallint, text, text) from public, anon, authenticated;
grant execute on function private.labmate_is_subject_path_staff(text, smallint, smallint, text, text) to authenticated;

create policy "Approved staff read own subject assignments and admins read all"
  on public.labmate_faculty_subjects for select to authenticated
  using (faculty_id = (select auth.uid()) or (select private.is_labmate_admin()));
create policy "Approved staff manage own valid subject assignments"
  on public.labmate_faculty_subjects for insert to authenticated
  with check (
    faculty_id = (select auth.uid())
    and exists (select 1 from public.profiles p where p.id = (select auth.uid())
      and p.role in ('faculty', 'assistant_professor') and p.account_status in ('active', 'approved'))
    and exists (select 1 from public.labmate_experiments e where e.branch = labmate_faculty_subjects.branch
      and e.academic_year = labmate_faculty_subjects.academic_year and e.semester = labmate_faculty_subjects.semester
      and e.course_code = labmate_faculty_subjects.course_code and e.subject_name = labmate_faculty_subjects.subject_name)
  );
create policy "Approved staff remove own subject assignments"
  on public.labmate_faculty_subjects for delete to authenticated
  using (faculty_id = (select auth.uid()) and (select private.labmate_is_approved_staff()));

-- Staff select multiple courses at signup; preserve that request after approval.
create or replace function private.create_labmate_profile()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  requested_name text := nullif(btrim(coalesce(new.raw_user_meta_data ->> 'full_name', '')), '');
  requested_role text := coalesce(new.raw_user_meta_data ->> 'account_type', 'student');
  requested_roll text := nullif(btrim(coalesce(new.raw_user_meta_data ->> 'roll_number', '')), '');
  requested_branch text := coalesce(new.raw_user_meta_data ->> 'branch', 'ENTC');
  requested_year integer;
  assigned_status text;
  item jsonb;
begin
  if requested_name is null then raise exception 'A full name is required'; end if;
  if requested_role = 'student' then
    if requested_roll is null then raise exception 'A college roll number is required for students'; end if;
    begin requested_year := (new.raw_user_meta_data ->> 'academic_year')::integer;
    exception when others then raise exception 'Students must select second, third, or fourth year'; end;
    if requested_year not in (2, 3, 4) then raise exception 'Students must select second, third, or fourth year'; end if;
    assigned_status := 'active';
  elsif requested_role in ('faculty', 'assistant_professor') then
    requested_roll := null; requested_year := null; assigned_status := 'pending';
    if coalesce(jsonb_typeof(new.raw_user_meta_data -> 'teaching_subjects'), '') <> 'array' then
      raise exception 'Faculty must select at least one lab subject';
    end if;
    if jsonb_array_length(new.raw_user_meta_data -> 'teaching_subjects') = 0 then
      raise exception 'Faculty must select at least one lab subject';
    end if;
  else raise exception 'That account type cannot be self-registered';
  end if;

  insert into public.profiles (id, full_name, email, role, account_status, roll_number, academic_year, branch)
  values (new.id, requested_name, lower(new.email), requested_role, assigned_status, requested_roll, requested_year,
    case when requested_role = 'student' then requested_branch else null end);

  if requested_role in ('faculty', 'assistant_professor') then
    for item in select value from jsonb_array_elements(new.raw_user_meta_data -> 'teaching_subjects') loop
      if item ->> 'branch' <> 'ENTC' then raise exception 'Unsupported branch'; end if;
      if not exists (
        select 1 from public.labmate_experiments e
        where e.branch = item ->> 'branch'
          and e.academic_year = (item ->> 'academic_year')::smallint
          and e.semester = (item ->> 'semester')::smallint
          and e.course_code = item ->> 'course_code'
          and e.subject_name = item ->> 'subject_name'
      ) then raise exception 'Selected subject is not in the LabMate syllabus'; end if;
      insert into public.labmate_faculty_subjects (faculty_id, branch, academic_year, semester, course_code, subject_name)
      values (new.id, item ->> 'branch', (item ->> 'academic_year')::smallint,
        (item ->> 'semester')::smallint, item ->> 'course_code', item ->> 'subject_name')
      on conflict do nothing;
    end loop;
  end if;
  return new;
end;
$$;

-- Scope syllabus edits to an assigned subject. Multiple teachers may share the same assignment.
drop policy if exists "Approved faculty can add experiments" on public.labmate_experiments;
drop policy if exists "Approved faculty can edit experiments" on public.labmate_experiments;
drop policy if exists "Approved faculty can remove experiments" on public.labmate_experiments;
create policy "Assigned faculty add experiments"
  on public.labmate_experiments for insert to authenticated
  with check ((select private.labmate_is_subject_staff(branch, academic_year, semester, course_code, subject_name)));
create policy "Assigned faculty edit experiments"
  on public.labmate_experiments for update to authenticated
  using ((select private.labmate_is_subject_staff(branch, academic_year, semester, course_code, subject_name)))
  with check ((select private.labmate_is_subject_staff(branch, academic_year, semester, course_code, subject_name)));
create policy "Assigned faculty remove experiments"
  on public.labmate_experiments for delete to authenticated
  using ((select private.labmate_is_subject_staff(branch, academic_year, semester, course_code, subject_name)));

drop policy if exists "Approved LabMate users can read experiments" on public.labmate_experiments;
create policy "Approved users read their experiments"
  on public.labmate_experiments for select to authenticated
  using (
    exists (select 1 from public.profiles p where p.id = (select auth.uid())
      and p.account_status in ('active', 'approved') and (
        p.role = 'admin'
        or (p.role = 'student' and p.branch = labmate_experiments.branch and p.academic_year = labmate_experiments.academic_year)
        or (p.role in ('faculty', 'assistant_professor') and (select private.labmate_is_subject_staff(
          labmate_experiments.branch, labmate_experiments.academic_year, labmate_experiments.semester,
          labmate_experiments.course_code, labmate_experiments.subject_name)))
      ))
  );

-- Shared files belong to lab teachers; students can only read faculty materials for their year/branch.
drop policy if exists "Approved LabMate users can read materials" on public.labmate_files;
drop policy if exists "Approved users can upload their own materials" on public.labmate_files;
drop policy if exists "Approved owners and faculty can remove materials" on public.labmate_files;
create policy "Approved users read assigned course materials"
  on public.labmate_files for select to authenticated
  using (
    exists (select 1 from public.profiles p where p.id = (select auth.uid())
      and p.account_status in ('active', 'approved') and (
        p.role = 'admin'
        or (p.role = 'student' and p.branch = labmate_files.branch and p.academic_year = labmate_files.academic_year
          and exists (select 1 from public.profiles owner where owner.id = labmate_files.uploaded_by
            and owner.role in ('faculty', 'assistant_professor', 'admin') and owner.account_status in ('active', 'approved')))
        or (p.role in ('faculty', 'assistant_professor') and (select private.labmate_is_subject_staff(
          labmate_files.branch, labmate_files.academic_year, labmate_files.semester,
          labmate_files.course_code, labmate_files.subject_name)))
      ))
  );
create policy "Assigned faculty upload course materials"
  on public.labmate_files for insert to authenticated
  with check (uploaded_by = (select auth.uid()) and
    (select private.labmate_is_subject_staff(branch, academic_year, semester, course_code, subject_name)));
create policy "Assigned faculty delete shared course materials"
  on public.labmate_files for delete to authenticated
  using ((select private.labmate_is_subject_staff(branch, academic_year, semester, course_code, subject_name)));

-- Keep the private object store aligned with the course row policies.
drop policy if exists "Approved users can view shared LabMate materials" on storage.objects;
drop policy if exists "Approved users can upload own LabMate materials" on storage.objects;
drop policy if exists "Approved owners or faculty remove LabMate materials" on storage.objects;
create policy "Course members read shared LabMate material objects"
  on storage.objects for select to authenticated
  using (bucket_id = 'labmate-materials' and exists (
    select 1 from public.labmate_files f where f.storage_path = storage.objects.name
  ));
create policy "Assigned faculty upload shared LabMate material objects"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'labmate-materials'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and (select private.labmate_is_subject_path_staff(
      (storage.foldername(name))[2],
      ((storage.foldername(name))[3])::smallint,
      ((storage.foldername(name))[4])::smallint,
      (storage.foldername(name))[5],
      (storage.foldername(name))[6]
    ))
  );
create policy "Assigned faculty remove shared LabMate material objects"
  on storage.objects for delete to authenticated
  using (bucket_id = 'labmate-materials' and (select private.labmate_is_subject_path_staff(
    (storage.foldername(name))[2],
    ((storage.foldername(name))[3])::smallint,
    ((storage.foldername(name))[4])::smallint,
    (storage.foldername(name))[5],
    (storage.foldername(name))[6]
  )));

-- Students now check and uncheck their own practical completion directly.
alter table public.labmate_practical_records
  drop constraint if exists labmate_practical_records_completion_status_check;
alter table public.labmate_practical_records
  add constraint labmate_practical_records_completion_status_check
  check (completion_status in ('not_started', 'completed'));
create or replace function private.guard_labmate_practical_record_update()
returns trigger language plpgsql security definer set search_path = '' as $$
declare actor_role text;
begin
  if new.student_id is distinct from old.student_id or new.experiment_id is distinct from old.experiment_id then
    raise exception 'Practical records cannot be moved to another student or experiment';
  end if;
  select actor.role into actor_role from public.profiles actor
  where actor.id = (select auth.uid()) and actor.account_status in ('active', 'approved');
  if actor_role = 'student' then
    if tg_op = 'UPDATE' then
      if new.attendance_status is distinct from old.attendance_status
        or new.attendance_date is distinct from old.attendance_date
        or new.marked_by is distinct from old.marked_by then raise exception 'Only faculty can change attendance'; end if;
    elsif new.attendance_status <> 'not_marked' or new.attendance_date is not null or new.marked_by is not null then
      raise exception 'Students cannot set their own attendance';
    end if;
  elsif actor_role is null or actor_role not in ('faculty', 'assistant_professor', 'admin') then
    raise exception 'Approved LabMate access is required';
  elsif not exists (
    select 1 from public.labmate_experiments e where e.id = new.experiment_id
      and private.labmate_is_subject_staff(e.branch, e.academic_year, e.semester, e.course_code, e.subject_name)
  ) then
    raise exception 'You are not assigned to this lab subject';
  end if;
  return new;
end;
$$;

-- Attendance and private evidence follow the same staff-to-subject assignments.
drop policy if exists "Students and faculty can read practical records" on public.labmate_practical_records;
drop policy if exists "Students can complete own practicals and faculty can add attendance records" on public.labmate_practical_records;
drop policy if exists "Students can submit own practical completion and faculty can add records" on public.labmate_practical_records;
drop policy if exists "Students update completion and faculty update attendance" on public.labmate_practical_records;
drop policy if exists "Students update own completion; faculty manage practical records" on public.labmate_practical_records;
create policy "Students and assigned staff read attendance"
  on public.labmate_practical_records for select to authenticated
  using (
    exists (select 1 from public.profiles p where p.id = (select auth.uid())
      and p.account_status in ('active', 'approved') and (
        (p.role = 'student' and p.id = labmate_practical_records.student_id)
        or (p.role in ('faculty', 'assistant_professor', 'admin') and exists (
          select 1 from public.labmate_experiments e where e.id = labmate_practical_records.experiment_id
            and private.labmate_is_subject_staff(e.branch, e.academic_year, e.semester, e.course_code, e.subject_name)
        ))
      ))
  );
create policy "Students and assigned staff create attendance or completion"
  on public.labmate_practical_records for insert to authenticated
  with check (
    private.labmate_practical_target_matches(student_id, experiment_id)
    and exists (select 1 from public.profiles actor where actor.id = (select auth.uid())
      and actor.account_status in ('active', 'approved') and (
        (actor.role = 'student' and student_id = actor.id and attendance_status = 'not_marked'
          and attendance_date is null and marked_by is null and completion_status in ('not_started', 'completed'))
        or (actor.role in ('faculty', 'assistant_professor', 'admin') and completion_status = 'not_started'
          and exists (select 1 from public.labmate_experiments e where e.id = experiment_id
            and private.labmate_is_subject_staff(e.branch, e.academic_year, e.semester, e.course_code, e.subject_name)))
      ))
  );
create policy "Students update own checklist and assigned staff update attendance"
  on public.labmate_practical_records for update to authenticated
  using (
    private.labmate_practical_target_matches(student_id, experiment_id)
    and exists (select 1 from public.profiles actor where actor.id = (select auth.uid())
      and actor.account_status in ('active', 'approved') and (
        (actor.role = 'student' and student_id = actor.id)
        or (actor.role in ('faculty', 'assistant_professor', 'admin') and exists (
          select 1 from public.labmate_experiments e where e.id = experiment_id
            and private.labmate_is_subject_staff(e.branch, e.academic_year, e.semester, e.course_code, e.subject_name)
        ))
      ))
  )
  with check (
    private.labmate_practical_target_matches(student_id, experiment_id)
    and exists (select 1 from public.profiles actor where actor.id = (select auth.uid())
      and actor.account_status in ('active', 'approved') and (
        (actor.role = 'student' and student_id = actor.id and completion_status in ('not_started', 'completed')
          and attendance_status = 'not_marked' and attendance_date is null and marked_by is null)
        or (actor.role in ('faculty', 'assistant_professor', 'admin') and exists (
          select 1 from public.labmate_experiments e where e.id = experiment_id
            and private.labmate_is_subject_staff(e.branch, e.academic_year, e.semester, e.course_code, e.subject_name)
        ))
      ))
  );

drop policy if exists "Students see own evidence and faculty see their branch evidence" on public.labmate_practical_evidence;
create policy "Students and assigned staff see practical evidence"
  on public.labmate_practical_evidence for select to authenticated
  using (exists (
    select 1 from public.profiles actor join public.labmate_experiments e on e.id = labmate_practical_evidence.experiment_id
    where actor.id = (select auth.uid()) and actor.account_status in ('active', 'approved') and (
      (actor.role = 'student' and labmate_practical_evidence.student_id = actor.id)
      or (actor.role in ('faculty', 'assistant_professor', 'admin') and private.labmate_is_subject_staff(
        e.branch, e.academic_year, e.semester, e.course_code, e.subject_name
      ))
    )
  ));

-- Saved chats are private to the signed-in account. Attachments are size-limited in the interface.
create table if not exists public.labmate_chat_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null default 'New chat' check (char_length(title) between 1 and 120),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists labmate_chat_sessions_user_idx on public.labmate_chat_sessions (user_id, updated_at desc);
create table if not exists public.labmate_chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.labmate_chat_sessions(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('user', 'model')),
  content text not null check (char_length(content) <= 16000),
  attachment_name text,
  created_at timestamptz not null default now()
);
create index if not exists labmate_chat_messages_session_idx on public.labmate_chat_messages (session_id, created_at);
alter table public.labmate_chat_sessions enable row level security;
alter table public.labmate_chat_messages enable row level security;
revoke all on public.labmate_chat_sessions, public.labmate_chat_messages from anon, authenticated;
grant select, insert, update, delete on public.labmate_chat_sessions to authenticated;
grant select, insert, delete on public.labmate_chat_messages to authenticated;
create policy "Users manage their own saved chat sessions" on public.labmate_chat_sessions
  for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "Users manage their own saved chat messages" on public.labmate_chat_messages
  for all to authenticated using (user_id = (select auth.uid()) and exists (
    select 1 from public.labmate_chat_sessions s where s.id = labmate_chat_messages.session_id and s.user_id = (select auth.uid())
  )) with check (user_id = (select auth.uid()) and exists (
    select 1 from public.labmate_chat_sessions s where s.id = labmate_chat_messages.session_id and s.user_id = (select auth.uid())
  ));
