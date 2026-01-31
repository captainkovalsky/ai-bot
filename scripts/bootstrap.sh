#!/bin/bash
set -e

# Define target config path
TARGET_CONFIG="${XDG_CONFIG_HOME:-/home/node/.openclaw}/openclaw.json"

echo "🦞 OpenClaw Bootstrap"
echo "-----------------------------------"
echo "Target Config: $TARGET_CONFIG"

# Ensure config directory exists
mkdir -p "$(dirname "$TARGET_CONFIG")"

# Apply patches if any exist
if [ -d "/app/configs" ]; then
  echo "📦 Applying configuration patches..."
  node /app/scripts/apply_patches.js "$TARGET_CONFIG"
else
  echo "⚠️  No configs directory found."
fi

echo "🚀 Starting OpenClaw Gateway..."
# Execute the passed command (from CMD or docker-compose command)
exec "$@"
