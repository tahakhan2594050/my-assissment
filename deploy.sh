#!/bin/bash

echo "🚀 Starting deployment to Vercel..."

# Deploy server first
echo "📡 Deploying server..."
cd server
vercel --prod
echo "✅ Server deployed!"

# Get server URL (you'll need to update this manually)
echo "📝 Please copy your server URL from Vercel dashboard"
echo "🔄 Update client/.env.production with your server URL"
read -p "Press enter when you've updated the client environment variables..."

# Deploy client
echo "🎨 Deploying client..."
cd ../client
vercel --prod
echo "✅ Client deployed!"

echo "🎉 Deployment complete!"
echo "📋 Don't forget to:"
echo "   1. Add environment variables in Vercel dashboard"
echo "   2. Test all functionality"
echo "   3. Update any hardcoded URLs"