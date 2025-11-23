#!/bin/bash

# Quick start script for Ghost Bot SQD Indexer

set -e

echo "🤖 Ghost Bot SQD Indexer - Quick Start"
echo "======================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created. Please update it with your configuration."
    echo ""
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo ""
echo "🐳 Starting Docker services..."
docker-compose up -d postgres

echo ""
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 5

echo ""
echo "🏗️  Building the project..."
npm run build

echo ""
echo "🗄️  Running database migrations..."
npm run db:migrate

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the indexer:"
echo "  npm run process"
echo ""
echo "To start the GraphQL server:"
echo "  npm run serve"
echo ""
echo "Or start everything with Docker:"
echo "  docker-compose up -d"
echo ""
echo "GraphQL Playground will be available at: http://localhost:4350/graphql"
echo ""
echo "⚠️  Don't forget to update the contract address in src/constants.ts!"
