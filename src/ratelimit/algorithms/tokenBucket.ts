import { RateLimitAlgorithm, RateLimitResult } from "../core/rateLimitAlgorithm"
import { RateLimiterBackend } from "../core/rateLimiterBackend"

interface Bucket {
  tokens: number
  lastRefill: number
}

export class TokenBucket implements RateLimitAlgorithm {

  constructor(
    private backend: RateLimiterBackend,
    private capacity: number,
    private refillRate: number
  ) {}

  async allowRequest(key: string): Promise<RateLimitResult> {

    let bucket: Bucket = await this.backend.get(key)

    const now = Date.now()

    if (!bucket) {
      bucket = {
        tokens: this.capacity,
        lastRefill: now
      }
    }

    const elapsed = (now - bucket.lastRefill) / 1000

    const refill = elapsed * this.refillRate

    bucket.tokens = Math.min(
      this.capacity,
      bucket.tokens + refill
    )

    bucket.lastRefill = now

    if (bucket.tokens >= 1) {

      bucket.tokens -= 1

      await this.backend.set(key, bucket)

      return {
        allowed: true,
        remaining: Math.floor(bucket.tokens)
      }
    }

    await this.backend.set(key, bucket)

    return {
      allowed: false,
      remaining: 0,
      retryAfter: Math.ceil(1 / this.refillRate)
    }

  }

}