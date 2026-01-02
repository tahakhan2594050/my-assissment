@echo off
echo 🔧 FIXED Vercel Deployment Script
echo.
echo ✅ Applied Fixes:
echo    - Serverless function structure
echo    - Removed top-level await issues
echo    - Added proper CORS headers
echo    - Simplified authentication
echo    - Added database fallback
echo.

echo 📡 Deploying FIXED server to Vercel...
cd server
call vercel --prod

if %errorlevel% neq 0 (
    echo ❌ Server deployment failed!
    echo 📋 Check the error above and try again
    pause
    exit /b 1
)

echo ✅ Server deployed successfully!
echo.
echo 🧪 Testing endpoints...
echo 📋 Test these URLs in your browser:
echo    Health: https://your-server-url.vercel.app/api/health
echo    Main: https://your-server-url.vercel.app/
echo.
echo 📝 IMPORTANT: Add environment variables in Vercel Dashboard
echo    See FIXED_DEPLOYMENT_GUIDE.md for the complete list
echo.

pause

echo 🎨 Now deploying client...
cd ../client
call vercel --prod

if %errorlevel% neq 0 (
    echo ❌ Client deployment failed!
    pause
    exit /b 1
)

echo ✅ Client deployed successfully!
echo.
echo 🎉 Deployment Complete!
echo.
echo 🌐 Your app should be live at:
echo    Frontend: https://your-client-url.vercel.app
echo    Backend: https://your-server-url.vercel.app
echo.
echo 📋 Final Steps:
echo    1. Add environment variables in Vercel dashboard
echo    2. Test all endpoints
echo    3. Update client VITE_BASE_URL with server URL
echo.
pause