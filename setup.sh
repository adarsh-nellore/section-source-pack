#!/usr/bin/env bash
# setup.sh — bootstrap a freshly-cloned peer-design-system into a new project.
#
# Usage:
#   gh repo create my-app --template adarsh-nellore/peer-design-system --clone
#   cd my-app
#   ./setup.sh
#
# Or after a local cp -r:
#   cp -r ~/Projects/adarsh-design-system ~/Projects/my-app
#   cd ~/Projects/my-app
#   ./setup.sh

set -euo pipefail

DEFAULT_NAME="$(basename "$PWD")"

echo "peer-design-system setup"
echo "------------------------"
read -rp "New project name (kebab-case) [$DEFAULT_NAME]: " NAME
NAME="${NAME:-$DEFAULT_NAME}"

if ! [[ "$NAME" =~ ^[a-z0-9]+(-[a-z0-9]+)*$ ]]; then
  echo "Project name must be kebab-case (lowercase letters, digits, hyphens). Got: $NAME" >&2
  exit 1
fi

echo ""
echo "→ Renaming package to: $NAME"
node -e "
const fs = require('fs');
const p = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
p.name = '$NAME';
fs.writeFileSync('./package.json', JSON.stringify(p, null, 2) + '\n');
"

if [ -f "src/lib/mock-data.ts" ]; then
  read -rp "Clear src/lib/mock-data.ts (regenerated per exercise)? [Y/n]: " CLEAR
  CLEAR="${CLEAR:-Y}"
  if [[ "$CLEAR" =~ ^[Yy] ]]; then
    echo "// Mock data is regenerated per exercise. Empty for now." > src/lib/mock-data.ts
    echo "export {};" >> src/lib/mock-data.ts
    echo "→ Cleared src/lib/mock-data.ts"
  fi
fi

echo ""
echo "→ Installing dependencies (npm install)..."
npm install

echo ""
echo "✓ Ready."
echo ""
echo "Next steps:"
echo "  npm run dev      → starts the dev server"
echo "  npm run audit    → runs the composition audit gate"
echo "  npm run build    → audit + Next.js production build"
echo ""
echo "Routes:"
echo "  /                  → landing"
echo "  /components        → primitive showcase"
echo "  /templates         → templates gallery"
echo "  /templates/<name>  → individual page templates (9 available)"
