/**
 * Math Adventures - Adaptive Learning System
 * JavaScript Logic for Frontend
 */

// Difficulty configuration
const DIFFICULTY_LEVELS = {
    0: { 
        name: 'Easy', 
        range: [1, 10], 
        operations: ['+', '-'],
        maxOperands: 2,
        useBodmas: false,
        simpleProb: 1.0
    },
    1: { 
        name: 'Medium', 
        range: [1, 20], 
        operations: ['+', '-', '×'],
        maxOperands: 3,
        useBodmas: true,
        simpleProb: 0.5
    },
    2: { 
        name: 'Hard', 
        range: [10, 50], 
        operations: ['+', '-', '×', '÷'],
        maxOperands: 4,
        useBodmas: true,
        simpleProb: 0.3
    }
};

const MAX_PUZZLES = 10;

// Game state
let gameState = {
    userName: '',
    difficulty: 0,
    currentPuzzle: null,
    startTime: null,
    performance: [],
    puzzleCount: 0
};

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
 * Generate a math puzzle based on difficulty level
 */
function generatePuzzle(level) {
    const config = DIFFICULTY_LEVELS[level];
    
    // Decide simple or complex
    const useSimple = Math.random() < config.simpleProb;
    
    if (useSimple || !config.useBodmas) {
        return generateSimplePuzzle(config);
    } else {
        return generateComplexPuzzle(config, level);
    }
}

/**
 * Generate simple 2-operand puzzle
 */
function generateSimplePuzzle(config) {
    const [min, max] = config.range;
    const operation = config.operations[Math.floor(Math.random() * config.operations.length)];
    
    let num1 = Math.floor(Math.random() * (max - min + 1)) + min;
    let num2 = Math.floor(Math.random() * (max - min + 1)) + min;
    let answer;
    let display;

    switch(operation) {
        case '+':
            answer = num1 + num2;
            display = `${num1} + ${num2}`;
            break;
        case '-':
            if (num2 > num1) [num1, num2] = [num2, num1];
            answer = num1 - num2;
            display = `${num1} - ${num2}`;
            break;
        case '×':
            num1 = Math.floor(Math.random() * 10) + 1;
            num2 = Math.floor(Math.random() * 10) + 1;
            answer = num1 * num2;
            display = `${num1} × ${num2}`;
            break;
        case '÷':
            num2 = Math.floor(Math.random() * 10) + 1;
            answer = Math.floor(Math.random() * 10) + 1;
            num1 = num2 * answer;
            display = `${num1} ÷ ${num2}`;
            break;
        default:
            answer = num1 + num2;
            display = `${num1} + ${num2}`;
    }

    return { num1, num2, operation, answer, display };
}

/**
 * Generate complex puzzle with BODMAS
 */
function generateComplexPuzzle(config, level) {
    const [min, max] = config.range;
    const numOperands = Math.floor(Math.random() * (config.maxOperands - 2)) + 3;
    
    let problemTypes = ['multiplication_first', 'parentheses', 'mixed_operations'];
    
    if (level === 1) {
        problemTypes = ['multiplication_first', 'parentheses'];
    }
    
    const problemType = problemTypes[Math.floor(Math.random() * problemTypes.length)];
    
    if (problemType === 'multiplication_first') {
        return generateMultFirst(min, max);
    } else if (problemType === 'parentheses') {
        return generateParentheses(min, max, numOperands);
    } else {
        return generateMixedOperations(min, max, numOperands);
    }
}

/**
 * Generate: a + b × c
 */
function generateMultFirst(min, max) {
    const a = Math.floor(Math.random() * (max - min + 1)) + min;
    const b = Math.floor(Math.random() * 9) + 2;
    const c = Math.floor(Math.random() * 9) + 2;
    
    const answer = a + (b * c);
    const display = `${a} + ${b} × ${c}`;
    
    return { num1: a, num2: b, operation: 'complex', answer, display };
}

/**
 * Generate: (a + b) × c or similar
 */
