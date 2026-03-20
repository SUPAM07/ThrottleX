#!/usr/bin/env bash
set -euo pipefail

echo "🐳 Starting development stack..."
docker compose -f docker/docker-compose.dev.yml up -d "$@"
echo "✅ Development stack started!"
echo "  Backend: http://localhost:3000"
echo "  Frontend: http://localhost:5173"
