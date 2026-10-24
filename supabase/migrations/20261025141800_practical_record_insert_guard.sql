-- Handle INSERT and UPDATE distinctly while keeping student completion separate from attendance.
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
  if tg_op = 'UPDATE' then
    if new.student_id is distinct from old.student_id
      or new.experiment_id is distinct from old.experiment_id then
      raise exception 'Practical records cannot be moved to another student or experiment';
    end if;
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
      select 1
      from public.labmate_practical_evidence evidence
      join storage.objects object
        on object.bucket_id = 'labmate-evidence'
        and object.name = evidence.storage_path
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
    if tg_op = 'INSERT' and new.marked_by is distinct from (select auth.uid()) then
      raise exception 'Attendance must be recorded by the signed-in faculty member';
    end if;
    if tg_op = 'UPDATE'
      and (new.attendance_status is distinct from old.attendance_status
        or new.attendance_date is distinct from old.attendance_date)
      and new.marked_by is distinct from (select auth.uid()) then
      raise exception 'Attendance must be recorded by the signed-in faculty member';
    end if;
  else
    raise exception 'Approved LabMate access is required';
  end if;

  return new;
end;
$$;
