#!/bin/bash
set -e

echo "🚀 Starting Full E2E Test Suite..."

# Kill any existing processes on our ports
echo "🧹 Cleaning up existing processes..."
lsof -ti :5173 | xargs kill -9 2>/dev/null || true
lsof -ti :5174 | xargs kill -9 2>/dev/null || true
lsof -ti :8080 | xargs kill -9 2>/dev/null || true

# Start backend server
echo "🔧 Starting backend server..."
cd backend
go run cmd/server/main.go &
BACKEND_PID=$!
cd ..

# Wait for backend to be ready
echo "⏳ Waiting for backend server..."
for i in {1..30}; do
  if curl -s http://localhost:8080/health > /dev/null; then
    echo "✅ Backend server is running on port 8080"
    break
  fi
  echo "Waiting for backend... ($i/30)"
  sleep 1
done

# Start frontend server
echo "🎨 Starting frontend server..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Wait for frontend to be ready and detect the port
echo "⏳ Waiting for frontend server..."
FRONTEND_PORT=""
for i in {1..45}; do
  if curl -s http://127.0.0.1:5173 > /dev/null; then
    FRONTEND_PORT="5173"
    echo "✅ Frontend server is running on port 5173"
    break
  elif curl -s http://127.0.0.1:5174 > /dev/null; then
    FRONTEND_PORT="5174"
    echo "✅ Frontend server is running on port 5174"
    break
  fi
  echo "Waiting for frontend... ($i/45)"
  sleep 1
done

if [ -z "$FRONTEND_PORT" ]; then
  echo "❌ Frontend server failed to start"
  kill $BACKEND_PID 2>/dev/null || true
  exit 1
fi

# Update Cypress config to use the correct port with 127.0.0.1
echo "🔧 Updating Cypress config to use port $FRONTEND_PORT..."
cd frontend
sed -i.bak "s/baseUrl: 'http:\/\/localhost:[0-9]*'/baseUrl: 'http:\/\/127.0.0.1:$FRONTEND_PORT'/" cypress.config.ts
cd ..

# Additional wait to ensure server is fully ready
echo "⏳ Additional wait for server stability..."
sleep 3

# Run Cypress tests
echo "🧪 Running Cypress E2E tests..."
cd frontend
npm run cypress:run
CYPRESS_EXIT_CODE=$?
cd ..

# Cleanup
echo "🧹 Cleaning up..."
kill $BACKEND_PID 2>/dev/null || true
kill $FRONTEND_PID 2>/dev/null || true

echo "🏁 E2E Test Suite Complete!"
exit $CYPRESS_EXIT_CODE 