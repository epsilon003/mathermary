/**
 * Leaderboard Management - Firebase Version
 * Real-time leaderboard with Firestore
 */

let leaderboardUnsubscribe = null; // Store unsubscribe function

/**
 * Load leaderboard from Firestore with real-time updates
 */
function loadLeaderboard() {
    try {
        // Unsubscribe from previous listener if it exists
        if (leaderboardUnsubscribe) {
            leaderboardUnsubscribe();
        }
        
        // Set up real-time listener for top 5 players
        leaderboardUnsubscribe = db.collection('users')
            .orderBy('rating', 'desc')
            .limit(5)
            .onSnapshot((snapshot) => {
                const leaderboard = [];
                
                snapshot.forEach((doc) => {
                    const data = doc.data();
                    leaderboard.push({
                        userId: doc.id,
                        userName: data.userName || 'Anonymous Player',
                        realName: data.realName || '',
                        userPhoto: data.userPhoto || '',
                        rating: data.rating || 1000,
                        gamesPlayed: data.gamesPlayed || 0
                    });
                });
                
                displayLeaderboard(leaderboard);
                console.log('Leaderboard updated (real-time)');
            }, (error) => {
                console.error('Error loading leaderboard:', error);
                displayLeaderboard([]); // Show empty state
            });
            
    } catch (error) {
        console.error('Error setting up leaderboard listener:', error);
        displayLeaderboard([]);
    }
}

/**
 * Display leaderboard
 */
function displayLeaderboard(leaderboard) {
    const container = document.getElementById('leaderboardList');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (leaderboard.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #556b2f;">No players yet. Be the first!</p>';
        return;
    }
    
    leaderboard.forEach((player, index) => {
        // Determine display name
        let displayName = player.userName || 'Anonymous Player';
        
        const gamesPlayed = player.gamesPlayed || 0;
        
        // Determine initial for profile circle
        let initial = displayName.charAt(0).toUpperCase();
        
        // Highlight current user
        const isCurrentUser = gameState.isSignedIn && player.userId === gameState.userId;
        const highlightClass = isCurrentUser ? 'current-user-highlight' : '';
        
        const itemHTML = `
            <div class="leaderboard-item ${highlightClass}">
                <div class="leaderboard-rank">${index + 1}</div>
                ${player.userPhoto ? 
                    `<img class="leaderboard-photo" src="${player.userPhoto}" alt="${displayName}">` : 
                    `<div class="leaderboard-photo leaderboard-initial">${initial}</div>`
                }
                <div class="leaderboard-info">
                    <p class="leaderboard-name">
                        ${displayName}
                        ${isCurrentUser ? '<span style="color: #daa520; font-size: 0.8em; margin-left: 5px;">(You)</span>' : ''}
                    </p>
                    <span class="leaderboard-rating">${player.rating} pts • ${gamesPlayed} games</span>
                </div>
            </div>
        `;
        container.innerHTML += itemHTML;
    });
}

/**
 * Update leaderboard with current user (called after saving user data)
 * This is now handled automatically by the real-time listener
 */
function updateLeaderboard() {
    // No action needed - real-time listener handles updates automatically
    console.log('Leaderboard will update automatically via real-time sync');
}

/**
 * Stop listening to leaderboard updates (cleanup)
 */
function stopLeaderboardListener() {
    if (leaderboardUnsubscribe) {
        leaderboardUnsubscribe();
        leaderboardUnsubscribe = null;
        console.log('Leaderboard listener stopped');
    }
}

// Add CSS for current user highlight (inject into page)
const style = document.createElement('style');
style.textContent = `
    .current-user-highlight {
        background: linear-gradient(135deg, #fff9e6, #fffaed) !important;
        border: 2px solid #daa520 !important;
        box-shadow: 0 2px 8px rgba(218, 165, 32, 0.2) !important;
    }
`;
document.head.appendChild(style);