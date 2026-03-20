#!/usr/bin/env bash
set -euo pipefail

VERSION=${1:-latest}

echo "🐳 Building Docker images (version: $VERSION)..."

echo "Building backend image..."
docker build -t "throttlex/backend:$VERSION" -t "throttlex/backend:latest" \
  -f backend/docker/Dockerfile backend/

echo "Building frontend image..."
docker build -t "throttlex/frontend:$VERSION" -t "throttlex/frontend:latest" \
  -f frontend/docker/Dockerfile frontend/

echo "✅ All images built successfully!"
