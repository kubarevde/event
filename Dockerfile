# syntax=docker/dockerfile:1

# ---------- зависимости ----------
FROM node:22-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# better-sqlite3 поставляется с готовыми бинарниками (prebuilds), компиляция не нужна
RUN npm ci --ignore-scripts

# ---------- сборка ----------
FROM node:22-bookworm-slim AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---------- запуск ----------
FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    DATA_DIR=/app/storage \
    GEOIP_DIR=/app/geoip

COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
# Офлайн-база городов по IP (DB-IP Lite, CC BY 4.0) — standalone-сборка её не подхватывает сама
COPY --from=deps --chown=node:node /app/node_modules/@ip-location-db/dbip-city-mmdb ./geoip
RUN mkdir -p /app/storage && chown node:node /app/storage

USER node
EXPOSE 3000
VOLUME ["/app/storage"]

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/admin/login').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
