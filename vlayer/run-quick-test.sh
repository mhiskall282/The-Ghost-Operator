#!/bin/bash

# Load environment and run test
cd "$(dirname "$0")"

# Load .env file
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Run the test
node test-pr-quick.mjs
