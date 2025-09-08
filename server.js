// Quiz AI App - Node.js Server with Socket.IO for Multiplayer
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const pdfParse = require('pdf-parse');

// TODO: Replace with your actual Gemini API key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyANt9WI56zqzUfP3M0p2gsLMkUfbFbUeWw';

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Configure multer for file uploads
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// In-memory storage for quiz rooms
const rooms = new Map();

// Generate random 6-digit PIN
function generatePin() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Gemini API functions
async function generateQuizFromTopic(topic, questionCount, difficulty = 'intermediate') {
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE' || GEMINI_API_KEY.startsWith('ghp_')) {
        // Return mock data for testing when API key is not properly configured
        console.log('Using mock data for quiz generation - configure a valid Gemini API key for real functionality');
        return generateMockQuiz(topic, questionCount, difficulty);
    }
    
    const difficultyPrompts = {
        beginner: "Create BEGINNER level questions focusing on basic concepts, definitions, and fundamental principles. Use straightforward language and avoid complex scenarios.",
        intermediate: "Create INTERMEDIATE level questions that require moderate understanding and application of concepts. Include some analytical thinking.",
        advanced: "Create ADVANCED level questions requiring deep understanding, analysis, and application. Include complex scenarios and multi-step reasoning.",
        expert: "Create EXPERT level questions that are challenging and require specialized knowledge, critical thinking, synthesis, and advanced problem-solving skills."
    };
    
    const prompt = `Generate ${questionCount} multiple-choice quiz questions about "${topic}". 
    
    DIFFICULTY LEVEL: ${difficultyPrompts[difficulty]}
    
    CREATIVITY REQUIREMENTS:
    - Make questions engaging and thought-provoking
    - Use real-world scenarios and practical applications when possible
    - Include creative distractors (wrong answers) that are plausible but clearly incorrect
    - Vary question types: definitions, applications, comparisons, problem-solving, scenarios
    - Use interesting examples and case studies
    - Make options witty but educational where appropriate
    - Keep answer options CONCISE (maximum 5-7 words each)
    - Use short phrases instead of full sentences for options
    
    Each question should have exactly 4 answer options (A, B, C, D) with only one correct answer.
    CRITICAL: Distribute correct answers randomly across ALL options (A, B, C, D). Avoid patterns.
    Ensure roughly equal distribution: 25% A, 25% B, 25% C, 25% D across all questions.
    Make the incorrect options creative and educational - they should teach something even when wrong.
    IMPORTANT: Keep all answer options SHORT and CONCISE (5-7 words maximum).
    
    Format the response as a JSON array with this structure:
    [
        {
            "question": "Question text here?",
            "options": {
                "A": "Creative option A text",
                "B": "Creative option B text", 
                "C": "Creative option C text",
                "D": "Creative option D text"
            },
            "correct": "A"
        }
    ]
    
    Make sure the questions are educational, varied in difficulty within the ${difficulty} level, and cover different aspects of the topic with creative scenarios.`;
    
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Gemini API Error Response (Topic):', response.status, errorText);
            throw new Error(`Failed to generate quiz from Gemini API: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        const text = data.candidates[0].content.parts[0].text;
        
        // Extract JSON from the response
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            const questions = JSON.parse(jsonMatch[0]);
            return shuffleAnswers(questions);
        } else {
            throw new Error('Invalid response format from Gemini API');
        }
    } catch (error) {
        console.error('Error generating quiz:', error);
        console.log('Falling back to mock data due to API error');
        // Fallback to mock data if API fails
        return generateMockQuiz(topic, questionCount, difficulty);
    }
}

async function generateQuizFromDocument(fileContent, questionCount, difficulty = 'intermediate') {
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE' || GEMINI_API_KEY.startsWith('ghp_')) {
        // Return mock data for testing when API key is not properly configured
        console.log('Using mock data for document quiz generation - configure a valid Gemini API key for real functionality');
        return generateMockDocumentQuiz(fileContent, questionCount, difficulty);
    }
    
    const difficultyPrompts = {
        beginner: "Create BEGINNER level questions focusing on basic facts, main ideas, and simple comprehension from the document. Use clear, straightforward questions.",
        intermediate: "Create INTERMEDIATE level questions requiring understanding, analysis, and connection of ideas from the document. Include some inferential thinking.",
        advanced: "Create ADVANCED level questions requiring deep analysis, synthesis of information, and critical evaluation of the document content.",
        expert: "Create EXPERT level questions that require sophisticated analysis, critical thinking, synthesis across concepts, and advanced interpretation of the document."
    };
    
    const prompt = `Based on the following document content, generate ${questionCount} multiple-choice quiz questions.
    
    DIFFICULTY LEVEL: ${difficultyPrompts[difficulty]}
    
    CREATIVITY REQUIREMENTS:
    - Create engaging questions that test real understanding, not just memorization
    - Use scenarios and applications based on the document content
    - Include creative distractors that are plausible but clearly wrong
    - Vary question types: comprehension, analysis, inference, application, evaluation
    - Make questions that would help someone truly understand the material
    - Use real-world connections where the document content applies
    - Keep answer options CONCISE (maximum 5-7 words each)
    - Use short phrases instead of full sentences for options
    
    Each question should have exactly 4 answer options (A, B, C, D) with only one correct answer.
    CRITICAL: Distribute correct answers randomly across ALL options (A, B, C, D). Avoid patterns.
    Ensure roughly equal distribution: 25% A, 25% B, 25% C, 25% D across all questions.
    Focus on the key concepts, facts, and important information from the document.
    Make the incorrect options educational and creative - they should relate to the content but be clearly wrong.
    IMPORTANT: Keep all answer options SHORT and CONCISE (5-7 words maximum).
    
    Document content:
    ${fileContent}
    
    Format the response as a JSON array with this structure:
    [
        {
            "question": "Question text here?",
            "options": {
                "A": "Creative option A text",
                "B": "Creative option B text", 
                "C": "Creative option C text",
                "D": "Creative option D text"
            },
            "correct": "A"
        }
    ]`;
    
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Gemini API Error Response (Document):', response.status, errorText);
            throw new Error(`Failed to generate quiz from Gemini API: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        const text = data.candidates[0].content.parts[0].text;
        
        // Extract JSON from the response
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            const questions = JSON.parse(jsonMatch[0]);
            return shuffleAnswers(questions);
        } else {
            throw new Error('Invalid response format from Gemini API');
        }
    } catch (error) {
        console.error('Error generating quiz from document:', error);
        console.log('Falling back to mock data due to API error');
        // Fallback to mock data if API fails
        return generateMockDocumentQuiz(fileContent, questionCount, difficulty);
    }
}

