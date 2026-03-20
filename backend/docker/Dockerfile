# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS production

ENV NODE_ENV=production

WORKDIR /app

RUN addgroup -g 1001 -S nodejs && adduser -S throttlex -u 1001

RUN mkdir -p /app/logs && chown -R throttlex:nodejs /app/logs

COPY package*.json ./
RUN npm install --omit=dev && npm cache clean --force

COPY --from=builder --chown=throttlex:nodejs /app/dist ./dist

USER throttlex

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q --spider http://localhost:3000/health/live || exit 1

CMD ["node", "dist/main/server.js"]
