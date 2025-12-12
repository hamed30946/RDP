# Sora Internal Downloader

Private, audit-ready media resolver inspired by snapsora.net layout. Uses Next.js App Router, NextAuth, Prisma, BullMQ, Redis, and MinIO.

## Features
- Direct URL or asset registry resolution with SSRF protection and allowlist enforcement
- Bulk downloader with Redis queue + worker
- Admin console for allowlist, limits, and audit log visibility
- S3-compatible storage with signed download links
- Rate limiting and audit logging for every action

## Getting started
1. Copy `.env.example` to `.env.local` and fill values.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Generate Prisma client and run migrations:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```
4. Start services via Docker Compose:
   ```bash
   docker compose up
   ```
5. Run the Next.js app:
   ```bash
   npm run dev
   ```
6. Start the worker:
   ```bash
   npm run worker
   ```

## Environment variables
- `DATABASE_URL` Postgres connection string
- `REDIS_HOST` / `REDIS_PORT`
- `S3_ENDPOINT`, `S3_PORT`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`, `S3_BUCKET`, `S3_USE_SSL`
- `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
- `ALLOWLIST_DOMAINS` fallback domains

## Acceptance checklist
- [x] Home resolves direct media URLs and asset IDs
- [x] Bulk queue with per-row status and CSV/copy helpers
- [x] Admin allowlist + limits + audit log view
- [x] Theme toggle persists (next-themes)
- [x] Audit logging on resolves, jobs, and downloads
- [x] robots.txt disables indexing

## Safety notes
- No watermark removal, DRM bypass, or scraping behind authentication
- SSRF protection and domain allowlist enforced on resolution
