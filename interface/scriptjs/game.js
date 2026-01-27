/**
 * Game Flow & UI Management
 * Main game logic and screen transitions
 */

/**
 * Select difficulty level
 */
function selectDifficulty(level) {
    gameState.difficulty = level;
    document.querySelectorAll('.diff-btn').forEach((btn, idx) => {
        btn.classList.toggle('active', idx === level);
    });
}

/**
 * Start the game
 */
async function startGame() {
    console.log('startGame() called');
    
    try {
        const usernameInput = document.getElementById('usernameInput');
        console.log('usernameInput:', usernameInput);
        
        if (!usernameInput) {
            console.error('Username input not found');
            alert('Error: Unable to find username input field. Please refresh the page.');
            return;
        }
        
        const username = usernameInput.value.trim();
        console.log('Username entered:', username);
        
        if (!username) {
            alert('Please enter a username!');
            usernameInput.focus();
            return;
        }
        
        if (username.length < 2) {
            alert('Username must be at least 2 characters!');
            usernameInput.focus();
            return;
        }
        gameState.userName = username;
        console.log('Username set to:', gameState.userName);
        
        if (!gameState.isSignedIn) {
            gameState.userId = 'guest_' + Date.now();
            console.log('Guest ID generated:', gameState.userId);
        }

        gameState.performance = [];
        gameState.puzzleCount = 0;

        if (!modelTrained) {
            console.log('ML model not trained, initializing...');
            
            const welcomeScreen = document.getElementById('welcomeScreen');
            console.log('welcomeScreen:', welcomeScreen);
            
            if (!welcomeScreen) {
                console.error('Welcome screen element not found');
                alert('Error: Page structure issue. Please refresh.');
                return;
            }
            
            const loadingOverlay = document.createElement('div');
            loadingOverlay.id = 'loadingOverlay';
            loadingOverlay.style.cssText = 'position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(255,255,255,0.95); display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: 30px; z-index: 1000;';
            loadingOverlay.innerHTML = `
                <style>
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    .spinner {
                        width: 80px;
                        height: 80px;
                        border: 6px solid #e8e8e8;
                        border-top: 6px solid #daa520;
                        border-right: 6px solid #b8860b;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                        margin-bottom: 30px;
                    }
                </style>
                <div class="spinner"></div>
                <h2 style="color: #2d5016; margin-bottom: 10px; font-size: 1.5em;">Initializing AI Engine</h2>
                <p style="color: #556b2f; font-size: 1em;">Training adaptive learning model...</p>
            `;
            welcomeScreen.appendChild(loadingOverlay);
            
            try {
                await initializeMLModel();
                if (welcomeScreen.contains(loadingOverlay)) {
                    welcomeScreen.removeChild(loadingOverlay);
                }
                console.log('ML model initialized successfully');
            } catch (error) {
                console.error('Error initializing ML model:', error);
                if (welcomeScreen.contains(loadingOverlay)) {
                    welcomeScreen.removeChild(loadingOverlay);
                }
            }
        } else {
            console.log('ML model already trained');
        }

        const welcomeScreen2 = document.getElementById('welcomeScreen');
        const gameScreen = document.getElementById('gameScreen');
        
        console.log('welcomeScreen2:', welcomeScreen2);
        console.log('gameScreen:', gameScreen);
        
        if (!welcomeScreen2 || !gameScreen) {
            console.error('Required screen elements not found');
            alert('Error: Unable to find game screens. Please refresh the page.');
            return;
        }
        
        welcomeScreen2.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        
        const playerNameEl = document.getElementById('playerName');
        console.log('playerNameEl:', playerNameEl);
        
        if (playerNameEl) {
            playerNameEl.textContent = gameState.userName;
        } else {
            console.warn('playerName element not found, but continuing...');
        }

        console.log('About to call showNewPuzzle()');
        showNewPuzzle();
        console.log('Game started successfully!');
        
    } catch (error) {
        console.error('Error in startGame:', error);
        console.error('Error stack:', error.stack);
        alert('An error occurred: ' + error.message + '\n\nPlease refresh the page and try again.');
    }
}

/**
 * Display a new puzzle
 */
