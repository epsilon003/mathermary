/**
 * Rating System
 * Calculate and manage player ratings
 */

/**
 * Calculate session rating based on performance
 */
function calculateSessionRating(accuracy, avgTime, finalDifficulty) {
    let rating = 0;
    
    // Accuracy component (0-500 points)
    rating += accuracy * 5;
    
    // Speed component (0-300 points)
    const speedScore = Math.max(0, 300 - (avgTime / 15000 * 300));
    rating += speedScore;
    
    // Difficulty multiplier
    const difficultyMultiplier = {
        0: 1.0,
        1: 1.5,
        2: 2.0
    };
    rating *= difficultyMultiplier[finalDifficulty];
    
    // Consistency bonus
    if (accuracy > 80) {
        rating += 100;
    }
    
    return Math.round(rating);
}

/**
 * Update player rating (ELO-style)
 */
function updatePlayerRating(sessionScore) {
    const oldRating = userData.rating;
    
    const expectedScore = 1 / (1 + Math.pow(10, (1500 - oldRating) / 400));
    const actualScore = Math.min(sessionScore / 1000, 1);
    const kFactor = userData.gamesPlayed < 10 ? 40 : 20;
    
    const ratingChange = Math.round(kFactor * (actualScore - expectedScore));
    userData.rating = Math.max(100, oldRating + ratingChange);
    
    if (userData.rating > userData.bestRating) {
        userData.bestRating = userData.rating;
    }
    
    return ratingChange;
}