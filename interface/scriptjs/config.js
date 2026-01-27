/**
 * Configuration and Constants
 * Math Adventures - Adaptive Learning System
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
    userName: '',  // Display name (from username input)
    realName: '',  // Real name (from Google)
    userEmail: '',
    userPhoto: '',
    userId: '',
    difficulty: 0,
    currentPuzzle: null,
    startTime: null,
    performance: [],
    puzzleCount: 0,
    currentRating: 0,
    isSignedIn: false
};

// User data storage
let userData = {
    rating: 1000, // Starting rating (ELO-style)
    gamesPlayed: 0,
    totalAccuracy: 0,
    bestRating: 1000,
    sessionsHistory: []
};

// ML Model state
let adaptiveModel = null;
let modelTrained = false;