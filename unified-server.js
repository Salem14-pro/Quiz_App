// Unified Server - BRANIAC Landing Page + Quiz AI App
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const multer = require('multer');

// Import the existing backend functionality
const backendServer = require('./backend/server.js');

const app = express();
const server = http.createServer(app);

// Configure CORS for all origins
app.use(cors({
    origin: '*',
    credentials: true
}));

app.use(express.json());
app.use(express.static('public')); // For shared assets

// Serve BRANIAC Landing Page (Root Route)
app.use('/', express.static(path.join(__dirname, 'frontend-deploy')));

// Serve Quiz AI App 
app.use('/quiz', express.static(path.join(__dirname))); // Main quiz app files
app.use('/app', express.static(path.join(__dirname))); // Alternative route

// API Routes (from backend server)
app.use('/api', backendServer);

// Route Definitions
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend-deploy', 'index.html'));
});

app.get('/quiz', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Main quiz app
});

app.get('/app', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Alternative route
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        services: {
            'landing-page': 'active',
            'quiz-app': 'active',
            'api': 'active'
        }
    });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, '0.0.0.0', () => {
    console.log('🚀 Unified Quiz AI Server Started!');
    console.log('');
    console.log('📍 Server Details:');
    console.log(`   Port: ${PORT}`);
    console.log(`   Host: 0.0.0.0`);
    console.log('');
    console.log('🌐 Available Routes:');
    console.log(`   🏠 BRANIAC Landing Page: http://localhost:${PORT}/`);
    console.log(`   🧠 Quiz AI App: http://localhost:${PORT}/quiz`);
    console.log(`   🎮 Quiz App (Alt): http://localhost:${PORT}/app`);
    console.log(`   🔌 API Endpoints: http://localhost:${PORT}/api/`);
    console.log(`   ❤️  Health Check: http://localhost:${PORT}/health`);
    console.log('');
    console.log('🎯 Ready for deployment to any platform!');
});

module.exports = app;