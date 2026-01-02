# 🏠 Local Development Guide

## 🚀 Quick Start

### Option 1: One-Click Start (Recommended)
```bash
./start-website.bat
```
This will start both server and client automatically in separate windows.

### Option 2: Manual Start
```bash
# Terminal 1 - Start Server
./start-server.bat

# Terminal 2 - Start Client  
./start-client.bat
```

### Option 3: Individual Commands
```bash
# Start Server
cd server
npm install
npm run dev

# Start Client (in new terminal)
cd client
npm install
npm run dev
```

## 🌐 Access Your Website

After starting both services:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000
- **Health Check**: http://localhost:3000/api/health

## 📁 Project Structure

```
my-assissment/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── pages/         # React pages
│   │   ├── components/    # React components
│   │   └── assets/        # Images, icons, etc.
│   ├── .env               # Client environment variables
│   └── package.json       # Client dependencies
├── server/                # Node.js Backend
│   ├── routes/           # API routes
│   ├── controllers/      # Business logic
│   ├── configs/          # Database, Cloudinary config
│   ├── middlewares/      # Authentication, etc.
│   ├── .env              # Server environment variables
│   ├── index.js          # Server entry point
│   └── package.json      # Server dependencies
└── start-website.bat     # Quick start script
```

## 🔧 Environment Variables

### Server (.env)
```
DATABASE_URL=your_database_url
CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
GEMINI_API_KEY=your_gemini_key
OPENAI_API_KEY=your_openai_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

### Client (.env)
```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
VITE_BASE_URL=http://localhost:3000
```

## 🛠️ Available Scripts

### Server Scripts
- `npm run dev` - Start server with nodemon (auto-restart)
- `npm start` - Start server normally

### Client Scripts  
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🎯 Features Available

### AI Tools
- ✅ AI Article Writer
- ✅ Blog Title Generator  
- ✅ AI Image Generation
- ✅ Background Removal
- ✅ Object Removal
- ✅ Resume Reviewer

### User Features
- ✅ Authentication (Clerk)
- ✅ Dashboard
- ✅ Creation Management
- ✅ Community Features

## 🔍 Troubleshooting

### Server Won't Start
1. Check if port 3000 is available
2. Verify environment variables in `server/.env`
3. Run `npm install` in server directory

### Client Won't Start  
1. Check if port 5173 is available
2. Verify environment variables in `client/.env`
3. Run `npm install` in client directory

### API Connection Issues
1. Ensure server is running on port 3000
2. Check `VITE_BASE_URL` in client/.env
3. Verify CORS settings allow localhost:5173

### Database Connection Issues
1. Check `DATABASE_URL` in server/.env
2. Ensure database is accessible
3. Check network connectivity

## 📊 Development Tools

### Useful URLs
- **Client Dev Server**: http://localhost:5173
- **Server API**: http://localhost:3000
- **API Health**: http://localhost:3000/api/health
- **API Docs**: http://localhost:3000 (shows available routes)

### Browser Dev Tools
- Press F12 to open developer tools
- Check Console tab for errors
- Check Network tab for API calls
- Check Application tab for local storage

## 🎉 You're All Set!

Your AI Content Creation Platform is now running locally with:
- ✅ Full-stack development environment
- ✅ Hot reload for both client and server
- ✅ All AI features available
- ✅ Authentication system
- ✅ Database integration
- ✅ File upload capabilities

Happy coding! 🚀