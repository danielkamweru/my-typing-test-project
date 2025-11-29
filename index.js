// Sentence pools for different difficulty levels
const sentencePools = {
    easy: [
        "The cat sat on the mat and looked at me.",
        "I like to eat pizza with my friends.",
        "The sun is bright and warm today.",
        "She went to the store to buy some milk.",
        "We can play games after we finish our work.",
        "The dog runs fast in the big park.",
        "My mom makes the best cookies in town.",
        "The book was very good and fun to read.",
        "I want to go to the beach this summer.",
        "The car is red and has four doors.",
        "He likes to watch movies on the weekend.",
        "The flowers in the garden are very pretty.",
        "We had a great time at the party last night.",
        "The baby is sleeping in the small bed.",
        "I need to buy new shoes for school."
    ],
    medium: [
        "Technology has revolutionized the way we communicate with each other.",
        "The beautiful sunset painted the sky with vibrant colors of orange and pink.",
        "Learning a new language requires dedication, practice, and patience over time.",
        "The ancient castle stood majestically on the hill overlooking the peaceful valley.",
        "Scientists are constantly discovering new species in the depths of the ocean.",
        "The entrepreneur presented an innovative solution to the environmental problem.",
        "Music has the power to evoke emotions and bring people together across cultures.",
        "The detective carefully examined the evidence to solve the mysterious case.",
        "Traveling to different countries broadens your perspective on life and culture.",
        "The chef prepared an exquisite meal using fresh ingredients from the local market.",
        "Education is the foundation for building a successful and fulfilling career.",
        "The photographer captured the perfect moment when the eagle soared through the clouds.",
        "Climate change is one of the most pressing challenges facing our generation.",
        "The architect designed a sustainable building that harmonizes with its natural surroundings.",
        "Artificial intelligence is transforming industries and reshaping the future of work."
    ],
    hard: [
        "The pharmaceutical company's groundbreaking research led to the development of a revolutionary treatment for neurodegenerative diseases.",
        "Quantum mechanics demonstrates that subatomic particles exhibit both wave-like and particle-like characteristics simultaneously.",
        "The archaeological expedition uncovered extraordinary artifacts that challenged conventional theories about ancient civilizations.",
        "Biotechnology entrepreneurs are leveraging CRISPR gene-editing techniques to address previously incurable genetic disorders.",
        "The symphony's crescendo exemplified the composer's mastery of orchestration and his profound understanding of musical dynamics.",
        "Cryptocurrency's decentralized blockchain technology has disrupted traditional financial institutions and monetary systems worldwide.",
        "The astrophysicist's hypothesis regarding dark matter's influence on galactic rotation curves requires sophisticated mathematical modeling.",
        "Psychological research indicates that cognitive behavioral therapy effectively ameliorates symptoms of anxiety and depression disorders.",
        "The entrepreneur's innovative approach to sustainable agriculture incorporates precision farming techniques and artificial intelligence algorithms.",
        "Paleontologists discovered fossilized remains that provide unprecedented insights into the evolutionary trajectory of prehistoric mammals.",
        "The philosopher's treatise on existentialism explores the fundamental questions of human consciousness and authentic existence.",
        "Nanotechnology applications in medicine enable targeted drug delivery systems that minimize adverse effects while maximizing therapeutic efficacy.",
        "The meteorologist's sophisticated atmospheric modeling accurately predicted the hurricane's unprecedented trajectory and intensity fluctuations.",
        "Neuroscientists are investigating the intricate neural pathways responsible for memory consolidation and retrieval processes.",
        "The economist's comprehensive analysis revealed the complex interdependencies between global markets and geopolitical stability."
    ]
};

// DOM elements
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const textDisplay = document.getElementById('text-display');
const textInput = document.getElementById('text-input');
const timerDisplay = document.getElementById('timer');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const results = document.getElementById('results');
const difficultyBtns = document.querySelectorAll('.difficulty-btn');
const themeToggle = document.getElementById('theme-toggle');

// Test state
let currentDifficulty = 'easy';
let testText = '';
let startTime = null;
let timerInterval = null;
let isTestActive = false;
let isTestReady = false;
let totalCharacters = 0;
let correctCharacters = 0;

// Generate random sentence based on difficulty
function generateText(difficulty) {
    const sentences = sentencePools[difficulty];
    const randomIndex = Math.floor(Math.random() * sentences.length);
    return sentences[randomIndex];
}

// Update timer display
function updateTimer() {
    if (startTime) {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        timerDisplay.textContent = `${elapsed}s`;
    }
}

// Calculate and update WPM
function updateWPM() {
    if (startTime) {
        const elapsed = (Date.now() - startTime) / 1000 / 60; // minutes
        const typedText = textInput.value;
        const words = typedText.trim().split(/\s+/).filter(word => word.length > 0).length;
        const wpm = Math.round(words / elapsed) || 0;
        wpmDisplay.textContent = wpm;
    }
}

