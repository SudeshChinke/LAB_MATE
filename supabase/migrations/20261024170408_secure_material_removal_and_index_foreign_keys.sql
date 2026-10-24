-- Add foreign-key indexes and require approved accounts when removing shared files.
create index if not exists labmate_experiments_created_by_idx
  on public.labmate_experiments (created_by);
create index if not exists labmate_experiments_updated_by_idx
  on public.labmate_experiments (updated_by);
create index if not exists labmate_files_experiment_id_idx
  on public.labmate_files (experiment_id);
create index if not exists labmate_files_uploaded_by_idx
  on public.labmate_files (uploaded_by);

drop policy if exists "Owners and faculty can remove materials" on public.labmate_files;
create policy "Approved owners and faculty can remove materials"
  on public.labmate_files
  for delete to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid())
        and p.account_status in ('active', 'approved')
        and (
          public.labmate_files.uploaded_by = (select auth.uid())
          or p.role in ('faculty', 'assistant_professor', 'admin')
        )
    )
  );

drop policy if exists "Owners or faculty remove LabMate materials" on storage.objects;
create policy "Approved owners or faculty remove LabMate materials"
  on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'labmate-materials'
    and (
      (
        (storage.foldername(name))[1] = (select auth.uid())::text
        and exists (
          select 1 from public.profiles p
          where p.id = (select auth.uid())
            and p.account_status in ('active', 'approved')
        )
      )
      or exists (
        select 1 from public.profiles p
        where p.id = (select auth.uid())
          and p.role in ('faculty', 'assistant_professor', 'admin')
          and p.account_status in ('active', 'approved')
      )
    )
  );
