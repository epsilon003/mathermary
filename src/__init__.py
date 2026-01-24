"""
Math Adventures - Adaptive Learning System
A modular adaptive math learning platform for children ages 5-10

Modules:
- puzzle_generator: Creates difficulty-appropriate math puzzles
- tracker: Tracks and analyzes performance metrics
- adaptive_engine: Implements adaptive difficulty adjustment logic
"""

__version__ = "1.0.0"
__author__ = "Abhimantr Singh"

from .puzzle_generator import PuzzleGenerator
from .tracker import PerformanceTracker
from .adaptive_engine import AdaptiveEngine

__all__ = [
    'PuzzleGenerator',
    'PerformanceTracker',
    'AdaptiveEngine'
]