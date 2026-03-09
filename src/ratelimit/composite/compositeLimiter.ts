import { LimitComponent } from "./limitComponent"
import { RateLimitResult } from "../core/rateLimitAlgorithm"
import { CombinationLogic } from "./combinationLogic"

export class CompositeLimiter {

  constructor(
    private components: LimitComponent[],
    private logic: CombinationLogic = CombinationLogic.AND
  ) {}

  async check(key: string): Promise<RateLimitResult> {

    const results: RateLimitResult[] = []

    for (const component of this.components) {

      const result = await component.check(key)

      results.push(result)

      if (this.logic === CombinationLogic.AND && !result.allowed) {
        return result
      }

      if (this.logic === CombinationLogic.OR && result.allowed) {
        return result
      }

    }

    return results[0]

  }

}