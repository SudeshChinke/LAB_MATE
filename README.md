# LabMate

LabMate is a Java-first college lab management starter. It brings year-based subjects, practicals, faculty and student signups, and shared learning materials into one calm workspace.

## Project layout

- `frontend/` — Vite + React dashboard. Deploy this directory as the Vercel project root.
- `backend/` — Spring Boot REST API (Java 17+, Maven). Run or host this separately and point the frontend at its URL.

The dashboard currently uses a sample computer-science curriculum for second, third, and fourth year, with five subjects in each. Replace it with the college syllabus when available. Student accounts use name, normal email, password, roll number, and academic year. Supabase Auth requires email confirmation before sign-in. Faculty and assistant professor requests stay pending until an admin approves them. The profile table uses row-level security; users can read only their own profile, while admins can review and update requests.

The Supabase project `LabMate` is in the `ap-south-1` Mumbai region. `supabase/migrations/20261024161725_labmate_accounts_and_faculty_approval.sql` contains the profile table, signup trigger, and access policies. After the first admin creates an account and confirms their email, run `supabase/bootstrap_admin.sql` in the Supabase SQL Editor after replacing its email placeholder. Only that database-side step grants the initial admin role; signup metadata cannot assign admin access.

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `frontend/.env.local` for local development. The Vercel project uses the same public configuration variables. These are publishable browser values; never add a Supabase service-role or secret key to the frontend. Add the production LabMate URL and `http://localhost:5173` to Supabase Authentication → URL Configuration, including the production URL in the redirect allow list.

The API has starter read endpoints backed by sample data. Signup totals are still examples. The faculty upload control is still a UI preview that records filenames for the current session; durable private file sharing needs backend storage and role-based access.

## Run locally

Backend:

```sh
cd backend
mvn spring-boot:run
```

Frontend (in a second terminal):

```sh
cd frontend
npm install
npm run dev
```

Set `VITE_API_BASE_URL` in `frontend/.env.local` to the backend origin when connecting the UI to the API, for example `http://localhost:8080`. Without it, the dashboard shows its sample data.

Add these Supabase settings to the same `.env.local` file before running the frontend:

```sh
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

## Deploy

The Vercel project builds the Vite frontend from `frontend/`. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` to Vercel for Production, Preview, and Development, then redeploy. Add the production and local URLs to Supabase's auth redirect allow list. The Spring Boot service is a separate Java process and needs a Java-capable host; Vercel is not the place to run this conventional Spring Boot app as an always-on server. Configure `VITE_API_BASE_URL` after the API has a public HTTPS URL. Keep database and service-role credentials on the backend.

Room and lab allocation is deliberately left out until the faculty, student, and space constraints are known. The sample curriculum and equipment are placeholders. Verify auth redirect settings and bootstrap the first admin before inviting users. Add private file storage, input validation, and audit logging before handling real course materials or equipment records. The free Supabase plan is intended for this prototype; check current limits before a college-wide rollout.
