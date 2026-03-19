// TypeMaster Pro - World-Class Typing Test Application
// A comprehensive typing test with real-time feedback, multiple modes, and detailed analytics

class TypingTestApp {
    constructor() {
        // Core configuration
        this.config = {
            mode: 'time', // 'time' or 'words'
            timeLimit: 30,
            wordCount: 25,
            difficulty: 'easy',
            punctuationEnabled: false,
            soundEnabled: true,
            theme: 'auto'
        };

        // Test state
        this.state = {
            isActive: false,
            isReady: false,
            startTime: null,
            endTime: null,
            currentText: '',
            typedText: '',
            correctChars: 0,
            incorrectChars: 0,
            totalChars: 0,
            wpmHistory: [],
            accuracyHistory: [],
            timerInterval: null,
            currentWordIndex: 0
        };

        // Performance optimization
        this.updateTimeout = null;
        this.renderCache = new Map();
        
        // Word pools for different difficulties
        this.wordPools = {
            easy: [
                'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'I',
                'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
                'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
                'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
                'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
                'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
                'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other',
                'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
                'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way',
                'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us'
            ],
            medium: [
                'about', 'above', 'across', 'after', 'against', 'along', 'among', 'around',
                'before', 'behind', 'below', 'beneath', 'beside', 'between', 'beyond',
                'during', 'except', 'inside', 'into', 'like', 'near', 'off', 'since',
                'through', 'toward', 'under', 'until', 'upon', 'within', 'without',
                'according', 'although', 'because', 'however', 'therefore', 'moreover',
                'nevertheless', 'nonetheless', 'otherwise', 'furthermore', 'meanwhile',
                'technology', 'computer', 'software', 'internet', 'digital', 'electronic',
                'information', 'communication', 'development', 'programming', 'database',
                'algorithm', 'architecture', 'engineering', 'mathematics', 'statistics',
                'research', 'analysis', 'design', 'implementation', 'optimization',
                'performance', 'efficiency', 'productivity', 'innovation', 'creativity'
            ],
            hard: [
                'cryptocurrency', 'blockchain', 'decentralized', 'smart', 'contracts',
                'artificial', 'intelligence', 'machine', 'learning', 'neural', 'networks',
                'quantum', 'computing', 'biotechnology', 'nanotechnology', 'sustainable',
                'architecture', 'philosophical', 'methodology', 'epistemology', 'paradigm',
                'synchronization', 'authentication', 'authorization', 'cryptographic',
                'entrepreneurship', 'metropolitan', 'infrastructure', 'globalization',
                'socioeconomic', 'psychological', 'physiological', 'biochemical',
                'electromagnetic', 'thermodynamic', 'nanomaterials', 'semiconductor',
                'pharmaceutical', 'neuroscience', 'paleontological', 'archaeological',
                'extraterrestrial', 'intergalactic', 'subatomic', 'quantum', 'mechanics',
                'relativistic', 'gravitational', 'electromagnetic', 'photosynthesis',
                'metamorphosis', 'homeostasis', 'symbiotic', 'parasitic', 'commensal'
            ],
            expert: [
                'antidisestablishmentarianism', 'pneumonoultramicroscopicsilicovolcanoconiosiss',
                'hippopotomonstrosesquippedaliophobia', 'supercalifragilisticexpialidocious',
                'incomprehensibilities', 'uncharacteristically', 'internationalization',
                'counterrevolutionaries', 'hyperbolic', 'metamorphosis', 'philosophical',
                'psychopharmacological', 'electroencephalographically', 'immunoelectrophoresis',
                'deoxyribonucleic', 'acid', 'photoelectric', 'electromagnetic', 'spectroscopic',
                'biochemical', 'microbiological', 'histopathological', 'psychophysiological',
                'neuropsychological', 'electroencephalographic', 'electrocardiographic',
                'gastroenterological', 'otorhinolaryngological', 'ophthalmological',
                'dermatological', 'rheumatological', 'endocrinological', 'hematological'
            ]
        };

        // Punctuation marks
        this.punctuation = ['.', ',', '!', '?', ';', ':', '-', '"', "'", '(', ')'];
        
        // DOM elements
        this.elements = {};
        
        // Initialize the app
        this.init();
    }

    // Initialize the application
    init() {
        this.cacheElements();
        this.loadSettings();
        this.setupEventListeners();
        this.updateUI();
        this.loadHistory();
        this.applyTheme();
    }