function generateParentheses(min, max, numOperands) {
    if (numOperands === 3) {
        let a = Math.floor(Math.random() * (max - min + 1)) + min;
        let b = Math.floor(Math.random() * (max - min + 1)) + min;
        const c = Math.floor(Math.random() * 9) + 2;
        
        const innerOp = Math.random() < 0.5 ? '+' : '-';
        const outerOp = Math.random() < 0.5 ? '×' : '+';
        
        let innerResult;
        if (innerOp === '+') {
            innerResult = a + b;
        } else {
            if (b > a) [a, b] = [b, a];
            innerResult = a - b;
        }
        
        let answer, display;
        if (outerOp === '×') {
            answer = innerResult * c;
            display = `(${a} ${innerOp} ${b}) × ${c}`;
        } else {
            answer = innerResult + c;
            display = `(${a} ${innerOp} ${b}) + ${c}`;
        }
        
        return { num1: a, num2: b, operation: 'complex', answer, display };
    } else {
        let a = Math.floor(Math.random() * (max - min + 1)) + min;
        let b = Math.floor(Math.random() * (max - min + 1)) + min;
        let c = Math.floor(Math.random() * (max - min + 1)) + min;
        let d = Math.floor(Math.random() * (max - min + 1)) + min;
        
        if (b > a) [a, b] = [b, a];
        if (d > c) [c, d] = [d, c];
        
        const left = a + b;
        const right = c - d;
        const answer = left * right;
        const display = `(${a} + ${b}) × (${c} - ${d})`;
        
        return { num1: a, num2: b, operation: 'complex', answer, display };
    }
}

/**
 * Generate: a + b × c - d
 */
function generateMixedOperations(min, max, numOperands) {
    if (numOperands === 3) {
        const a = Math.floor(Math.random() * (max - min + 1)) + min;
        const b = Math.floor(Math.random() * 9) + 2;
        const c = Math.floor(Math.random() * 9) + 2;
        
        const answer = a + (b * c);
        const display = `${a} + ${b} × ${c}`;
        
        return { num1: a, num2: b, operation: 'complex', answer, display };
    } else {
        let a = Math.floor(Math.random() * (max - min + 1)) + min;
        const b = Math.floor(Math.random() * 9) + 2;
        const c = Math.floor(Math.random() * 9) + 2;
        let d = Math.floor(Math.random() * Math.min(max, 20) - min + 1) + min;
        
        let answer = a + (b * c) - d;
        
        if (answer < 0) {
            a = a + Math.abs(answer) + Math.floor(Math.random() * 10) + 5;
            answer = a + (b * c) - d;
        }
        
        const display = `${a} + ${b} × ${c} - ${d}`;
        
        return { num1: a, num2: b, operation: 'complex', answer, display };
    }
}

/**
 * Adaptive Engine: Calculate next difficulty based on performance
 */
function calculateNextDifficulty(currentDiff, perfHistory) {
    if (perfHistory.length < 2) return currentDiff;

    // Get last 3 attempts
    const recent = perfHistory.slice(-3);
    const recentAccuracy = recent.filter(p => p.correct).length / recent.length;
    const avgTime = recent.reduce((sum, p) => sum + p.time, 0) / recent.length;

    let score = 0;
    
    // Decision rules
    if (recentAccuracy >= 0.8 && avgTime < 8000) {
        score = 1;  // Increase difficulty
    } else if (recentAccuracy >= 0.67) {
        score = 0;  // Maintain difficulty
    } else {
        score = -1; // Decrease difficulty
    }

    // Return new difficulty (bounded 0-2)
    return Math.max(0, Math.min(2, currentDiff + score));
}

/**
 * Start the game
 */
function startGame() {
    const name = document.getElementById('userName').value.trim();
    if (!name) {
        alert('Please enter your name!');
        return;
    }

    gameState.userName = name;
    gameState.performance = [];
    gameState.puzzleCount = 0;

    // Hide welcome, show game screen
    document.getElementById('welcomeScreen').classList.add('hidden');
    document.getElementById('gameScreen').classList.remove('hidden');
    document.getElementById('playerName').textContent = name;

    showNewPuzzle();
}

/**
 * Display a new puzzle
 */
