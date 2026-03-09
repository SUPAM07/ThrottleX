import { RateLimitAlgorithm, RateLimitResult } from "../core/rateLimitAlgorithm"
import { RateLimiterBackend } from "../core/rateLimiterBackend"

export class SlidingWindowLog implements RateLimitAlgorithm {

  constructor(
    private backend: RateLimiterBackend,
    private capacity: number,
    private windowMs: number
  ) {}

  async allowRequest(key: string): Promise<RateLimitResult> {

    const now = Date.now()

    let timestamps: number[] = await this.backend.get(key)

    if (!timestamps) {
      timestamps = []
    }

    // remove expired timestamps
    timestamps = timestamps.filter(
      ts => now - ts < this.windowMs
    )

    if (timestamps.length < this.capacity) {

      timestamps.push(now)

      await this.backend.set(key, timestamps)

      return {
        allowed: true,
        remaining: this.capacity - timestamps.length
      }

    }

    const retryAfter = this.windowMs - (now - timestamps[0])

    return {
      allowed: false,
      remaining: 0,
      retryAfter
    }

  }

}