@echo off
echo 🚀 Starting FIXED deployment to Vercel...
echo.
echo ✅ Issues Fixed:
echo    - Serverless function compatibility
echo    - CORS configuration
echo    - Cloudinary initialization
echo    - Error handling
echo.

REM Deploy server first
echo 📡 Deploying server (FIXED VERSION)...
cd server
call vercel --prod
if %errorlevel% neq 0 (
    echo ❌ Server deployment failed!
    echo 📋 Check the logs and ensure all environment variables are set
    pause
    exit /b 1
)
echo ✅ Server deployed successfully!
echo.

REM Prompt for server URL update
echo 📝 IMPORTANT: Copy your server URL from Vercel dashboard
echo 🔄 Add environment variables in Vercel dashboard (see DEPLOYMENT_ENV_VARIABLES.md)
echo 💡 Test server health: https://your-server-url.vercel.app/api/health
echo.
pause

REM Deploy client
echo 🎨 Deploying client...
cd ../client
call vercel --prod
if %errorlevel% neq 0 (
    echo ❌ Client deployment failed!
    pause
    exit /b 1
)
echo ✅ Client deployed successfully!
echo.

echo 🎉 Deployment complete!
echo.
echo 📋 Final checklist:
echo    ✅ Add all environment variables in Vercel dashboard
echo    ✅ Test server health endpoint
echo    ✅ Test client application
echo    ✅ Verify authentication works
echo    ✅ Test AI features
echo.
echo 🌐 Your app should be live at:
echo    Frontend: https://your-client-url.vercel.app
echo    Backend: https://your-server-url.vercel.app
echo.
pause