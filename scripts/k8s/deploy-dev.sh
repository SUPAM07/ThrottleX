#!/usr/bin/env bash
set -euo pipefail

echo "☸️  Deploying to dev Kubernetes..."
kubectl apply -k k8s/backend/environments/dev
kubectl apply -k k8s/frontend/environments/dev
echo "✅ Dev deployment complete!"
