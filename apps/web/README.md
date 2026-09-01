# `@secure-crm/web`

Frontend del laboratorio: **Next.js 14 (App Router) + TypeScript + Tailwind**.
Es la mesa de tickets que consume [`@secure-crm/api`](../api/README.md) desde el
navegador.

Puerto por defecto: **3000**.

> La interfaz es el campo de práctica del DAST (ZAP / Burp contra
> `http://localhost:3000`). El contexto del curso está en el
> [README raíz](../../README.md).

---

## Requisitos

- Estar en la raíz del monorepo (pnpm workspace).
- La API debe estar arriba (o usa `pnpm dev` en la raíz, que levanta ambas).
- **Node.js 20+** y **pnpm 10+**, **o** Docker (ver raíz).

---

## Cómo levantarla

Desde la **raíz del repo** (recomendado):

```bash
pnpm install
pnpm seed          # necesario para poder iniciar sesión
pnpm dev           # API + Web
# o solo el frontend, si la API ya corre:
pnpm dev:web
```

Solo este paquete:

```bash
pnpm --filter @secure-crm/web dev
```

Abre **http://localhost:3000**. Sin sesión te redirige a `/login`.

Producción local (después de `pnpm build` en la raíz):

```bash
pnpm --filter @secure-crm/web start
```

Con Docker, el servicio `web` de `docker-compose.yml` hornea
`NEXT_PUBLIC_API_URL=http://localhost:4000` en el build y publica el puerto **3000**.

---

## Scripts

| Script | Qué hace |
|--------|----------|
| `dev` | `next dev -p 3000` |
| `build` | Build de producción |
| `start` | `next start -p 3000` |
| `lint` | ESLint de Next |

---

## Variables de entorno

Las variables `NEXT_PUBLIC_*` se inyectan en el bundle del navegador
(en Docker, en **tiempo de build**).

| Variable | Descripción | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Origen de la API | `http://localhost:4000` |
| `NEXT_PUBLIC_SHOW_SOLUTIONS` | Reservada para el instructor | `false` |

Copia [`.env.example`](../../.env.example) en la raíz. Si cambias el puerto de
la API, este valor y `API_PORT` deben coincidir.

El cliente HTTP vive en `lib/api.ts`: guarda el JWT en `localStorage` y lo envía
como `Authorization: Bearer`.

---

## Rutas

| Ruta | Qué muestra |
|------|-------------|
| `/` | Redirige a `/dashboard` o `/login` según haya sesión |
| `/login` | Formulario de acceso |
| `/dashboard` | KPIs y gráficos |
| `/tickets` | Listado y búsqueda (`?q=`) |
| `/tickets/new` | Alta de ticket |
| `/tickets/[id]` | Detalle y edición |
| `/admin` | Usuarios y roles (enlace visible solo para `admin`) |

Cuentas de prueba: ver [README de la API](../api/README.md#cuentas-que-crea-el-seed)
o el [README raíz](../../README.md#cuentas-de-prueba).

---

## Estructura

```
apps/web/
├─ app/
│  ├─ layout.tsx
│  ├─ page.tsx                 # redirect según sesión
│  ├─ globals.css
│  ├─ login/page.tsx
│  ├─ dashboard/page.tsx
│  ├─ admin/page.tsx
│  └─ tickets/
│     ├─ page.tsx
│     ├─ new/page.tsx
│     └─ [id]/page.tsx
├─ components/
│  ├─ AppShell.tsx             # layout autenticado + nav
│  ├─ useAuth.ts
│  ├─ ui.tsx
│  ├─ charts.tsx
│  └─ brand.tsx
├─ lib/api.ts                  # cliente REST
├─ public/brand/
├─ Dockerfile
└─ package.json
```

Tipos de `User`, `Ticket`, etc.: [`@secure-crm/shared`](../../packages/shared/src/index.ts)
(`transpilePackages` en `next.config.mjs`).

---

## Notas

- El proxy de ZAP/Burp debe apuntar a **esta** origen (`:3000`) para ver el
  tráfico del navegador; las llamadas salen hacia `:4000`.
- No hace falta un `.env` dentro de `apps/web` si usas los defaults.
- Guía del alumno (ZAP, Burp, CVSS, tablero de retos):
  [`docs/guia-laboratorio.html`](../../docs/guia-laboratorio.html).
