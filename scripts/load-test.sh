#!/bin/bash

# Adaptive Rate Limiter - Load Test Script
# This script runs a series of benchmarks against the rate limiter API.

set -e

HOST=${1:-"http://localhost:3000"}
ENDPOINT="$HOST/api/benchmark"

echo "============================================="
echo "🚀 Starting Adaptive Rate Limiter Benchmark"
echo "📡 Target: $HOST"
echo "============================================="

# Function to run a benchmark scenario
run_scenario() {
  local scenario=$1
  local concurrency=$2
  local duration=$3
  local algorithm=$4

  echo -e "\n⏳ Running Scenario: $scenario ($algorithm)"
  echo "   Concurrency: $concurrency | Duration: ${duration}ms"
  
  curl -s -X POST $ENDPOINT \
    -H "Content-Type: application/json" \
    -d "{
      \"scenario\": \"$scenario\",
      \"concurrency\": $concurrency,
      \"durationMs\": $duration,
      \"algorithm\": \"$algorithm\"
    }" | jq '.'
}

# Ensure jq is installed
if ! command -v jq &> /dev/null; then
  echo "❌ Error: 'jq' is required to format JSON output. Please install it."
  echo "brew install jq (mac) or apt-get install jq (linux)"
  exit 1
fi

# Run scenarios
echo "Waiting for service to be ready..."
sleep 2

run_scenario "burst" 50 5000 "token_bucket"
run_scenario "sustained" 100 10000 "sliding_window"
run_scenario "stress" 200 15000 "composite"

echo -e "\n✅ Benchmarks complete."
