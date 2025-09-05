# 🚀 Vercel Deployment Guide

## Quick Deploy to Vercel

1. **Go to [vercel.com](https://vercel.com)**
2. **Sign in** with your GitHub account
3. **Import Repository**: Select `Quiz_Arena`
4. **Environment Variables**: Add `GEMINI_API_KEY`
5. **Deploy**: Click Deploy button

## Environment Variables Required

```
GEMINI_API_KEY=AIzaSyANt9WI56zqzUfP3M0p2gsLMkUfbFbUeWw
```

## Features Supported on Vercel

✅ Quiz Generation API  
✅ Document Upload & Processing  
✅ Static File Serving  
✅ Socket.IO Multiplayer  
✅ Responsive Design  
✅ All Timer Functions  

## Vercel Configuration Files

- `vercel.json` - Main configuration
- `index.js` - Serverless entry point
- `.vercelignore` - Files to exclude
- `.env.example` - Environment variables template

## Testing After Deployment

Test these URLs on your deployed app:
- `/` - Homepage
- `/api/generate-quiz/topic` - Quiz API
- Multiplayer functionality
- File upload features

Your app will be available at: `https://quiz-arena-[random].vercel.app`
