# ⚡ Quick Client Deployment

## 🚀 One-Command Deployment

### Option 1: Use the Script
```bash
./deploy-client.bat
```

### Option 2: Manual Commands
```bash
# 1. Navigate to client directory
cd client

# 2. Install dependencies
npm install

# 3. Test build locally
npm run build

# 4. Deploy to Vercel
vercel --prod
```

## 📝 Before Deploying

### 1. Update Server URL
Replace in `client/.env`:
```
VITE_BASE_URL=https://YOUR-ACTUAL-SERVER-URL.vercel.app
```

### 2. Ensure Server is Working
Test your server endpoints:
- `https://your-server-url.vercel.app/api/health`
- `https://your-server-url.vercel.app/`

## 🎯 Deployment Settings

When prompted by Vercel CLI:
- **Project name:** `my-ai-app-client` (or your choice)
- **Link to existing project:** No (first time)
- **Root directory:** Should auto-detect `client`

## 📱 After Deployment

### Test These:
1. **Homepage loads:** `https://your-client-url.vercel.app`
2. **Dashboard works:** Sign in and check dashboard
3. **API calls work:** Check browser console for errors
4. **Authentication:** Sign in/out functionality

## 🔧 If Issues Occur

### Build Errors:
```bash
cd client
npm run build
# Fix any errors shown
```

### Environment Variables:
1. Go to Vercel Dashboard
2. Select your client project
3. Settings → Environment Variables
4. Add: `VITE_BASE_URL=https://your-server-url.vercel.app`

### API Connection Issues:
1. Check server is deployed and working
2. Verify CORS settings allow your client domain
3. Check browser console for network errors

Your client will be live at: `https://your-client-name.vercel.app` 🎉