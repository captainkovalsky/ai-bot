#!/bin/bash
# Simplified approval script for OpenClaw
# Usage: ./approve.sh <channel> <code>
# Example: ./approve.sh telegram 123456

if [ "$#" -ne 2 ]; then
    echo "Usage: ./approve.sh <channel> <code>"
    echo "Example: ./approve.sh telegram 123456"
    exit 1
fi

CHANNEL=$1
CODE=$2

# Check if we are inside the container (rudimentary check)
if [ -f "/app/dist/index.js" ]; then
    echo "Running approval for $CHANNEL with code $CODE..."
    cd /app
    node dist/index.js pairing approve "$CHANNEL" "$CODE"
else
    echo "Error: This script must be run inside the OpenClaw container."
    echo "Use: docker compose exec openclaw-gateway /app/scripts/approve.sh $CHANNEL $CODE"
    exit 1
fi
