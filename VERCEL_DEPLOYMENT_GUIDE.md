# 🚀 Complete Vercel Deployment Guide

## Prerequisites
- Vercel account (free at vercel.com)
- Git repository with your code
- All environment variables ready

## Method 1: Using Vercel CLI (Recommended)

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy Server First
```bash
cd server
vercel --prod
```
- Follow the prompts
- Choose "N" for linking to existing project (first time)
- Set project name (e.g., "my-ai-app-server")
- Choose your scope/team

### 4. Configure Server Environment Variables
After deployment, go to Vercel Dashboard:
1. Select your server project
2. Go to Settings → Environment Variables
3. Add all variables from `DEPLOYMENT_ENV_VARIABLES.md`

### 5. Update Client Environment
1. Copy your server deployment URL from Vercel
2. Update `client/.env.production` with the server URL
3. Or add environment variables in Vercel Dashboard for client project

### 6. Deploy Client
```bash
cd ../client
vercel --prod
```

## Method 2: Using Vercel Dashboard (Web Interface)

### 1. Go to vercel.com and login

### 2. Deploy Server
1. Click "New Project"
2. Import your Git repository
3. **Important:** Set Root Directory to `server`
4. Click Deploy
5. Add environment variables in Settings

### 3. Deploy Client
1. Click "New Project" again
2. Import the same Git repository
3. **Important:** Set Root Directory to `client`
4. Add environment variables:
   - `VITE_CLERK_PUBLISHABLE_KEY`
   - `VITE_BASE_URL` (your server URL)
5. Click Deploy

## Important Configuration Notes

### Server Configuration
- Root Directory: `server`
- Build Command: (leave empty, uses package.json)
- Output Directory: (leave empty)
- Install Command: `npm install`

### Client Configuration  
- Root Directory: `client`
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### Domain Setup
1. Server will get URL like: `https://my-ai-app-server.vercel.app`
2. Client will get URL like: `https://my-ai-app-client.vercel.app`
3. Update client's `VITE_BASE_URL` to point to server URL

### CORS Configuration
Make sure your server allows requests from your client domain. Update server CORS settings if needed.

## Post-Deployment Checklist

✅ Server deployed and accessible  
✅ Client deployed and accessible  
✅ All environment variables configured  
✅ Client can communicate with server  
✅ Database connections working  
✅ Authentication (Clerk) working  
✅ File uploads (Cloudinary) working  
✅ AI APIs (OpenAI, Gemini) working  

## Troubleshooting

### Common Issues:
1. **CORS errors**: Update server CORS configuration
2. **Environment variables**: Double-check all variables are set
3. **Build failures**: Check Node.js version compatibility
4. **API errors**: Verify all API keys are correct

### Useful Commands:
```bash
# Check deployment logs
vercel logs [deployment-url]

# Redeploy
vercel --prod

# Check environment variables
vercel env ls
```

## Custom Domains (Optional)
1. Go to project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update environment variables with new domain

Your AI content creation platform will be live at:
- **Frontend**: https://your-client-app.vercel.app
- **Backend**: https://your-server-app.vercel.app