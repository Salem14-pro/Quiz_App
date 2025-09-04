# Quiz AI App

A full-featured Quiz AI application powered by Google's Gemini API with multiplayer support using WebSockets.

## Features

### 🎯 Quiz Generation
- **Topic-based**: Generate quizzes from any topic using AI
- **Document-based**: Upload PDF or TXT files to generate questions from content
- **4 Difficulty Levels**: Choose from Beginner, Intermediate, Advanced, or Expert
- **Creative Questions**: Engaging scenarios with educational options
- **Flexible Question Count**: Choose from 3 to 30 questions
- **Timer Options**: Set time limits from 30 seconds to 5 minutes per question, or no limit
- **Smart randomization**: Correct answers are randomly distributed across options

### 🎮 Game Modes
- **Instant Play**: Single-player mode for immediate quiz experience
- **Multiplayer**: Real-time multiplayer with host/join functionality
  - Host creates room with 6-digit PIN
  - Players join using PIN
  - Real-time synchronization of quiz progress
  - Live leaderboard and scoring

### 🎨 User Experience
- Clean, modern, responsive design
- Smooth animations and transitions
- Intuitive navigation
- Mobile-friendly interface
- Progress tracking and scoring

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone or download the project files**
   ```bash
   cd quiz-ai-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```
   
   For development with auto-restart:
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3001`

5. **Configure API Key**
   - On first visit, you'll be prompted to enter your Gemini API key
   - The key is stored locally in your browser
   - Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

## Usage Guide

### Single Player (Instant Play)

1. Click "Instant Play" on the landing page
2. Choose between:
   - **Topic-based**: Enter any topic (e.g., "JavaScript", "World History", "Biology")
   - **Document-based**: Upload a PDF or TXT file
3. Select difficulty level (Beginner, Intermediate, Advanced, Expert)
4. Select number of questions (3, 5, 7, 10, 15, 20, 25, or 30)
5. Choose time limit (No limit, 30 seconds to 5 minutes per question)
6. Click "Generate Quiz"
7. Answer questions within the time limit and see your final score

### Multiplayer

#### Hosting a Quiz
1. Click "Multiplayer" → "Host a Quiz"
2. Set up your quiz (topic or document-based)
3. Choose difficulty level, number of questions, and time limit
4. Click "Create Room"
5. Share the 6-digit PIN with players
6. Wait for players to join, then click "Start Quiz"

#### Joining a Quiz
1. Click "Multiplayer" → "Join a Quiz"
2. Enter the 6-digit PIN and your name
3. Wait for the host to start the quiz
4. Answer questions and compete with other players

## File Structure

```
quiz-ai-app/
├── index.html                    # Main HTML file with all UI components
├── style.css                     # Complete CSS with modern styling
├── script.js                     # Frontend JavaScript with game logic
├── server.js                     # Node.js server with Socket.IO for multiplayer
├── package.json                  # Node.js dependencies and scripts
├── test-document.txt             # Sample text file for testing
├── sample-programming-history.txt # Sample content file
└── README.md                     # This file
```

## Technical Features

### Frontend
- **Vanilla JavaScript**: No framework dependencies
- **CSS3**: Modern styling with gradients, shadows, and animations
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Socket.IO Client**: Real-time multiplayer communication

### Backend
- **Express.js**: Web server framework
- **Socket.IO**: WebSocket library for real-time communication
- **Room Management**: Automatic cleanup of empty/old rooms
- **Error Handling**: Comprehensive error handling and validation

### API Integration
- **Gemini API**: Google's AI for generating quiz questions
- **Intelligent Prompts**: Structured prompts for consistent question format
- **Content Analysis**: Document parsing for relevant question generation
- **PDF Support**: Advanced PDF text extraction using pdf-parse library
- **Difficulty Adaptation**: AI prompts adjust based on selected difficulty level

## Customization

### Adding Question Types
Modify the prompt in `generateQuizFromTopic()` or `generateQuizFromDocument()` in `script.js` to change question formats.

### Styling
All styles are in `style.css` using CSS custom properties (variables) for easy theming.

### Server Configuration
Adjust server settings in `server.js`:
- Port configuration
- Room cleanup intervals
- CORS settings

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Troubleshooting

### Common Issues

1. **API Key Issues**
   - Ensure your Gemini API key is valid
   - Check API quotas and billing
   - Verify key permissions

2. **Multiplayer Not Working**
   - Check if the server is running
   - Ensure port 3001 is not blocked
   - Try refreshing the page

3. **File Upload Issues**
   - PDF and TXT files are supported
   - File size should be reasonable (< 10MB)
   - Ensure file contains readable text
   - For PDFs, ensure they contain extractable text (not just images)

4. **Connection Issues**
   - Check internet connection
   - Verify server is accessible
   - Try disabling browser extensions

## Development

### Adding Features
1. Frontend logic goes in `script.js`
2. Styling changes go in `style.css`
3. Server-side logic goes in `server.js`
4. UI components are in `index.html`

### Testing
- Test single-player mode with various topics
- Test document upload with different file types
- Test multiplayer with multiple browser tabs
- Test mobile responsiveness

## Security Notes

- API keys are stored in browser localStorage
- Server validates all socket events
- Room PINs are randomly generated
- No persistent data storage (privacy-friendly)

## Performance

- Questions are generated on-demand
- Minimal server resource usage
- Client-side game logic for responsiveness
- Automatic room cleanup prevents memory leaks

## License

MIT License - Feel free to modify and distribute.

## Support

For issues or questions:
1. Check this README
2. Review browser console for errors
3. Verify API key and server status
4. Test with different browsers/devices
