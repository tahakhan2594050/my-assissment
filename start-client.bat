@echo off
echo 🎨 Starting AI Content Creation Client
echo.
echo 📍 Client will run on: http://localhost:5173
echo.

cd client
echo 📦 Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install client dependencies!
    pause
    exit /b 1
)

echo 🎨 Starting client...
call npm run dev