function showNewPuzzle() {
    try {
        gameState.currentPuzzle = generatePuzzle(gameState.difficulty);
        gameState.startTime = Date.now();

        const puzzle = gameState.currentPuzzle;
        const displayText = puzzle.display || `${puzzle.num1} ${puzzle.operation} ${puzzle.num2}`;
        
        const puzzleTextEl = document.getElementById('puzzleText');
        const answerInputEl = document.getElementById('answerInput');
        
        if (!puzzleTextEl || !answerInputEl) {
            console.error('Puzzle display elements not found');
            return;
        }
        
        puzzleTextEl.textContent = `${displayText} = ?`;
        answerInputEl.value = '';

        updateProgressDisplay();
        updateDifficultyBadge();
        
        const feedbackArea = document.getElementById('feedbackArea');
        const puzzleArea = document.getElementById('puzzleArea');
        
        if (feedbackArea) feedbackArea.innerHTML = '';
        if (puzzleArea) puzzleArea.style.display = 'block';
        
        setTimeout(() => {
            const answerInput = document.getElementById('answerInput');
            if (answerInput) answerInput.focus();
        }, 100);
    } catch (error) {
        console.error('Error in showNewPuzzle:', error);
    }
}

/**
 * Update progress display
 */
function updateProgressDisplay() {
    document.getElementById('progressText').textContent = 
        `${gameState.puzzleCount + 1} / ${MAX_PUZZLES}`;
}

/**
 * Update difficulty badge
 */
function updateDifficultyBadge() {
    const badge = document.getElementById('difficultyBadge');
    const level = DIFFICULTY_LEVELS[gameState.difficulty];
    const classes = ['badge-easy', 'badge-medium', 'badge-hard'];
    badge.className = `difficulty-badge ${classes[gameState.difficulty]}`;
    badge.textContent = level.name;
}

/**
 * Update statistics display
 */
function updateStats() {
    const correct = gameState.performance.filter(p => p.correct).length;
    const incorrect = gameState.performance.filter(p => !p.correct).length;
    const accuracy = gameState.performance.length > 0 
        ? (correct / gameState.performance.length * 100).toFixed(0) 
        : 0;

    document.getElementById('correctCount').textContent = correct;
    document.getElementById('incorrectCount').textContent = incorrect;
    document.getElementById('accuracyPercent').textContent = accuracy + '%';
}

/**
 * Submit answer
 */
function submitAnswer() {
    const userAnswer = document.getElementById('answerInput').value;
    if (!userAnswer) return;

    const timeTaken = Date.now() - gameState.startTime;
    const isCorrect = parseInt(userAnswer) === gameState.currentPuzzle.answer;

    const newPerf = {
        puzzle: gameState.currentPuzzle.display || `${gameState.currentPuzzle.num1} ${gameState.currentPuzzle.operation} ${gameState.currentPuzzle.num2}`,
        userAnswer: parseInt(userAnswer),
        correctAnswer: gameState.currentPuzzle.answer,
        correct: isCorrect,
        time: timeTaken,
        difficulty: gameState.difficulty
    };

    gameState.performance.push(newPerf);
    updateStats();

    showFeedback(isCorrect, timeTaken);

    setTimeout(async () => {
        gameState.puzzleCount++;

        if (gameState.puzzleCount >= MAX_PUZZLES) {
            showSummary();
        } else {
            gameState.difficulty = await calculateNextDifficulty(
                gameState.difficulty, 
                gameState.performance
            );
            showNewPuzzle();
        }
    }, 2000);
}

/**
 * Show feedback for answer
 */
function showFeedback(isCorrect, timeTaken) {
    document.getElementById('puzzleArea').style.display = 'none';
    const feedbackArea = document.getElementById('feedbackArea');
    const message = isCorrect 
        ? 'Correct!' 
        : `Not quite. The answer was ${gameState.currentPuzzle.answer}`;
    const timeText = `Time: ${(timeTaken / 1000).toFixed(1)}s`;
    
    feedbackArea.innerHTML = `
        <div class="feedback ${isCorrect ? 'feedback-correct' : 'feedback-incorrect'}">
            <div>${message}</div>
            <div style="font-size: 0.6em; margin-top: 10px;">${timeText}</div>
        </div>
    `;
}

/**
 * Restart the game
 */
function restartGame() {
    document.getElementById('summaryScreen').classList.add('hidden');
    document.getElementById('welcomeScreen').classList.remove('hidden');
    gameState.difficulty = 0;
    selectDifficulty(0);
}