# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Build & Development Commands

```bash
npm run dev      # Start dev server (requires PostgreSQL running)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint (eslint)
```

### Local development with Docker

```bash
docker compose -f docker-compose.dev.yml up -d   # Start PostgreSQL
npm run dev                                        # Start Next.js
docker compose -f docker-compose.dev.yml down      # Stop PostgreSQL
```

No test framework is configured.

## Architecture

**Stack:** Next.js 16 (App Router) + React 19 + TypeScript + PostgreSQL + Tailwind CSS 4

**Path alias:** `@/*` maps to `./src/*`

### Database (src/lib/db.ts)
Direct PostgreSQL connection via `pg` pool. Helpers: `query()`, `queryOne()`, `queryCount()`. Returns empty results gracefully when no DB is available (build time).

### Auth (src/lib/auth.ts)
Custom JWT-based authentication with `jose` + `bcrypt`. Session stored in httpOnly cookie (`session`). Admin users stored in `admin_users` table.

### Server Actions (src/actions/)
All data mutations and queries go through Server Actions:
- `properties.ts` — CRUD + filtering/pagination for properties (raw SQL)
- `images.ts` — delete/reorder property images (files stored on disk at `/public/uploads/`)
- `tasaciones.ts` — valuation request management with Zod validation
- `settings.ts` — site contact info (key-value store in `site_settings` table)
- `contact.ts` — send contact emails via Resend
- `auth.ts` — login/logout with bcrypt + JWT

### API Routes (src/app/api/)
- `/api/images/upload` — POST: file upload to disk + DB insert (used by client component)
- `/api/images/[id]` — PATCH: update image description
- `/api/auth/logout` — POST: clear session
- `/api/health` — GET: DB health check

### Routing
- **Public:** `/`, `/propiedades`, `/propiedades/[slug]`, `/venta`, `/alquiler`, `/tasacion`, `/nosotros`, `/contacto`
- **Admin (auth-protected via middleware):** `/admin/dashboard`, `/admin/propiedades`, `/admin/propiedades/nueva`, `/admin/propiedades/[id]/editar`, `/admin/tasaciones`, `/admin/configuracion`

### Auth & Middleware
`src/middleware.ts` protects all `/admin/*` routes using JWT verification via `jose` (edge-compatible). Unauthenticated users redirect to `/admin/login`. Already-authenticated users on `/admin/login` redirect to `/admin/dashboard`.

### Database Schema & Migrations
Initial schema in `deploy/init/01_schema.sql`. Tables: `properties`, `property_images`, `tasacion_requests`, `site_settings`, `admin_users`. Default admin user seeded in `deploy/init/02_admin_user.sql`.

Incremental migrations live in `supabase/migrations/` (numbered `001_*.sql`, `002_*.sql`, etc.). They run automatically on app startup via `src/lib/migrate.ts`, tracked in `schema_migrations` table. For existing databases, baseline migrations (001–005) are auto-marked as applied. To add a new migration, create the next numbered `.sql` file in that directory.

### Image Storage
Property images are stored on local disk at `public/uploads/{propertyId}/{timestamp}.{ext}`. Served by Caddy directly from the uploads volume in production. The `image-uploader.tsx` client component uploads via `fetch("/api/images/upload")`.

### SEO
Dynamic sitemap (`src/app/sitemap.ts`) includes static pages + all active properties. `robots.ts` disallows `/admin/`.

### Key Patterns
- All DB-dependent pages use `export const dynamic = "force-dynamic"` (required for standalone Docker deployment)
- Slugs are auto-generated from property titles in `createProperty`
- Image ordering uses `display_order` field, reorderable via drag-and-drop (@dnd-kit)
- Geolocation via Leaflet maps (client-only components with dynamic import)
- `cn()` utility (clsx + tailwind-merge) for className composition
- All UI text is in Spanish
- Currency formatting handles both ARS and USD via `formatPrice()` in `src/lib/utils.ts`
- PostgreSQL returns `numeric` columns as strings — use `Number()` when needed
- Constants (property types, operations, provinces) in `src/lib/constants.ts`

### Deployment
Dockerized with `output: "standalone"` in next.config.ts. Production runs on DigitalOcean droplet:
- **Caddy** — reverse proxy, serves uploads from disk
- **Next.js app** — standalone Node.js server
- **PostgreSQL 16** — local database
- **Umami** — self-hosted analytics
- **CI/CD:** GitHub Actions builds and pushes to GHCR. Deploy triggered by `v*` tags via SSH.

### Environment Variables
Required in `.env.local` (see `.env.local.example`):
- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET` — secret for signing session JWTs
- `RESEND_API_KEY` — Resend email service
- `RESEND_FROM_EMAIL` — sender email address

Optional:
- `SECURE_COOKIES=true` — enable secure cookies (set when using HTTPS)
- `UMAMI_URL` — Umami analytics base URL
- `UMAMI_WEBSITE_ID` — Umami website tracking ID
