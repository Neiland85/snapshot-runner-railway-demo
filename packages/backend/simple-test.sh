#!/bin/bash
echo "🧪 Simple server test..."
node dist/index.js &
SERVER_PID=$!
echo "Server PID: $SERVER_PID"
sleep 3
if ps -p $SERVER_PID > /dev/null; then
    echo "✅ Server process is running"
    netstat -an | grep :4000 || echo "❌ Port 4000 not listening"
else
    echo "❌ Server process died"
fi
kill $SERVER_PID 2>/dev/null
