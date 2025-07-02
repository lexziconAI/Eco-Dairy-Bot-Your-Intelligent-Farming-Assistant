#!/bin/bash
# Stable server startup script that survives CLI timeouts

echo "Starting Kineticha server in background..."

# Kill any existing processes
pkill -f "node server.js" 2>/dev/null || true
sleep 2

# Start server in background with output logging
nohup npm run dev > server-output.log 2>&1 &

# Get the PID
SERVER_PID=$!
echo "Server started with PID: $SERVER_PID"
echo $SERVER_PID > server.pid

# Wait a moment for startup
sleep 5

# Check if server is running
if ps -p $SERVER_PID > /dev/null; then
    echo "✅ Server is running successfully!"
    echo "🌐 Access at: http://localhost:3000"
    echo "📄 Logs: tail -f server-output.log"
    echo "🛑 Stop with: kill $SERVER_PID"
else
    echo "❌ Server failed to start"
    cat server-output.log
fi