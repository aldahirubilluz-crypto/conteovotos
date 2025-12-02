# Etapa 1: Builder
FROM golang:1.25-alpine AS builder

WORKDIR /app

# Instalar herramientas necesarias para compilación (si usas CGO, etc.)
RUN apk add --no-cache gcc musl-dev

# Copiar archivos de dependencias primero (mejora caché de Docker)
COPY go.mod go.sum ./
RUN go mod download

# Copiar el resto del código
COPY . .

# Compilar la aplicación
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o server ./cmd/server/main.go

# Etapa 2: Runtime (usando Alpine en lugar de distroless - más compatible)
FROM alpine:3.19

WORKDIR /app

# Instalar CA certificates para conexiones HTTPS/SSL
RUN apk add --no-cache ca-certificates tzdata && \
    update-ca-certificates

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

# Crear directorios necesarios con permisos correctos
RUN mkdir -p /app/uploads /app/logs && \
    chown -R appuser:appgroup /app

# Copiar el binario desde el builder
COPY --from=builder --chown=appuser:appgroup /app/server .

# Copiar archivos estáticos si los hay
COPY --from=builder --chown=appuser:appgroup /app/uploads ./uploads

# Cambiar al usuario no-root
USER appuser

# Variables de entorno por defecto
ENV PORT=8080
ENV HOST=0.0.0.0
ENV GIN_MODE=release

# Exponer puerto
EXPOSE 8080

# Health check para Docker Compose
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/health || exit 1

# Comando de ejecución
CMD ["/app/server"]