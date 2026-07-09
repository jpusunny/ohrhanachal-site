# syntax=docker/dockerfile:1.7
# BuildKit cache mounts below make repeat deploys ~3x faster:
#   /root/.npm  keeps the npm download cache warm between builds
#   /app/.next/cache  keeps Next.js's incremental build cache warm
# Requires BUILDKIT enabled (Coolify's Docker daemon has it on by default).
FROM node:22-slim AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN --mount=type=cache,target=/root/.npm \
    if [ -f package-lock.json ]; then npm ci --prefer-offline --no-audit; else npm install --prefer-offline --no-audit; fi

FROM node:22-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN --mount=type=cache,target=/app/.next/cache \
    npm run build

FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN apt-get update && apt-get install -y --no-install-recommends curl \
 && rm -rf /var/lib/apt/lists/*

RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=10s --timeout=3s --start-period=15s --retries=5 \
  CMD curl -fsS http://127.0.0.1:3000/ || exit 1

CMD ["node", "server.js"]
