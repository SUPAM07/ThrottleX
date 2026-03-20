#!/usr/bin/env bash
set -euo pipefail

BACKEND_URL=${BACKEND_URL:-http://localhost:3000}
FRONTEND_URL=${FRONTEND_URL:-http://localhost:5173}

echo "🏥 Checking ThrottleX health..."

# Backend health check
if curl -sf "$BACKEND_URL/health/live" >/dev/null 2>&1; then
  echo "✅ Backend is healthy at $BACKEND_URL"
else
  echo "❌ Backend is not responding at $BACKEND_URL"
fi

# Frontend health check  
if curl -sf "$FRONTEND_URL" >/dev/null 2>&1; then
  echo "✅ Frontend is healthy at $FRONTEND_URL"
else
  echo "⚠️  Frontend is not responding at $FRONTEND_URL"
fi
