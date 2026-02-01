# Deployment & Connectivity Playbook

## Architecture Snapshot
- **Frontend (Admin)**: Vite/React SPA hosted on Vercel at https://potography-webapp.vercel.app (root: `client`).
- **Frontend (Public Site)**: Vite/React SPA hosted on Vercel at https://potography-webapp-website.vercel.app.
- **Backend API**: Express + MongoDB hosted on Render at https://potography-webapp.onrender.com, serving REST endpoints under `/api`.
- **Database**: MongoDB Atlas cluster `photography_db` accessed via SRV connection string.

Both frontends talk to the same backend using `VITE_API_URL` → `https://potography-webapp.onrender.com/api`. All CRUD logic and authentication stay on the server.

## Environment Variables

### Backend (Render)
| Variable | Required | Description | Example |
| --- | --- | --- | --- |
| `MONGODB_URI` | ✅ | Full SRV string with credentials | `mongodb+srv://photograper:photograper@cluster0.sy94kcl.mongodb.net/photography_db` |
| `DATABASE_NAME` | ⚠️ Optional | Overrides the DB name if not embedded in URI | `photography_db` |
| `CORS_ALLOWLIST` | ✅ | Comma-separated origins allowed by CORS | `https://potography-webapp.vercel.app,https://potography-webapp-website.vercel.app` |
| `EXIT_ON_DB_FAIL` | ⚠️ Optional | Set to `true` to crash the process when Mongo cannot connect (preferred in prod) | `true` |
| `PING_MESSAGE` | ⚠️ Optional | Custom message for `/api/ping` health probe | `pong` |

> Render already injects `PORT`. Do **not** commit credentials; configure them in the Render dashboard.

### Frontends (Vercel)
| Project | Variable | Value |
| --- | --- | --- |
| `potography-webapp` (Admin) | `VITE_API_URL` | `https://potography-webapp.onrender.com/api` |
| `potography-webapp-website` (Public) | `VITE_API_URL` | `https://potography-webapp.onrender.com/api` |

## Backend Deployment Checklist (Render)
1. **Service Settings**
   - Repository: `akankshaaa27/potography-webapp`
   - Branch: `main`
   - Build Command: `npm run build:server`
   - Start Command: `npm start`
   - Region: Oregon (US West)
2. **Environment**
   - Add the variables listed above.
   - Paste the two Vercel URLs (and any staging URLs) into `CORS_ALLOWLIST`.
   - If you keep local tooling such as Postman, also include `http://localhost:8080` and `http://127.0.0.1:5173`.
3. **Trigger Deploy**
   - Click *Deploy* to build (`dist/server/node-build.mjs`) and boot the Express app.
   - Watch logs: you should see `MongoDB connected successfully` and `Server running on port ...`.
4. **Smoke Test**
   ```bash
   curl https://potography-webapp.onrender.com/api/health
   curl https://potography-webapp.onrender.com/api/ping
   ```
   Confirm `status: ok` and `dbState: 1` in the JSON payload.

## Frontend Deployment Checklist (Vercel)
1. **Admin Panel**
   - Project: `potography-webapp`
   - Framework: Vite
   - Root Directory: `client`
   - Build Command: `npm run build` (Vercel auto-detects)
   - Output Directory: `dist`
   - Set `VITE_API_URL` in *Project Settings → Environment Variables*.
2. **Public Website**
   - Project: `potography-webapp-website`
   - Same build/output settings, pointing to the `website` package if/when migrated; currently it reuses the admin build if required.
3. **Redeploy** both after updating the backend so they fetch the latest schema.

## API Surface (Server)
| Route | Purpose |
| --- | --- |
| `GET /api/ping` | Lightweight uptime check.
| `GET /api/health` | Returns API + DB status plus the active CORS allowlist.
| `GET /api/db-status` | Raw mongoose `readyState` numbers for dashboards.
| `POST /api/auth/login` | Admin authentication (JWT-based).
| CRUD collections: `/api/clients`, `/api/services`, `/api/quotations`, `/api/invoices`, `/api/payments`, `/api/orders`, `/api/users`, `/api/films`, `/api/slider`, `/api/gallery`.

All routers live under `server/routes` and use the controllers in `server/controllers` to talk to MongoDB models.

## Frontend ↔ Backend Integration
- Shared Axios instance: `client/src/services/api.js` reads `import.meta.env.VITE_API_URL` (falls back to `http://localhost:5000/api`).
- All domain-specific services (`client/src/services/*.js`) import this instance, so updating the environment variable is enough for both Admin and Website builds.
- Authentication tokens (when enabled) can be appended inside the Axios request interceptor.

## Validation Flow
1. **Local**: `pnpm dev` (root) starts Vite (`http://localhost:8080`) and proxies Express. Ensure `.env` contains the same Mongo/allowlist values as Render.
2. **Backend**: hit `/api/health` and `/api/db-status`. Ready state `1` means connected.
3. **Frontends**: from the browser console run `fetch(import.meta.env.VITE_API_URL + "/ping")` to double-check env wiring after deploy.
4. **End-to-End**: create a client/invoice/quotation via Admin UI → verify the record via `GET /api/clients` and confirm it appears on the public website if surfaced.

Following this checklist keeps Vercel and Render aligned with the exact configuration that works locally.
