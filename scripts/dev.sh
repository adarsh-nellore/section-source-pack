#!/usr/bin/env bash
# Free port 3053 and start the prototype dev server.
set -euo pipefail
cd "$(dirname "$0")/.."
if lsof -ti:3053 >/dev/null 2>&1; then
  echo "Stopping existing process on port 3053..."
  lsof -ti:3053 | xargs kill -9 2>/dev/null || true
  sleep 1
fi
echo "Starting http://localhost:3053"
exec npm run dev
