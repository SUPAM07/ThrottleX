#!/usr/bin/env bash
set -euo pipefail

echo "🛑 Stopping Docker services..."
docker compose -f docker/docker-compose.yml down "$@" 2>/dev/null || true
docker compose -f docker/docker-compose.dev.yml down "$@" 2>/dev/null || true
echo "✅ Services stopped!"
