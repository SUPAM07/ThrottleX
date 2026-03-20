#!/usr/bin/env bash
set -euo pipefail

echo "🏗️  Initializing ThrottleX monorepo..."

command -v node >/dev/null 2>&1 || { echo "❌ Node.js >=18 is required"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ npm is required"; exit 1; }

echo "📦 Installing all workspace dependencies..."
npm install

echo "🔨 Building shared package..."
npm run build:shared

echo "✅ Monorepo initialized!"
echo ""
echo "Next steps:"
echo "  1. cp .env.example .env && cp backend/.env.example backend/.env && cp frontend/.env.example frontend/.env"
echo "  2. Edit .env files with your settings"
echo "  3. make dev  (or: npm run dev:backend & npm run dev:frontend)"
