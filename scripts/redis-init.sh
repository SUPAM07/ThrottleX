#!/usr/bin/env bash
# Redis initialization script - seeds default configs

set -e

REDIS_URL="${REDIS_URL:-redis://localhost:6379}"
echo "Initializing Redis at $REDIS_URL"

redis-cli -u "$REDIS_URL" SET "rl:initialized" "true" EX 86400
redis-cli -u "$REDIS_URL" HSET "cfg:limit:global" limit 1000 windowMs 60000 algorithm token_bucket

echo "✅ Redis initialized successfully"
