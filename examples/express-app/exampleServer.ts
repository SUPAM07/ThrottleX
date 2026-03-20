import express, { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';
import { RateLimiter } from '../../backend/src/main/services/ratelimit/core/rateLimiter';
import { ALGORITHMS } from '../../backend/src/main/utils/constants';

// Initialize the standalone rate limiter
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
const rateLimiter = new RateLimiter({
  redis,
  defaultAlgorithm: ALGORITHMS.TOKEN_BUCKET,
  defaultLimit: 100,
  defaultWindowMs: 60_000,
});

const app = express();
app.use(express.json());

// Example Express Middleware using the Rate Limiter library directly
const createLimiterMiddleware = (
  options: { keyPrefix: string; limit: number; windowMs: number; algorithm: string }
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Determine the identifier (e.g., API key, User ID, or IP)
    const identifier = req.headers['x-api-key'] || req.ip || 'anonymous';
    const key = `${options.keyPrefix}:${identifier}`;

    try {
      const result = await rateLimiter.check(key, {
        limit: options.limit,
        windowMs: options.windowMs,
        algorithm: options.algorithm,
      });

      // Set standard rate limit headers
      res.setHeader('X-RateLimit-Limit', result.limit);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, result.remaining));
      res.setHeader('X-RateLimit-Reset', Math.ceil(result.resetMs / 1000));

      if (result.allowed) {
        next();
      } else {
        res.status(429).json({
          error: 'Too Many Requests',
          retryAfter: Math.ceil((result.resetMs - Date.now()) / 1000),
          algorithm: result.algorithm,
        });
      }
    } catch (error) {
      // Fail-open strategy handles internal setup errors gracefully
      next(); 
    }
  };
};

// 1. Strict sliding window for login endpoints
app.post('/api/login', createLimiterMiddleware({
  keyPrefix: 'login',
  limit: 5,
  windowMs: 60 * 1000, // 5 requests per minute
  algorithm: ALGORITHMS.SLIDING_WINDOW,
}), (req, res) => {
  res.json({ success: true, message: 'Login attempted' });
});

// 2. Token bucket allowing bursts for standard API operations
app.get('/api/data', createLimiterMiddleware({
  keyPrefix: 'api',
  limit: 100,
  windowMs: 60 * 1000, 
  algorithm: ALGORITHMS.TOKEN_BUCKET,
}), (req, res) => {
  res.json({ data: ['item1', 'item2'] });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Example Express app listening at http://localhost:${PORT}`);
});
