# Deploy Quiz AI App to DigitalOcean App Platform

DigitalOcean App Platform provides excellent full-stack deployment with integrated databases and CDN.

## 🌊 DigitalOcean App Platform Deployment Guide

### Step 1: Create DigitalOcean Account
1. Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
2. Sign up/Login
3. Connect your GitHub account

### Step 2: Create New App
1. Click "Create App"
2. Choose "GitHub" as source
3. Select your repository: `Salem14-pro/Quiz_App`
4. Choose branch: `master`
5. Enable "Autodeploy" for automatic deployments

### Step 3: Configure Build Settings
DigitalOcean will auto-detect:
- **Framework**: Node.js
- **Build Command**: `npm install`
- **Run Command**: `npm start` or `node server.js`

### Step 4: Environment Variables
In the app configuration:
- Add `GEMINI_API_KEY` = `AIzaSyANt9WI56zqzUfP3M0p2gsLMkUfbFbUeWw`
- Add `NODE_ENV` = `production`

### Step 5: Configure Resources
- **Instance Type**: Basic ($5/month) or Professional ($12/month)
- **Instance Count**: 1 (can scale up later)

### Step 6: Add Domain (Optional)
- Use provided domain: `https://your-app-name.ondigitalocean.app`
- Or add custom domain in settings

### Step 7: Deploy
Click "Create Resources" and wait for deployment!

## ✅ Advantages of DigitalOcean:
- ✅ Excellent documentation
- ✅ Integrated databases (PostgreSQL, MongoDB, Redis)
- ✅ Built-in CDN
- ✅ SSL certificates included
- ✅ Great monitoring and logs
- ✅ Predictable pricing

## 💰 Pricing:
- **Basic**: $5/month (perfect for your app)
- **Professional**: $12/month (with more resources)

Your app will be available at: `https://your-app-name.ondigitalocean.app`
