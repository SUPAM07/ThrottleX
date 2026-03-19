# 🚀 Distributed Rate Limiter

> Production-ready distributed rate limiter with **5 algorithms**, **Redis backing**, **adaptive ML rate limiting**, and **geographic awareness**.

[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org)
[![Redis](https://img.shields.io/badge/Redis-7.2-red.svg)](https://redis.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🏃 **High Performance** | 50,000+ requests/second with <2ms P95 latency |
| 🎯 **5 Algorithms** | Token Bucket, Sliding Window, Fixed Window, Leaky Bucket, Composite |
| 🤖 **Adaptive ML** | EMA + Z-score anomaly detection for automatic limit optimization |
| 🌍 **Geo Limiting** | Country-level limits with Cloudflare/CloudFront CDN header support |
| 🌐 **Distributed** | Redis-backed atomic Lua scripts for multi-instance safety |
| ⚡ **Production Ready** | Circuit breaker, fallback limiter, Prometheus metrics |
| 🛡️ **Thread Safe** | Atomic Redis operations — no race conditions |
| 📊 **Rich Metrics** | Prometheus + P50/P95/P99 latency histograms |
| 🧪 **Tested** | Vitest unit + integration + load test suites |
| 🐳 **Container Ready** | Multi-stage Dockerfile + Docker Compose + Kubernetes manifests |

---

## 📁 Project Structure

```
distributed-rate-limiter/
├── src/
│   ├── adaptive/           # ML-driven adaptive rate limiting (EMA + Z-score)
│   ├── config/             # Redis, algorithm, admin, geo, OpenAPI configs
│   ├── controllers/        # Express route handlers
│   ├── geo/                # Geographic rate limiting + compliance zones
│   ├── middlewares/        # Rate limit, API key auth, geo, error handler
│   ├── models/             # TypeScript interfaces and DTOs
│   ├── observability/      # Prometheus metrics, health checks
│   ├── ratelimit/
│   │   ├── algorithms/     # 5 algorithm implementations
│   │   ├── core/           # Factory, interfaces
│   │   └── keys/           # Redis key generation
│   ├── redis/
│   │   └── luaScripts/     # Atomic Lua scripts (1 per algorithm)
│   ├── resilience/         # Circuit breaker, fallback, retry
│   ├── routes/             # Express routers
│   ├── security/           # API keys, IP extraction, tenant resolution
│   ├── services/           # Business logic orchestration
│   ├── utils/              # Logger, constants, helpers, validation
│   ├── app.ts              # Express app
│   └── server.ts           # Entry point with graceful shutdown
├── tests/
│   ├── unit/               # 7 unit test files
│   ├── integration/        # 3 integration test files
│   └── load/               # Load & stress tests
├── docker/                 # Dockerfile + Docker Compose
├── k8s/                    # Kubernetes base manifests + environments
├── scripts/                # benchmark.sh, redis-init.sh
└── docs/                   # Architecture, algorithm deep-dives
```

---

## 🚀 Quick Start

### Using Docker Compose (Recommended)

```bash
# Clone & start
git clone <repo-url>
cd distributed-rate-limiter

# Start Redis + app
docker-compose -f docker/docker-compose.yml up --build -d

# Verify
curl http://localhost:3000/health
```

### Local Development

```bash
# Prerequisites: Node 20+, Redis running on localhost:6379

npm install
cp .env .env.local   # customize as needed
npm run dev          # ts-node-dev hot reload

# Run tests (no Redis needed for unit tests)
npm test
```

---

## 📡 API Reference

### Rate Limit Check
```http
POST /rate-limit/check
Content-Type: application/json

{
  "key": "user:12345",
  "algorithm": "token_bucket",
  "limit": 100,
  "windowMs": 60000
}
```
**Response:**
```json
{
  "allowed": true,
  "remaining": 99,
  "limit": 100,
  "resetMs": 1736000000000,
  "algorithm": "token_bucket",
  "key": "user:12345",
  "latencyMs": 1
}
```

### Health Check
```http
GET /health           # Full health status
GET /health/live      # Liveness probe
GET /health/ready     # Readiness probe
```

### Metrics
```http
GET /metrics          # Prometheus text format
GET /metrics/json     # JSON snapshot
```

### Admin (requires X-Admin-Key header)
```http
GET    /admin/limits           # List all overrides
POST   /admin/limits           # Set a limit override
DELETE /admin/limits/:key      # Remove an override
```

### Benchmark
```http
POST /benchmark/run
{
  "scenario": "sustained",
  "concurrency": 50,
  "durationMs": 10000,
  "algorithm": "sliding_window"
}
```

---

## 🎯 Algorithms

| Algorithm | Best For | Atomic Op | Key Type |
|-----------|----------|-----------|----------|
| **Token Bucket** | APIs with burst allowance | HSET/HGET | Hash |
| **Sliding Window** | Precise fairness | ZADD/ZRANGE | Sorted Set |
| **Fixed Window** | Simple counters | INCR/EXPIRE | String |
| **Leaky Bucket** | Traffic shaping | HSET/HGET | Hash |
| **Composite** | Multi-dimensional limits | Combined | Multiple |

---

## 🤖 Adaptive ML Rate Limiting

The adaptive engine uses **Exponential Moving Average (EMA)** tracking + **Z-score anomaly detection** to automatically adjust limits:

```
Signal Types:
  THROTTLE   → Traffic spike detected (z-score > 2.5) → reduce limit
  SCALE_UP   → Traffic drop detected → relax limit
  ALERT      → High rejection rate (>80%) → notify
  STABLE     → Normal operation
```

Enable with `ADAPTIVE_ENABLED=true` in `.env`.

---

## 📊 Response Headers

Every rate-limited response includes:

| Header | Description |
|--------|-------------|
| `X-RateLimit-Limit` | Maximum requests allowed |
| `X-RateLimit-Remaining` | Requests remaining in window |
| `X-RateLimit-Reset` | Unix timestamp of window reset |
| `X-RateLimit-Algorithm` | Algorithm used |
| `Retry-After` | Seconds until retry (on 429) |
| `X-Correlation-ID` | Request correlation ID |

---

## 🐳 Docker

```bash
# Standard deployment
docker-compose -f docker/docker-compose.yml up -d

# Redis cluster (6-node: 3 masters + 3 replicas)
docker-compose -f docker/docker-compose.redis-cluster.yml up -d

# Build image only
docker build -f docker/Dockerfile -t rate-limiter:latest .
```

---

## ☸️ Kubernetes

```bash
# Deploy base manifests
kubectl apply -f k8s/base/

# Production (with HPA, 3-20 replicas)
kubectl apply -f k8s/environments/production/
```

---

## 🧪 Testing

```bash
npm test                  # All unit tests
npm run test:unit         # Unit tests only (no Redis)
npm run test:integration  # Integration tests (needs Redis)
npm run test:coverage     # Coverage report
npm run benchmark         # Benchmark scenario runner
```

---

## 🔧 Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `REDIS_URL` | `redis://localhost:6379` | Redis connection URL |
| `DEFAULT_ALGORITHM` | `token_bucket` | Default algorithm |
| `DEFAULT_RATE_LIMIT` | `100` | Default request limit |
| `DEFAULT_WINDOW_MS` | `60000` | Default window size (ms) |
| `ADAPTIVE_ENABLED` | `true` | Enable ML adaptation |
| `GEO_ENABLED` | `true` | Enable geo limiting |
| `CIRCUIT_BREAKER_THRESHOLD` | `5` | Failures before opening |
| `PORT` | `3000` | Server port |

---

## 📄 License

MIT © Distributed Rate Limiter Team
