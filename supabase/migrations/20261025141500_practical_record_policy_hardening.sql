create or replace function private.labmate_practical_target_matches(p_student_id uuid, p_experiment_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
set row_security = off
as $$
  select exists (
    select 1
    from public.profiles student
    join public.labmate_experiments e on e.id = p_experiment_id
    where student.id = p_student_id
      and student.role = 'student'
      and student.account_status in ('active', 'approved')
      and student.branch = e.branch
      and student.academic_year = e.academic_year
  );
$$;

revoke all on function private.labmate_practical_target_matches(uuid, uuid) from public, anon;
grant execute on function private.labmate_practical_target_matches(uuid, uuid) to authenticated;

drop policy if exists "Students can submit own practical completion and faculty can add records" on public.labmate_practical_records;
create policy "Students can submit own practical completion and faculty can add records"
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
            and completion_status in ('not_started', 'submitted')
          )
          or actor.role in ('faculty', 'assistant_professor', 'admin')
        )
    )
  );

drop policy if exists "Students update own completion; faculty manage practical records" on public.labmate_practical_records;
create policy "Students update own completion; faculty manage practical records"
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
            and completion_status in ('not_started', 'submitted')
          )
          or actor.role in ('faculty', 'assistant_professor', 'admin')
        )
    )
  );
