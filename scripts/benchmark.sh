#!/usr/bin/env bash
# Benchmark script using curl
set -e

BASE_URL="${BASE_URL:-http://localhost:3000}"
ALGORITHM="${ALGORITHM:-token_bucket}"
CONCURRENCY="${CONCURRENCY:-20}"
REQUESTS="${REQUESTS:-1000}"

echo "🏃 Running benchmark: algorithm=$ALGORITHM concurrency=$CONCURRENCY requests=$REQUESTS"

curl -s -X POST "$BASE_URL/benchmark/run" \
  -H "Content-Type: application/json" \
  -d "{\"scenario\":\"sustained\",\"concurrency\":$CONCURRENCY,\"durationMs\":10000,\"algorithm\":\"$ALGORITHM\"}" \
  | python3 -m json.tool 2>/dev/null || cat

echo "✅ Benchmark complete"
