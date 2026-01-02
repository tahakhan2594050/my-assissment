@echo off
echo 🔧 Network Error Fix Script
echo.
echo ✅ Fixes Applied:
echo    - Enhanced CORS configuration
echo    - Better error handling
echo    - Request timeout configuration
echo    - Debug information display
echo    - Fallback data support
echo.

echo 📡 Step 1: Deploying fixed server...
cd server
call vercel --prod
if %errorlevel% neq 0 (
    echo ❌ Server deployment failed!
    pause
    exit /b 1
)
echo ✅ Server deployed with network fixes!

echo.
echo 📝 Step 2: Please update your client environment
echo    1. Copy your server URL from Vercel dashboard
echo    2. Update client/.env file:
echo       VITE_BASE_URL=https://your-server-url.vercel.app
echo.
pause

echo 🎨 Step 3: Deploying fixed client...
cd ../client
call vercel --prod
if %errorlevel% neq 0 (
    echo ❌ Client deployment failed!
    pause
    exit /b 1
)
echo ✅ Client deployed with network fixes!

echo.
echo 🧪 Step 4: Testing your deployment
echo.
echo Test these URLs in your browser:
echo    1. Server health: https://your-server-url.vercel.app/api/health
echo    2. Client app: https://your-client-url.vercel.app
echo.
echo 🔍 Debug Information:
echo    - Dashboard now shows API URL and error details
echo    - Check browser console (F12) for network requests
echo    - Retry button available if connection fails
echo.
echo 🎉 Network Error Fix Complete!
echo    Your app should now work without network errors.
echo.
pause