#!/bin/bash

echo "🚀 Starting GraphQL server in background..."
node dist/index.js > server.log 2>&1 &
SERVER_PID=$!
echo "Server PID: $SERVER_PID"
echo $SERVER_PID > server.pid

echo "⏳ Waiting for server to start..."
sleep 3

if ps -p $SERVER_PID > /dev/null; then
    echo "✅ Server is running"
    echo "📋 Server logs: tail -f server.log"
    echo "🛑 To stop server: kill \$(cat server.pid)"
    echo "🧪 To test GraphQL: ./test-graphql.sh"
else
    echo "❌ Server failed to start"
    cat server.log
fi
