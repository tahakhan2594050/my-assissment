@echo off
echo 🌐 Starting AI Content Creation Website
echo.
echo This will start both server and client in separate windows
echo.
echo 📍 Server: http://localhost:3000
echo 📍 Client: http://localhost:5173
echo.
pause

echo 🚀 Starting server in new window...
start "AI Server" cmd /k "cd server && npm install && npm run dev"

echo ⏳ Waiting for server to start...
timeout /t 5 /nobreak > nul

echo 🎨 Starting client in new window...
start "AI Client" cmd /k "cd client && npm install && npm run dev"

echo.
echo ✅ Both server and client are starting!
echo.
echo 📋 Next steps:
echo    1. Wait for both windows to show "ready" or "running"
echo    2. Open http://localhost:5173 in your browser
echo    3. Enjoy your AI Content Creation Platform!
echo.
pause