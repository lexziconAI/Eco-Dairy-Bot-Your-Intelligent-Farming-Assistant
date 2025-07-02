# Run this in Windows PowerShell as Administrator

# Get WSL IP
$wslIp = "172.30.112.61"

Write-Host "Setting up port forwarding for WSL IP: $wslIp"

# Remove existing port proxy
netsh interface portproxy delete v4tov4 listenport=3000 listenaddress=0.0.0.0

# Add new port proxy
netsh interface portproxy add v4tov4 listenport=3000 listenaddress=0.0.0.0 connectport=3000 connectaddress=$wslIp

# Add firewall rule
New-NetFirewallRule -DisplayName "WSL2 Kineticha Dev Server" -Direction Inbound -Protocol TCP -LocalPort 3000 -Action Allow -ErrorAction SilentlyContinue

Write-Host "Port forwarding configured!"
Write-Host "You can now access the app at http://localhost:3000"
