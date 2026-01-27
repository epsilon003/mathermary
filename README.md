# Math Adventures - ML-Powered Adaptive Learning System

An intelligent math learning platform that dynamically adjusts difficulty using both rule-based algorithms and machine learning. Features Google authentication, Firebase integration, real-time leaderboards, ELO-style rating system, and TensorFlow.js-powered adaptive difficulty adjustment.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.8+-green.svg)
![JavaScript](https://img.shields.io/badge/javascript-ES6+-yellow.svg)
![TensorFlow.js](https://img.shields.io/badge/tensorflow.js-4.11.0-orange.svg)
![Firebase](https://img.shields.io/badge/firebase-10.7.1-red.svg)

## Overview

Math Adventures is a comprehensive adaptive learning platform designed for children ages 5-10 to practice arithmetic operations. The system combines rule-based logic with machine learning (TensorFlow.js) to personalize the learning experience, featuring user authentication, persistent progress tracking, competitive leaderboards, and real-time difficulty adaptation.

### Key Features

- **Dual Adaptive Engine**: Rule-based logic + TensorFlow.js ML model for intelligent difficulty adjustment
- **Google Authentication**: Secure sign-in with Google accounts for persistent progress
- **Firebase Integration**: Real-time data storage and synchronization
- **ELO Rating System**: Competitive rating system similar to chess rankings
- **Global Leaderboards**: Real-time player rankings and competition
- **Three Difficulty Levels**: Easy, Medium, and Hard with progressive challenges
- **Enhanced Problem Types**: Multi-operand problems (up to 4 operands) with BODMAS support
- **Beautiful UI**: Gold & olive green theme with smooth animations and responsive design
- **Dual Interface**: Advanced web frontend and Python CLI
- **Performance Analytics**: Detailed session statistics and progress tracking
- **Guest Mode**: Play without authentication with local progress saving

## Problem Types

### Easy Level (Ages 5-7)
- 2 operands, numbers 1-10
- Operations: Addition (+), Subtraction (-)
- Example: `7 + 3 = ?`, `9 - 4 = ?`

### Medium Level (Ages 7-9)
- 2-3 operands, numbers 1-20
- Operations: +, -, × with BODMAS
- Examples:
  - `12 + 3 × 4 = ?` (BODMAS: 12 + 12 = 24)
  - `(7 + 3) × 2 = ?` (Parentheses: 10 × 2 = 20)

### Hard Level (Ages 9-10)
- 3-4 operands, numbers 10-50
- All operations: +, -, ×, ÷ with complex BODMAS
- Examples:
  - `20 + 5 × 3 - 8 = ?` (27)
  - `(12 + 8) × (15 - 10) = ?` (100)
  - `30 - 12 ÷ 3 = ?` (26)

## Project Structure

```
math-adventures/
│
├── README.md                   # This file
├── .gitignore                  # Git ignore rules
├── requirements.txt            # Python dependencies
├── main.py                     # Python CLI application
│
├── src/                        # Python source modules
│   ├── __init__.py
│   ├── puzzle_generator.py     # Enhanced puzzle generation
│   ├── tracker.py              # Performance tracking
│   └── adaptive_engine.py      # Rule-based adaptive logic
│
├── interface/                  # Web interface
│   ├── index.html              # HTML structure with auth
│   ├── styles.css              # Gold & olive green styling
│   ├── logo.jpg                # Application logo
│   └── scriptjs/               # JavaScript modules
│       ├── config.js           # Configuration and constants
│       ├── auth.js             # Google authentication
│       ├── firebase-config.js  # Firebase configuration
│       ├── game.js             # Core game logic
│       ├── leaderboard.js      # Leaderboard management
│       ├── mlEngine.js         # TensorFlow.js ML engine
│       ├── puzzleGenerator.js  # Client-side puzzle generation
│       ├── rating.js           # ELO rating system
│       └── summary.js          # Session summary display
│
└── docs/                       # Documentation
    └── notes.md                # Development notes
```

## Quick Start

### Web Version (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/math-adventures.git
   cd math-adventures
   ```

2. **Set up Firebase (Optional)**
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Authentication and Firestore
   - Update `interface/scriptjs/firebase-config.js` with your config
   - Configure Google Sign-In in Firebase Console

3. **Set up Google Authentication (Optional)**
   - Get Google Client ID from Google Cloud Console
   - Update `GOOGLE_CLIENT_ID` in `interface/scriptjs/config.js`

4. **Run the application**
   ```bash
   # Using Python's built-in server
   python -m http.server 8000
   # Visit: http://localhost:8000/interface/
   
   # Or simply open the file directly
   open interface/index.html
   ```

5. **Start learning**
   - Sign in with Google (optional) or play as guest
   - Choose your display username
   - Select difficulty level
   - Answer 10 questions and compete on the leaderboard!

### Python CLI Version

1. **Run the application**
   ```bash
   python main.py
   ```

2. **Follow the prompts**
   - Enter your name
   - Choose difficulty (0=Easy, 1=Medium, 2=Hard)
   - Answer math problems
   - View your session summary

### Run Tests

```bash
python test_system.py
```

## Adaptive Learning Algorithm

The system uses a **hybrid adaptive engine** combining rule-based logic with machine learning:

### Machine Learning Engine (TensorFlow.js)

- **Neural Network**: 3-layer feedforward network with dropout
- **Input Features**: Accuracy, response time, current difficulty, streak, total attempts
- **Training**: Synthetic data generation with 500+ samples
- **Real-time Prediction**: Difficulty adjustment based on performance patterns

### Rule-Based Fallback

| Condition | Action |
|-----------|--------|
| Accuracy ≥ 80% AND Avg Time < 8s | Increase difficulty |
| Accuracy ≥ 67% | Maintain difficulty |
| Accuracy < 67% | Decrease difficulty |

### ELO Rating System

- **Starting Rating**: 1000 points
- **K-Factor**: 40 (new players), 20 (experienced)
- **Session Score**: Based on accuracy, speed, and difficulty
- **Rating Updates**: After each session using ELO formula

## Visual Features

### Authentication & User Management

1. **Google Sign-In**: Secure authentication with profile photos
2. **Guest Mode**: Play without signing in with local storage
3. **User Profiles**: Display names, ratings, and game statistics

### Game Interface

1. **Real-time Stats**: Live accuracy, correct/incorrect counters
2. **Difficulty Badges**: Visual indicators of current level
3. **Progress Tracking**: Question counter and session progress

### Summary Screen Graphics

1. **Session Rating**: ELO-style rating with change indicators
2. **Performance Cards**: Accuracy, average time, correct answers
3. **Progress Bars**: Visual representation of performance
4. **Recommendations**: Suggested difficulty for next session

### Leaderboard

1. **Global Rankings**: Top 5 players with ratings and games played
2. **Profile Integration**: User photos and display names
3. **Real-time Updates**: Live leaderboard refresh

## Design

- **Color Theme**: Gold (#DAA520) & Olive Green (#556B2F)
- **Background**: Checkered pattern
- **Typography**: Segoe UI, clean and readable
- **Animations**: Smooth transitions and progress reveals
- **Responsive**: Works on desktop and mobile

## Architecture

```
┌─────────────────────────────────────────┐
│         User Interface Layer            │
│    (HTML/CSS/JS or Python CLI)          │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│        Authentication Layer             │
│   (Google Sign-In, Firebase Auth)       │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│        Main Controller                  │
│   (Orchestrates Learning Session)       │
└─┬──────────┬──────────┬─────────────────┘
  │          │          │
  ▼          ▼          ▼
┌────────┐ ┌─────────┐ ┌──────────────┐
│Puzzle  │ │ML/Rule  │ │   Rating &   │
│Generat │ │Adaptive │ │  Leaderboard │
│or      │ │Engine   │ │   System     │
└────────┘ └─────────┘ └──────────────┘
           │
           ▼
     ┌──────────────┐
     │  TensorFlow  │
     │  .js Model   │
     └──────────────┘
```

## Testing

The project includes comprehensive testing for all components:

```bash
# Test Python modules
python src/puzzle_generator.py
python src/tracker.py
python src/adaptive_engine.py

# Run Python CLI version
python main.py

# Test web version
# Open interface/index.html in browser
# Or run local server:
python -m http.server 8000
```

### Manual Testing Checklist

**Authentication:**
- [ ] Google Sign-In works
- [ ] Guest mode functions
- [ ] User data persists
- [ ] Sign-out clears session

**Game Flow:**
- [ ] Difficulty selection
- [ ] Puzzle generation
- [ ] Answer validation
- [ ] Adaptive difficulty changes
- [ ] Session completion

**ML Engine:**
- [ ] Model trains successfully
- [ ] Predictions are reasonable
- [ ] Fallback to rules works
- [ ] Performance is acceptable

**Leaderboard:**
- [ ] Rankings update
- [ ] User info displays
- [ ] Local storage works
- [ ] Multiple users supported

## Future Enhancements

- **Advanced ML Models**: LSTM networks for sequence prediction
- **Personalized Learning Paths**: Individual curriculum adaptation
- **Multi-topic Support**: Vocabulary, science, history modules
- **Teacher Dashboard**: Classroom management and analytics
- **Mobile App**: React Native or Flutter implementation
- **Multiplayer Modes**: Real-time competitions and team challenges
- **Advanced Analytics**: Learning curve analysis and insights
- **Accessibility Features**: Screen reader support, high contrast mode
- **Gamification**: Achievements, badges, and reward systems
- **Parent Portal**: Progress reports and learning recommendations

## Design Decisions

### Why Hybrid ML + Rule-Based Approach?

**Machine Learning Advantages:**
- Learns individual user patterns
- Discovers non-obvious performance indicators
- Adapts to unique learning styles
- Improves with more data

**Rule-Based Fallback Benefits:**
- Transparent and explainable decisions
- Consistent behavior for new users
- No training data required initially
- Easy to debug and modify

**Combined Approach:**
- Best of both worlds
- Graceful degradation when ML unavailable
- Immediate deployment capability

### Authentication Strategy

**Google Sign-In Benefits:**
- Secure, trusted authentication
- No password management
- Profile photos and real names
- Cross-device synchronization

**Guest Mode Support:**
- No barriers to entry
- Local progress saving
- Privacy-conscious option
- Offline capability

### ELO Rating System

- **Competitive Element**: Motivates continued play
- **Fair Matching**: Similar skill levels compete
- **Progress Tracking**: Long-term improvement measurement
- **Familiar System**: Used in chess, gaming, sports

### BODMAS Integration

Problems follow proper order of operations:
1. **B**rackets (Parentheses)
2. **O**rders (Exponents - not implemented)
3. **D**ivision and **M**ultiplication (left to right)
4. **A**ddition and **S**ubtraction (left to right)

All division ensures whole number results, and subtraction guarantees positive answers for age-appropriate learning.

## Technical Details

### Technologies Used

**Frontend:**
- HTML5 for structure
- CSS3 for styling with responsive design
- Vanilla JavaScript (ES6+)
- TensorFlow.js 4.11.0 for machine learning
- Firebase 10.7.1 for authentication and data storage
- Google Sign-In API for authentication

**Backend:**
- Python 3.8+ (standard library only)
- Modular architecture
- Object-oriented design

**Data Storage:**
- Firebase Firestore for cloud storage
- LocalStorage for offline/guest mode
- Real-time synchronization

### Dependencies

**Web Version:**
- TensorFlow.js (CDN)
- Firebase SDK (CDN)
- Google Sign-In API (CDN)

**Python Version:**
- scikit-learn (optional, for ML features)
- numpy (optional, for numerical computing)

## Configuration

### Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Authentication and Firestore Database
3. Add your domain to authorized domains
4. Update `interface/scriptjs/firebase-config.js`:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

### Google Authentication Setup

1. Go to Google Cloud Console
2. Create OAuth 2.0 credentials
3. Add authorized origins
4. Update `GOOGLE_CLIENT_ID` in `interface/scriptjs/config.js`

### Running Without Authentication

The app works perfectly in guest mode without any setup - just open `interface/index.html`!

### Performance

- **Lightweight**: Core game <100 KB
- **ML Model**: ~50 KB compressed TensorFlow.js model
- **Fast Training**: 50 epochs in <5 seconds
- **Real-time Inference**: <10ms prediction time
- **Offline Capable**: Guest mode with local storage

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
