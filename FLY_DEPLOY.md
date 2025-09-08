# Deploy Quiz AI App to Fly.io

Fly.io offers excellent performance with global edge deployment and great Node.js support.

## 🪰 Fly.io Deployment Guide

### Step 1: Install Fly CLI
```bash
# macOS
brew install flyctl

# Or download from https://fly.io/docs/getting-started/installing-flyctl/
```

### Step 2: Login and Setup
```bash
# Login to Fly.io
fly auth login

# Initialize your app in the project directory
cd /Users/macbook/Desktop/TITLED
fly launch
```

### Step 3: Configure fly.toml
The `fly launch` command creates a `fly.toml` file. Update it:

```toml
app = "quiz-ai-app"

[build]
  builder = "heroku/buildpacks:20"

[env]
  NODE_ENV = "production"
  PORT = "8080"

[http_service]
  internal_port = 8080
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true

[[services]]
  http_checks = []
  internal_port = 8080
  processes = ["app"]
  protocol = "tcp"
  script_checks = []

  [services.concurrency]
    hard_limit = 25
    soft_limit = 20
    type = "connections"

  [[services.ports]]
    force_https = true
    handlers = ["http"]
    port = 80

  [[services.ports]]
    handlers = ["tls", "http"]
    port = 443
```

### Step 4: Set Environment Variables
```bash
fly secrets set GEMINI_API_KEY=AIzaSyANt9WI56zqzUfP3M0p2gsLMkUfbFbUeWw
```

### Step 5: Deploy
```bash
fly deploy
```

### Step 6: Access Your App
```bash
fly open
```

## ✅ Advantages of Fly.io:
- ✅ Global edge deployment
- ✅ Excellent performance
- ✅ Great for real-time apps (Socket.IO)
- ✅ Docker-based deployment
- ✅ Built-in load balancing
- ✅ Custom domains with SSL

## 💰 Pricing:
- **Free**: 3 shared-cpu-1x VMs
- **Paid**: $2.67/month per VM

Your app will be available at: `https://quiz-ai-app.fly.dev`
