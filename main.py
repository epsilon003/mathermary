"""
Math Adventures - Adaptive Learning System
Main entry point for the application
"""

from src.puzzle_generator import PuzzleGenerator
from src.tracker import PerformanceTracker
from src.adaptive_engine import AdaptiveEngine
import time

class MathAdventures:
    def __init__(self):
        self.puzzle_gen = PuzzleGenerator()
        self.tracker = PerformanceTracker()
        self.adaptive_engine = AdaptiveEngine()
        self.user_name = ""
        self.current_difficulty = 1  # Start at Medium (0=Easy, 1=Medium, 2=Hard)
        self.max_puzzles = 10
        
    def display_welcome(self):
        """Display welcome screen and get user info"""
        print("\n" + "="*60)
        print("  MATH ADVENTURES - AI-POWERED ADAPTIVE LEARNING")
        print("="*60)
        print("\nWelcome to Math Adventures!")
        print("This system adapts to YOUR learning pace.\n")
        
        self.user_name = input("Enter your name: ").strip()
        while not self.user_name:
            self.user_name = input("Please enter your name: ").strip()
            
        print("\nChoose starting difficulty:")
        print("0 - Easy (1-10, +/-)")
        print("1 - Medium (1-20, +/-/×)")
        print("2 - Hard (10-50, +/-/×/÷)")
        
        while True:
            try:
                choice = int(input("\nYour choice (0-2): "))
                if 0 <= choice <= 2:
                    self.current_difficulty = choice
                    break
                print("Please enter 0, 1, or 2")
            except ValueError:
                print("Please enter a valid number")
    
    def display_puzzle(self, puzzle):
        """Display the current puzzle"""
        print("\n" + "-"*60)
        difficulty_names = ['EASY', 'MEDIUM', 'HARD']
        print(f"Difficulty: {difficulty_names[self.current_difficulty]}")
        print(f"Question {self.tracker.get_total_attempts() + 1}/{self.max_puzzles}")
        print("-"*60)
        # Handle both simple and complex puzzles
        display_text = puzzle.get('display', f"{puzzle['num1']} {puzzle['operation']} {puzzle['num2']}")
        print(f"\n  {display_text} = ?")
        print()
    
    def get_user_answer(self):
        """Get and validate user answer"""
        while True:
            try:
                answer = input("Your answer: ").strip()
                return int(answer)
            except ValueError:
                print("Please enter a valid number")
    
    def display_feedback(self, is_correct, correct_answer, time_taken):
        """Display feedback on the answer"""
        if is_correct:
            print("\n✓ Correct! Great job!")
        else:
            print(f"\n✗ Not quite. The correct answer was {correct_answer}")
        print(f"Time taken: {time_taken:.1f} seconds")
    
    def display_stats(self):
        """Display current session statistics"""
        stats = self.tracker.get_stats()
        print("\n" + "="*60)
        print("CURRENT SESSION STATS")
        print("="*60)
        print(f"Correct: {stats['correct']} | Incorrect: {stats['incorrect']} | "
              f"Accuracy: {stats['accuracy']:.1f}%")
        print("="*60)
    
    def display_summary(self):
        """Display end-of-session summary"""
        stats = self.tracker.get_stats()
        
        print("\n\n" + "="*60)
        print(f"🏆  SESSION SUMMARY - {self.user_name.upper()}  🏆")
        print("="*60)
        
        print(f"\nPerformance Metrics:")
        print(f"   Total Questions: {stats['total']}")
        print(f"   Correct Answers: {stats['correct']}")
        print(f"   Accuracy: {stats['accuracy']:.1f}%")
        print(f"   Average Time: {stats['avg_time']:.1f} seconds")
        
        difficulty_names = ['Easy', 'Medium', 'Hard']
        print(f"\nFinal Difficulty Level: {difficulty_names[self.current_difficulty]}")
        
        print(f"\nRecommendation: Start your next session at {difficulty_names[self.current_difficulty]} level")
        print("\n" + "="*60)
        print("Thank you for playing Math Adventures!")
        print("="*60 + "\n")
    
    def run(self):
        """Main game loop"""
        self.display_welcome()
        
        print(f"\n🚀 Let's start, {self.user_name}!\n")
        time.sleep(1)
        
        for puzzle_num in range(self.max_puzzles):
            # Generate puzzle at current difficulty
            puzzle = self.puzzle_gen.generate(self.current_difficulty)
            
            # Display puzzle
            self.display_puzzle(puzzle)
            
            # Track start time
            start_time = time.time()
            
            # Get user answer
            user_answer = self.get_user_answer()
            
            # Calculate time taken
            time_taken = time.time() - start_time
            
            # Check correctness
            is_correct = (user_answer == puzzle['answer'])
            
            # Record performance
            self.tracker.record_attempt(
                puzzle=puzzle.get('display', f"{puzzle['num1']} {puzzle['operation']} {puzzle['num2']}"),
                user_answer=user_answer,
                correct_answer=puzzle['answer'],
                is_correct=is_correct,
                time_taken=time_taken,
                difficulty=self.current_difficulty
            )
            
            # Display feedback
            self.display_feedback(is_correct, puzzle['answer'], time_taken)
            
            # Display current stats
            self.display_stats()
            
            # Adapt difficulty for next puzzle (if not last puzzle)
            if puzzle_num < self.max_puzzles - 1:
                old_difficulty = self.current_difficulty
                self.current_difficulty = self.adaptive_engine.calculate_next_difficulty(
                    self.current_difficulty,
                    self.tracker.get_performance_history()
                )
                
                if self.current_difficulty != old_difficulty:
                    difficulty_names = ['Easy', 'Medium', 'Hard']
                    change = "increased" if self.current_difficulty > old_difficulty else "decreased"
                    print(f"\nDifficulty {change} to {difficulty_names[self.current_difficulty]}!")
                
                time.sleep(1.5)
        
        # Display final summary
        self.display_summary()


if __name__ == "__main__":
    game = MathAdventures()
    game.run()