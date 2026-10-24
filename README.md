# LabMate

LabMate is a mobile-friendly SPPU E&TC lab workspace for students, faculty, assistant professors, and administrators.

## Features

- Email and password accounts with email verification. Students provide their name, branch, roll number, and year. Faculty select one or more lab subjects and wait for admin approval.
- Faculty subject assignments can be shared by multiple teachers. Only assigned teachers can edit experiments, set dates, and upload or delete shared course materials.
- Students can browse their year and semester labs, view faculty materials, check or uncheck experiment completion, and see attendance recorded by faculty.
- Private saved study chats use Gemini 3.8 Flash for text, PDF, image, audio, and video prompts. Attachments are limited to 2.5 MB to stay within Vercel Function request limits.
- Profile and settings include account details, teacher assignments, larger text, reduced motion, and password reset.

## Project layout

- `frontend/` — Vite + React app and the Vercel `/api/chat` server function.
- `supabase/migrations/` — database schema, row-level security, signup triggers, and syllabus data.
- `backend/` — Spring Boot starter, not used by the current Vercel app.

## Environment variables

The Vercel project root is `frontend/`.

Set these in Vercel for Production, Preview, and Development:

- `VITE_SUPABASE_URL` — public Supabase project URL.
- `VITE_SUPABASE_PUBLISHABLE_KEY` — public Supabase publishable key.
- `GEMINI_API_KEY` — secret Gemini API key, used only by the server function. Never add this to a `VITE_` variable or frontend source.

The API can use `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` to validate signed-in sessions. Optional server-only aliases are `SUPABASE_URL` and `SUPABASE_ANON_KEY`.

For local chat development, use Vercel's local development command so `/api/chat` runs. A plain Vite dev server only serves the frontend. Add the local and production URLs to Supabase Authentication's redirect allow list.

## First admin and approval

After the first admin verifies their email, run `supabase/bootstrap_admin.sql` in the Supabase SQL Editor after replacing its email placeholder. Signup metadata cannot grant admin access. The admin then approves faculty and assistant professor accounts from the dashboard.

## Free-plan notes

The free plans are suitable for a pilot at this scale while usage stays within each provider's quota. They do not provide a production uptime commitment or automatic database backups on Supabase Free. Supabase may pause a low-activity free project; export database data and back up stored files separately. Gemini's free tier has request limits and Google may use free-tier prompts and uploaded content to improve its products. Do not send sensitive student data to the assistant.
