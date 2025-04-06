@echo off
echo Starting all Foody services...

echo Starting Backend Server...
start cmd /k "cd backend && npm start"

echo Starting Admin Panel...
start cmd /k "cd admin && npm run dev"

echo Starting Frontend...
start cmd /k "cd frontend && npm run dev"

echo All services started successfully!
echo Backend: http://localhost:4000
echo Admin: Check console for URL (likely http://localhost:5175)
echo Frontend: Check console for URL 