"""
Puzzle Generator Module
Generates diverse math puzzles with multiple operands and BODMAS support
"""

import random


class PuzzleGenerator:
    """
    Generates adaptive math puzzles for different difficulty levels.
    Supports 2-4 operands with BODMAS (order of operations).
    
    Difficulty Levels:
    - 0 (Easy): 2 operands, numbers 1-10, operations: +, -
    - 1 (Medium): 2-3 operands, numbers 1-20, operations: +, -, ×, with some BODMAS
    - 2 (Hard): 3-4 operands, numbers 10-50, all operations with complex BODMAS
    """
    
    def __init__(self):
        self.difficulty_config = {
            0: {
                'name': 'Easy',
                'range': (1, 10),
                'operations': ['+', '-'],
                'max_operands': 2,
                'use_bodmas': False,
                'simple_prob': 1.0  # 100% simple problems
            },
            1: {
                'name': 'Medium',
                'range': (1, 20),
                'operations': ['+', '-', '×'],
                'max_operands': 3,
                'use_bodmas': True,
                'simple_prob': 0.5  # 50% simple, 50% complex
            },
            2: {
                'name': 'Hard',
                'range': (10, 50),
                'operations': ['+', '-', '×', '÷'],
                'max_operands': 4,
                'use_bodmas': True,
                'simple_prob': 0.3  # 30% simple, 70% complex
            }
        }
    
    def generate(self, difficulty_level):
        """
        Generate a math puzzle at the specified difficulty level.
        
        Args:
            difficulty_level (int): 0 (Easy), 1 (Medium), or 2 (Hard)
            
        Returns:
            dict: Puzzle containing expression, answer, and display text
        """
        if difficulty_level not in self.difficulty_config:
            raise ValueError(f"Invalid difficulty level: {difficulty_level}")
        
        config = self.difficulty_config[difficulty_level]
        
        # Decide whether to generate simple or complex problem
        use_simple = random.random() < config['simple_prob']
        
        if use_simple or not config['use_bodmas']:
            return self._generate_simple_problem(config, difficulty_level)
        else:
            return self._generate_complex_problem(config, difficulty_level)
    
    def _generate_simple_problem(self, config, difficulty_level):
        """Generate a simple 2-operand problem"""
        min_val, max_val = config['range']
        operation = random.choice(config['operations'])
        
        # Generate numbers and calculate answer based on operation
        if operation == '+':
            return self._generate_addition(min_val, max_val)
        elif operation == '-':
            return self._generate_subtraction(min_val, max_val)
        elif operation == '×':
            return self._generate_multiplication()
        elif operation == '÷':
            return self._generate_division()
    
    def _generate_complex_problem(self, config, difficulty_level):
        """Generate a complex problem with 3-4 operands and BODMAS"""
        min_val, max_val = config['range']
        num_operands = random.randint(3, config['max_operands'])
        
        # Choose problem type
        problem_types = [
            'multiplication_first',  # a + b × c
            'division_first',        # a - b ÷ c
            'parentheses',           # (a + b) × c
            'mixed_operations'       # a + b × c - d
        ]
        
        # Filter based on difficulty
        if difficulty_level == 1:
            # Medium: no division, fewer operands
            problem_types = ['multiplication_first', 'parentheses']
            num_operands = min(num_operands, 3)
        
        problem_type = random.choice(problem_types)
        
        if problem_type == 'multiplication_first':
            return self._generate_mult_first(min_val, max_val)
        elif problem_type == 'division_first' and '÷' in config['operations']:
            return self._generate_div_first(min_val, max_val)
        elif problem_type == 'parentheses':
            return self._generate_parentheses(min_val, max_val, num_operands)
        else:
            return self._generate_mixed_operations(min_val, max_val, num_operands, config['operations'])
    
    def _generate_addition(self, min_val, max_val):
        """Generate an addition problem"""
        num1 = random.randint(min_val, max_val)
        num2 = random.randint(min_val, max_val)
        answer = num1 + num2
        
        return {
            'num1': num1,
            'num2': num2,
            'operation': '+',
            'answer': answer,
            'expression': f"{num1} + {num2}",
            'display': f"{num1} + {num2}"
        }
    
    def _generate_subtraction(self, min_val, max_val):
        """Generate a subtraction problem (ensures positive result)"""
        num1 = random.randint(min_val, max_val)
        num2 = random.randint(min_val, max_val)
        
        # Ensure num1 >= num2 for positive result
        if num2 > num1:
            num1, num2 = num2, num1
        
        answer = num1 - num2
        
        return {
            'num1': num1,
            'num2': num2,
            'operation': '-',
            'answer': answer,
            'expression': f"{num1} - {num2}",
            'display': f"{num1} - {num2}"
        }
    
    def _generate_multiplication(self):
        """Generate a multiplication problem"""
        num1 = random.randint(1, 10)
        num2 = random.randint(1, 10)
        answer = num1 * num2
        
        return {
            'num1': num1,
            'num2': num2,
            'operation': '×',
            'answer': answer,
            'expression': f"{num1} × {num2}",
            'display': f"{num1} × {num2}"
        }
    
    def _generate_division(self):
        """Generate a division problem (ensures whole number result)"""
        num2 = random.randint(1, 10)
        answer = random.randint(1, 10)
        num1 = num2 * answer
        
        return {
            'num1': num1,
            'num2': num2,
            'operation': '÷',
            'answer': answer,
            'expression': f"{num1} ÷ {num2}",
            'display': f"{num1} ÷ {num2}"
        }
    
    def _generate_mult_first(self, min_val, max_val):
        """Generate: a + b × c (multiplication first by BODMAS)"""
        a = random.randint(min_val, max_val)
        b = random.randint(2, 10)  # Smaller for multiplication
        c = random.randint(2, 10)
        
        # Calculate with BODMAS: b × c first, then + a
        answer = a + (b * c)
        
        return {
            'num1': a,
            'num2': b,
            'operation': 'complex',
            'answer': answer,
            'expression': f"{a} + {b} × {c}",
            'display': f"{a} + {b} × {c}"
        }
    
    def _generate_div_first(self, min_val, max_val):
        """Generate: a - b ÷ c (division first by BODMAS)"""
        c = random.randint(2, 10)
        quotient = random.randint(2, 10)
        b = c * quotient  # Ensure whole number division
        a = random.randint(min_val, max_val)
        
        # Calculate with BODMAS: b ÷ c first, then a -
        answer = a - (b // c)
        
        # Ensure positive answer
        if answer < 0:
            a = a + abs(answer) + random.randint(5, 10)
            answer = a - (b // c)
        
        return {
            'num1': a,
            'num2': b,
            'operation': 'complex',
            'answer': answer,
            'expression': f"{a} - {b} ÷ {c}",
            'display': f"{a} - {b} ÷ {c}"
        }
    
    def _generate_parentheses(self, min_val, max_val, num_operands):
        """Generate problems with parentheses: (a + b) × c or (a - b) + c"""
        if num_operands == 3:
            # (a op1 b) op2 c
            a = random.randint(min_val, max_val)
            b = random.randint(min_val, max_val)
            c = random.randint(2, 10)
            
            inner_op = random.choice(['+', '-'])
            outer_op = random.choice(['×', '+'])
            
            # Calculate inner parentheses first
            if inner_op == '+':
                inner_result = a + b
            else:
                if b > a:
                    a, b = b, a
                inner_result = a - b
            
            # Calculate outer operation
            if outer_op == '×':
                answer = inner_result * c
                expression = f"({a} {inner_op} {b}) × {c}"
            else:
                answer = inner_result + c
                expression = f"({a} {inner_op} {b}) + {c}"
            
            return {
                'num1': a,
                'num2': b,
                'operation': 'complex',
                'answer': answer,
                'expression': expression,
                'display': expression
            }
        else:
            # 4 operands: (a + b) × (c - d) or similar
            a = random.randint(min_val, max_val)
            b = random.randint(min_val, max_val)
            c = random.randint(min_val, max_val)
            d = random.randint(min_val, max_val)
            
            # Ensure positive results
            if b > a:
                a, b = b, a
            if d > c:
                c, d = d, c
            
            left = a + b
            right = c - d
            answer = left * right
            
            expression = f"({a} + {b}) × ({c} - {d})"
            
            return {
                'num1': a,
                'num2': b,
                'operation': 'complex',
                'answer': answer,
                'expression': expression,
                'display': expression
            }
    
    def _generate_mixed_operations(self, min_val, max_val, num_operands, allowed_ops):
        """Generate mixed operations: a + b × c - d"""
        if num_operands == 3:
            a = random.randint(min_val, max_val)
            b = random.randint(2, 10)
            c = random.randint(2, 10)
            
            # a + b × c (BODMAS: multiply first)
            answer = a + (b * c)
            expression = f"{a} + {b} × {c}"
            
            return {
                'num1': a,
                'num2': b,
                'operation': 'complex',
                'answer': answer,
                'expression': expression,
                'display': expression
            }
        else:
            # 4 operands: a + b × c - d
            a = random.randint(min_val, max_val)
            b = random.randint(2, 10)
            c = random.randint(2, 10)
            d = random.randint(min_val, min(max_val, 20))
            
            # BODMAS: b × c first, then a + result - d
            answer = a + (b * c) - d
            
            # Ensure positive answer
            if answer < 0:
                a = a + abs(answer) + random.randint(5, 15)
                answer = a + (b * c) - d
            
            expression = f"{a} + {b} × {c} - {d}"
            
            return {
                'num1': a,
                'num2': b,
                'operation': 'complex',
                'answer': answer,
                'expression': expression,
                'display': expression
            }
    
    def get_difficulty_name(self, difficulty_level):
        """Get the name of a difficulty level"""
        return self.difficulty_config.get(difficulty_level, {}).get('name', 'Unknown')


# Testing the module
if __name__ == "__main__":
    gen = PuzzleGenerator()
    
    print("Testing Enhanced Puzzle Generator with BODMAS\n")
    
    for difficulty in [0, 1, 2]:
        print(f"\n{gen.get_difficulty_name(difficulty)} Level Examples:")
        for i in range(5):
            puzzle = gen.generate(difficulty)
            print(f"{i+1}. {puzzle['display']} = {puzzle['answer']}")
            
    print("Testing complete!")