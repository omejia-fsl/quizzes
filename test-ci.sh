#!/bin/bash
set -e

echo "==================================="
echo "Testing CI Commands"
echo "==================================="

echo -e "\n📝 Running ESLint..."
pnpm lint

echo -e "\n✨ Checking Prettier formatting..."
pnpm format:check

echo -e "\n🔍 TypeScript type checking..."
pnpm typecheck

echo -e "\n🏗️ Building API..."
pnpm build:api

echo -e "\n🏗️ Building UI..."
pnpm build:ui

echo -e "\n🧪 Running tests..."
pnpm test

echo -e "\n==================================="
echo "✅ All CI commands passed successfully!"
echo "==================================="