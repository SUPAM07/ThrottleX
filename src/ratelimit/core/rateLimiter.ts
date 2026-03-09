import { RateLimitAlgorithm, RateLimitResult } from "./rateLimitAlgorithm"
import { LimitComponent } from "../composite/limitComponent"

export class RateLimiter implements LimitComponent {

  constructor(
    private algorithm: RateLimitAlgorithm
  ) {}

  async check(key: string): Promise<RateLimitResult> {

    return this.algorithm.allowRequest(key)

  }

}