# Deploying ThrottleX Backend to Render

This guide explains how to deploy the ThrottleX backend to [Render](https://render.com).

---

## Prerequisites

- A free or paid [Render](https://render.com) account
- An external Redis instance (see [Redis Setup](#redis-setup) below)

---

## Quick Start (render.yaml)

The repository includes a `render.yaml` at the project root that configures the
backend service automatically.

1. Fork or push this repository to GitHub.
2. In the Render dashboard click **New → Blueprint** and connect your repository.
3. Render detects `render.yaml` and pre-fills the service configuration.
4. Set the **required** environment variables listed below before the first deploy.

---

## Environment Variables

Copy `backend/.env.production.example` and set each value in the Render dashboard
under **Environment → Environment Variables**.

### Required

| Variable | Description |
|---|---|
| `REDIS_URL` | Full connection URL for your Redis instance (see below) |
| `ADMIN_API_KEY` | Secret key for admin endpoints — use a strong random value |

### Recommended

| Variable | Default | Description |
|---|---|---|
| `NODE_ENV` | `production` | Runtime environment |
| `PORT` | `3000` | HTTP port (Render sets this automatically) |
| `LOG_LEVEL` | `info` | Logging verbosity (`debug`, `info`, `warn`, `error`) |
| `REDIS_TLS` | `false` | Set `true` when using a TLS-enabled Redis URL (`rediss://`) |
| `GEO_ENABLED` | `false` | Disable on Render free tier (no persistent disk for GeoIP DB) |

All other variables have sensible defaults and can be left at their defaults for a
basic deployment. See `backend/.env.production.example` for the full list.

---

## Redis Setup

ThrottleX requires Redis for distributed rate limiting. Render's **free tier** does
not include a managed Redis instance, so you must connect an external one.

### Option A — Upstash (Recommended for Free Tier)

[Upstash](https://upstash.com) offers a generous free tier with a serverless Redis
that works well with Render.

1. Sign up at <https://upstash.com> and create a new Redis database.
2. Choose the region closest to your Render service region.
3. Copy the **Redis URL** from the Upstash console (use the **TLS** URL).
4. In Render, set:
   ```
   REDIS_URL=rediss://:your-password@hostname.upstash.io:6379
   REDIS_TLS=true
   ```

### Option B — Redis Cloud

[Redis Cloud](https://redis.com/try-free/) also provides a 30 MB free database.

1. Create a free subscription at <https://redis.com/try-free/>.
2. Copy the public endpoint and password.
3. In Render, set:
   ```
   REDIS_URL=redis://:your-password@redis-12345.c1.us-east-1-2.ec2.cloud.redislabs.com:12345
   ```

### Option C — Render Redis (Paid Tier)

If you are on a paid Render plan, you can create a managed Redis service:

1. In the Render dashboard click **New → Redis**.
2. Choose a region and plan.
3. After creation, click **Connect** and copy the **Internal Redis URL**.
4. In your backend service environment variables, set:
   ```
   REDIS_URL=<Internal Redis URL>
   ```

---

## Manual Service Setup (without render.yaml)

If you prefer to configure the service manually in the Render dashboard:

| Setting | Value |
|---|---|
| **Environment** | Node |
| **Region** | Your preferred region |
| **Root Directory** | `backend` |
| **Build Command** | `npm install; npm run build` |
| **Start Command** | `npm start` |
| **Health Check Path** | `/health` |

Then add all environment variables from `backend/.env.production.example`.

---

## Health Checks

Once deployed, the following endpoints are available:

| Endpoint | Description |
|---|---|
| `GET /health` | Full health status (Redis + memory) |
| `GET /health/live` | Liveness probe (always returns 200 if process is running) |
| `GET /health/ready` | Readiness probe (200 only when Redis is connected) |
| `GET /metrics` | Prometheus metrics |
| `GET /api-docs` | Swagger UI documentation |

The readiness probe (`/health/ready`) returns **503** when Redis is unavailable.
Render uses the health check path (`/health`) to determine if the service is live.

---

## Fallback Behaviour (No Redis)

When `REDIS_URL` is **not set**, the backend:

- Logs a warning at startup: `REDIS_URL is not set — Redis is disabled.`
- Uses an **in-memory fallback rate limiter** for all requests.
- Remains fully functional as a single-instance deployment.
- Is **not suitable for multi-instance (horizontal) scaling** — each instance
  maintains its own independent counter state.

Set `REDIS_URL` to enable distributed, consistent rate limiting across instances.

---

## Troubleshooting

### "Redis error" / "max reconnection attempts reached"

**Cause:** `REDIS_URL` is not set or points to an unreachable host.

**Fix:**
1. Verify `REDIS_URL` is set in Render → Environment → Environment Variables.
2. Confirm the Redis host is reachable from your Render service region.
3. If using TLS (`rediss://`), ensure `REDIS_TLS=true` is also set.

### Service restarts continuously

**Cause:** An uncaught exception is crashing the process.

**Fix:** Check the Render logs for `[ERROR] Uncaught exception` or `Failed to start server`.
Common causes: missing required environment variables, TypeScript build failure.

### Build succeeds but `npm start` fails with "Cannot find module"

**Cause:** TypeScript compilation did not produce the expected output file
(`dist/main/server.js`).

**Fix:** Ensure the `build` script runs `tsc` successfully. Check that `tsconfig.json`
has `"outDir": "dist"` and `"rootDir": "src"`.
