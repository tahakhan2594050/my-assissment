@echo off
echo 🔧 FINAL FIX - Vercel Runtime Error Resolved
echo.
echo ✅ Applied Final Fix:
echo    - Simplified server structure (single index.js)
echo    - Fixed Vercel configuration
echo    - Removed runtime version issues
echo    - Added dummy data endpoints for testing
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
echo    Main: https://your-server-url.vercel.app/
echo    Health: https://your-server-url.vercel.app/api/health
echo    User Creations: https://your-server-url.vercel.app/api/user/get-user-creations
echo.
echo 📝 IMPORTANT: Add environment variables in Vercel Dashboard
echo    See FINAL_FIX_GUIDE.md for the complete list
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
echo    1. Test all endpoints work
echo    2. Add environment variables in Vercel dashboard
echo    3. Update client VITE_BASE_URL with server URL
echo    4. Test full application flow
echo.
pause