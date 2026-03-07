import { MemoryBackend } from "../ratelimit/backend/memoryBackend"
import { AlgorithmFactory } from "../ratelimit/core/algorithmFactory"
import { RateLimiter } from "../ratelimit/core/rateLimiter"

async function run() {

  console.log("Test started")

  const backend = new MemoryBackend()

  const algorithm = AlgorithmFactory.create(
    "fixed_window",
    backend,
    {
      capacity: 5,
      windowMs: 10000
    }
  )

  const limiter = new RateLimiter(algorithm)

  for (let i = 0; i < 10; i++) {

    const result = await limiter.check("user1")

    console.log(result)

  }

}

run().catch(console.error)