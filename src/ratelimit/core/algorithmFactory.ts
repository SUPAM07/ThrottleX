import { RateLimitAlgorithm } from "./rateLimitAlgorithm"
import { FixedWindow } from "../algorithms/fixedWindow"
import { TokenBucket } from "../algorithms/tokenBucket"
import { RateLimiterBackend } from "./rateLimiterBackend"

export type AlgorithmType =
  | "fixed_window"
  | "token_bucket"

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

      default:
        throw new Error("Unknown algorithm")

    }

  }

}