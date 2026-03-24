# Matias Perez Inmuebles

Sitio web inmobiliario con panel de administración.

## Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS 4
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **Email:** Resend
- **Mapas:** Leaflet + OpenStreetMap

## Requisitos

- Node.js 18+
- Cuenta de Supabase con las tablas creadas (ver `supabase/migrations/`)
- Variables de entorno configuradas (ver `.env.local.example`)

## Configuración

```bash
# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.local.example .env.local
# Completar con tus credenciales de Supabase y Resend

# Ejecutar las migraciones en Supabase (001 a 005 en orden)

# Iniciar en desarrollo
npm run dev
```

## Scripts

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run start    # Servidor de producción
npm run lint     # Linter
```

## Estructura

```
src/
├── actions/        # Server actions (properties, images, settings, contact, auth)
├── app/            # Páginas (App Router)
│   ├── admin/      # Panel de administración (protegido)
│   └── ...         # Páginas públicas
├── components/     # Componentes React
├── lib/            # Utilidades, constantes, clientes Supabase
└── types/          # TypeScript interfaces
supabase/
└── migrations/     # SQL migrations (001-005)
```
