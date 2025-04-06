Write-Host "Attempting to kill any process using port 4000..." -ForegroundColor Yellow

# Try with taskkill directly since it's more reliable on Windows
Write-Host "Killing all Node.js processes..." -ForegroundColor Cyan
$result = (cmd /c "taskkill /F /IM node.exe" 2>&1)
Write-Host $result -ForegroundColor Green

Write-Host "Done! Now you can start the backend server" -ForegroundColor Green 