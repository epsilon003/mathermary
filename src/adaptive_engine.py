"""
Adaptive Engine Module
Implements rule-based adaptive logic to adjust difficulty based on performance
"""

from typing import List, Dict


class AdaptiveEngine:
    """
    Rule-based adaptive engine that adjusts difficulty based on:
    1. Recent accuracy (last 3 attempts)
    2. Average response time
    3. Performance trends
    
    Strategy:
    - High accuracy (≥80%) + Fast response (<8s) → Increase difficulty
    - Moderate accuracy (≥67%) → Maintain difficulty
    - Low accuracy (<67%) → Decrease difficulty
    """
    
    def __init__(self, lookback_window: int = 3):
        """
        Initialize the adaptive engine.
        
        Args:
            lookback_window (int): Number of recent attempts to consider
        """
        self.lookback_window = lookback_window
        self.time_threshold_fast = 8.0  # seconds
        self.accuracy_threshold_high = 0.80  # 80%
        self.accuracy_threshold_moderate = 0.67  # 67%
    
    def calculate_next_difficulty(self, current_difficulty: int, 
                                 performance_history: List[Dict]) -> int:
        """
        Calculate the next difficulty level based on recent performance.
        
        Args:
            current_difficulty (int): Current difficulty level (0, 1, or 2)
            performance_history (List[Dict]): List of all performance records
            
        Returns:
            int: Next difficulty level (0, 1, or 2)
        """
        # Need at least 2 attempts to make meaningful adjustments
        if len(performance_history) < 2:
            return current_difficulty
        
        # Get recent performance
        recent = performance_history[-self.lookback_window:]
        
        # Calculate metrics
        recent_accuracy = self._calculate_accuracy(recent)
        avg_time = self._calculate_avg_time(recent)
        
        # Determine adjustment score
        adjustment_score = self._determine_adjustment(recent_accuracy, avg_time)
        
        # Calculate new difficulty (bounded between 0 and 2)
        new_difficulty = max(0, min(2, current_difficulty + adjustment_score))
        
        return new_difficulty
    
    def _calculate_accuracy(self, attempts: List[Dict]) -> float:
        """
        Calculate accuracy from a list of attempts.
        
        Args:
            attempts (List[Dict]): List of attempt records
            
        Returns:
            float: Accuracy as a decimal (0.0 to 1.0)
        """
        if not attempts:
            return 0.0
        
        correct_count = sum(1 for attempt in attempts if attempt['correct'])
        return correct_count / len(attempts)
    
    def _calculate_avg_time(self, attempts: List[Dict]) -> float:
        """
        Calculate average response time from a list of attempts.
        
        Args:
            attempts (List[Dict]): List of attempt records
            
        Returns:
            float: Average time in seconds
        """
        if not attempts:
            return 0.0
        
        total_time = sum(attempt['time'] for attempt in attempts)
        return total_time / len(attempts)
    
    def _determine_adjustment(self, accuracy: float, avg_time: float) -> int:
        """
        Determine difficulty adjustment based on performance metrics.
        
        Args:
            accuracy (float): Recent accuracy (0.0 to 1.0)
            avg_time (float): Average response time in seconds
            
        Returns:
            int: Adjustment score (-1, 0, or +1)
        """
        # Performing well: high accuracy and fast responses
        if accuracy >= self.accuracy_threshold_high and avg_time < self.time_threshold_fast:
            return 1  # Increase difficulty
        
        # Moderate performance: decent accuracy
        elif accuracy >= self.accuracy_threshold_moderate:
            return 0  # Maintain current difficulty
        
        # Struggling: low accuracy
        else:
            return -1  # Decrease difficulty
    
    def get_performance_assessment(self, performance_history: List[Dict]) -> Dict:
        """
        Get a detailed assessment of recent performance.
        
        Args:
            performance_history (List[Dict]): List of all performance records
            
        Returns:
            Dict: Assessment containing accuracy, time, and recommendation
        """
        if not performance_history:
            return {
                'accuracy': 0.0,
                'avg_time': 0.0,
                'assessment': 'Not enough data',
                'recommendation': 'Continue practicing'
            }
        
        recent = performance_history[-self.lookback_window:]
        accuracy = self._calculate_accuracy(recent)
        avg_time = self._calculate_avg_time(recent)
        
        # Determine assessment
        if accuracy >= self.accuracy_threshold_high and avg_time < self.time_threshold_fast:
            assessment = "Excellent! You're mastering this level."
            recommendation = "Ready for more challenging problems"
        elif accuracy >= self.accuracy_threshold_moderate:
            assessment = "Good progress! Keep it up."
            recommendation = "Continue at this level to build confidence"
        else:
            assessment = "Keep practicing - you're learning!"
            recommendation = "Let's try some easier problems"
        
        return {
            'accuracy': accuracy * 100,  # Convert to percentage
            'avg_time': avg_time,
            'assessment': assessment,
            'recommendation': recommendation
        }


# Testing the module
if __name__ == "__main__":
    engine = AdaptiveEngine()
    
    print("Testing Adaptive Engine\n")
    
    # Simulate performance scenarios
    scenarios = [
        {
            'name': 'High Performance',
            'history': [
                {'correct': True, 'time': 3.0},
                {'correct': True, 'time': 2.5},
                {'correct': True, 'time': 4.0}
            ],
            'current_diff': 1
        },
        {
            'name': 'Moderate Performance',
            'history': [
                {'correct': True, 'time': 6.0},
                {'correct': True, 'time': 7.0},
                {'correct': False, 'time': 8.0}
            ],
            'current_diff': 1
        },
        {
            'name': 'Struggling',
            'history': [
                {'correct': False, 'time': 10.0},
                {'correct': True, 'time': 12.0},
                {'correct': False, 'time': 9.0}
            ],
            'current_diff': 1
        }
    ]
    
    for scenario in scenarios:
        next_diff = engine.calculate_next_difficulty(
            scenario['current_diff'],
            scenario['history']
        )
        assessment = engine.get_performance_assessment(scenario['history'])
        
        print(f"Scenario: {scenario['name']}")
        print(f"  Current Difficulty: {scenario['current_diff']}")
        print(f"  Next Difficulty: {next_diff}")
        print(f"  Assessment: {assessment['assessment']}")
        print(f"  Recommendation: {assessment['recommendation']}\n")