/**
 * Authentication & User Management - Firebase Native Google Auth
 * Uses Firebase's built-in Google authentication (simpler, no separate Google Client ID needed)
 */

/**
 * Initialize Firebase Google Sign-In (Native)
 */
function initializeGoogleSignIn() {
    try {
        // Check if Firebase is loaded
        if (typeof firebase === 'undefined') {
            console.error('Firebase not loaded');
            showGuestOnlyMessage();
            return;
        }
        
        // Set up Firebase native Google sign-in button
        const signInButton = document.getElementById('signInButton');
        if (signInButton) {
            signInButton.innerHTML = `
                <button class="google-signin-btn" onclick="signInWithGoogle()">
                    <svg width="18" height="18" viewBox="0 0 18 18">
                        <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
                        <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
                        <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
                        <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
                    </svg>
                    <span>Sign in with Google</span>
                </button>
            `;
            console.log('Firebase Google Sign-In button created');
        }
    } catch (error) {
        console.error('Error initializing Google Sign-In:', error);
        showGuestOnlyMessage();
    }
}

/**
 * Sign in with Google using Firebase Authentication
 */
async function signInWithGoogle() {
    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        
        // Optional: Request additional scopes if needed
        // provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
        
        // Sign in with popup
        const result = await auth.signInWithPopup(provider);
        
        // User info from Firebase
        const user = result.user;
        
        // Update game state
        gameState.realName = user.displayName || 'Player';
        gameState.userEmail = user.email || '';
        gameState.userPhoto = user.photoURL || '';
        gameState.userId = user.uid;
        gameState.isSignedIn = true;
        
        // Load user data from Firestore
        await loadUserData();
        
        // Set username if not already set
        const usernameInput = document.getElementById('usernameInput');
        if (usernameInput && !usernameInput.value) {
            const firstName = (user.displayName || 'Player').split(' ')[0];
            usernameInput.value = firstName;
        }
        
        // Update UI
        document.getElementById('authSection').classList.add('hidden');
        document.getElementById('userInfoDisplay').classList.remove('hidden');
        document.getElementById('userPhoto').src = gameState.userPhoto || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>';
        document.getElementById('userNameDisplay').textContent = gameState.realName;
        document.getElementById('userRatingDisplay').textContent = `Rating: ${userData.rating}`;
        
        // Load leaderboard
        loadLeaderboard();
        
        console.log('User signed in:', gameState.realName);
        
    } catch (error) {
        console.error('Sign-in error:', error);
        
        // Handle specific errors
        if (error.code === 'auth/popup-closed-by-user') {
            console.log('Sign-in cancelled by user');
        } else if (error.code === 'auth/popup-blocked') {
            alert('Pop-up blocked! Please allow pop-ups for this site and try again.');
        } else {
            alert('Sign-in failed: ' + error.message);
        }
    }
}

/**
 * Show guest-only message when Google Sign-In is unavailable
 */
function showGuestOnlyMessage() {
    const authSection = document.getElementById('authSection');
    if (authSection) {
        authSection.innerHTML = `
            <div style="text-align: center; padding: 15px; background: linear-gradient(135deg, #fff4cc, #ffe699); border-radius: 10px;">
                <p style="color: #2d5016; margin: 0; font-weight: 600;">Playing as Guest</p>
                <p style="color: #556b2f; font-size: 0.9em; margin: 5px 0 0 0;">
                    Sign-in unavailable. Progress will be saved to your account once you sign in.
                </p>
            </div>
        `;
    }
}

/**
 * Sign out user from Firebase
 */
async function signOut() {
    try {
        await auth.signOut();
        
        gameState.isSignedIn = false;
        gameState.realName = '';
        gameState.userEmail = '';
        gameState.userPhoto = '';
        gameState.userId = '';
        
        document.getElementById('authSection').classList.remove('hidden');
        document.getElementById('userInfoDisplay').classList.add('hidden');
        
        // Re-initialize Google Sign-In button
        setTimeout(() => {
            initializeGoogleSignIn();
        }, 100);
        
        console.log('User signed out');
    } catch (error) {
        console.error('Sign-out error:', error);
    }
}

/**
 * Load user data from Firestore
 */
async function loadUserData() {
    if (!gameState.userId) {
        console.error('Cannot load user data: No user ID');
        return;
    }
    
    try {
        const userDoc = await db.collection('users').doc(gameState.userId).get();
        
        if (userDoc.exists) {
            const data = userDoc.data();
            userData = {
                rating: data.rating || 1000,
                gamesPlayed: data.gamesPlayed || 0,
                totalAccuracy: data.totalAccuracy || 0,
                bestRating: data.bestRating || 1000,
                sessionsHistory: [] // Sessions loaded separately when needed
            };
            gameState.currentRating = userData.rating;
            console.log('User data loaded from Firestore:', userData);
        } else {
            // New user - create default data
            userData = {
                rating: 1000,
                gamesPlayed: 0,
                totalAccuracy: 0,
                bestRating: 1000,
                sessionsHistory: []
            };
            gameState.currentRating = 1000;
            
            // Create user document in Firestore
            await saveUserData();
            console.log('New user data created in Firestore');
        }
    } catch (error) {
        console.error('Error loading user data:', error);
        // Fallback to default values
        userData = {
            rating: 1000,
            gamesPlayed: 0,
            totalAccuracy: 0,
            bestRating: 1000,
            sessionsHistory: []
        };
        gameState.currentRating = 1000;
    }
}

/**
 * Save user data to Firestore
 */
async function saveUserData() {
    if (!gameState.isSignedIn) {
        console.log('Not signed in - data not saved to cloud');
        return;
    }
    
    try {
        const userRef = db.collection('users').doc(gameState.userId);
        
        await userRef.set({
            rating: userData.rating,
            gamesPlayed: userData.gamesPlayed,
            totalAccuracy: userData.totalAccuracy,
            bestRating: userData.bestRating,
            userName: gameState.userName,
            realName: gameState.realName,
            userEmail: gameState.userEmail,
            userPhoto: gameState.userPhoto,
            lastActive: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        
        console.log('User data saved to Firestore');
        
        // Update leaderboard
        updateLeaderboard();
        
    } catch (error) {
        console.error('Error saving user data:', error);
    }
}

/**
 * Save session data to Firestore
 */
async function saveSessionData(sessionData) {
    if (!gameState.isSignedIn) {
        console.log('Not signed in - session not saved to cloud');
        return;
    }
    
    try {
        const sessionRef = db.collection('users').doc(gameState.userId)
            .collection('sessions').doc();
        
        await sessionRef.set({
            ...sessionData,
            date: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        console.log('Session saved to Firestore');
        
    } catch (error) {
        console.error('Error saving session:', error);
    }
}

/**
 * Listen for authentication state changes
 */
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log('Auth state: User signed in:', user.email);
    } else {
        console.log('Auth state: No user signed in');
    }
});