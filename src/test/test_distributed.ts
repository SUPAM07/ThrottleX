import Redis from "ioredis"
import { RedisScriptLoader } from "../distributed/redisScriptLoader"
import { DistributedRateLimiter } from "../distributed/distributedRateLimiter"

async function test() {

  const redis = new Redis()

  const loader = new RedisScriptLoader(redis)

  await loader.loadScript("fixedWindow")
  await loader.loadScript("slidingWindowLog")
  await loader.loadScript("slidingWindowCounter")
  await loader.loadScript("tokenBucket")
  await loader.loadScript("leakyBucket")

  const limiter = new DistributedRateLimiter(
    redis,
    loader,
    {
      limit: 5,
      window: 10
    }
  )

  console.log("Testing Sliding Window Log")

  for (let i = 1; i <= 10; i++) {

    const allowed = await limiter.allow(
      "user1",
      "slidingWindowLog"
    )

    console.log("request", i, allowed)

  }

}

test()