function showNewPuzzle() {
    gameState.currentPuzzle = generatePuzzle(gameState.difficulty);
    gameState.startTime = Date.now();

    const puzzle = gameState.currentPuzzle;
    const displayText = puzzle.display || `${puzzle.num1} ${puzzle.operation} ${puzzle.num2}`;
    document.getElementById('puzzleText').textContent = `${displayText} = ?`;
    document.getElementById('answerInput').value = '';

    updateProgressDisplay();
    updateDifficultyBadge();
    document.getElementById('feedbackArea').innerHTML = '';
    document.getElementById('puzzleArea').style.display = 'block';
    
    // Auto-focus on answer input after a short delay to ensure it's visible
    setTimeout(() => {
        document.getElementById('answerInput').focus();
    }, 100);
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

    // Record performance
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

    // Show feedback
    showFeedback(isCorrect, timeTaken);

    // Move to next puzzle after delay
    setTimeout(() => {
        gameState.puzzleCount++;

        if (gameState.puzzleCount >= MAX_PUZZLES) {
            showSummary();
        } else {
            // Adapt difficulty
            gameState.difficulty = calculateNextDifficulty(
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
 * Show summary screen
 */
function showSummary() {
    document.getElementById('gameScreen').classList.add('hidden');
    document.getElementById('summaryScreen').classList.remove('hidden');

    const correct = gameState.performance.filter(p => p.correct).length;
    const accuracy = (correct / gameState.performance.length * 100).toFixed(1);
    const avgTime = (gameState.performance.reduce((sum, p) => sum + p.time, 0) 
        / gameState.performance.length / 1000).toFixed(1);

    document.getElementById('summaryName').textContent = gameState.userName;
    document.getElementById('finalAccuracy').textContent = accuracy + '%';
    document.getElementById('avgTime').textContent = avgTime + 's';
    document.getElementById('finalScore').textContent = `${correct}/${gameState.performance.length}`;
    document.getElementById('finalLevel').textContent = DIFFICULTY_LEVELS[gameState.difficulty].name;
    document.getElementById('recommendedLevel').textContent = DIFFICULTY_LEVELS[gameState.difficulty].name;

    // Animate graphical elements
    animateSummaryGraphics(correct, gameState.performance.length, accuracy, avgTime);
}

/**
 * Animate summary graphics
 */
function animateSummaryGraphics(correct, total, accuracy, avgTime) {
    // Animate circular progress
    setTimeout(() => {
        const circle = document.getElementById('accuracyCircle');
        const circumference = 2 * Math.PI * 85;
        const offset = circumference - (accuracy / 100) * circumference;
        circle.style.strokeDashoffset = offset;
        document.getElementById('circleAccuracy').textContent = accuracy + '%';
    }, 100);

    // Animate correct answers bar
    setTimeout(() => {
        const correctBar = document.getElementById('correctBar');
        const percentage = (correct / total) * 100;
        correctBar.style.width = percentage + '%';
    }, 300);

    // Animate time bar (inverse - less time is better)
    setTimeout(() => {
        const timeBar = document.getElementById('timeBar');
        // Max expected time is 15 seconds, scale accordingly
        const timePercentage = Math.min(100, (avgTime / 15) * 100);
        const inversePercentage = 100 - timePercentage;
        timeBar.style.width = inversePercentage + '%';
    }, 500);

    // Animate difficulty dots
    setTimeout(() => {
        for (let i = 0; i <= gameState.difficulty; i++) {
            setTimeout(() => {
                document.getElementById(`dot${i + 1}`).classList.add('active');
            }, i * 200);
        }
    }, 700);

    // Animate star rating
    setTimeout(() => {
        const starContainer = document.getElementById('starRating');
        const numStars = getStarRating(accuracy);
        starContainer.innerHTML = '';
        
        for (let i = 0; i < 5; i++) {
            const star = document.createElement('span');
            star.className = 'star';
            star.textContent = '★';
            starContainer.appendChild(star);
            
            if (i < numStars) {
                setTimeout(() => {
                    star.classList.add('filled');
                }, i * 150);
            }
        }
    }, 900);
}

/**
 * Calculate star rating based on accuracy
 */
function getStarRating(accuracy) {
    if (accuracy >= 90) return 5;
    if (accuracy >= 80) return 4;
    if (accuracy >= 70) return 3;
    if (accuracy >= 60) return 2;
    return 1;
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

/**
 * Event Listeners
 */
document.addEventListener('DOMContentLoaded', () => {
    // Enter key to submit answer
    const answerInput = document.getElementById('answerInput');
    if (answerInput) {
        answerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') submitAnswer();
        });
    }
});

// Export for testing (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generatePuzzle,
        calculateNextDifficulty,
        DIFFICULTY_LEVELS
    };
}