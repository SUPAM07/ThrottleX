#!/usr/bin/env bash
set -euo pipefail

echo "🔧 Installing development tools..."

# Check for brew (macOS)
if command -v brew &>/dev/null; then
  brew install kubectl helm k9s redis
elif command -v apt-get &>/dev/null; then
  sudo apt-get update
  sudo apt-get install -y kubectl redis-tools
fi

echo "✅ Tools installed!"
