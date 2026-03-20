#!/usr/bin/env bash
set -euo pipefail

echo "🚀 Setting up ThrottleX development environment..."

# Check prerequisites
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required but not installed."; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "❌ Docker is required but not installed."; exit 1; }

# Install dependencies
echo "�� Installing dependencies..."
npm install

# Copy env files
if [ ! -f .env ]; then
  cp .env.example .env
  echo "✅ Created root .env from .env.example"
fi

if [ ! -f backend/.env ]; then
  cp backend/.env.example backend/.env
  echo "✅ Created backend/.env from .env.example"
fi

if [ ! -f frontend/.env ]; then
  cp frontend/.env.example frontend/.env
  echo "✅ Created frontend/.env from .env.example"
fi

# Start Redis
echo "🐳 Starting Redis..."
docker compose -f docker/docker-compose.dev.yml up -d redis

echo "✅ Development environment ready!"
echo "  Backend: npm run dev:backend"
echo "  Frontend: npm run dev:frontend"
echo "  Both: make dev"
