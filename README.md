# Secret Santa

Secret Santa is a small two‑part application (backend + frontend) that lets a group of users draw a Secret Santa using a spinning wheel UI. The backend exposes a JSON API and Socket.IO events and stores users in Supabase. The frontend is a Next.js app that shows the wheel, handles authentication via simple username/password, and listens for real‑time updates.

**Project Layout**
- **`backend/`**: TypeScript Express server with Socket.IO. Talks to Supabase for user storage and exposes endpoints under `/:` e.g. `/login`, `/users`, `/has-spun`, `/current-user`.
- **`frontend/secret-santa-fe/`**: Next.js 16 frontend (React 19) that renders the wheel UI, login flow and communicates with the backend.

## Quick Start (recommended)

- Start the backend (development):

```bash
cd backend
npm install
npm run dev
```

- Start the frontend (development):

```bash
cd frontend/secret-santa-fe
npm install
npm run dev
```

By default the backend listens on port `3000` and the frontend dev server runs on port `3001` (see `frontend/secret-santa-fe/package.json`).

## Backend Details
- Entry point: `backend/src/main.ts` — loads environment variables and starts an HTTP + Socket.IO server.
- Main server: `backend/src/app.ts` — Express app with routes:
	- `POST /login` - returns a JWT for subsequent requests.
	- `GET /users` - returns available users (requires JWT in `Authorization: Bearer <token>`).
	- `PUT /has-spun` - mark a user as having spun and store the assigned secret santa name.
	- `GET /current-user` - returns the username from the JWT.
- Realtime: Socket.IO is used to broadcast `hasSpunUpdated` messages so connected clients refresh their view.
- Data layer: `backend/src/repository/users-repository.ts` uses the Supabase JS client to read/update the `users` table.

### Backend Scripts (in `backend/package.json`)
- `npm run dev` — run with `ts-node-dev` for development (watches files).
- `npm run build` — compile TypeScript to `dist/`.
- `npm start` — run the compiled Node app from `dist/`.

### Backend Environment Variables
- `SUPABASE_URL` — Your Supabase project URL.
- `SUPABASE_KEY` — Service role or anon key for Supabase (the repo expects this in `.env`).
- `JWT_SECRET` — Secret used to sign JWTs (defaults to a placeholder; change for production).
- `ADMIN_USERNAME` / `ADMIN_PASSWORD` — optional admin credentials used by `/login`.
- `PORT` / `HOST` — (optional) server binding info.
- `FRONTEND_URL` — URL of the frontend for CORS and Socket.IO (defaults to `http://localhost:3001`).

Place these variables in `backend/.env` (or set them in your environment). Example `.env`:

```env
SUPABASE_URL=https://xyzcompany.supabase.co
SUPABASE_KEY=eyJ...yourkey...
JWT_SECRET=super-secret-change-me
ADMIN_USERNAME=admin
ADMIN_PASSWORD=password
PORT=3000
FRONTEND_URL=http://localhost:3001
```

Security note: In production use a service role or restricted key and never commit `.env` to source control.

## Frontend Details
- Located at `frontend/secret-santa-fe/` (Next.js app). The primary pages and components live under `app/` and use client components for interactivity.
- The frontend reads the API base URL from `process.env.NEXT_PUBLIC_API_URL` and falls back to `http://localhost:3000`.
- The wheel UI lives in `app/page.tsx` which fetches `/users`, renders the list, and calls `/has-spun` when a spin finishes.

### Frontend Scripts (in `frontend/secret-santa-fe/package.json`)
- `npm run dev` — builds then starts Next's dev server on port `3001` (configured in the script).
- `npm run build` — build for production.
- `npm run start` — start the production server after `npm run build`.

## Running Locally - checklist
- Start Supabase (or point to your hosted Supabase) and make sure the `users` table exists with expected columns:
	- `id` (number), `name` (string), `username` (string), `password` (string), `has_spun` (boolean), `secret_santa` (string), `partner_name` (string)
- Create `.env` in `backend/` with the variables shown above.
- Start backend then frontend.
- Open `http://localhost:3001` and login. The login flow sets a cookie `authenticated` and `token` which the frontend uses for auth.

## Deployment Hints
- Backend: The repo contains a `Dockerfile` and `fly.toml` for Fly.io. Build with Docker and deploy using your preferred service. Ensure environment variables are set in your host.
- Frontend: This Next.js app can be deployed to Vercel, Netlify, or Fly. Make sure `NEXT_PUBLIC_API_URL` points to your backend API.
