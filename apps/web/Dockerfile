# =============================================================
# apps/web/Dockerfile
# Contexto de build: raíz del monorepo (context: .)
#
# Las variables VITE_* DEBEN llegar como build args — no como
# env_file en runtime. Vite las incrusta en el bundle JS
# estático durante el build. En runtime solo corre Nginx,
# no hay proceso Node que pueda leer variables de entorno.
# =============================================================

# ── Base: node + pnpm ────────────────────────────────────────
FROM node:20-alpine AS base
RUN npm install -g pnpm@9


# ── Stage 1: Build ───────────────────────────────────────────
FROM base AS builder
WORKDIR /app

# Variables de entorno para Vite — deben estar disponibles
# cuando se ejecuta `vite build`, no en runtime.
ARG VITE_API_URL
ARG VITE_BRAND_NAME
ARG VITE_WHATSAPP_NUMBER
ARG VITE_CONTACT_EMAIL
ARG VITE_SITE_URL
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_BRAND_NAME=$VITE_BRAND_NAME
ENV VITE_WHATSAPP_NUMBER=$VITE_WHATSAPP_NUMBER
ENV VITE_CONTACT_EMAIL=$VITE_CONTACT_EMAIL
ENV VITE_SITE_URL=$VITE_SITE_URL
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

# Manifiestos → layer cache
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY tsconfig.json ./

COPY packages/types/package.json           ./packages/types/
COPY packages/utils/package.json           ./packages/utils/
COPY packages/ui/package.json              ./packages/ui/
COPY packages/tailwind-config/package.json ./packages/tailwind-config/

COPY apps/web/package.json ./apps/web/

RUN pnpm install --frozen-lockfile

# Código fuente
COPY packages/ ./packages/
COPY apps/web/ ./apps/web/

# Vite lee las ENV vars del proceso y las incrusta en dist/
RUN pnpm --filter @surf-app/web build


# ── Stage 2: Nginx ───────────────────────────────────────────
FROM nginx:alpine AS runner

# Archivos estáticos compilados
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

# Configuración de Nginx (copiada desde el contexto de build)
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
