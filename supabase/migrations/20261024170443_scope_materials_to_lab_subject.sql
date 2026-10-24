alter table public.labmate_files
  add column if not exists subject_name text,
  add column if not exists elective_name text;

create index if not exists labmate_files_course_subject_idx
  on public.labmate_files (academic_year, semester, course_code, subject_name, created_at desc);
