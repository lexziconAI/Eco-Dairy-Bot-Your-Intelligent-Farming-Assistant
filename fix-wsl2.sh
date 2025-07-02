#!/bin/bash

echo "=== WSL2 Network Fix Script ==="
echo

# Get WSL2 IP
WSL_IP=$(ip addr show eth0 | grep -oP '(?<=inet\s)\d+(\.\d+){3}')
echo "WSL2 IP: $WSL_IP"
echo

# Kill any existing Node processes
echo "Killing any existing Node processes..."
pkill -f node
pkill -f npm
sleep 2

# Clear Next.js cache
echo "Clearing Next.js cache..."
rm -rf .next/
echo

# Create Windows PowerShell script
cat > fix-windows.ps1 << EOF
# Run this in Windows PowerShell as Administrator

# Get WSL IP
\$wslIp = "$WSL_IP"

Write-Host "Setting up port forwarding for WSL IP: \$wslIp"

# Remove existing port proxy
netsh interface portproxy delete v4tov4 listenport=3000 listenaddress=0.0.0.0

# Add new port proxy
netsh interface portproxy add v4tov4 listenport=3000 listenaddress=0.0.0.0 connectport=3000 connectaddress=\$wslIp

# Add firewall rule
New-NetFirewallRule -DisplayName "WSL2 Kineticha Dev Server" -Direction Inbound -Protocol TCP -LocalPort 3000 -Action Allow -ErrorAction SilentlyContinue

Write-Host "Port forwarding configured!"
Write-Host "You can now access the app at http://localhost:3000"
EOF

echo "Created fix-windows.ps1 script"
echo
echo "=== Instructions ==="
echo "1. Copy and run this command in Windows PowerShell (as Administrator):"
echo
echo "wsl cat /root/projects/kinetichat/fix-windows.ps1 | powershell -Command -"
echo
echo "2. Then start the server in WSL with:"
echo "   npm run dev"
echo
echo "3. Access the app at:"
echo "   - http://localhost:3000"
echo "   - http://$WSL_IP:3000"
echo