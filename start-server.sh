#!/bin/bash
cd /root/projects/kinetichat
export NODE_ENV=development

echo "Starting Next.js server..."
echo "Server will be available at:"
echo "  - http://localhost:3000"
echo "  - http://172.30.112.61:3000"
echo ""

exec npm run dev