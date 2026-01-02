# 🎨 Client Deployment Guide for Vercel

## 📋 Prerequisites
- Server already deployed to Vercel
- Server URL copied from Vercel dashboard
- Vercel CLI installed (`npm install -g vercel`)

## 🚀 Deployment Methods

### Method 1: Using Vercel CLI (Recommended)

#### Step 1: Navigate to Client Directory
```bash
cd client
```

#### Step 2: Update Environment Variables
Replace `your-server-deployment-url` in `.env` and `.env.production` with your actual server URL from Vercel.

Example:
```
VITE_BASE_URL=https://my-ai-app-server.vercel.app
```

#### Step 3: Deploy to Vercel
```bash
vercel --prod
```

Follow the prompts:
- Link to existing project? **N** (first time)
- Project name: `my-ai-app-client` (or your preferred name)
- Directory: **./client** (should auto-detect)

### Method 2: Using Vercel Dashboard (Web Interface)

#### Step 1: Go to Vercel Dashboard
1. Visit [vercel.com](https://vercel.com)
2. Click "New Project"

#### Step 2: Import Repository
1. Connect your Git repository
2. **Important:** Set Root Directory to `client`
3. Keep other settings as default:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

#### Step 3: Add Environment Variables
In project settings, add:
```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_Zmxvd2luZy1jb2QtMjIuY2xlcmsuYWNjb3VudHMuZGV2JA
VITE_BASE_URL=https://your-server-url.vercel.app
```

#### Step 4: Deploy
Click "Deploy" button

## 🔧 Client Configuration

### Vercel Settings for Client:
- **Root Directory:** `client`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`
- **Node.js Version:** 18.x (or latest)

### Environment Variables Required:
```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_Zmxvd2luZy1jb2QtMjIuY2xlcmsuYWNjb3VudHMuZGV2JA
VITE_BASE_URL=https://your-server-url.vercel.app
```

## 🧪 Testing Your Deployment

### 1. Test Client Loading
Visit your client URL: `https://your-client-url.vercel.app`

### 2. Test API Connection
1. Open browser developer tools (F12)
2. Go to Network tab
3. Navigate to Dashboard page
4. Check if API calls to your server are successful

### 3. Test Authentication
1. Try to sign in with Clerk
2. Check if authentication redirects work
3. Verify protected routes work

## 🔍 Troubleshooting

### Common Issues:

#### 1. Build Failures
```bash
# Check if build works locally
cd client
npm run build
```

#### 2. Environment Variables Not Working
- Ensure variables start with `VITE_`
- Check they're added in Vercel Dashboard
- Redeploy after adding variables

#### 3. API Connection Issues
- Verify server URL is correct
- Check CORS settings on server
- Ensure server is deployed and working

#### 4. Authentication Issues
- Verify Clerk keys are correct
- Check Clerk dashboard settings
- Ensure domain is added to Clerk

### Useful Commands:
```bash
# Check deployment logs
vercel logs https://your-client-url.vercel.app

# Redeploy
vercel --prod

# Check environment variables
vercel env ls
```

## 📱 Expected Results

After successful deployment:

✅ **Client loads** at your Vercel URL  
✅ **API calls work** to your server  
✅ **Authentication works** with Clerk  
✅ **Dashboard shows** user creations  
✅ **All pages load** without errors  

## 🌐 Final URLs

Your application will be available at:
- **Frontend:** `https://your-client-name.vercel.app`
- **Backend:** `https://your-server-name.vercel.app`

## 🎯 Next Steps

1. **Test all features** thoroughly
2. **Add custom domain** (optional)
3. **Set up monitoring** (optional)
4. **Configure analytics** (optional)

Your AI content creation platform is now live! 🎉