# LabMate

LabMate is a Java-first college lab management starter. It brings year-based subjects, practicals, faculty and student signups, and shared learning materials into one calm workspace.

## Project layout

- `frontend/` — Vite + React dashboard. Deploy this directory as the Vercel project root.
- `backend/` — Spring Boot REST API (Java 17+, Maven). Run or host this separately and point the frontend at its URL.

The dashboard currently uses a sample computer-science curriculum for second, third, and fourth year, with five subjects in each. Replace it with the college syllabus when available. Student registration should use name, normal email, and college roll number. Faculty and assistant professor registrations require admin approval. The API has starter read endpoints backed by in-memory sample records; signup totals are examples and no database or authentication is configured yet. The faculty upload control is a UI preview that records filenames for the current session; durable private file sharing needs backend storage and role-based access.

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

## Deploy

Import this repository into Vercel and set the project Root Directory to `frontend`. Vercel can build the Vite frontend. The Spring Boot service is a separate Java process and needs a Java-capable host; Vercel is not the place to run this conventional Spring Boot app as an always-on server. Configure `VITE_API_BASE_URL` in Vercel after the API has a public HTTPS URL. Keep the database and API credentials on the backend.

Room and lab allocation is deliberately left out until the faculty, student, and space constraints are known. The UI and API are designed as a starting point, not a production-ready system. Add persistent storage, authentication, authorization, input validation, and audit logging before handling real student or equipment records.