// Shuffle answer options to randomize correct answer position
function shuffleAnswers(questions) {
    return questions.map(question => {
        // Get all option entries and the correct answer text
        const options = Object.entries(question.options);
        const correctAnswerText = question.options[question.correct];
        
        // Shuffle the options using Fisher-Yates algorithm
        const shuffledOptions = [...options];
        for (let i = shuffledOptions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
        }
        
        // Create new options object with A, B, C, D keys in order
        const newOptions = {};
        const keys = ['A', 'B', 'C', 'D'];
        let newCorrectKey = '';
        
        shuffledOptions.forEach(([originalKey, value], index) => {
            newOptions[keys[index]] = value;
            if (value === correctAnswerText) {
                newCorrectKey = keys[index];
            }
        });
        
        return {
            ...question,
            options: newOptions,
            correct: newCorrectKey
        };
    });
}

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        apiKey: GEMINI_API_KEY ? 'configured' : 'missing'
    });
});

// Favicon route
app.get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(__dirname, 'favicon.ico'));
});

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API Routes for quiz generation
app.post('/api/generate-quiz/topic', async (req, res) => {
    try {
        const { topic, questionCount, difficulty } = req.body;
        
        if (!topic || !questionCount) {
            return res.status(400).json({ error: 'Topic and question count are required' });
        }
        
        console.log(`Generating quiz for topic: ${topic}, questions: ${questionCount}, difficulty: ${difficulty || 'intermediate'}`);
        const questions = await generateQuizFromTopic(topic, questionCount, difficulty);
        
        res.json({ questions });
    } catch (error) {
        console.error('Error generating topic quiz:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/generate-quiz/document', upload.single('document'), async (req, res) => {
    try {
        const { questionCount, difficulty } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ error: 'Document file is required' });
        }
        
        if (!questionCount) {
            return res.status(400).json({ error: 'Question count is required' });
        }
        
        // Extract text from uploaded file
        let fileContent;
        const fileExtension = req.file.originalname.toLowerCase().split('.').pop();
        
        try {
            if (fileExtension === 'txt') {
                fileContent = req.file.buffer.toString('utf-8');
            } else if (fileExtension === 'pdf') {
                console.log('Processing PDF file...');
                const pdfData = await pdfParse(req.file.buffer);
                fileContent = pdfData.text;
                console.log(`Extracted ${fileContent.length} characters from PDF`);
            } else {
                return res.status(400).json({ 
                    error: 'Unsupported file type. Please upload a TXT or PDF file.' 
                });
            }
            
            if (!fileContent || fileContent.trim().length === 0) {
                return res.status(400).json({ 
                    error: 'The uploaded file appears to be empty or unreadable. Please ensure it contains text content.' 
                });
            }
            
            // Clean up the extracted text
            fileContent = fileContent.replace(/\s+/g, ' ').trim();
            
        } catch (error) {
            console.error('Error processing file:', error);
            return res.status(400).json({ 
                error: 'Error processing the uploaded file. Please ensure it is a valid TXT or PDF file with readable content.' 
            });
        }
        
        console.log(`Generating quiz from document: ${req.file.originalname}, questions: ${questionCount}, difficulty: ${difficulty || 'intermediate'}`);
        console.log(`Document content length: ${fileContent.length} characters`);
        const questions = await generateQuizFromDocument(fileContent, questionCount, difficulty);
        
        res.json({ questions });
    } catch (error) {
        console.error('Error generating document quiz:', error);
        res.status(500).json({ error: error.message });
    }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    
    // Create a new quiz room
    socket.on('createRoom', (data) => {
        const pin = generatePin();
        const room = {
            pin: pin,
            host: socket.id,
            questions: data.questions,
            timeLimit: data.timeLimit || 0,
            players: [{
                id: socket.id,
                name: 'Host',
                isHost: true,
                score: 0
            }],
            isStarted: false,
            results: []
        };
        
        rooms.set(pin, room);
        socket.join(pin);
        
        console.log(`Room created with PIN: ${pin}, Time Limit: ${data.timeLimit || 'No limit'}`);
        socket.emit('roomCreated', { pin: pin });
        socket.emit('playerJoined', { players: room.players });
    });
    
    // Join an existing quiz room
    socket.on('joinRoom', (data) => {
        const { pin, name } = data;
        const room = rooms.get(pin);
        
        if (!room) {
            socket.emit('error', { message: 'Room not found' });
            return;
        }
        
        if (room.isStarted) {
            socket.emit('error', { message: 'Quiz has already started' });
            return;
        }
        
        // Check if name already exists
        const nameExists = room.players.some(player => player.name.toLowerCase() === name.toLowerCase());
        if (nameExists) {
            socket.emit('error', { message: 'Name already taken' });
            return;
        }
        
        // Add player to room
        const player = {
            id: socket.id,
            name: name,
            isHost: false,
            score: 0
        };
        
        room.players.push(player);
        socket.join(pin);
        
        console.log(`Player ${name} joined room ${pin}`);
        socket.emit('joinedRoom', { pin: pin, players: room.players });
        
        // Notify all players in the room
        io.to(pin).emit('playerJoined', { players: room.players });
    });
    
    // Start the quiz (host only)
    socket.on('startQuiz', (data) => {
        const { pin } = data;
        const room = rooms.get(pin);
        
        if (!room) {
            socket.emit('error', { message: 'Room not found' });
            return;
        }
        
        if (room.host !== socket.id) {
            socket.emit('error', { message: 'Only the host can start the quiz' });
            return;
        }
        
        if (room.players.length < 2) {
            socket.emit('error', { message: 'Need at least 2 players to start' });
            return;
        }
        
        room.isStarted = true;
        console.log(`Quiz started in room ${pin}`);
        
        // Send quiz questions and timer settings to all players
        io.to(pin).emit('quizStarted', { 
            questions: room.questions, 
            timeLimit: room.timeLimit 
        });
    });
    
    // Submit quiz score
    socket.on('submitScore', (data) => {
        const { pin, score, total } = data;
        const room = rooms.get(pin);
        
        if (!room) {
            socket.emit('error', { message: 'Room not found' });
            return;
        }
        
        // Find the player and update their score
        const player = room.players.find(p => p.id === socket.id);
        if (player) {
            player.score = score;
            player.total = total;
            
            // Add to results if not already added
            const existingResult = room.results.find(r => r.id === socket.id);
            if (!existingResult) {
                room.results.push({
                    id: socket.id,
                    name: player.name,
                    score: score,
                    total: total,
                    percentage: Math.round((score / total) * 100)
                });
            }
            
            console.log(`Player ${player.name} submitted score: ${score}/${total}`);
            
            // Check if all players have submitted scores
            if (room.results.length === room.players.length) {
                // Sort results by score (descending)
                room.results.sort((a, b) => b.score - a.score);
                
                console.log(`All players finished quiz in room ${pin}. Sending results.`);
                io.to(pin).emit('quizResults', { results: room.results });
            }
        }
    });
    
    // Handle player disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        
        // Find and remove player from any rooms
        for (const [pin, room] of rooms.entries()) {
            const playerIndex = room.players.findIndex(p => p.id === socket.id);
            
            if (playerIndex !== -1) {
                const player = room.players[playerIndex];
                console.log(`Player ${player.name} left room ${pin}`);
                
                // If host disconnects, close the room
                if (player.isHost) {
                    console.log(`Host left room ${pin}. Closing room.`);
                    io.to(pin).emit('error', { message: 'Host has left the room' });
                    rooms.delete(pin);
                } else {
                    // Remove player and notify others
                    room.players.splice(playerIndex, 1);
                    io.to(pin).emit('playerLeft', { players: room.players });
                }
                break;
            }
        }
    });
    
    // Get room info (for debugging)
    socket.on('getRoomInfo', (data) => {
        const { pin } = data;
        const room = rooms.get(pin);
        
        if (room) {
            socket.emit('roomInfo', {
                pin: room.pin,
                players: room.players,
                isStarted: room.isStarted,
                questionCount: room.questions.length
            });
        } else {
            socket.emit('error', { message: 'Room not found' });
        }
    });
});

