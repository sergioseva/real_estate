# Matias Perez Inmuebles

Sitio web inmobiliario con panel de administración.

## Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS 4
- **Backend:** PostgreSQL 16 (directo via `pg`)
- **Auth:** JWT (jose + bcrypt)
- **Email:** Resend
- **Mapas:** Leaflet + OpenStreetMap
- **Analytics:** Umami (self-hosted)
- **Deploy:** Docker + Caddy + GitHub Actions

## Desarrollo local

```bash
# Instalar dependencias
npm install

# Levantar PostgreSQL
docker compose -f docker-compose.dev.yml up -d

# Copiar variables de entorno
cp .env.local.example .env.local
# Completar con tus valores

# Iniciar en desarrollo
npm run dev
```

Admin por defecto: `admin@matiasperezinmuebles.com` / `admin123`

## Scripts

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run start    # Servidor de producción
npm run lint     # Linter
```

## Deploy a producción

```bash
# Build y push de imagen Docker
docker build -t ghcr.io/sergioseva/real_estate:latest .
docker push ghcr.io/sergioseva/real_estate:latest

# En el servidor
cd /aplicaciones/real-estate/docker
docker compose pull app
docker compose up -d app
```

O via GitHub Actions: pushear un tag `v*` deploya automáticamente.

```bash
git tag v1.0.0
git push origin main --tags
```

## Estructura

```
src/
├── actions/        # Server actions (properties, images, settings, contact, auth)
├── app/            # Páginas (App Router)
│   ├── admin/      # Panel de administración (protegido)
│   ├── api/        # API routes (images upload, health, auth)
│   └── ...         # Páginas públicas
├── components/     # Componentes React
├── lib/            # db.ts, auth.ts, utils, constants
└── types/          # TypeScript interfaces
deploy/
├── docker-compose.yml   # Producción (Caddy + App + PostgreSQL + Umami)
├── Caddyfile            # Reverse proxy config
└── init/                # SQL schema + admin user seed
```
