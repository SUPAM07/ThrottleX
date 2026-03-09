import Redis from "ioredis"
import { RedisScriptLoader } from "./redisScriptLoader"

export type RateLimitAlgorithm =
  | "fixedWindow"
  | "slidingWindowLog"
  | "slidingWindowCounter"
  | "tokenBucket"
  | "leakyBucket"

interface RateLimitOptions {
  limit: number
  window: number
}

export class DistributedRateLimiter {

  private redis: Redis
  private loader: RedisScriptLoader
  private options: RateLimitOptions

  constructor(
    redis: Redis,
    loader: RedisScriptLoader,
    options: RateLimitOptions
  ) {
    this.redis = redis
    this.loader = loader
    this.options = options
  }

  async allow(
    key: string,
    algorithm: RateLimitAlgorithm
  ): Promise<boolean> {

    const sha = this.loader.getScriptSha(algorithm)

    const now = Date.now()

    const result = await this.redis.evalsha(
      sha,
      1,
      key,
      this.options.limit,
      this.options.window,
      now
    )

    return result === 1
  }

}