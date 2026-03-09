import { RateLimitAlgorithm } from "./rateLimitAlgorithm"
import { FixedWindow } from "../algorithms/fixedWindow"
import { TokenBucket } from "../algorithms/tokenBucket"
import { SlidingWindowLog } from "../algorithms/slidingWindowLog"
import { SlidingWindowCounter } from "../algorithms/slidingWindowCounter"
import { LeakyBucket } from "../algorithms/leakyBucket"
import { RateLimiterBackend } from "./rateLimiterBackend"

export type AlgorithmType =
  | "fixed_window"
  | "token_bucket"
  | "sliding_window_log"
  | "sliding_window_counter"
  | "leaky_bucket"

export class AlgorithmFactory {

  static create(
    type: AlgorithmType,
    backend: RateLimiterBackend,
    config: any
  ): RateLimitAlgorithm {

    switch (type) {

      case "fixed_window":
        return new FixedWindow(
          backend,
          config.capacity,
          config.windowMs
        )

      case "token_bucket":
        return new TokenBucket(
          backend,
          config.capacity,
          config.refillRate
        )

      case "sliding_window_log":
        return new SlidingWindowLog(
          backend,
          config.capacity,
          config.windowMs
        )

      case "sliding_window_counter":
        return new SlidingWindowCounter(
          backend,
          config.capacity,
          config.windowMs
        )

      case "leaky_bucket":
        return new LeakyBucket(
          backend,
          config.capacity,
          config.leakRate
        )

      default:
        throw new Error("Unknown algorithm")

    }

  }

}