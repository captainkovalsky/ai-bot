#!/bin/bash
# Query the running OpenClaw gateway for its active configuration
echo "🔎 Querying running configuration..."

# Use full path to ensure execution
CMD="node /app/dist/index.js"

$CMD gateway call config.get --params '{}'
