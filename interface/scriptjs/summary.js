/**
 * Summary Screen & Animations - Firebase Version
 * Display session results and save to Firestore
 */

/**
 * Show summary screen
 */
async function showSummary() {
    document.getElementById('gameScreen').classList.add('hidden');
    document.getElementById('summaryScreen').classList.remove('hidden');

    const correct = gameState.performance.filter(p => p.correct).length;
    const accuracy = (correct / gameState.performance.length * 100).toFixed(1);
    const avgTime = (gameState.performance.reduce((sum, p) => sum + p.time, 0) 
        / gameState.performance.length / 1000).toFixed(1);

    const sessionScore = calculateSessionRating(parseFloat(accuracy), parseFloat(avgTime) * 1000, gameState.difficulty);
    
    let ratingChange = 0;
    
    // Update user data and save to Firestore
    if (gameState.isSignedIn) {
        ratingChange = updatePlayerRating(sessionScore);
        
        userData.gamesPlayed++;
        userData.totalAccuracy = ((userData.totalAccuracy * (userData.gamesPlayed - 1)) + parseFloat(accuracy)) / userData.gamesPlayed;
        
        // Create session data object
        const sessionData = {
            accuracy: parseFloat(accuracy),
            avgTime: parseFloat(avgTime),
            difficulty: gameState.difficulty,
            score: sessionScore,
            ratingChange: ratingChange,
            correctAnswers: correct,
            totalQuestions: gameState.performance.length
        };
        
        // Save to Firestore (both user data and session)
        try {
            await saveUserData();
            await saveSessionData(sessionData);
            console.log('Session data saved to Firestore');
        } catch (error) {
            console.error('Error saving session:', error);
        }
        
        // Update rating display
        const userRatingDisplay = document.getElementById('userRatingDisplay');
        if (userRatingDisplay) {
            userRatingDisplay.textContent = `Rating: ${userData.rating}`;
        }
    }

    // Update summary UI
    document.getElementById('summaryName').textContent = gameState.userName;
    document.getElementById('finalAccuracy').textContent = accuracy + '%';
    document.getElementById('avgTime').textContent = avgTime + 's';
    document.getElementById('finalScore').textContent = `${correct}/${gameState.performance.length}`;
    
    const sessionRatingEl = document.getElementById('sessionRating');
    if (sessionRatingEl) {
        sessionRatingEl.textContent = sessionScore;
    }
    
    const ratingChangeEl = document.getElementById('ratingChange');
    if (ratingChangeEl) {
        if (gameState.isSignedIn) {
            if (ratingChange > 0) {
                ratingChangeEl.textContent = `+${ratingChange} Rating`;
                ratingChangeEl.className = 'rating-change rating-up';
            } else if (ratingChange < 0) {
                ratingChangeEl.textContent = `${ratingChange} Rating`;
                ratingChangeEl.className = 'rating-change rating-down';
            } else {
                ratingChangeEl.textContent = '±0 Rating';
                ratingChangeEl.className = 'rating-change rating-neutral';
            }
            
            const totalRatingText = document.createElement('div');
            totalRatingText.style.fontSize = '0.9em';
            totalRatingText.style.marginTop = '5px';
            totalRatingText.style.color = '#556b2f';
            totalRatingText.textContent = `Total Rating: ${userData.rating}`;
            ratingChangeEl.appendChild(totalRatingText);
        } else {
            ratingChangeEl.textContent = 'Sign in to track rating';
            ratingChangeEl.className = 'rating-change';
            ratingChangeEl.style.fontSize = '0.8em';
            ratingChangeEl.style.color = '#556b2f';
        }
    }

    animateSummaryGraphics(correct, gameState.performance.length, accuracy, avgTime);
    
    // Leaderboard updates automatically via real-time listener
    console.log('Leaderboard will update automatically');
}

/**
 * Animate summary graphics
 */
function animateSummaryGraphics(correct, total, accuracy, avgTime) {
    setTimeout(() => {
        const correctBar = document.getElementById('correctBar');
        if (correctBar) {
            const percentage = (correct / total) * 100;
            correctBar.style.width = percentage + '%';
        }
    }, 300);
}

/**
 * Event Listeners and Initialization
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Initializing Math Adventures (Firebase Version)');
    console.log('Config loaded:', typeof DIFFICULTY_LEVELS !== 'undefined');
    console.log('Puzzle generator loaded:', typeof generatePuzzle === 'function');
    console.log('ML engine loaded:', typeof initializeMLModel === 'function');
    console.log('Auth loaded:', typeof initializeGoogleSignIn === 'function');
    console.log('Rating loaded:', typeof calculateSessionRating === 'function');
    console.log('Leaderboard loaded:', typeof loadLeaderboard === 'function');
    console.log('Game loaded:', typeof startGame === 'function');
    console.log('Firebase loaded:', typeof firebase !== 'undefined');
    
    // Wait for Firebase to be ready before initializing
    setTimeout(() => {
        console.log('Attempting to initialize Google Sign-In...');
        if (typeof initializeGoogleSignIn === 'function') {
            initializeGoogleSignIn();
        } else {
            console.error('initializeGoogleSignIn function not found!');
        }
        
        // Load leaderboard with real-time updates
        if (typeof loadLeaderboard === 'function') {
            loadLeaderboard();
        }
    }, 500);
    
    // Enter key to submit answer
    const answerInput = document.getElementById('answerInput');
    if (answerInput) {
        answerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') submitAnswer();
        });
    }
    
    console.log('Math Adventures initialization complete! (Firebase Version)');
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    stopLeaderboardListener();
});