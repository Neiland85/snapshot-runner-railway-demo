#!/bin/bash
echo "🚀 Starting server..."
node --loader ts-node/esm src/index.ts &
SERVER_PID=$!
echo "⏳ Waiting for server to start..."
sleep 10
echo "🧪 Testing health endpoint..."
curl -s http://localhost:4000/health || echo "❌ Health check failed"
echo ""
echo "🧪 Testing root endpoint..."
curl -s http://localhost:4000/ || echo "❌ Root endpoint failed"
echo ""
echo "🛑 Stopping server..."
kill $SERVER_PID
echo "✅ Test completed"