// Clean up empty rooms periodically
setInterval(() => {
    const now = Date.now();
    for (const [pin, room] of rooms.entries()) {
        // Remove rooms with no players or rooms older than 1 hour
        if (room.players.length === 0 || (now - room.createdAt) > 3600000) {
            console.log(`Cleaning up room ${pin}`);
            rooms.delete(pin);
        }
    }
}, 300000); // Check every 5 minutes

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Export the app for serverless platforms (Vercel)
module.exports = app;

// Start server for Railway and other platforms
if (require.main === module) {
    const PORT = process.env.PORT || 3001;
    const HOST = process.env.HOST || '0.0.0.0';
    
    console.log(`🚄 Starting Quiz AI App...`);
    console.log(`📍 Target Port: ${PORT}`);
    console.log(`🔗 Host: ${HOST}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔑 API Key: ${GEMINI_API_KEY ? 'configured ✅' : 'missing ❌'}`);
    
    // Handle uncaught exceptions
    process.on('uncaughtException', (err) => {
        console.error('❌ Uncaught Exception:', err);
        process.exit(1);
    });
    
    process.on('unhandledRejection', (reason, promise) => {
        console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
        process.exit(1);
    });
    
    server.listen(PORT, HOST, () => {
        console.log(`🚄 Quiz AI App server running on Railway!`);
        console.log(`📍 Port: ${PORT}`);
        console.log(`🔗 Host: ${HOST}`);
        console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`🔑 API Key configured: ${GEMINI_API_KEY ? 'Yes ✅' : 'No ❌'}`);
        console.log(`🚀 Server ready for connections!`);
        console.log(`🌍 Health check: http://localhost:${PORT}/health`);
    }).on('error', (err) => {
        console.error('❌ Server failed to start:', err);
        console.error('❌ Error details:', {
            code: err.code,
            errno: err.errno,
            syscall: err.syscall,
            address: err.address,
            port: err.port
        });
        process.exit(1);
    });
}

