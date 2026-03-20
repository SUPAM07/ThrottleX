#!/usr/bin/env bash
set -euo pipefail

NAMESPACE=${1:-throttlex-dev}
echo "🧹 Cleaning up namespace: $NAMESPACE"
kubectl delete namespace "$NAMESPACE" --ignore-not-found
echo "✅ Cleanup complete!"
