# app/Dockerfile - Versión corregida

# Etapa 1: Base con Bun
FROM oven/bun:1-alpine AS base

# Etapa 2: Dependencias - CON CACHE LIMPIO
FROM base AS deps
WORKDIR /app

# Limpiar cache de Bun antes de instalar
RUN bun pm cache rm --all || true

# Copiar archivos de dependencias
COPY package.json bun.lock* ./

# Instalar con verificación forzada
RUN bun install --frozen-lockfile --force

# Etapa 3: Builder
FROM base AS builder
WORKDIR /app

# Copiar node_modules desde deps
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Configurar variables de entorno
ARG API_BASE_URL=http://backend:8080
ENV API_BASE_URL=${API_BASE_URL}
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Construir la aplicación
RUN bun run build

# Etapa 4: Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Crear usuario no-root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copiar archivos necesarios
COPY --from=builder /app/public ./public

# Para output: 'standalone' (recomendado para Docker)
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Dar permisos
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]