#!/bin/bash
set -e

cd "$(dirname "$0")/frontend"

# Install dependencies if needed
if [ ! -d node_modules ]; then
  echo "Installing frontend dependencies..."
  npm install
fi

# Kill any process on port 5173
if lsof -ti :5173 > /dev/null; then
  echo "Killing existing process on port 5173..."
  lsof -ti :5173 | xargs kill -9
fi

# Start Vite dev server in background
npm run dev &
VITE_PID=$!

# Wait for Vite to be ready
for i in {1..15}; do
  if curl -s http://localhost:5173 > /dev/null; then
    echo "Vite dev server is running."
    break
  fi
  echo "Waiting for Vite dev server... ($i)"
  sleep 1
done

# Run Cypress E2E tests
npm run cypress:run

# Kill Vite dev server
kill $VITE_PID 