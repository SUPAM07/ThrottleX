#!/usr/bin/env bash
set -euo pipefail

echo "☸️  Deploying to production Kubernetes..."
kubectl apply -k k8s/backend/environments/prod
kubectl apply -k k8s/frontend/environments/prod
echo "✅ Production deployment complete!"
