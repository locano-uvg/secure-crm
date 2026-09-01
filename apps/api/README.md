# `@secure-crm/api`

Backend del laboratorio: **Express + TypeScript + SQLite** (`better-sqlite3`).
Expone la API REST que consume la web y concentra la mayoría de los fallos
plantados (autenticación, autorización, consultas y configuración HTTP).

Puerto por defecto: **4000**. Health check: `GET /api/health`.

> Este servicio es **intencionalmente inseguro**. Úsalo solo en local o staging
> autorizado. Detalle del laboratorio y flujo del curso: [README raíz](../../README.md).

---

## Requisitos

- Estar en la raíz del monorepo (pnpm workspace).
- **Node.js 20+** y **pnpm 10+**, **o** Docker (ver raíz).

---

## Cómo levantarla

Desde la **raíz del repo** (recomendado):

```bash
pnpm install
pnpm seed          # crea apps/api/data/crm.db y carga usuarios/tickets
pnpm dev:api       # tsx watch → http://localhost:4000
```

Solo este paquete:

```bash
pnpm --filter @secure-crm/api seed
pnpm --filter @secure-crm/api dev
```

Producción local (después de `pnpm build` en la raíz):

```bash
pnpm --filter @secure-crm/api start
```

Con Docker, el servicio `api` de `docker-compose.yml` construye esta app, siembra
la BD al arrancar y publica el puerto **4000**.

---

## Scripts

| Script | Qué hace |
|--------|----------|
| `dev` | `tsx watch src/index.ts` (recarga al guardar) |
| `seed` | Borra y recrea usuarios y tickets de prueba |
| `build` | Compila TypeScript a `dist/` |
| `start` | `node dist/index.js` |

---

## Variables de entorno

Leídas en tiempo de ejecución (valores por defecto si no existen):

| Variable | Descripción | Default |
|----------|-------------|---------|
| `API_PORT` | Puerto HTTP | `4000` |
| `JWT_SECRET` | Secreto con el que se firman los JWT | `secret123` |

El ejemplo vive en [`.env.example`](../../.env.example) de la raíz. Los defaults
bastan para el laboratorio.

---

## Cuentas que crea el seed

| Rol | Usuario | Contraseña |
|-----|---------|------------|
| `admin` | `admin` | `Admin123!` |
| `agent` | `jperez` | `Password1` |
| `agent` | `mlopez` | `qwerty123` |
| `viewer` | `viewer` | `viewer` |

La base queda en `data/crm.db` (ignorada por git). Si la corrompes o quieres
un estado limpio: vuelve a ejecutar `pnpm seed` desde la raíz.

---

## Superficie HTTP

Prefijo `/api`. Las rutas de tickets, usuarios y dashboard esperan
`Authorization: Bearer <token>` o la cookie `session` que setea el login.

| Método | Ruta | Propósito |
|--------|------|-----------|
| `GET` | `/api/health` | Estado del servicio |
| `POST` | `/api/auth/login` | Autenticación; responde `{ token, user }` |
| `GET` | `/api/dashboard` | Métricas del panel |
| `GET` | `/api/tickets` | Listado; query `?q=` busca en título, descripción y cliente |
| `GET` | `/api/tickets/:id` | Detalle |
| `POST` | `/api/tickets` | Alta |
| `PUT` | `/api/tickets/:id` | Edición |
| `DELETE` | `/api/tickets/:id` | Baja |
| `GET` | `/api/users` | Listado |
| `GET` | `/api/users/:id` | Detalle |
| `POST` | `/api/users` | Alta |
| `PUT` | `/api/users/:id/role` | Cambio de rol |

Tipos compartidos con la web: [`@secure-crm/shared`](../../packages/shared/src/index.ts).

---

## Estructura

```
apps/api/
├─ src/
│  ├─ index.ts              # Express, CORS, health, routers, errores
│  ├─ db.ts                 # SQLite + esquema
│  ├─ seed.ts               # Datos de prueba
│  ├─ auth.ts               # Login y emisión de JWT
│  ├─ hash.ts               # Hash de contraseñas
│  ├─ middleware/auth.ts    # Lectura del token en rutas protegidas
│  └─ routes/
│     ├─ tickets.ts
│     ├─ users.ts
│     └─ dashboard.ts
├─ data/                    # crm.db (generada, no se versiona)
├─ Dockerfile
└─ package.json
```

---

## Notas

- `better-sqlite3` es un módulo nativo: si `pnpm install` no lo compila, usa
  `pnpm approve-builds` en la raíz o levanta con Docker.
- La web espera esta API en `NEXT_PUBLIC_API_URL` (por defecto
  `http://localhost:4000`). Si cambias `API_PORT`, actualiza esa URL.
- No publiques este contenedor ni esta BD fuera del laboratorio.
