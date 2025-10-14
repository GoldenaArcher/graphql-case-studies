#!/bin/bash

set -e
echo "🛑 Stopping local environment..."

cd "$(dirname "$0")/../docker"
docker compose down

echo "✅ All containers stopped."