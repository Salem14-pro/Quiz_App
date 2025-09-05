#!/bin/bash
# Script to push to additional repository
# Replace 'NEW_REPO_URL' with your actual new repository URL

echo "🚀 Pushing Quiz AI App to Additional Repository"
echo "==============================================="

# Add new remote with different name
echo "📍 Adding new remote as 'backup'..."
git remote add backup https://github.com/Salem14-pro/NEW_REPO_NAME.git

# Push all files to new repository
echo "📍 Pushing to new repository..."
git push -u backup master

echo "✅ Successfully pushed to additional repository!"
echo "🌐 Your files are now in both repositories!"

# Show all remotes
echo "📍 Current remotes:"
git remote -v
