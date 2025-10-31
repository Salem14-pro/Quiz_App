# 🚀 Railway Backend Deployment Guide

## Step 1: Deploy Backend to Railway

### 1.1 Connect to Railway
1. Go to **https://railway.app**
2. **Sign in** with GitHub
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"**
5. Choose **Salem14-pro/Quiz_App** repository
6. **Important**: Set **ROOT DIRECTORY** to `backend`

### 1.2 Configure Environment Variables
1. In Railway dashboard → **Variables** tab
2. Add these environment variables:
   - **GEMINI_API_KEY**: `AIzaSyANt9WI56zqzUfP3M0p2gsLMkUfbFbUeWw`
   - **NODE_ENV**: `production`
3. **Save** and wait for automatic redeploy

### 1.3 Test Deployment
Your Railway backend will be available at: **https://your-app-name.up.railway.app**

Test endpoints:
- **Health**: https://your-app-name.up.railway.app/health
- **API**: https://your-app-name.up.railway.app/api/generate-quiz/topic

## Step 2: Update Frontend Configuration

After Railway deployment, update `frontend/script.js`:

```javascript
// Line 5: Update API_BASE_URL
const API_BASE_URL = 'https://your-actual-railway-url.up.railway.app';
```

## Step 3: Deploy Updated Frontend

Commit and push changes to update GitHub Pages:

```bash
git add frontend/script.js
git commit -m "Update: Connect frontend to Railway backend"
git push origin master
```

## ✅ Final Testing Checklist

### Local Testing (✅ Completed):
- ✅ BRANIAC landing page loads with animations
- ✅ Navigation buttons work 
- ✅ Quiz AI app loads properly
- ✅ Backend API responds correctly
- ✅ Quiz generation works

### Production Testing (📋 Next Steps):
- [ ] Railway backend deployment
- [ ] API endpoint updates
- [ ] GitHub Pages frontend update
- [ ] End-to-end production testing

## 🌟 Current Status:
- **Frontend**: Ready for GitHub Pages
- **Backend**: Ready for Railway deployment  
- **API Integration**: Configured and tested locally
- **Navigation**: Working between BRANIAC → Quiz AI

Your app is **deployment-ready**! 🎉