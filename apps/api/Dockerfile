# =============================================================
# apps/api/Dockerfile
# Contexto de build: raíz del monorepo (context: .)
# =============================================================

# ── Base: node + pnpm ────────────────────────────────────────
FROM node:20-alpine AS base
RUN npm install -g pnpm@9


# ── Stage 1: Instalar dependencias ───────────────────────────
FROM base AS deps
WORKDIR /app

# Copiar manifiestos primero → layer cache: solo se re-ejecuta
# pnpm install si cambia algún package.json o el lockfile
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY tsconfig.json ./

# Manifiestos de packages compartidos
COPY packages/types/package.json         ./packages/types/
COPY packages/utils/package.json         ./packages/utils/
COPY packages/ui/package.json            ./packages/ui/
COPY packages/tailwind-config/package.json ./packages/tailwind-config/

# Manifiesto de la API
COPY apps/api/package.json ./apps/api/

# Instalar todas las dependencias (incluyendo dev, necesarias para compilar TS)
RUN pnpm install --frozen-lockfile


# ── Stage 2: Compilar TypeScript ─────────────────────────────
FROM deps AS builder
WORKDIR /app

# Copiar packages compartidos (tipos, utils — compilados en el bundle)
COPY packages/ ./packages/

# Copiar código fuente de la API
COPY apps/api/ ./apps/api/

# Compilar TypeScript → genera dist/
RUN pnpm --filter @surf-app/api build

# Crear bundle de producción con solo las dependencias runtime.
# pnpm deploy resuelve workspace deps, elimina devDependencies
# y produce un directorio autónomo sin symlinks.
RUN pnpm --filter @surf-app/api deploy --prod /deploy


# ── Stage 3: Runner de producción ────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Solo lo necesario en runtime:
# - node_modules de producción (de pnpm deploy, sin symlinks)
# - dist/ compilado (contiene todo el código, incluidos packages compartidos)
COPY --from=builder /deploy/node_modules ./node_modules
COPY --from=builder /app/apps/api/dist   ./dist

EXPOSE 3000

CMD ["node", "dist/main.js"]
