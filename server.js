// BRANIAC + Quick Quiz Practice Unified Server
// Perfect for scholarquiz.netlify.app deployment

const express = require('express');
const path = require('path');
const app = express();

// Middleware
app.use(express.json());
app.use(express.static('.'));

console.log('🚀 Setting up BRANIAC + Quick Quiz Practice...');

// Route 1: BRANIAC Landing Page (Main Page)
app.get('/', (req, res) => {
    console.log('📱 Serving BRANIAC Landing Page');
    res.sendFile(path.join(__dirname, 'frontend-deploy/index.html'));
});

// Route 2: Quick Quiz Practice App
app.get('/quiz', (req, res) => {
    console.log('🧠 Serving Quick Quiz Practice App');
    res.sendFile(path.join(__dirname, 'frontend/index.html'));
});

// Route 3: Practice (alternative route)
app.get('/practice', (req, res) => {
    console.log('📚 Serving Quick Quiz Practice (alternative route)');
    res.sendFile(path.join(__dirname, 'frontend/index.html'));
});

// Health check for deployment platforms
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        message: 'BRANIAC + Quick Quiz Practice ready!' 
    });
});

// Fallback route (removed wildcard that was causing issues)
app.use((req, res) => {
    console.log('🔄 Fallback to BRANIAC Landing Page');
    res.sendFile(path.join(__dirname, 'frontend-deploy/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`\n🌟 BRANIAC + Quick Quiz Practice Server Running!`);
    console.log(`📱 BRANIAC Landing: http://localhost:${PORT}/`);
    console.log(`🧠 Quick Quiz Practice: http://localhost:${PORT}/quiz`);
    console.log(`📚 Alternative Practice: http://localhost:${PORT}/practice`);
    console.log(`🔗 Ready for scholarquiz.netlify.app deployment!`);
    console.log(`\n✨ All routes configured for Netlify deployment ✨\n`);
});
