-- Completion updates preserve faculty attendance, and evidence metadata must refer to a real upload.

drop policy if exists "Students update completion and faculty update attendance"
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
          )
          or actor.role in ('faculty', 'assistant_professor', 'admin')
        )
    )
  );

create or replace function private.guard_labmate_practical_evidence_insert()
returns trigger
language plpgsql
security definer
set search_path = ''
set row_security = off
as $$
begin
  if new.student_id is distinct from (select auth.uid()) then
    raise exception 'Evidence must belong to the signed-in student';
  end if;

  if not private.labmate_practical_target_matches(new.student_id, new.experiment_id)
    or not exists (
      select 1 from public.profiles actor
      where actor.id = (select auth.uid())
        and actor.role = 'student'
        and actor.account_status in ('active', 'approved')
    ) then
    raise exception 'Active student access for this practical is required';
  end if;

  if not exists (
    select 1 from storage.objects object
    where object.bucket_id = 'labmate-evidence'
      and object.name = new.storage_path
  ) then
    raise exception 'Upload the evidence file before saving its details';
  end if;

  return new;
end;
$$;

revoke all on function private.guard_labmate_practical_evidence_insert() from public, anon, authenticated;
drop trigger if exists labmate_guard_practical_evidence_insert on public.labmate_practical_evidence;
create trigger labmate_guard_practical_evidence_insert
  before insert on public.labmate_practical_evidence
  for each row execute function private.guard_labmate_practical_evidence_insert();
