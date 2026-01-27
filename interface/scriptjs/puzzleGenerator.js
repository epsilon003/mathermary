/**
 * Puzzle Generator
 * Generates math puzzles with BODMAS support
 */

/**
 * Generate a math puzzle based on difficulty level
 */
function generatePuzzle(level) {
    const config = DIFFICULTY_LEVELS[level];
    
    // Decide simple or complex
    const useSimple = Math.random() < config.simpleProb;
    
    if (useSimple || !config.useBodmas) {
        return generateSimplePuzzle(config);
    } else {
        return generateComplexPuzzle(config, level);
    }
}

/**
 * Generate simple 2-operand puzzle
 */
function generateSimplePuzzle(config) {
    const [min, max] = config.range;
    const operation = config.operations[Math.floor(Math.random() * config.operations.length)];
    
    let num1 = Math.floor(Math.random() * (max - min + 1)) + min;
    let num2 = Math.floor(Math.random() * (max - min + 1)) + min;
    let answer;
    let display;

    switch(operation) {
        case '+':
            answer = num1 + num2;
            display = `${num1} + ${num2}`;
            break;
        case '-':
            if (num2 > num1) [num1, num2] = [num2, num1];
            answer = num1 - num2;
            display = `${num1} - ${num2}`;
            break;
        case '×':
            num1 = Math.floor(Math.random() * 10) + 1;
            num2 = Math.floor(Math.random() * 10) + 1;
            answer = num1 * num2;
            display = `${num1} × ${num2}`;
            break;
        case '÷':
            num2 = Math.floor(Math.random() * 10) + 1;
            answer = Math.floor(Math.random() * 10) + 1;
            num1 = num2 * answer;
            display = `${num1} ÷ ${num2}`;
            break;
        default:
            answer = num1 + num2;
            display = `${num1} + ${num2}`;
    }

    return { num1, num2, operation, answer, display };
}

/**
 * Generate complex puzzle with BODMAS
 */
function generateComplexPuzzle(config, level) {
    const [min, max] = config.range;
    const numOperands = Math.floor(Math.random() * (config.maxOperands - 2)) + 3;
    
    let problemTypes = ['multiplication_first', 'parentheses', 'mixed_operations'];
    
    if (level === 1) {
        problemTypes = ['multiplication_first', 'parentheses'];
    }
    
    const problemType = problemTypes[Math.floor(Math.random() * problemTypes.length)];
    
    if (problemType === 'multiplication_first') {
        return generateMultFirst(min, max);
    } else if (problemType === 'parentheses') {
        return generateParentheses(min, max, numOperands);
    } else {
        return generateMixedOperations(min, max, numOperands);
    }
}

/**
 * Generate: a + b × c
 */
function generateMultFirst(min, max) {
    const a = Math.floor(Math.random() * (max - min + 1)) + min;
    const b = Math.floor(Math.random() * 9) + 2;
    const c = Math.floor(Math.random() * 9) + 2;
    
    const answer = a + (b * c);
    const display = `${a} + ${b} × ${c}`;
    
    return { num1: a, num2: b, operation: 'complex', answer, display };
}

/**
 * Generate: (a + b) × c or similar
 */
function generateParentheses(min, max, numOperands) {
    if (numOperands === 3) {
        let a = Math.floor(Math.random() * (max - min + 1)) + min;
        let b = Math.floor(Math.random() * (max - min + 1)) + min;
        const c = Math.floor(Math.random() * 9) + 2;
        
        const innerOp = Math.random() < 0.5 ? '+' : '-';
        const outerOp = Math.random() < 0.5 ? '×' : '+';
        
        let innerResult;
        if (innerOp === '+') {
            innerResult = a + b;
        } else {
            if (b > a) [a, b] = [b, a];
            innerResult = a - b;
        }
        
        let answer, display;
        if (outerOp === '×') {
            answer = innerResult * c;
            display = `(${a} ${innerOp} ${b}) × ${c}`;
        } else {
            answer = innerResult + c;
            display = `(${a} ${innerOp} ${b}) + ${c}`;
        }
        
        return { num1: a, num2: b, operation: 'complex', answer, display };
    } else {
        let a = Math.floor(Math.random() * (max - min + 1)) + min;
        let b = Math.floor(Math.random() * (max - min + 1)) + min;
        let c = Math.floor(Math.random() * (max - min + 1)) + min;
        let d = Math.floor(Math.random() * (max - min + 1)) + min;
        
        if (b > a) [a, b] = [b, a];
        if (d > c) [c, d] = [d, c];
        
        const left = a + b;
        const right = c - d;
        const answer = left * right;
        const display = `(${a} + ${b}) × (${c} - ${d})`;
        
        return { num1: a, num2: b, operation: 'complex', answer, display };
    }
}

/**
 * Generate: a + b × c - d
 */
function generateMixedOperations(min, max, numOperands) {
    if (numOperands === 3) {
        const a = Math.floor(Math.random() * (max - min + 1)) + min;
        const b = Math.floor(Math.random() * 9) + 2;
        const c = Math.floor(Math.random() * 9) + 2;
        
        const answer = a + (b * c);
        const display = `${a} + ${b} × ${c}`;
        
        return { num1: a, num2: b, operation: 'complex', answer, display };
    } else {
        let a = Math.floor(Math.random() * (max - min + 1)) + min;
        const b = Math.floor(Math.random() * 9) + 2;
        const c = Math.floor(Math.random() * 9) + 2;
        let d = Math.floor(Math.random() * Math.min(max, 20) - min + 1) + min;
        
        let answer = a + (b * c) - d;
        
        if (answer < 0) {
            a = a + Math.abs(answer) + Math.floor(Math.random() * 10) + 5;
            answer = a + (b * c) - d;
        }
        
        const display = `${a} + ${b} × ${c} - ${d}`;
        
        return { num1: a, num2: b, operation: 'complex', answer, display };
    }
}