# Deploying ThrottleX Backend to Render

This guide walks you through deploying the ThrottleX backend service to [Render](https://render.com) using [Upstash Redis](https://upstash.com) as the managed Redis provider.

---

## Prerequisites

- A [Render](https://render.com) account
- A [GitHub](https://github.com) account (repository already connected)
- A free [Upstash](https://console.upstash.com) account

---

## 1. Set Up Upstash Redis

1. Log in to [Upstash Console](https://console.upstash.com).
2. Click **Create Database**.
3. Choose a name (e.g. `throttlex`), select the region closest to your Render region, and click **Create**.
4. Open the database and go to the **REST API** tab.
5. Copy the two values you need:

   | Variable | Where to find it |
   |---|---|
   | `UPSTASH_REDIS_REST_URL` | **Endpoint** field (e.g. `https://huge-orca-78896.upstash.io`) |
   | `UPSTASH_REDIS_REST_TOKEN` | **Token** field (long base64 string) |

---

## 2. Deploy on Render

### Option A — Automatic (using `render.yaml`)

The repository includes a `render.yaml` blueprint at the repo root.

1. Go to [Render Dashboard](https://dashboard.render.com) → **New** → **Blueprint**.
2. Connect your GitHub repository (`SUPAM07/ThrottleX`).
3. Render detects `render.yaml` automatically.
4. During setup, fill in the two secret environment variables:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
5. Click **Apply** — Render builds and deploys the backend.

### Option B — Manual service configuration

1. Go to [Render Dashboard](https://dashboard.render.com) → **New** → **Web Service**.
2. Connect the `SUPAM07/ThrottleX` repository.
3. Configure the service:

   | Setting | Value |
   |---|---|
   | **Root Directory** | `backend` |
   | **Environment** | `Node` |
   | **Build Command** | `npm install && npm run build` |
   | **Start Command** | `npm start` |
   | **Health Check Path** | `/health` |

4. Click **Environment** and add the variables listed in [Environment Variables](#environment-variables).
5. Click **Create Web Service**.

---

## 3. Environment Variables

Set these in **Render Dashboard → Your Service → Environment**.

### Required

| Variable | Description | Example |
|---|---|---|
| `UPSTASH_REDIS_REST_URL` | Upstash database REST endpoint | `https://huge-orca-78896.upstash.io` |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash REST auth token | `gQAAAAA...` |
| `NODE_ENV` | Must be `production` | `production` |
| `ADMIN_API_KEY` | Secret key for admin endpoints | *(generate a random string)* |

### Optional (with defaults)

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3000` | HTTP port |
| `HOST` | `0.0.0.0` | Bind address |
| `LOG_LEVEL` | `info` | Logging verbosity (`debug`, `info`, `warn`, `error`) |
| `DEFAULT_RATE_LIMIT` | `100` | Default requests per window |
| `DEFAULT_WINDOW_MS` | `60000` | Default window in ms |
| `DEFAULT_ALGORITHM` | `token_bucket` | Rate limiting algorithm |
| `ADAPTIVE_ENABLED` | `true` | Enable adaptive rate limiting |
| `GEO_ENABLED` | `true` | Enable geo-IP detection |
| `METRICS_ENABLED` | `true` | Expose Prometheus metrics |
| `CIRCUIT_BREAKER_THRESHOLD` | `5` | Failures before circuit opens |
| `CIRCUIT_BREAKER_TIMEOUT_MS` | `30000` | Circuit breaker reset timeout |

> A full template is available in [`backend/.env.production.example`](./backend/.env.production.example).

---

## 4. How Upstash Credentials Work

The app supports two ways to connect to Redis:

### Using Upstash REST credentials (recommended)

Set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.  
The app automatically converts these into a TLS-enabled ioredis connection:

```
rediss://default:<UPSTASH_REDIS_REST_TOKEN>@<host>:6380
```

No additional configuration is needed.

### Using a standard Redis URL

Set `REDIS_URL` to a full `redis://` or `rediss://` connection string.  
This works with any Redis provider (Render Redis, Redis Cloud, self-hosted, etc.).

```
REDIS_URL=rediss://default:<password>@<host>:<port>
REDIS_TLS=true
```

---

## 5. Health Check

Once deployed, verify the service is healthy:

```bash
curl https://<your-service>.onrender.com/health
```

Expected response:

```json
{
  "status": "ok",
  "redis": "connected",
  ...
}
```

---

## 6. API Endpoints

| Endpoint | Description |
|---|---|
| `GET /health` | Health check (used by Render) |
| `GET /metrics` | Prometheus metrics |
| `POST /rate-limit/check` | Check a rate limit |
| `GET /api-docs` | Swagger UI documentation |

---

## 7. Troubleshooting

### Redis connection errors at startup

```
[ERROR] Redis error {"error":""}
[WARN]  Redis: max reconnection attempts reached
```

**Cause**: `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` are not set (or are wrong).  
**Fix**: Double-check the values in **Render → Environment**. Trigger a manual redeploy after saving.

---

### Service shows `development` instead of `production`

**Cause**: `NODE_ENV` is not set.  
**Fix**: Add `NODE_ENV=production` in Render environment variables.

---

### Build fails: `tsc` not found

**Cause**: TypeScript devDependencies weren't installed.  
**Fix**: Make sure the build command is `npm install && npm run build` (not `npm install --production`).

---

### `npm start` fails immediately

**Cause**: `dist/` folder is missing — the TypeScript build step didn't run.  
**Fix**: Confirm build command includes `npm run build` and check Render build logs for TypeScript errors.
