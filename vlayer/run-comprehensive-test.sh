#!/bin/bash

# Comprehensive Test Runner
# Loads environment variables and runs full test suite

cd "$(dirname "$0")"

# Load environment variables
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

# Run the comprehensive test
node test-comprehensive.mjs