    // Cache DOM elements
    cacheElements() {
        // Configuration elements
        this.elements.modeBtns = document.querySelectorAll('.mode-btn');
        this.elements.timeBtns = document.querySelectorAll('.time-btn');
        this.elements.wordsBtns = document.querySelectorAll('.words-btn');
        this.elements.difficultyBtns = document.querySelectorAll('.difficulty-btn');
        this.elements.punctuationToggle = document.getElementById('punctuation-toggle');
        this.elements.soundToggle = document.getElementById('sound-toggle');
        
        // Test elements
        this.elements.textDisplay = document.getElementById('text-display');
        this.elements.textInput = document.getElementById('text-input');
        this.elements.startBtn = document.getElementById('start-btn');
        this.elements.resetBtn = document.getElementById('reset-btn');
        this.elements.nextTestBtn = document.getElementById('next-test-btn');
        
        // Stats elements
        this.elements.wpmDisplay = document.getElementById('wpm-display');
        this.elements.accuracyDisplay = document.getElementById('accuracy-display');
        this.elements.timeDisplay = document.getElementById('time-display');
        this.elements.charsDisplay = document.getElementById('chars-display');
        
        // Results elements
        this.elements.resultsSection = document.getElementById('results-section');
        this.elements.finalWpm = document.getElementById('final-wpm');
        this.elements.finalAccuracy = document.getElementById('final-accuracy');
        this.elements.finalTime = document.getElementById('final-time');
        this.elements.finalChars = document.getElementById('final-chars');
        this.elements.finalRaw = document.getElementById('final-raw');
        this.elements.finalConsistency = document.getElementById('final-consistency');
        this.elements.performanceRating = document.getElementById('performance-rating');
        
        // History elements
        this.elements.historyList = document.getElementById('history-list');
        this.elements.clearHistoryBtn = document.getElementById('clear-history');
        
        // Settings elements
        this.elements.settingsBtn = document.getElementById('settings-btn');
        this.elements.settingsModal = document.getElementById('settings-modal');
        this.elements.closeSettingsBtn = document.getElementById('close-settings');
        this.elements.fontSizeSelect = document.getElementById('font-size-select');
        this.elements.fontFamilySelect = document.getElementById('font-family-select');
        this.elements.themeSelect = document.getElementById('theme-select');
        
        // Theme elements
        this.elements.themeToggle = document.getElementById('theme-toggle');
        
        // Modal elements
        this.elements.customTimeModal = document.getElementById('custom-time-modal');
        this.elements.closeCustomTimeBtn = document.getElementById('close-custom-time');
        this.elements.customTimeValue = document.getElementById('custom-time-value');
        this.elements.applyCustomTimeBtn = document.getElementById('apply-custom-time');
        
        // Selector containers
        this.elements.timeSelector = document.getElementById('time-selector');
        this.elements.wordsSelector = document.getElementById('words-selector');
    }

