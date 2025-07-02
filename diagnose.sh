#!/bin/bash

echo "=== WSL2 Network Diagnostic ==="
echo

echo "1. Current network interfaces:"
ip addr show | grep -E "inet|state"
echo

echo "2. Checking if Next.js is running:"
ps aux | grep -E "node|next" | grep -v grep
echo

echo "3. Port 3000 status:"
ss -tlnp | grep 3000 || echo "Port 3000 not listening"
echo

echo "4. Testing localhost connectivity:"
curl -s -o /dev/null -w "localhost:3000 - HTTP %{http_code}\n" http://localhost:3000 || echo "localhost:3000 - FAILED"
curl -s -o /dev/null -w "127.0.0.1:3000 - HTTP %{http_code}\n" http://127.0.0.1:3000 || echo "127.0.0.1:3000 - FAILED"
curl -s -o /dev/null -w "0.0.0.0:3000 - HTTP %{http_code}\n" http://0.0.0.0:3000 || echo "0.0.0.0:3000 - FAILED"
echo

echo "5. WSL2 IP address:"
ip addr show eth0 | grep -oP '(?<=inet\s)\d+(\.\d+){3}' || echo "No WSL2 IP found"
echo

echo "6. Windows host IP (from WSL perspective):"
cat /etc/resolv.conf | grep nameserver | awk '{print $2}'
echo

echo "7. Checking firewall/iptables rules:"
sudo iptables -L INPUT -n | grep -E "3000|ACCEPT" || echo "No specific rules for port 3000"
echo

echo "8. Network route to Windows host:"
ip route | grep default
echo

echo "=== Recommendations ==="
echo "Try accessing from Windows browser using:"
WSL_IP=$(ip addr show eth0 | grep -oP '(?<=inet\s)\d+(\.\d+){3}')
echo "- http://$WSL_IP:3000"
echo
echo "Or run in Windows PowerShell (as Admin):"
echo "wsl hostname -I"
echo "Then use that IP with :3000"