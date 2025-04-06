Write-Host "Starting FOODY services..." -ForegroundColor Green

# Kill any existing Node processes to free ports
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "Terminating existing Node.js processes..." -ForegroundColor Yellow
    Stop-Process -Name "node" -Force
    Start-Sleep -Seconds 2
    Write-Host "Existing processes terminated." -ForegroundColor Green
}

# Start Backend
Write-Host "Starting backend server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-Command `"cd '$PWD\backend'; npm start`"" -WindowStyle Normal

Write-Host "Waiting for backend to initialize..." -ForegroundColor Cyan
Start-Sleep -Seconds 5

# Start Frontend
Write-Host "Starting frontend application..." -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-Command `"cd '$PWD\frontend'; npm run dev`"" -WindowStyle Normal

Write-Host "All services started successfully!" -ForegroundColor Green
Write-Host "Backend: http://localhost:4000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Magenta 