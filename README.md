# Math Adventures - AI-Powered Adaptive Learning System

An intelligent math learning platform that dynamically adjusts difficulty based on student performance using adaptive learning algorithms. Features enhanced BODMAS support, multi-operand problems, and beautiful visual feedback.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.8+-green.svg)
![HTML5](https://img.shields.io/badge/html5-CSS3-orange.svg)

## Overview

Math Adventures is an adaptive learning prototype designed for children ages 5-10 to practice arithmetic operations. The system uses a rule-based adaptive engine to personalize the learning experience by adjusting puzzle difficulty in real-time based on accuracy and response time.

### Key Features

- **Adaptive Difficulty Engine**: Automatically adjusts problem difficulty based on performance
- **Three Difficulty Levels**: Easy, Medium, and Hard with appropriate challenges
- **Enhanced Problem Types**: Multi-operand problems (up to 4 operands) with BODMAS support
- **Graphical Progress Summary**: Circular progress bars, star ratings, and animated statistics
- **Dual Interface**: Web frontend and Python CLI
- **Beautiful UI**: Gold & olive green checkered theme with smooth animations
- **Keyboard Optimized**: Auto-focus input for seamless question flow

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
math-adaptive-prototype/
│
├── README.md                   # This file
├── .gitignore                  # Git ignore rules
├── requirements.txt            # Python dependencies (none required)
├── main.py                     # Python CLI application
│
├── src/                        # Python source modules
│   ├── __init__.py
│   ├── puzzle_generator.py     # Enhanced puzzle generation
│   ├── tracker.py              # Performance tracking
│   └── adaptive_engine.py      # Adaptive difficulty logic
│
├── interface/                  # Web interface
│   ├── index.html              # HTML structure
│   ├── styles.css              # Gold & olive green styling
│   └── script.js               # Game logic and animations
│
└── docs/                       # Documentation
    └── technical_note.md       # Technical documentation
```

## Quick Start

### Web Version (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/math-adaptive-prototype.git
   cd math-adaptive-prototype
   ```

2. **Open in browser**
   ```bash
   # Simply open the file
   open frontend/index.html
   
   # Or use a local server
   python -m http.server 8000
   # Visit: http://localhost:8000/frontend/index.html
   ```

3. **Start learning**
   - Enter your name
   - Choose difficulty level
   - Answer 10 questions
   - View your animated progress summary

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

The system uses a **rule-based adaptive engine** that evaluates performance over a sliding window of 3 attempts:

### Decision Rules

| Condition | Action |
|-----------|--------|
| Accuracy ≥ 80% AND Avg Time < 8s | Increase difficulty |
| Accuracy ≥ 67% | Maintain difficulty |
| Accuracy < 67% | Decrease difficulty |

### Key Metrics

- **Recent Accuracy**: Percentage of correct answers (last 3 attempts)
- **Response Time**: Average time taken to answer (seconds)
- **Difficulty Transitions**: Tracked throughout the session

## Visual Features

### Summary Screen Graphics

1. **Circular Progress Indicator**: Animated accuracy percentage
2. **Progress Bars**: Visual representation of correct answers
3. **Time Performance Bar**: Speed indicator (faster is better)
4. **Difficulty Dots**: Shows progression through levels
5. **Star Rating System**:
   - 5 stars: 90%+ (Excellent)
   - 4 stars: 80-89% (Great)
   - 3 stars: 70-79% (Good)
   - 2 stars: 60-69% (Fair)
   - 1 star: <60% (Keep trying!)

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
│        Main Controller                  │
│   (Orchestrates Learning Session)       │
└─┬──────────┬──────────┬─────────────────┘
  │          │          │
  ▼          ▼          ▼
┌────────┐ ┌─────────┐ ┌──────────────┐
│Puzzle  │ │Performan│ │   Adaptive   │
│Generat │ │ce       │ │   Engine     │
│or      │ │Tracker  │ │              │
└────────┘ └─────────┘ └──────────────┘
```

## Testing

The project includes comprehensive unit tests for all components:

```bash
# Run all tests
python test_system.py

# Test individual modules
python src/puzzle_generator.py
python src/tracker.py
python src/adaptive_engine.py
```

## Future Enhancements

- Machine Learning-based adaptive engine
- User accounts and progress persistence
- Multi-topic support (vocabulary, science, etc.)
- Multiplayer mode with leaderboards
- Mobile app (React Native)
- Teacher dashboard with analytics
- Additional operations (fractions, decimals, algebra)
- Accessibility features (screen reader support, high contrast mode)

## Design Decisions

### Why Rule-Based Over Machine Learning?

**Advantages of Rule-Based:**
- Transparent and explainable decisions
- No training data required
- Consistent and predictable behavior
- Immediate deployment
- Easy to debug and modify

**Trade-offs:**
- Cannot learn individual user patterns
- Fixed thresholds may not suit all learners
- Doesn't discover emergent insights from data

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
- CSS3 for styling (no frameworks)
- Vanilla JavaScript (no dependencies)
- SVG for circular progress graphics

**Backend:**
- Python 3.8+ (standard library only)
- Modular architecture
- Object-oriented design

### Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Performance

- Lightweight: <50 KB total
- No external dependencies
- Fast load times
- Smooth 60fps animations

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