// Mock data functions for testing without API key
function generateMockQuiz(topic, questionCount, difficulty = 'intermediate') {
    const difficultyData = {
        beginner: {
            questions: [
                {
                    question: `What is the most fundamental concept to understand when learning about ${topic}?`,
                    options: {
                        A: "Basic definitions and principles",
                        B: "Advanced implementation techniques", 
                        C: "Historical controversies",
                        D: "Quantum physics relationships"
                    },
                    correct: "A"
                },
                {
                    question: `If you were explaining ${topic} to a friend who's never heard of it, what would you start with?`,
                    options: {
                        A: "Complex mathematical formulas",
                        B: "Advanced theoretical frameworks",
                        C: "Simple everyday examples",
                        D: "Criticisms and limitations"
                    },
                    correct: "C"
                },
                {
                    question: `Which of these is typically the FIRST step when beginning to study ${topic}?`,
                    options: {
                        A: "Understanding basic vocabulary",
                        B: "Memorizing advanced terminology",
                        C: "Analyzing complex case studies",
                        D: "Debating controversial aspects"
                    },
                    correct: "A"
                }
            ]
        },
        intermediate: {
            questions: [
                {
                    question: `In a real-world scenario involving ${topic}, what would be the most practical approach to problem-solving?`,
                    options: {
                        A: "Rely purely on intuition",
                        B: "Use advanced techniques only", 
                        C: "Avoid systematic approaches",
                        D: "Apply knowledge systematically"
                    },
                    correct: "D"
                },
                {
                    question: `When analyzing different aspects of ${topic}, what demonstrates intermediate-level understanding?`,
                    options: {
                        A: "Memorizing basic definitions",
                        B: "Connecting concepts together",
                        C: "Knowing advanced theories",
                        D: "Focusing on historical development"
                    },
                    correct: "B"
                },
                {
                    question: `How would someone with moderate knowledge of ${topic} approach a challenging problem?`,
                    options: {
                        A: "Guess randomly",
                        B: "Use complex methods only",
                        C: "Break down and apply principles",
                        D: "Avoid the problem"
                    },
                    correct: "C"
                }
            ]
        },
        advanced: {
            questions: [
                {
                    question: `What distinguishes an advanced practitioner's approach to ${topic} from a beginner's?`,
                    options: {
                        A: "Memorizing more facts",
                        B: "Using complicated vocabulary",
                        C: "Avoiding practical applications",
                        D: "Synthesizing complex concepts"
                    },
                    correct: "D"
                },
                {
                    question: `In advanced applications of ${topic}, what is most crucial for success?`,
                    options: {
                        A: "Deep analytical thinking",
                        B: "Following basic formulas",
                        C: "Memorizing historical facts",
                        D: "Avoiding innovation"
                    },
                    correct: "A"
                },
                {
                    question: `How would an expert in ${topic} handle conflicting information or competing theories?`,
                    options: {
                        A: "Choose first theory learned",
                        B: "Ignore conflicting information",
                        C: "Critically evaluate evidence",
                        D: "Choose popular opinion"
                    },
                    correct: "C"
                }
            ]
        },
        expert: {
            questions: [
                {
                    question: `What characterizes expert-level mastery in ${topic}?`,
                    options: {
                        A: "The ability to innovate and create new knowledge",
                        B: "Simple memorization of facts", 
                        C: "Following established methods only",
                        D: "Avoiding complex topics"
                    },
                    correct: "A"
                },
                {
                    question: `How would a true expert approach an unprecedented challenge in ${topic}?`,
                    options: {
                        A: "Use only traditional methods",
                        B: "Rely on trial and error",
                        C: "Synthesize knowledge from multiple domains",
                        D: "Seek approval before acting"
                    },
                    correct: "C"
                },
                {
                    question: `What role does ${topic} play in broader intellectual and practical contexts according to expert understanding?`,
                    options: {
                        A: "Exists in isolation",
                        B: "Only matters in narrow scope",
                        C: "Has no practical applications",
                        D: "Interconnects with multiple disciplines"
                    },
                    correct: "D"
                }
            ]
        }
    };

    const selectedQuestions = difficultyData[difficulty]?.questions || difficultyData.intermediate.questions;
    
    // Extend with more creative questions if needed
    const additionalQuestions = [
        {
            question: `What would happen if the core principles of ${topic} were applied to solve a completely different type of problem?`,
            options: {
                A: "Nothing useful would result",
                B: "It would create more confusion",
                C: "The principles only work originally",
                D: "Could lead to innovative solutions"
            },
            correct: "D"
        },
        {
            question: `How has the understanding of ${topic} evolved, and what does this tell us about knowledge development?`,
            options: {
                A: "Knowledge builds upon discoveries",
                B: "It hasn't changed over time",
                C: "All new ideas are wrong",
                D: "Evolution is irrelevant"
            },
            correct: "A"
        },
        {
            question: `What creative applications of ${topic} might we see in the next decade?`,
            options: {
                A: "No new applications possible",
                B: "Only traditional uses continue",
                C: "Innovative tech combinations",
                D: "Less relevance over time"
            },
            correct: "C"
        }
    ];

    const allQuestions = [...selectedQuestions, ...additionalQuestions];
    
    // Return the requested number of questions
    const finalQuestions = allQuestions.slice(0, questionCount);
    return shuffleAnswers(finalQuestions);
}

