"""
ML-Based Adaptive Engine Module
Uses machine learning to predict optimal difficulty adjustments
"""

import random
import json
from typing import List, Dict, Optional


class MLAdaptiveEngine:
    """
    Machine Learning-based adaptive engine that predicts difficulty
    using a simple decision tree-like approach.
    
    Features:
    - Feature extraction from performance history
    - Pattern recognition for learning styles
    - Confidence-based predictions
    - Falls back to rule-based when uncertain
    """
    
    def __init__(self):
        # Initialize with pre-trained patterns (simulated ML model)
        self.patterns = self._initialize_patterns()
        self.confidence_threshold = 0.7
        self.feature_weights = {
            'recent_accuracy': 0.4,
            'accuracy_trend': 0.2,
            'avg_time': 0.2,
            'time_trend': 0.1,
            'consistency': 0.1
        }
    
    def _initialize_patterns(self):
        """
        Initialize learned patterns from 'training data'
        In a real ML system, this would be loaded from a trained model
        """
        return {
            # Pattern: (accuracy_range, time_range, consistency_range) -> (difficulty_change, confidence)
            'quick_master': {
                'features': {'acc': (0.8, 1.0), 'time': (0, 6000), 'consistency': (0.8, 1.0)},
                'prediction': +1,
                'confidence': 0.9
            },
            'steady_learner': {
                'features': {'acc': (0.65, 0.8), 'time': (6000, 10000), 'consistency': (0.6, 0.8)},
                'prediction': 0,
                'confidence': 0.85
            },
            'struggling': {
                'features': {'acc': (0, 0.5), 'time': (8000, 15000), 'consistency': (0, 0.5)},
                'prediction': -1,
                'confidence': 0.9
            },
            'fast_guesser': {
                'features': {'acc': (0, 0.5), 'time': (0, 4000), 'consistency': (0, 0.3)},
                'prediction': -1,
                'confidence': 0.75
            },
            'slow_thinker': {
                'features': {'acc': (0.8, 1.0), 'time': (10000, 20000), 'consistency': (0.7, 1.0)},
                'prediction': 0,  # Don't penalize for being thoughtful
                'confidence': 0.8
            },
            'improving': {
                'features': {'acc': (0.6, 0.8), 'time': (5000, 9000), 'consistency': (0.5, 0.7)},
                'prediction': +1,
                'confidence': 0.7
            }
        }
    
    def calculate_next_difficulty(self, current_difficulty: int, 
                                 performance_history: List[Dict]) -> int:
        """
        Use ML to predict next difficulty level.
        
        Args:
            current_difficulty (int): Current difficulty (0, 1, or 2)
            performance_history (List[Dict]): Performance records
            
        Returns:
            int: Predicted next difficulty level
        """
        if len(performance_history) < 2:
            return current_difficulty
        
        # Extract features from performance history
        features = self._extract_features(performance_history)
        
        # Predict using pattern matching (simulated ML inference)
        prediction, confidence = self._predict(features)
        
        # Apply prediction with confidence weighting
        if confidence >= self.confidence_threshold:
            new_difficulty = current_difficulty + prediction
        else:
            # Fall back to rule-based when uncertain
            new_difficulty = self._rule_based_fallback(current_difficulty, performance_history)
        
        # Ensure difficulty stays in valid range
        return max(0, min(2, new_difficulty))
    
    def _extract_features(self, history: List[Dict]) -> Dict[str, float]:
        """
        Extract meaningful features from performance history.
        
        Returns feature vector for ML prediction.
        """
        recent = history[-3:] if len(history) >= 3 else history
        all_history = history[-5:] if len(history) >= 5 else history
        
        # Feature 1: Recent accuracy
        recent_accuracy = sum(1 for h in recent if h['correct']) / len(recent)
        
        # Feature 2: Overall accuracy
        overall_accuracy = sum(1 for h in all_history if h['correct']) / len(all_history)
        
        # Feature 3: Accuracy trend (improving or declining)
        if len(history) >= 4:
            first_half_acc = sum(1 for h in history[:len(history)//2] if h['correct']) / (len(history)//2)
            second_half_acc = sum(1 for h in history[len(history)//2:] if h['correct']) / (len(history) - len(history)//2)
            accuracy_trend = second_half_acc - first_half_acc
        else:
            accuracy_trend = 0
        
        # Feature 4: Average response time
        avg_time = sum(h['time'] for h in recent) / len(recent)
        
        # Feature 5: Time trend (getting faster or slower)
        if len(history) >= 4:
            first_half_time = sum(h['time'] for h in history[:len(history)//2]) / (len(history)//2)
            second_half_time = sum(h['time'] for h in history[len(history)//2:]) / (len(history) - len(history)//2)
            time_trend = first_half_time - second_half_time  # Positive = getting faster
        else:
            time_trend = 0
        
        # Feature 6: Consistency (standard deviation of correctness)
        if len(recent) >= 2:
            correct_pattern = [1 if h['correct'] else 0 for h in recent]
            mean_correct = sum(correct_pattern) / len(correct_pattern)
            variance = sum((x - mean_correct) ** 2 for x in correct_pattern) / len(correct_pattern)
            consistency = 1 - variance  # Higher = more consistent
        else:
            consistency = 1.0
        
        # Feature 7: Streak (current streak of correct/incorrect)
        streak = 0
        if history:
            last_result = history[-1]['correct']
            for h in reversed(history):
                if h['correct'] == last_result:
                    streak += 1
                else:
                    break
            streak = streak if last_result else -streak
        
        return {
            'recent_accuracy': recent_accuracy,
            'overall_accuracy': overall_accuracy,
            'accuracy_trend': accuracy_trend,
            'avg_time': avg_time,
            'time_trend': time_trend,
            'consistency': consistency,
            'streak': streak
        }
    
    def _predict(self, features: Dict[str, float]) -> tuple:
        """
        Predict difficulty adjustment using pattern matching.
        
        Returns:
            tuple: (prediction: -1/0/+1, confidence: 0-1)
        """
        best_match = None
        best_score = 0
        
        # Match features against learned patterns
        for pattern_name, pattern_data in self.patterns.items():
            score = self._match_score(features, pattern_data['features'])
            if score > best_score:
                best_score = score
                best_match = pattern_data
        
        if best_match and best_score > 0.5:
            return best_match['prediction'], best_match['confidence'] * best_score
        
        # No strong match, return neutral with low confidence
        return 0, 0.5
    
    def _match_score(self, features: Dict[str, float], 
                     pattern_features: Dict[str, tuple]) -> float:
        """
        Calculate how well features match a pattern.
        
        Returns:
            float: Match score (0-1)
        """
        scores = []
        
        # Check accuracy match
        if 'acc' in pattern_features:
            acc_range = pattern_features['acc']
            if acc_range[0] <= features['recent_accuracy'] <= acc_range[1]:
                scores.append(1.0)
            else:
                # Partial score based on distance
                distance = min(
                    abs(features['recent_accuracy'] - acc_range[0]),
                    abs(features['recent_accuracy'] - acc_range[1])
                )
                scores.append(max(0, 1 - distance * 2))
        
        # Check time match
        if 'time' in pattern_features:
            time_range = pattern_features['time']
            if time_range[0] <= features['avg_time'] <= time_range[1]:
                scores.append(1.0)
            else:
                distance = min(
                    abs(features['avg_time'] - time_range[0]),
                    abs(features['avg_time'] - time_range[1])
                ) / 10000  # Normalize
                scores.append(max(0, 1 - distance))
        
        # Check consistency match
        if 'consistency' in pattern_features:
            cons_range = pattern_features['consistency']
            if cons_range[0] <= features['consistency'] <= cons_range[1]:
                scores.append(1.0)
            else:
                distance = min(
                    abs(features['consistency'] - cons_range[0]),
                    abs(features['consistency'] - cons_range[1])
                )
                scores.append(max(0, 1 - distance * 2))
        
        return sum(scores) / len(scores) if scores else 0
    
    def _rule_based_fallback(self, current_difficulty: int, 
                           performance_history: List[Dict]) -> int:
        """
        Fallback to simple rule-based logic when ML is uncertain.
        """
        recent = performance_history[-3:]
        recent_accuracy = sum(1 for h in recent if h['correct']) / len(recent)
        avg_time = sum(h['time'] for h in recent) / len(recent)
        
        if recent_accuracy >= 0.8 and avg_time < 8000:
            return min(current_difficulty + 1, 2)
        elif recent_accuracy < 0.67:
            return max(current_difficulty - 1, 0)
        else:
            return current_difficulty
    
    def get_performance_insights(self, performance_history: List[Dict]) -> Dict:
        """
        Generate insights about the learner's performance.
        
        Returns:
            Dict: Insights including learning style, strengths, areas for improvement
        """
        if len(performance_history) < 3:
            return {
                'learning_style': 'Insufficient data',
                'strengths': [],
                'areas_for_improvement': [],
                'recommendation': 'Complete more problems for personalized insights'
            }
        
        features = self._extract_features(performance_history)
        
        # Identify learning style
        learning_style = self._identify_learning_style(features)
        
        # Identify strengths
        strengths = []
        if features['recent_accuracy'] >= 0.8:
            strengths.append('High accuracy')
        if features['avg_time'] < 6000:
            strengths.append('Quick problem-solving')
        if features['consistency'] >= 0.7:
            strengths.append('Consistent performance')
        if features['accuracy_trend'] > 0.1:
            strengths.append('Improving over time')
        
        # Identify areas for improvement
        improvements = []
        if features['recent_accuracy'] < 0.6:
            improvements.append('Accuracy needs attention')
        if features['avg_time'] > 12000:
            improvements.append('Could work on speed')
        if features['consistency'] < 0.5:
            improvements.append('More consistent practice needed')
        
        return {
            'learning_style': learning_style,
            'strengths': strengths,
            'areas_for_improvement': improvements,
            'recommendation': self._generate_recommendation(features)
        }
    
    def _identify_learning_style(self, features: Dict[str, float]) -> str:
        """Identify the learner's style based on features"""
        if features['recent_accuracy'] >= 0.8 and features['avg_time'] < 6000:
            return 'Quick Master'
        elif features['recent_accuracy'] >= 0.8 and features['avg_time'] > 10000:
            return 'Thoughtful Solver'
        elif features['accuracy_trend'] > 0.2:
            return 'Fast Learner'
        elif features['consistency'] >= 0.8:
            return 'Steady Performer'
        elif features['recent_accuracy'] < 0.5:
            return 'Needs Support'
        else:
            return 'Developing Learner'
    
    def _generate_recommendation(self, features: Dict[str, float]) -> str:
        """Generate personalized recommendation"""
        if features['recent_accuracy'] >= 0.85:
            return 'Excellent work! Ready for more challenging problems'
        elif features['recent_accuracy'] >= 0.7:
            return 'Good progress! Keep practicing at this level'
        elif features['accuracy_trend'] > 0:
            return 'You\'re improving! Continue with current difficulty'
        else:
            return 'Try some easier problems to build confidence'


# Testing the module
if __name__ == "__main__":
    engine = MLAdaptiveEngine()
    
    print("Testing ML-Based Adaptive Engine\n")
    print("="*60)
    
    # Simulate different learner scenarios
    scenarios = {
        'Quick Master': [
            {'correct': True, 'time': 3000},
            {'correct': True, 'time': 2500},
            {'correct': True, 'time': 3500},
            {'correct': True, 'time': 2800}
        ],
        'Struggling': [
            {'correct': False, 'time': 12000},
            {'correct': False, 'time': 11000},
            {'correct': True, 'time': 10000},
            {'correct': False, 'time': 13000}
        ],
        'Improving': [
            {'correct': False, 'time': 8000},
            {'correct': True, 'time': 7000},
            {'correct': True, 'time': 6500},
            {'correct': True, 'time': 6000}
        ]
    }
    
    for scenario_name, history in scenarios.items():
        print(f"\nScenario: {scenario_name}")
        print("-" * 60)
        
        current_diff = 1
        next_diff = engine.calculate_next_difficulty(current_diff, history)
        
        print(f"Current Difficulty: {current_diff}")
        print(f"Predicted Next Difficulty: {next_diff}")
        
        insights = engine.get_performance_insights(history)
        print(f"Learning Style: {insights['learning_style']}")
        print(f"Recommendation: {insights['recommendation']}")
        
        if insights['strengths']:
            print(f"Strengths: {', '.join(insights['strengths'])}")
        if insights['areas_for_improvement']:
            print(f"Areas for Improvement: {', '.join(insights['areas_for_improvement'])}")