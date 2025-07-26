#!/bin/bash
echo "🔨 Building project..."
npm run build
echo "🚀 Starting built server..."
node dist/index.js &
SERVER_PID=$!
echo "⏳ Waiting for server to start..."
sleep 8
echo "🧪 Testing endpoints..."
curl -s http://localhost:4000/health && echo "" || echo "❌ Health check failed"
curl -s http://localhost:4000/ && echo "" || echo "❌ Root endpoint failed"
echo "🛑 Stopping server..."
kill $SERVER_PID 2>/dev/null
echo "✅ Test completed"
