import { RateLimitResult } from "../core/rateLimitAlgorithm"

export interface LimitComponent {

  check(key: string): Promise<RateLimitResult>

}