import { MemoryBackend } from "../ratelimit/backend/memoryBackend"
import { AlgorithmFactory } from "../ratelimit/core/algorithmFactory"
import { RateLimiter } from "../ratelimit/core/rateLimiter"

async function run() {

  const backend = new MemoryBackend()

  const algorithm = AlgorithmFactory.create(
    "token_bucket",
    backend,
    {
      capacity: 5,
      refillRate: 1
    }
  )

  const limiter = new RateLimiter(algorithm)

  for (let i = 0; i < 10; i++) {
    const result = await limiter.check("user1")
    console.log(result)
  }

}

run()