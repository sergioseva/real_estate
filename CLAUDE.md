# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Build & Development Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint (eslint)
```

No test framework is configured.

## Architecture

**Stack:** Next.js 16 (App Router) + React 19 + TypeScript + Supabase (PostgreSQL + Storage + Auth) + Tailwind CSS 4

**Path alias:** `@/*` maps to `./src/*`

### Supabase Clients (src/lib/supabase/)
Three clients for different contexts:
- `client.ts` — browser-side client
- `server.ts` — server-side client with cookie management (used in Server Components and Server Actions)
- `admin.ts` — service role client for privileged operations

### Server Actions (src/actions/)
All data mutations and queries go through Server Actions, not API routes:
- `properties.ts` — CRUD + filtering/pagination for properties
- `images.ts` — upload/delete/reorder property images via Supabase Storage (bucket: `property-images`)
- `tasaciones.ts` — valuation request management with Zod validation
- `auth.ts` — login/logout

### Routing
- **Public:** `/`, `/propiedades`, `/propiedades/[slug]`, `/venta`, `/alquiler`, `/tasacion`, `/nosotros`, `/contacto`
- **Admin (auth-protected via middleware):** `/admin/dashboard`, `/admin/propiedades`, `/admin/propiedades/nueva`, `/admin/propiedades/[id]/editar`, `/admin/tasaciones`

### Auth & Middleware
`middleware.ts` protects all `/admin/*` routes. Unauthenticated users redirect to `/admin/login`. Already-authenticated users on `/admin/login` redirect to `/admin/dashboard`.

### Database
Schema defined in `supabase/migrations/` (4 migration files). Main tables: `properties`, `property_images`, `tasacion_requests`. RLS policies: public read for active properties; authenticated (admin) gets full access.

### Key Patterns
- Slugs are auto-generated from property titles in `createProperty`
- Image ordering uses `display_order` field, reorderable via drag-and-drop (@dnd-kit)
- Geolocation via Leaflet maps (client-only components with dynamic import)
- `cn()` utility (clsx + tailwind-merge) for className composition
- All UI text is in Spanish
- Currency formatting handles both ARS and USD via `formatPrice()` in `src/lib/utils.ts`
- Constants (property types, operations, provinces) in `src/lib/constants.ts`

### Environment Variables
Required in `.env.local` (see `.env.local.example`):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
