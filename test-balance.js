// Quick test to verify answer distribution balance
const { generateMockQuiz } = require('./server.js');

// Test function (we'll need to extract it from server.js or simulate it)
function testAnswerDistribution() {
    const testQuestions = [
        // Beginner level (correct answers: A, C)
        {
            question: "What is the most fundamental concept?",
            options: { A: "Basic definitions and principles", B: "Advanced techniques", C: "Historical controversies", D: "Quantum physics" },
            correct: "A"
        },
        {
            question: "How would you explain to a friend?",
            options: { A: "Complex formulas", B: "Advanced frameworks", C: "Simple everyday examples", D: "Criticisms" },
            correct: "C"
        },
        // Intermediate level (correct answers: D, B, C)  
        {
            question: "What's the practical approach?",
            options: { A: "Rely on intuition", B: "Use advanced only", C: "Avoid systematic", D: "Apply knowledge systematically" },
            correct: "D"
        },
        {
            question: "What demonstrates understanding?",
            options: { A: "Memorizing definitions", B: "Connecting concepts together", C: "Knowing theories", D: "Historical focus" },
            correct: "B"
        },
        {
            question: "How to approach problems?",
            options: { A: "Guess randomly", B: "Complex methods only", C: "Break down and apply principles", D: "Avoid problems" },
            correct: "C"
        },
        // Advanced level (correct answers: D, A, C)
        {
            question: "What distinguishes advanced practitioners?",
            options: { A: "Memorizing facts", B: "Complex vocabulary", C: "Avoiding applications", D: "Synthesizing complex concepts" },
            correct: "D"
        },
        {
            question: "What's crucial for success?",
            options: { A: "Deep analytical thinking", B: "Basic formulas", C: "Historical facts", D: "Avoiding innovation" },
            correct: "A"
        },
        {
            question: "How to handle conflicts?",
            options: { A: "First theory learned", B: "Ignore conflicts", C: "Critically evaluate evidence", D: "Popular opinion" },
            correct: "C"
        },
        // Expert level (correct answers: A, C, D)
        {
            question: "What characterizes expertise?",
            options: { A: "The ability to innovate and create new knowledge", B: "Simple memorization", C: "Following established methods", D: "Avoiding complex topics" },
            correct: "A"
        },
        {
            question: "How to approach challenges?",
            options: { A: "Traditional methods", B: "Trial and error", C: "Synthesize knowledge from multiple domains", D: "Seek approval" },
            correct: "C"
        },
        {
            question: "Role in broader contexts?",
            options: { A: "Exists in isolation", B: "Narrow scope only", C: "No practical applications", D: "Interconnects with multiple disciplines" },
            correct: "D"
        }
    ];

    console.log('\n🎯 ANSWER DISTRIBUTION ANALYSIS');
    console.log('================================');
    
    const distribution = { A: 0, B: 0, C: 0, D: 0 };
    
    testQuestions.forEach((q, index) => {
        distribution[q.correct]++;
        console.log(`Question ${index + 1}: Correct = ${q.correct}`);
    });
    
    console.log('\n📊 DISTRIBUTION SUMMARY:');
    console.log(`A: ${distribution.A} questions (${(distribution.A/testQuestions.length*100).toFixed(1)}%)`);
    console.log(`B: ${distribution.B} questions (${(distribution.B/testQuestions.length*100).toFixed(1)}%)`);
    console.log(`C: ${distribution.C} questions (${(distribution.C/testQuestions.length*100).toFixed(1)}%)`);
    console.log(`D: ${distribution.D} questions (${(distribution.D/testQuestions.length*100).toFixed(1)}%)`);
    
    const ideal = testQuestions.length / 4;
    const maxDeviation = Math.max(
        ...Object.values(distribution).map(count => Math.abs(count - ideal))
    );
    
    console.log(`\n✅ BALANCE SCORE: ${maxDeviation <= 1 ? 'EXCELLENT' : maxDeviation <= 2 ? 'GOOD' : 'NEEDS IMPROVEMENT'}`);
    console.log(`   Max deviation from perfect balance: ${maxDeviation.toFixed(1)} questions`);
}

testAnswerDistribution();
