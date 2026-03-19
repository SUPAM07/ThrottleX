# Redis Design & Lua Scripts

All distributed rate-limiting state is managed in Redis using Lua scripts.

## Why Lua?
Using Lua scripts guarantees **atomicity**. A single script evaluation in Redis blocks other operations, ensuring that checking the limit and incrementing the counter happen as a single, uninterrupted transaction. This perfectly eliminates race conditions that occur in heavily concurrent environments.

## Time Complexity
All scripts are designed to be $O(1)$ or $O(\log(N))$ (for ZSET operations in sliding window). This ensures consistently low latency (<2ms P95) even at 50,000+ RPS.

## Keyspace Architecture
Keys are structured using `KeyGenerator` to avoid collisions and enable easy debugging:
`rl:{algorithm}:{tenant?}:{user?}:{endpoint?}:{bucket?}`

Example: `rl:token_bucket:t:acme:u:123`
