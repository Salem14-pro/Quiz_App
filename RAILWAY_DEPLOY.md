# Deploy Quiz AI App to Railway

Railway is an excellent platform for full-stack applications with great Node.js support and built-in databases.

## 🚄 Railway Deployment Guide

### Step 1: Prepare Your App
Your app is already configured! Railway works with your current setup.

### Step 2: Deploy to Railway
1. **Sign up**: Go to [railway.app](https://railway.app)
2. **Connect GitHub**: Link your GitHub account
3. **Create New Project**: Click "New Project" → "Deploy from GitHub repo"
4. **Select Repository**: Choose `Salem14-pro/Quiz_App`
5. **Configure**: Railway auto-detects Node.js apps

### Step 3: Environment Variables
In Railway dashboard:
- Go to your project → Variables
- Add: `GEMINI_API_KEY` = `AIzaSyANt9WI56zqzUfP3M0p2gsLMkUfbFbUeWw`
- Add: `PORT` = `3001` (optional, Railway sets this automatically)

### Step 4: Deploy Settings
Railway automatically:
- Detects `package.json`
- Runs `npm install`
- Starts with `npm start` or `node server.js`
- Provides HTTPS domain

### Step 5: Custom Domain (Optional)
- Go to Settings → Domains
- Add your custom domain
- Railway provides SSL automatically

## ✅ Advantages of Railway:
- ✅ Perfect for Node.js + Socket.IO
- ✅ Built-in PostgreSQL/MySQL if needed later
- ✅ Automatic SSL/HTTPS
- ✅ Git-based deployments
- ✅ Great free tier
- ✅ Easy environment variables
- ✅ Excellent uptime

## 💰 Pricing:
- **Free**: Perfect for your quiz app
- **Pro**: $5/month for production apps

Your app will be available at: `https://your-app-name.railway.app`