function generateMockDocumentQuiz(fileContent, questionCount, difficulty = 'intermediate') {
    // Extract some keywords from the document for more relevant questions
    const words = fileContent.toLowerCase().split(/\s+/).filter(word => word.length > 4);
    const commonWords = ['javascript', 'programming', 'function', 'variable', 'code', 'development', 'system', 'process', 'method', 'concept'];
    const relevantWords = words.filter(word => commonWords.includes(word)).slice(0, 3);
    const context = relevantWords.length > 0 ? relevantWords.join(', ') : 'the document content';

    const difficultyData = {
        beginner: {
            questions: [
                {
                    question: `Based on the document, what is the main topic being discussed?`,
                    options: {
                        A: `Key concepts related to ${context} and their applications`,
                        B: "Unrelated historical events",
                        C: "Abstract philosophical debates",
                        D: "Random technical specifications"
                    },
                    correct: "A"
                },
                {
                    question: "What does the document suggest is important for beginners to understand?",
                    options: {
                        A: "Complex advanced theories only",
                        B: "Fundamental concepts and basic principles explained in the text",
                        C: "Controversial opinions without context",
                        D: "Memorization without comprehension"
                    },
                    correct: "B"
                }
            ]
        },
        intermediate: {
            questions: [
                {
                    question: `How does the document connect different concepts related to ${context}?`,
                    options: {
                        A: "Treats concepts in isolation",
                        B: "Only presents conflicting views",
                        C: "Shows relationships between concepts",
                        D: "Avoids making connections"
                    },
                    correct: "C"
                },
                {
                    question: "What can be inferred about best practices from the document?",
                    options: {
                        A: "Follow guidelines with understanding",
                        B: "Best practices are irrelevant",
                        C: "Any approach is valid",
                        D: "Never question tradition"
                    },
                    correct: "A"
                }
            ]
        },
        advanced: {
            questions: [
                {
                    question: `What deeper implications can be drawn from the document's discussion of ${context}?`,
                    options: {
                        A: "No broader implications exist",
                        B: "Purely theoretical, no value",
                        C: "Too complex to understand",
                        D: "Wide-ranging applications exist"
                    },
                    correct: "D"
                },
                {
                    question: "How would you critically evaluate the approach presented in the document?",
                    options: {
                        A: "Accept everything without question",
                        B: "Analyze reasoning and evidence",
                        C: "Reject everything automatically",
                        D: "Focus only on faults"
                    },
                    correct: "B"
                }
            ]
        },
        expert: {
            questions: [
                {
                    question: `How might the principles discussed in the document be synthesized with other domains of knowledge?`,
                    options: {
                        A: "Cannot connect to other fields",
                        B: "Synthesis is counterproductive", 
                        C: "Each domain stays separate",
                        D: "Could reveal cross-disciplinary innovations"
                    },
                    correct: "D"
                },
                {
                    question: "What original insights or innovations might emerge from a deep understanding of this document?",
                    options: {
                        A: "Deep understanding leads to breakthroughs",
                        B: "No insights from existing knowledge",
                        C: "Innovation unrelated to understanding",
                        D: "Only predetermined conclusions"
                    },
                    correct: "A"
                }
            ]
        }
    };

    const selectedQuestions = difficultyData[difficulty]?.questions || difficultyData.intermediate.questions;
    
    // Add more creative questions based on document analysis
    const additionalQuestions = [
        {
            question: "What creative applications of the document's concepts might be possible in other contexts?",
            options: {
                A: "No applications outside original",
                B: "Applications never deviate",
                C: "Creative adaptation leads to innovation",
                D: "Creativity has no place"
            },
            correct: "C"
        },
        {
            question: "How does the document's approach compare to alternative methodologies?",
            options: {
                A: "No alternatives exist",
                B: "All approaches are identical",
                C: "Comparison wastes time",
                D: "Comparing reveals improvement opportunities"
            },
            correct: "D"
        }
    ];

    const allQuestions = [...selectedQuestions, ...additionalQuestions];
    
    // Return the requested number of questions
    const finalQuestions = allQuestions.slice(0, questionCount);
    return shuffleAnswers(finalQuestions);
}
