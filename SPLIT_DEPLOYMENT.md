# 🚀 Quiz AI App - Separate Frontend/Backend Deployment Guide

Your Quiz AI App has been split into separate frontend and backend components for better deployment and scalability.

## 📁 Project Structure

```
TITLED/
├── frontend/           # Static website (HTML, CSS, JS)
│   ├── index.html
│   ├── script.js      # Updated with configurable API URL
│   ├── style.css
│   ├── favicon.ico
│   └── README.md
├── backend/            # Node.js API server
│   ├── server.js      # Updated with CORS for frontend
│   ├── package.json
│   ├── railway.json
│   ├── api/
│   └── README.md
└── SPLIT_DEPLOYMENT.md (this file)
```

## 🎯 Deployment Steps

### Step 1: Deploy Backend First

**Recommended: Railway**

1. **Go to [railway.app](https://railway.app)**
2. **Login with GitHub**
3. **Create New Project** → **Deploy from GitHub repo**
4. **Select your Quiz_App repository**
5. **Set Root Directory**: `/backend` (important!)
6. **Add Environment Variables**:
   - `GEMINI_API_KEY` = `AIzaSyANt9WI56zqzUfP3M0p2gsLMkUfbFbUeWw`
   - `NODE_ENV` = `production`
7. **Deploy!**

**Your backend will be available at**: `https://your-app-name.up.railway.app`

### Step 2: Deploy Frontend

**Recommended: Netlify**

1. **Go to [netlify.com](https://netlify.com)**
2. **Drag and drop** the `frontend` folder
3. **Or connect your GitHub repo** and set build directory to `/frontend`
4. **Deploy!**

**Alternative: Vercel**
- Go to [vercel.com](https://vercel.com)
- Import your repository
- Set Framework Preset: "Other"
- Set Root Directory: `frontend`

### Step 3: Connect Frontend to Backend

**CRITICAL**: Update the frontend to point to your deployed backend:

1. **Edit `frontend/script.js`**
2. **Find line 6**: `const API_BASE_URL = 'https://your-backend-url-here.up.railway.app';`
3. **Replace with your actual Railway URL**: `const API_BASE_URL = 'https://quiz-ai-backend-production-xxxx.up.railway.app';`
4. **Redeploy the frontend**

### Step 4: Update Backend CORS

1. **Edit `backend/server.js`**
2. **Find the CORS configuration** (around lines 15 and 35)
3. **Replace** `'https://your-frontend-domain.netlify.app'` with your actual frontend URL
4. **Redeploy the backend**

## ✅ Success Checklist

- [ ] Backend deployed and running on Railway
- [ ] Frontend deployed on Netlify/Vercel
- [ ] API_BASE_URL updated in frontend script.js
- [ ] CORS origins updated in backend server.js
- [ ] Both redeployed after configuration updates
- [ ] Test: Can generate AI quizzes?
- [ ] Test: Can upload documents?
- [ ] Test: Does multiplayer work?

## 🔗 Expected URLs

- **Frontend**: `https://your-quiz-app.netlify.app`
- **Backend**: `https://your-quiz-backend.up.railway.app`
- **Backend Health**: `https://your-quiz-backend.up.railway.app/health`

## 🆘 Troubleshooting

**CORS Errors?**
- Make sure backend CORS includes your frontend domain
- Redeploy backend after CORS changes

**API Not Working?**
- Check API_BASE_URL in frontend script.js
- Verify backend is running: visit `/health` endpoint

**Multiplayer Not Working?**
- Check Socket.IO CORS configuration in backend
- Ensure frontend connects to correct backend URL

## 💡 Benefits of This Setup

✅ **Independent Scaling**: Scale frontend and backend separately  
✅ **Better Performance**: Static frontend loads instantly  
✅ **Easier Updates**: Update frontend without touching backend  
✅ **Multiple Frontends**: Could add mobile app using same backend  
✅ **Professional Architecture**: Industry-standard separation  

## 🎉 You're Ready!

Both your frontend and backend are now ready for deployment. Follow the steps above and your Quiz AI App will be live on the internet with professional architecture!

---

Need help? Check the README.md files in each folder for detailed instructions.
