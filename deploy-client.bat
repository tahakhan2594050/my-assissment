@echo off
echo 🎨 Client Deployment Script for Vercel
echo.

echo 📋 Pre-deployment Checklist:
echo    ✅ Server deployed and working
echo    ✅ Server URL copied from Vercel dashboard
echo    ✅ Environment variables updated
echo.

echo 📝 IMPORTANT: Update your server URL
echo    Edit client/.env and replace 'your-server-deployment-url' with your actual server URL
echo    Example: https://my-ai-app-server.vercel.app
echo.
pause

echo 🔍 Checking client directory...
cd client

echo 📦 Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies!
    pause
    exit /b 1
)

echo 🏗️ Testing build locally...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed! Please fix errors before deploying.
    pause
    exit /b 1
)
echo ✅ Build successful!

echo 🚀 Deploying to Vercel...
call vercel --prod
if %errorlevel% neq 0 (
    echo ❌ Client deployment failed!
    echo 📋 Common issues:
    echo    - Environment variables not set
    echo    - Build errors
    echo    - Vercel CLI not logged in
    pause
    exit /b 1
)

echo ✅ Client deployed successfully!
echo.
echo 🧪 Testing your deployment:
echo    1. Visit your client URL in browser
echo    2. Check if pages load correctly
echo    3. Test authentication (sign in/out)
echo    4. Check if API calls work (Dashboard page)
echo.
echo 📋 If you see errors:
echo    1. Check browser console (F12)
echo    2. Verify environment variables in Vercel dashboard
echo    3. Ensure server URL is correct
echo    4. Check Vercel function logs
echo.
echo 🎉 Deployment Complete!
echo    Your AI platform should now be live!
echo.
pause