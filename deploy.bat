@echo off
echo 🚀 Starting deployment to Vercel...

REM Deploy server first
echo 📡 Deploying server...
cd server
call vercel --prod
echo ✅ Server deployed!

REM Prompt for server URL update
echo 📝 Please copy your server URL from Vercel dashboard
echo 🔄 Update client/.env.production with your server URL
pause

REM Deploy client
echo 🎨 Deploying client...
cd ../client
call vercel --prod
echo ✅ Client deployed!

echo 🎉 Deployment complete!
echo 📋 Don't forget to:
echo    1. Add environment variables in Vercel dashboard
echo    2. Test all functionality
echo    3. Update any hardcoded URLs
pause