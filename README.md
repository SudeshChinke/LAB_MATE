# LabMate

LabMate is a Java-first college lab management starter. It brings lab sessions, equipment availability, and upcoming reservations into one calm, dark workspace.

## Project layout

- `frontend/` — Vite + React dashboard. Deploy this directory as the Vercel project root.
- `backend/` — Spring Boot REST API (Java 17+, Maven). Run or host this separately and point the frontend at its URL.

The dashboard currently uses sample data. The API has starter read endpoints backed by in-memory sample records; no database or authentication is configured yet.

## Run locally

Backend: `cd backend && mvn spring-boot:run`

Frontend: `cd frontend && npm install && npm run dev`

Set `VITE_API_BASE_URL` in `frontend/.env.local` to the backend origin. Without it, the dashboard shows its sample data.

## Deploy

Import this repository into Vercel and set the project Root Directory to `frontend`. The Spring Boot service is a separate Java process and needs a Java-capable host. Configure `VITE_API_BASE_URL` in Vercel after the API has a public HTTPS URL.

The UI and API are a starter. Add persistent storage, authentication, authorization, validation, and audit logging before handling real student or equipment records.
