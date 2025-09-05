#!/bin/bash
# Script to push to new repository
# Pushing to Quiz_App repository

echo "🚀 Pushing Quiz AI App to New Repository"
echo "========================================="

# Remove current remote
echo "📍 Removing current remote..."
git remote remove origin

# Add new remote
echo "📍 Adding new remote..."
git remote add origin https://github.com/Salem14-pro/Quiz_App.git

# Push all files to new repository
echo "📍 Pushing to new repository..."
git push -u origin master

echo "✅ Successfully pushed to new repository!"
echo "🌐 Your new repository is ready at: https://github.com/Salem14-pro/Quiz_App"
