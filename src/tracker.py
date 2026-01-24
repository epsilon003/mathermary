"""
Performance Tracker Module
Tracks user performance metrics and learning progress
"""

from typing import List, Dict


class PerformanceTracker:
    """
    Tracks student performance across the learning session.
    
    Metrics tracked:
    - Correctness (correct/incorrect answers)
    - Response time
    - Difficulty level for each attempt
    - Overall accuracy and trends
    """
    
    def __init__(self):
        self.performance_history = []
        self.difficulty_transitions = []
    
    def record_attempt(self, puzzle: str, user_answer: int, correct_answer: int,
                      is_correct: bool, time_taken: float, difficulty: int):
        """
        Record a single attempt.
        
        Args:
            puzzle (str): The puzzle question
            user_answer (int): User's answer
            correct_answer (int): Correct answer
            is_correct (bool): Whether answer was correct
            time_taken (float): Time taken in seconds
            difficulty (int): Difficulty level (0, 1, 2)
        """
        attempt = {
            'puzzle': puzzle,
            'user_answer': user_answer,
            'correct_answer': correct_answer,
            'correct': is_correct,
            'time': time_taken,
            'difficulty': difficulty,
            'attempt_number': len(self.performance_history) + 1
        }
        
        # Track difficulty transitions
        if self.performance_history:
            prev_difficulty = self.performance_history[-1]['difficulty']
            if prev_difficulty != difficulty:
                direction = 'up' if difficulty > prev_difficulty else 'down'
                difficulty_names = ['Easy', 'Medium', 'Hard']
                
                self.difficulty_transitions.append({
                    'from': difficulty_names[prev_difficulty],
                    'to': difficulty_names[difficulty],
                    'direction': direction,
                    'at': attempt['attempt_number']
                })
        
        self.performance_history.append(attempt)
    
    def get_performance_history(self) -> List[Dict]:
        """
        Get the complete performance history.
        
        Returns:
            List[Dict]: List of all attempts with their metrics
        """
        return self.performance_history.copy()
    
    def get_recent_performance(self, n: int = 3) -> List[Dict]:
        """
        Get the most recent n attempts.
        
        Args:
            n (int): Number of recent attempts to retrieve
            
        Returns:
            List[Dict]: List of recent attempts
        """
        return self.performance_history[-n:]
    
    def get_stats(self) -> Dict:
        """
        Calculate overall session statistics.
        
        Returns:
            Dict: Statistics including accuracy, average time, correct/incorrect counts
        """
        if not self.performance_history:
            return {
                'total': 0,
                'correct': 0,
                'incorrect': 0,
                'accuracy': 0.0,
                'avg_time': 0.0
            }
        
        correct_count = sum(1 for attempt in self.performance_history if attempt['correct'])
        total_count = len(self.performance_history)
        incorrect_count = total_count - correct_count
        accuracy = (correct_count / total_count * 100) if total_count > 0 else 0
        avg_time = sum(attempt['time'] for attempt in self.performance_history) / total_count
        
        return {
            'total': total_count,
            'correct': correct_count,
            'incorrect': incorrect_count,
            'accuracy': accuracy,
            'avg_time': avg_time
        }
    
    def get_recent_accuracy(self, n: int = 3) -> float:
        """
        Calculate accuracy for the most recent n attempts.
        
        Args:
            n (int): Number of recent attempts to consider
            
        Returns:
            float: Accuracy percentage (0-100)
        """
        recent = self.get_recent_performance(n)
        if not recent:
            return 0.0
        
        correct = sum(1 for attempt in recent if attempt['correct'])
        return (correct / len(recent)) * 100
    
    def get_recent_avg_time(self, n: int = 3) -> float:
        """
        Calculate average time for the most recent n attempts.
        
        Args:
            n (int): Number of recent attempts to consider
            
        Returns:
            float: Average time in seconds
        """
        recent = self.get_recent_performance(n)
        if not recent:
            return 0.0
        
        return sum(attempt['time'] for attempt in recent) / len(recent)
    
    def get_difficulty_transitions(self) -> List[Dict]:
        """
        Get all difficulty level transitions during the session.
        
        Returns:
            List[Dict]: List of difficulty changes
        """
        return self.difficulty_transitions.copy()
    
    def get_total_attempts(self) -> int:
        """Get total number of attempts made"""
        return len(self.performance_history)
    
    def reset(self):
        """Reset all tracking data"""
        self.performance_history = []
        self.difficulty_transitions = []


# Testing the module
if __name__ == "__main__":
    tracker = PerformanceTracker()
    
    print("Testing Performance Tracker\n")
    
    # Simulate some attempts
    test_attempts = [
        ("5 + 3", 8, 8, True, 3.2, 0),
        ("7 - 2", 5, 5, True, 2.8, 0),
        ("12 + 8", 20, 20, True, 4.1, 1),
        ("15 × 3", 45, 45, True, 5.5, 1),
        ("20 - 7", 12, 13, False, 6.2, 1),
    ]
    
    for puzzle, user_ans, correct_ans, is_correct, time, diff in test_attempts:
        tracker.record_attempt(puzzle, user_ans, correct_ans, is_correct, time, diff)
    
    print("Session Statistics:")
    stats = tracker.get_stats()
    for key, value in stats.items():
        print(f"  {key}: {value}")
    
    print("\nDifficulty Transitions:")
    for trans in tracker.get_difficulty_transitions():
        print(f"  {trans}")