    // Setup event listeners
    setupEventListeners() {
        // Configuration listeners
        this.elements.modeBtns.forEach(btn => {
            btn.addEventListener('click', () => this.setMode(btn.dataset.mode));
        });
        
        this.elements.timeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.dataset.time === 'custom') {
                    this.showCustomTimeModal();
                } else {
                    this.setTimeLimit(parseInt(btn.dataset.time));
                }
            });
        });
        
        this.elements.wordsBtns.forEach(btn => {
            btn.addEventListener('click', () => this.setWordCount(parseInt(btn.dataset.words)));
        });
        
        this.elements.difficultyBtns.forEach(btn => {
            btn.addEventListener('click', () => this.setDifficulty(btn.dataset.difficulty));
        });
        
        this.elements.punctuationToggle.addEventListener('change', (e) => {
            this.config.punctuationEnabled = e.target.checked;
            this.saveSettings();
        });
        
        this.elements.soundToggle.addEventListener('change', (e) => {
            this.config.soundEnabled = e.target.checked;
            this.saveSettings();
        });
        
        // Test control listeners
        this.elements.startBtn.addEventListener('click', () => this.startTest());
        this.elements.resetBtn.addEventListener('click', () => this.resetTest());
        this.elements.nextTestBtn.addEventListener('click', () => this.nextTest());
        
        // Input listeners
        this.elements.textInput.addEventListener('input', (e) => this.handleInput(e));
        this.elements.textInput.addEventListener('paste', (e) => e.preventDefault());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Settings listeners
        this.elements.settingsBtn.addEventListener('click', () => this.showSettings());
        this.elements.closeSettingsBtn.addEventListener('click', () => this.hideSettings());
        this.elements.fontSizeSelect.addEventListener('change', (e) => this.setFontSize(e.target.value));
        this.elements.fontFamilySelect.addEventListener('change', (e) => this.setFontFamily(e.target.value));
        this.elements.themeSelect.addEventListener('change', (e) => this.setTheme(e.target.value));
        
        // Theme toggle
        this.elements.themeToggle.addEventListener('click', () => this.toggleTheme());
        
        // Custom time modal
        this.elements.closeCustomTimeBtn.addEventListener('click', () => this.hideCustomTimeModal());
        this.elements.applyCustomTimeBtn.addEventListener('click', () => this.applyCustomTime());
        this.elements.customTimeValue.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.applyCustomTime();
        });
        
        // History
        this.elements.clearHistoryBtn.addEventListener('click', () => this.clearHistory());
        
        // Modal backdrop clicks
        this.elements.settingsModal.addEventListener('click', (e) => {
            if (e.target === this.elements.settingsModal) this.hideSettings();
        });
        this.elements.customTimeModal.addEventListener('click', (e) => {
            if (e.target === this.elements.customTimeModal) this.hideCustomTimeModal();
        });
    }

    // Set test mode
    setMode(mode) {
        this.config.mode = mode;
        this.elements.modeBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });
        
        // Show/hide appropriate selectors
        if (mode === 'time') {
            this.elements.timeSelector.classList.remove('hidden');
            this.elements.wordsSelector.classList.add('hidden');
        } else {
            this.elements.timeSelector.classList.add('hidden');
            this.elements.wordsSelector.classList.remove('hidden');
        }
        
        this.saveSettings();
        this.resetTest();
    }

    // Set time limit
    setTimeLimit(seconds) {
        this.config.timeLimit = seconds;
        this.elements.timeBtns.forEach(btn => {
            btn.classList.toggle('active', parseInt(btn.dataset.time) === seconds);
        });
        this.saveSettings();
        this.resetTest();
    }

    // Set word count
    setWordCount(count) {
        this.config.wordCount = count;
        this.elements.wordsBtns.forEach(btn => {
            btn.classList.toggle('active', parseInt(btn.dataset.words) === count);
        });
        this.saveSettings();
        this.resetTest();
    }

    // Set difficulty
    setDifficulty(difficulty) {
        this.config.difficulty = difficulty;
        this.elements.difficultyBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.difficulty === difficulty);
        });
        this.saveSettings();
        this.resetTest();
    }

    // Generate test text
    generateText() {
        const wordPool = this.wordPools[this.config.difficulty];
        const words = [];
        
        let targetLength = this.config.mode === 'words' ? this.config.wordCount : 50;
        
        for (let i = 0; i < targetLength; i++) {
            const randomWord = wordPool[Math.floor(Math.random() * wordPool.length)];
            words.push(randomWord);
            
            // Add punctuation randomly if enabled
            if (this.config.punctuationEnabled && Math.random() < 0.1) {
                const punct = this.punctuation[Math.floor(Math.random() * this.punctuation.length)];
                words[words.length - 1] += punct;
            }
        }
        
        return words.join(' ');
    }

    // Start test
    startTest() {
        this.state.currentText = this.generateText();
        this.state.typedText = '';
        this.state.isReady = true;
        this.state.isActive = false;
        this.state.startTime = null;
        this.state.correctChars = 0;
        this.state.incorrectChars = 0;
        this.state.totalChars = 0;
        this.state.wpmHistory = [];
        this.state.accuracyHistory = [];
        
        this.elements.textDisplay.innerHTML = this.renderText();
        this.elements.textInput.value = '';
        this.elements.textInput.disabled = false;
        this.elements.textInput.focus();
        
        this.elements.startBtn.textContent = 'Start Typing...';
        this.elements.startBtn.disabled = true;
        this.elements.resetBtn.disabled = false;
        this.elements.resultsSection.classList.add('hidden');
        
        this.updateLiveStats();
    }

    // Handle input
    handleInput(e) {
        const inputValue = e.target.value;
        const previousLength = this.state.typedText.length;
        this.state.typedText = inputValue;
        
        // Start timer on first character
        if (this.state.isReady && !this.state.isActive && inputValue.length > 0) {
            this.startTimer();
        }
        
        if (!this.state.isActive) return;
        
        // Update character tracking
        this.updateCharacterTracking(previousLength);
        
        // Debounced display update for performance
        this.debouncedUpdate();
        
        // Play sound effects
        if (this.config.soundEnabled) {
            this.playTypingSound(inputValue.length > previousLength);
        }
        
        // Check for test completion
        if (this.checkTestCompletion()) {
            this.endTest();
        }
    }

    // Debounced update for performance
    debouncedUpdate() {
        if (this.updateTimeout) {
            clearTimeout(this.updateTimeout);
        }
        
        this.updateTimeout = setTimeout(() => {
            this.elements.textDisplay.innerHTML = this.renderText();
            this.updateLiveStats();
            this.scrollToCurrentChar();
        }, 16); // ~60fps
    }

    // Update character tracking
    updateCharacterTracking(previousLength) {
        const typedLength = this.state.typedText.length;
        const textLength = this.state.currentText.length;
        
        if (typedLength > previousLength) {
            // Character was added
            const charIndex = typedLength - 1;
            if (charIndex < textLength) {
                const typedChar = this.state.typedText[charIndex];
                const expectedChar = this.state.currentText[charIndex];
                
                if (typedChar === expectedChar) {
                    this.state.correctChars++;
                } else {
                    this.state.incorrectChars++;
                }
                this.state.totalChars++;
            }
        } else if (typedLength < previousLength) {
            // Character was removed - recalculate
            this.recalculateCharacterStats();
        }
    }

    // Scroll to current character
    scrollToCurrentChar() {
        const currentChar = this.elements.textDisplay.querySelector('.char.current');
        if (currentChar) {
            const textDisplay = this.elements.textDisplay;
            const charRect = currentChar.getBoundingClientRect();
            const displayRect = textDisplay.getBoundingClientRect();
            
            // Check if current character is outside the visible area
            if (charRect.bottom > displayRect.bottom || charRect.top < displayRect.top) {
                // Smooth scroll to bring the character into view
                currentChar.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'nearest'
                });
            }
        }
    }

    // Recalculate character statistics
    recalculateCharacterStats() {
        this.state.correctChars = 0;
        this.state.incorrectChars = 0;
        this.state.totalChars = 0;
        
        for (let i = 0; i < Math.min(this.state.typedText.length, this.state.currentText.length); i++) {
            if (this.state.typedText[i] === this.state.currentText[i]) {
                this.state.correctChars++;
            } else {
                this.state.incorrectChars++;
            }
            this.state.totalChars++;
        }
    }

    // Render text with highlighting
    renderText() {
        const text = this.state.currentText;
        const typed = this.state.typedText;
        let html = '';
        
        // Split text into words to preserve spacing
        const words = text.split(' ');
        let charIndex = 0;
        
        words.forEach((word, wordIndex) => {
            // Render each character in the word
            for (let i = 0; i < word.length; i++) {
                const globalCharIndex = charIndex;
                let className = 'char';
                
                if (globalCharIndex < typed.length) {
                    if (typed[globalCharIndex] === text[globalCharIndex]) {
                        className += ' correct';
                    } else {
                        className += ' incorrect';
                    }
                } else if (globalCharIndex === typed.length) {
                    className += ' current';
                }
                
                html += `<span class="${className}">${text[globalCharIndex]}</span>`;
                charIndex++;
            }
            
            // Add space after word (except last word)
            if (wordIndex < words.length - 1) {
                const spaceIndex = charIndex;
                let className = 'char space';
                
                if (spaceIndex < typed.length) {
                    if (typed[spaceIndex] === text[spaceIndex]) {
                        className += ' correct';
                    } else {
                        className += ' incorrect';
                    }
                } else if (spaceIndex === typed.length) {
                    className += ' current';
                }
                
                html += `<span class="${className}"> </span>`;
                charIndex++;
            }
        });
        
        return html;
    }

    // Start timer
    startTimer() {
        this.state.isActive = true;
        this.state.startTime = Date.now();
        this.elements.startBtn.textContent = 'Typing...';
        
        this.state.timerInterval = setInterval(() => {
            this.updateLiveStats();
            
            // Check time limit
            if (this.config.mode === 'time') {
                const elapsed = (Date.now() - this.state.startTime) / 1000;
                if (elapsed >= this.config.timeLimit) {
                    this.endTest();
                }
            }
        }, 100);
    }

    // Update live statistics
    updateLiveStats() {
        const now = Date.now();
        const elapsed = this.state.startTime ? (now - this.state.startTime) / 1000 : 0;
        
        // WPM calculation (5 chars = 1 word, industry standard)
        const minutes = elapsed / 60;
        const correctChars = this.state.correctChars;
        const wpm = minutes > 0 ? Math.round((correctChars / 5) / minutes) : 0;
        
        // Accuracy calculation - only count characters that were attempted
        const accuracy = this.state.totalChars > 0 ? 
            Math.round((this.state.correctChars / this.state.totalChars) * 100) : 100;
        
        // Raw WPM (including errors and spaces)
 const totalTyped = this.state.typedText.length;
        const rawWpm = minutes > 0 ? 
            Math.round((totalTyped / 5) / minutes) : 0;
        
        // Update display
        this.elements.wpmDisplay.textContent = wpm;
        this.elements.accuracyDisplay.textContent = `${accuracy}%`;
        this.elements.charsDisplay.textContent = this.state.totalChars;
        
        if (this.config.mode === 'time') {
            const remaining = Math.max(0, this.config.timeLimit - elapsed);
            this.elements.timeDisplay.textContent = Math.ceil(remaining);
        } else {
            this.elements.timeDisplay.textContent = Math.ceil(elapsed);
        }
        
        // Store history for consistency calculation
        if (this.state.isActive && elapsed > 0) {
            this.state.wpmHistory.push(wpm);
            this.state.accuracyHistory.push(accuracy);
        }
    }

    // Check test completion
    checkTestCompletion() {
        if (this.config.mode === 'words') {
            const typedWords = this.state.typedText.trim().split(/\s+/).filter(word => word.length > 0).length;
            const targetWords = this.config.wordCount;
            
            // Check if user has typed at least the target number of words
            // and the typed text matches the expected text length
            return typedWords >= targetWords && 
                   this.state.typedText.length >= this.state.currentText.length;
        }
        return false;
    }

    // End test
    endTest() {
        this.state.isActive = false;
        this.state.isReady = false;
        this.state.endTime = Date.now();
        
        clearInterval(this.state.timerInterval);
        
        // Calculate final statistics
        const totalTime = (this.state.endTime - this.state.startTime) / 1000;
        const minutes = totalTime / 60;
        const wordsTyped = this.state.correctChars / 5;
        const wpm = Math.round(wordsTyped / minutes);
        const accuracy = this.state.totalChars > 0 ? 
            Math.round((this.state.correctChars / this.state.totalChars) * 100) : 0;
        const rawWpm = minutes > 0 ? 
            Math.round((this.state.typedText.length / 5) / minutes) : 0;
        
        // Calculate consistency
        const consistency = this.calculateConsistency();
        
        // Update results display
        this.showResults(wpm, accuracy, totalTime, rawWpm, consistency);
        
        // Save to history
        this.saveTestResult(wpm, accuracy, totalTime);
        
        // Update UI
        this.elements.textInput.disabled = true;
        this.elements.startBtn.textContent = 'Start Test';
        this.elements.startBtn.disabled = false;
        this.elements.nextTestBtn.classList.remove('hidden');
        
        // Play completion sound
        if (this.config.soundEnabled) {
            this.playCompletionSound();
        }
    }

    // Calculate typing consistency
    calculateConsistency() {
        if (this.state.wpmHistory.length < 2) return 100;
        
        const wpmValues = this.state.wpmHistory.slice(-10); // Last 10 values
        const mean = wpmValues.reduce((a, b) => a + b, 0) / wpmValues.length;
        const variance = wpmValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / wpmValues.length;
        const stdDev = Math.sqrt(variance);
        
        // Consistency is inversely proportional to standard deviation
        const consistency = Math.max(0, Math.min(100, 100 - (stdDev / mean) * 100));
        return Math.round(consistency);
    }

    // Show results
    showResults(wpm, accuracy, time, rawWpm, consistency) {
        this.elements.finalWpm.textContent = wpm;
        this.elements.finalAccuracy.textContent = `${accuracy}%`;
        this.elements.finalTime.textContent = `${Math.round(time)}s`;
        this.elements.finalChars.textContent = this.state.totalChars;
        this.elements.finalRaw.textContent = rawWpm;
        this.elements.finalConsistency.textContent = `${consistency}%`;
        
        // Performance rating
        const rating = this.getPerformanceRating(wpm, accuracy);
        this.elements.performanceRating.innerHTML = `
            <div class="rating-emoji">${rating.emoji}</div>
            <div class="rating-text">${rating.text}</div>
        `;
        
        this.elements.resultsSection.classList.remove('hidden');
    }

    // Get performance rating
    getPerformanceRating(wpm, accuracy) {
        if (wpm >= 80 && accuracy >= 98) {
            return { emoji: '🏆', text: 'Legendary! You\'re a typing master!' };
        } else if (wpm >= 70 && accuracy >= 95) {
            return { emoji: '🌟', text: 'Exceptional! Outstanding performance!' };
        } else if (wpm >= 60 && accuracy >= 90) {
            return { emoji: '🎯', text: 'Excellent! Great job!' };
        } else if (wpm >= 50 && accuracy >= 85) {
            return { emoji: '👍', text: 'Great work! Keep it up!' };
        } else if (wpm >= 40 && accuracy >= 80) {
            return { emoji: '😊', text: 'Good job! Room for improvement!' };
        } else if (wpm >= 30 && accuracy >= 75) {
            return { emoji: '💪', text: 'Nice effort! Keep practicing!' };
        } else {
            return { emoji: '🎯', text: 'Keep practicing! You\'ll get there!' };
        }
    }

    // Reset test
    resetTest() {
        this.state.isActive = false;
        this.state.isReady = false;
        clearInterval(this.state.timerInterval);
        
        this.state.typedText = '';
        this.state.correctChars = 0;
        this.state.incorrectChars = 0;
        this.state.totalChars = 0;
        this.state.wpmHistory = [];
        this.state.accuracyHistory = [];
        
        this.elements.textDisplay.innerHTML = '<span class="placeholder">Press Start to begin the test...</span>';
        this.elements.textInput.value = '';
        this.elements.textInput.disabled = true;
        
        this.elements.startBtn.textContent = 'Start Test';
        this.elements.startBtn.disabled = false;
        this.elements.resetBtn.disabled = true;
        this.elements.nextTestBtn.classList.add('hidden');
        this.elements.resultsSection.classList.add('hidden');
        
        this.updateLiveStats();
    }

    // Next test
    nextTest() {
        this.resetTest();
        setTimeout(() => this.startTest(), 100);
    }

    // Handle keyboard shortcuts
    handleKeyboard(e) {
        // Escape - Reset test
        if (e.key === 'Escape') {
            e.preventDefault();
            this.resetTest();
        }
        
        // Tab - Restart test
        if (e.key === 'Tab' && !e.shiftKey) {
            e.preventDefault();
            this.nextTest();
        }
        
        // Space - Start test (when not typing)
        if (e.key === ' ' && !this.state.isActive && !this.state.isReady && document.activeElement !== this.elements.textInput) {
            e.preventDefault();
            this.startTest();
        }
    }

    // Sound effects
    playTypingSound(isCorrect) {
        if (!this.config.soundEnabled) return;
        
        try {
            // Create simple beep sounds using Web Audio API
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = isCorrect ? 800 : 400;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.05, audioContext.currentTime); // Lower volume
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (e) {
            // Silently fail if audio context is not supported
        }
    }

    playCompletionSound() {
        if (!this.config.soundEnabled) return;
        
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const notes = [523.25, 659.25, 783.99]; // C, E, G
            
            notes.forEach((freq, index) => {
                setTimeout(() => {
                    const oscillator = audioContext.createOscillator();
                    const gainNode = audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(audioContext.destination);
                    
                    oscillator.frequency.value = freq;
                    oscillator.type = 'sine';
                    
                    gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
                    
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.2);
                }, index * 100);
            });
        } catch (e) {
            // Silently fail if audio context is not supported
        }
    }

    // Settings and preferences
    loadSettings() {
        const saved = localStorage.getItem('typemaster-settings');
        if (saved) {
            try {
                const settings = JSON.parse(saved);
                Object.assign(this.config, settings);
                
                // Update UI to reflect loaded settings
                this.setMode(this.config.mode);
                this.setTimeLimit(this.config.timeLimit);
                this.setWordCount(this.config.wordCount);
                this.setDifficulty(this.config.difficulty);
                this.elements.punctuationToggle.checked = this.config.punctuationEnabled;
                this.elements.soundToggle.checked = this.config.soundEnabled;
                this.elements.themeSelect.value = this.config.theme;
            } catch (e) {
                console.error('Failed to load settings:', e);
            }
        }
    }

    saveSettings() {
        localStorage.setItem('typemaster-settings', JSON.stringify(this.config));
    }

    // Theme management
    applyTheme() {
        const theme = this.config.theme;
        if (theme === 'auto') {
            const hour = new Date().getHours();
            const isDark = hour < 6 || hour >= 18;
            document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        } else {
            document.documentElement.setAttribute('data-theme', theme);
        }
        
        // Add smooth transition for theme change
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        this.config.theme = newTheme;
        this.saveSettings();
        
        // Add animation effect
        this.animateThemeChange();
    }
    
    animateThemeChange() {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: var(--accent-primary);
            opacity: 0.1;
            pointer-events: none;
            z-index: 9999;
            transition: opacity 0.3s ease;
        `;
        document.body.appendChild(overlay);
        
        setTimeout(() => {
            overlay.style.opacity = '0';
            setTimeout(() => document.body.removeChild(overlay), 300);
        }, 10);
    }

    setTheme(theme) {
        this.config.theme = theme;
        this.applyTheme();
        this.saveSettings();
    }

    // Font settings
    setFontSize(size) {
        const sizes = { small: '14px', medium: '16px', large: '18px' };
        document.documentElement.style.fontSize = sizes[size];
        this.saveSettings();
    }

    setFontFamily(family) {
        const families = {
            inter: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            jetbrains: "'JetBrains Mono', 'Fira Code', monospace",
            system: "system-ui, -apple-system, sans-serif"
        };
        document.body.style.fontFamily = families[family];
        this.saveSettings();
    }

    // Modal management
    showSettings() {
        this.elements.settingsModal.classList.remove('hidden');
    }

    hideSettings() {
        this.elements.settingsModal.classList.add('hidden');
    }

    showCustomTimeModal() {
        this.elements.customTimeModal.classList.remove('hidden');
        this.elements.customTimeValue.value = this.config.timeLimit;
        this.elements.customTimeValue.focus();
        this.elements.customTimeValue.select();
    }

    hideCustomTimeModal() {
        this.elements.customTimeModal.classList.add('hidden');
    }

    applyCustomTime() {
        const customTime = parseInt(this.elements.customTimeValue.value);
        if (customTime >= 5 && customTime <= 300) {
            this.setTimeLimit(customTime);
            this.hideCustomTimeModal();
        }
    }

    // History management
    loadHistory() {
        const history = localStorage.getItem('typemaster-history');
        if (history) {
            try {
                this.history = JSON.parse(history);
                this.displayHistory();
            } catch (e) {
                console.error('Failed to load history:', e);
                this.history = [];
            }
        } else {
            this.history = [];
        }
    }

    saveTestResult(wpm, accuracy, time) {
        const result = {
            wpm,
            accuracy,
            time: Math.round(time),
            date: new Date().toISOString(),
            mode: this.config.mode,
            difficulty: this.config.difficulty
        };
        
        this.history.unshift(result);
        if (this.history.length > 10) {
            this.history = this.history.slice(0, 10);
        }
        
        localStorage.setItem('typemaster-history', JSON.stringify(this.history));
        this.displayHistory();
    }

    displayHistory() {
        if (this.history.length === 0) {
            this.elements.historyList.innerHTML = '<div class="no-history">No test history yet</div>';
            return;
        }
        
        const historyHTML = this.history.map(result => `
            <div class="history-item">
                <div class="history-wpm">${result.wpm} WPM</div>
                <div class="history-accuracy">${result.accuracy}%</div>
                <div class="history-time">${result.time}s</div>
                <div class="history-date">${new Date(result.date).toLocaleDateString()}</div>
            </div>
        `).join('');
        
        this.elements.historyList.innerHTML = historyHTML;
    }

    clearHistory() {
        if (confirm('Are you sure you want to clear your test history?')) {
            this.history = [];
            localStorage.removeItem('typemaster-history');
            this.displayHistory();
        }
    }

    // Update UI
    updateUI() {
        // Set initial mode
        this.setMode(this.config.mode);
        
        // Update displays
        this.updateLiveStats();
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new TypingTestApp();
});