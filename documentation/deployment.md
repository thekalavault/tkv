# Deployment and DevOps Guide

## Architecture
- Backend and frontend run on the same server (no containers)
- NGINX reverse proxy routes `/api` to the backend and serves static files for the frontend
- PostgreSQL hosted in a managed service or self‑hosted with backups
- Redis for caching and queue persistence
- Cloudflare R2 for artwork media storage

## Self‑Hosted Deployment (No Docker)
1. **Install Node ≥ 18** on the server.
2. **Clone the repo** and run `npm ci` in `backend/` and `frontend/`.
3. **Build the frontend**: `cd frontend && npm run build`. The compiled assets appear in `frontend/dist`.
4. **Build the backend**: `cd backend && npm run build`. The compiled server lives in `backend/dist`.
5. **Create a real `.env`** from `.env.example` and fill in production secrets.
6. **Run the API** with a process manager, e.g. `pm2 start dist/server.js --name kalavault-backend`.
7. **Serve static files** with Nginx (or Apache) pointing `root` to `frontend/dist` and proxy `/api/*` to `http://127.0.0.1:4000`.
8. **Enable HTTPS** via Let’s Encrypt and secure headers.
9. **Optional**: add a health‑check script that curls `http://127.0.0.1:4000/health`.

## CI/CD
- GitHub Actions pipeline includes:
  - `lint` checks for backend and frontend
  - `type-check` for TypeScript
  - `test` stage for unit and integration tests
  - `build` stage for production assets
  - `deploy` stage for staging and production (runs the steps above)

## Environment config
- Separate secrets for `development`, `staging`, and `production`
- Backend environment keys:
  - `DATABASE_URL`
  - `REDIS_URL`
  - `JWT_SECRET`
  - `JWT_REFRESH_SECRET`
  - `CLOUDFLARE_R2_ACCOUNT_ID`
  - `CLOUDFLARE_R2_ACCESS_KEY`
  - `CLOUDFLARE_R2_SECRET_KEY`
  - `RAZORPAY_KEY_ID`
  - `RAZORPAY_KEY_SECRET`
  - `ZOHO_SIGN_CLIENT_ID`
  - `ZOHO_SIGN_CLIENT_SECRET`

## NGINX
- Proxy `/api/v1/` to backend
- Proxy static assets and frontend SSR to frontend directory
- Use TLS certificate and HSTS

## Backup strategy
- PostgreSQL: daily logical backups, weekly PITR snapshots
- Redis: AOF + RDB snapshots depending on persistence requirements
- R2: object lifecycle with versioning and retention for media backups

## Monitoring and logging
- Structured logs from backend with correlation IDs
- Application metrics for API latency, queue backlog, billing events
- Alerting for failed webhook processing, payment retries, and contract renewals

## Production hardening
- Enable HTTPS only
- Restrict admin routes with IP whitelisting and RBAC
- Validate webhooks using signatures
- Use signed URLs for protected image delivery
- Rotate refresh tokens and revoke stale sessions
