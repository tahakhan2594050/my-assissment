@echo off
echo 🚀 Starting AI Content Creation Server
echo.
echo 📍 Server will run on: http://localhost:3000
echo 📊 Health check: http://localhost:3000/api/health
echo.

cd server
echo 📦 Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install server dependencies!
    pause
    exit /b 1
)

echo 🚀 Starting server...
call npm run dev