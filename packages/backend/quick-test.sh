#!/bin/bash
echo "🚀 Testing built server..."
node dist/index.js &
SERVER_PID=$!
sleep 5
echo "📞 Testing server..."
if curl -s http://localhost:4000/health > /dev/null; then
    echo "✅ Server is working!"
    curl -s http://localhost:4000/health
    echo ""
    curl -s http://localhost:4000/
    echo ""
else
    echo "❌ Server not responding"
fi
kill $SERVER_PID 2>/dev/null
echo "🛑 Server stopped"
