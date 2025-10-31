# 🚀 GitHub Pages + Railway Deployment Guide

## Step 1: Deploy Frontend to GitHub Pages

### 1.1 Enable GitHub Pages
1. Go to **https://github.com/Salem14-pro/Quiz_App/settings/pages**
2. **Source**: Select "Deploy from a branch"
3. **Branch**: Select "master"
4. **Folder**: Select "/ (root)"
5. **Click "Save"**

Your frontend will be available at: **https://salem14-pro.github.io/Quiz_App/**

### 1.2 Test Frontend URLs
- **BRANIAC Landing Page**: https://salem14-pro.github.io/Quiz_App/frontend-deploy/
- **Quiz AI App**: https://salem14-pro.github.io/Quiz_App/

## Step 2: Deploy Backend to Railway

### 2.1 Deploy to Railway
1. Go to **https://railway.app**
2. **Sign in** with GitHub
3. **New Project** → **Deploy from GitHub repo**
4. **Select**: Salem14-pro/Quiz_App
5. **Deploy Now**

### 2.2 Add Environment Variables
1. In Railway dashboard → **Variables** tab
2. **Add**: `GEMINI_API_KEY` = `AIzaSyANt9WI56zqzUfP3M0p2gsLMkUfbFbUeWw`
3. **Save** and redeploy

Your backend will be at: **https://quiz-app-production-xxxx.up.railway.app**

## Step 3: Connect Frontend to Railway Backend

After Railway deployment, update your frontend to use the Railway API URL instead of localhost.

### Frontend URLs (GitHub Pages):
- **Landing Page**: https://salem14-pro.github.io/Quiz_App/frontend-deploy/
- **Quiz App**: https://salem14-pro.github.io/Quiz_App/
- **Backend API**: https://your-railway-url.up.railway.app

## Step 4: Update Navigation Links

Update the button links in your BRANIAC landing page to point to the GitHub Pages Quiz app URL.

## ✅ Final Result:
- **Free Frontend Hosting** on GitHub Pages
- **Powerful Backend** on Railway with AI features
- **Professional URLs** for sharing
- **Automatic deployments** on every git push