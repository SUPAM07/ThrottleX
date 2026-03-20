#!/usr/bin/env bash
set -euo pipefail

echo "🚀 Setting up ThrottleX production environment..."

command -v docker >/dev/null 2>&1 || { echo "❌ Docker is required but not installed."; exit 1; }

if [ ! -f .env ]; then
  echo "❌ .env file is required for production setup"
  exit 1
fi

echo "🏗️  Building Docker images..."
bash scripts/docker/build-all.sh

echo "🚀 Starting production stack..."
docker compose -f docker/docker-compose.prod.yml up -d

echo "✅ Production stack started!"
