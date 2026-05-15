# =============================================================
# apps/dashboard/Dockerfile
# Contexto de build: raíz del monorepo (context: .)
#
# Las variables VITE_* son build args — Vite las incrusta en
# el bundle estático. En runtime solo corre Nginx.
# =============================================================

# ── Base: node + pnpm ────────────────────────────────────────
FROM node:20-alpine AS base
RUN npm install -g pnpm@9


# ── Stage 1: Build ───────────────────────────────────────────
FROM base AS builder
WORKDIR /app

ARG VITE_API_URL
ARG VITE_BRAND_NAME

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_BRAND_NAME=$VITE_BRAND_NAME

# Manifiestos → layer cache
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY tsconfig.json ./

COPY packages/types/package.json           ./packages/types/
COPY packages/utils/package.json           ./packages/utils/
COPY packages/ui/package.json              ./packages/ui/
COPY packages/tailwind-config/package.json ./packages/tailwind-config/

COPY apps/dashboard/package.json ./apps/dashboard/

RUN pnpm install --frozen-lockfile

# Código fuente
COPY packages/ ./packages/
COPY apps/dashboard/ ./apps/dashboard/

RUN pnpm --filter @surf-app/dashboard build


# ── Stage 2: Nginx ───────────────────────────────────────────
FROM nginx:alpine AS runner

COPY --from=builder /app/apps/dashboard/dist /usr/share/nginx/html
COPY apps/dashboard/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
