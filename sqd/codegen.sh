#!/bin/bash

# Code generation script - generates TypeORM models from schema.graphql
# This script must be run before building the project

set -e

echo "🔧 Generating TypeORM models from schema.graphql..."

# Check if schema.graphql exists
if [ ! -f "schema.graphql" ]; then
    echo "❌ Error: schema.graphql not found!"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies first..."
    npm install
fi

# Generate TypeORM models
echo "📝 Running squid-typeorm-codegen..."
npx squid-typeorm-codegen

# Check if model directory was created
if [ -d "src/model" ]; then
    echo "✅ Models generated successfully in src/model/"
    echo ""
    echo "Generated files:"
    ls -la src/model/
else
    echo "❌ Error: Model directory was not created"
    exit 1
fi

echo ""
echo "✅ Code generation complete!"
echo ""
echo "Next steps:"
echo "  1. Run: npm run build"
echo "  2. Run: npm run db:migrate"