// Calculate and update accuracy
function updateAccuracy() {
    const typedText = textInput.value;
    totalCharacters = typedText.length;
    correctCharacters = 0;
    
    for (let i = 0; i < Math.min(typedText.length, testText.length); i++) {
        if (typedText[i] === testText[i]) {
            correctCharacters++;
        }
    }
    
    const accuracy = totalCharacters > 0 ? Math.round((correctCharacters / totalCharacters) * 100) : 100;
    accuracyDisplay.textContent = `${accuracy}%`;
    
    // Visual feedback
    highlightText();
}

// Highlight correct/incorrect text
function highlightText() {
    const typedText = textInput.value;
    let highlightedText = '';
    
    for (let i = 0; i < testText.length; i++) {
        const char = testText[i];
        if (i < typedText.length) {
            if (typedText[i] === char) {
                highlightedText += `<span class="correct">${char}</span>`;
            } else {
                highlightedText += `<span class="incorrect">${char}</span>`;
            }
        } else {
            highlightedText += char;
        }
    }
    
    textDisplay.innerHTML = highlightedText;
}

// Start test
function startTest() {
    testText = generateText(currentDifficulty);
    textDisplay.textContent = testText;
    textInput.value = '';
    textInput.disabled = false;
    textInput.focus();
    
    isTestReady = true;
    
    startBtn.textContent = 'Ready to Type';
    startBtn.disabled = true;
    resetBtn.disabled = false;
    
    // Disable difficulty selection during test
    difficultyBtns.forEach(btn => btn.disabled = true);
    
    results.textContent = 'Start typing to begin the timer! 🚀';
}

// Start timer when user begins typing
function startTimer() {
    if (!isTestActive && isTestReady) {
        startTime = Date.now();
        isTestActive = true;
        startBtn.textContent = 'Typing...';
        
        timerInterval = setInterval(() => {
            updateTimer();
            updateWPM();
        }, 100);
        
        results.textContent = 'Keep typing! You\'re doing great! 🚀';
    }
}

// End test
function endTest() {
    if (!isTestActive) return;
    
    isTestActive = false;
    clearInterval(timerInterval);
    
    const endTime = Date.now();
    const totalTime = (endTime - startTime) / 1000;
    const typedWords = textInput.value.trim().split(/\s+/).filter(word => word.length > 0).length;
    const wpm = Math.round((typedWords / totalTime) * 60);
    const accuracy = totalCharacters > 0 ? Math.round((correctCharacters / totalCharacters) * 100) : 0;
    
    // Show final results
    let performance = '';
    if (wpm >= 60 && accuracy >= 95) performance = 'Excellent! 🏆';
    else if (wpm >= 40 && accuracy >= 90) performance = 'Great job! 🎉';
    else if (wpm >= 25 && accuracy >= 80) performance = 'Good work! 👍';
    else performance = 'Keep practicing! 💪';
    
    results.innerHTML = `
        <strong>${performance}</strong><br>
        Final Speed: ${wpm} WPM | Accuracy: ${accuracy}% | Time: ${Math.round(totalTime)}s
    `;
    
    textInput.disabled = true;
    startBtn.textContent = 'Start Test';
    startBtn.disabled = false;
    resetBtn.disabled = false;
    
    // Re-enable difficulty selection
    difficultyBtns.forEach(btn => btn.disabled = false);
}

// Reset test
function resetTest() {
    isTestActive = false;
    isTestReady = false;
    clearInterval(timerInterval);
    
    textDisplay.textContent = 'Click "Start Test" to begin';
    textInput.value = '';
    textInput.disabled = true;
    
    timerDisplay.textContent = '0s';
    wpmDisplay.textContent = '0';
    accuracyDisplay.textContent = '100%';
    results.textContent = '';
    
    startBtn.textContent = 'Start Test';
    startBtn.disabled = false;
    resetBtn.disabled = true;
    
    difficultyBtns.forEach(btn => btn.disabled = false);
    
    startTime = null;
    totalCharacters = 0;
    correctCharacters = 0;
}

// Event listeners
startBtn.addEventListener('click', startTest);
resetBtn.addEventListener('click', resetTest);

// Difficulty selection
difficultyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (isTestActive) return;
        
        difficultyBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentDifficulty = btn.dataset.level;
        
        resetTest();
    });
});

// Text input events
textInput.addEventListener('input', () => {
    // Start timer on first keystroke
    if (isTestReady && !isTestActive) {
        startTimer();
    }
    
    if (!isTestActive) return;
    
    updateAccuracy();
    
    // Auto-complete test when user finishes typing
    if (textInput.value.length >= testText.length) {
        setTimeout(endTest, 500);
    }
});

// Prevent cheating (copy/paste)
textInput.addEventListener('paste', (e) => {
    e.preventDefault();
});

// Theme toggle functionality
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('darkTheme', isDark);
}

// Load saved theme
function loadTheme() {
    const savedTheme = localStorage.getItem('darkTheme');
    if (savedTheme === 'true') {
        document.body.classList.add('dark-theme');
        themeToggle.textContent = '☀️';
    }
}

// Theme toggle event listener
themeToggle.addEventListener('click', toggleTheme);

// Initialize
loadTheme();
resetTest();