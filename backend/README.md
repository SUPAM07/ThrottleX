# ThrottleX Backend

Production-ready distributed rate limiter API built with Node.js, Express, and Redis.

## Features
- 5 rate limiting algorithms (Token Bucket, Sliding Window, Fixed Window, Leaky Bucket, Composite)
- Adaptive ML-based rate limiting
- Geographic rate limiting
- Redis-backed distributed state
- Prometheus metrics
- Circuit breaker pattern

## Development

```bash
npm install
cp .env.example .env
npm run dev
```

## Testing

```bash
npm test              # Run all tests
npm run test:unit     # Unit tests only
npm run test:integration  # Integration tests
npm run test:coverage # With coverage
```

## Building

```bash
npm run build
npm start
```
