/**
 * Machine Learning Adaptive Engine
 * TensorFlow.js-based difficulty adjustment
 */

/**
 * Initialize and train the ML model
 */
async function initializeMLModel() {
    console.log('Initializing ML model...');
    
    // Create a simple neural network
    adaptiveModel = tf.sequential({
        layers: [
            tf.layers.dense({ inputShape: [5], units: 16, activation: 'relu' }),
            tf.layers.dropout({ rate: 0.2 }),
            tf.layers.dense({ units: 8, activation: 'relu' }),
            tf.layers.dense({ units: 3, activation: 'softmax' })
        ]
    });

    adaptiveModel.compile({
        optimizer: tf.train.adam(0.001),
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy']
    });

    // Generate synthetic training data
    const trainingData = generateTrainingData(500);
    
    const xs = tf.tensor2d(trainingData.features);
    const ys = tf.tensor2d(trainingData.labels);

    // Train the model
    console.log('Training ML model...');
    await adaptiveModel.fit(xs, ys, {
        epochs: 50,
        batchSize: 32,
        shuffle: true,
        verbose: 0,
        callbacks: {
            onEpochEnd: (epoch, logs) => {
                if (epoch % 10 === 0) {
                    console.log(`Epoch ${epoch}: loss = ${logs.loss.toFixed(4)}, accuracy = ${logs.acc.toFixed(4)}`);
                }
            }
        }
    });

    xs.dispose();
    ys.dispose();

    modelTrained = true;
    console.log('ML model trained successfully!');
}

/**
 * Generate synthetic training data for the model
 */
function generateTrainingData(numSamples) {
    const features = [];
    const labels = [];

    for (let i = 0; i < numSamples; i++) {
        const currentDiff = Math.floor(Math.random() * 3);
        const accuracy = Math.random();
        const avgTime = Math.random() * 15000;
        const correctStreak = Math.floor(Math.random() * 5);
        const totalAttempts = Math.floor(Math.random() * 10) + 1;

        let nextDiff;
        if (accuracy >= 0.8 && avgTime < 8000 && currentDiff < 2) {
            nextDiff = currentDiff + 1;
        } else if (accuracy < 0.5 && currentDiff > 0) {
            nextDiff = currentDiff - 1;
        } else {
            nextDiff = currentDiff;
        }

        const normalizedFeatures = [
            accuracy,
            avgTime / 15000,
            currentDiff / 2,
            correctStreak / 5,
            Math.min(totalAttempts / 10, 1)
        ];

        const oneHot = [0, 0, 0];
        oneHot[nextDiff] = 1;

        features.push(normalizedFeatures);
        labels.push(oneHot);
    }

    return { features, labels };
}

/**
 * ML-based adaptive difficulty prediction
 */
async function calculateNextDifficultyML(currentDiff, perfHistory) {
    if (!modelTrained || perfHistory.length < 2) {
        return calculateNextDifficultyRuleBased(currentDiff, perfHistory);
    }

    const recent = perfHistory.slice(-3);
    const recentAccuracy = recent.filter(p => p.correct).length / recent.length;
    const avgTime = recent.reduce((sum, p) => sum + p.time, 0) / recent.length;
    
    let correctStreak = 0;
    for (let i = perfHistory.length - 1; i >= 0; i--) {
        if (perfHistory[i].correct) correctStreak++;
        else break;
    }

    const features = tf.tensor2d([[
        recentAccuracy,
        avgTime / 15000,
        currentDiff / 2,
        Math.min(correctStreak / 5, 1),
        Math.min(perfHistory.length / 10, 1)
    ]]);

    const prediction = adaptiveModel.predict(features);
    const predictionData = await prediction.data();
    
    const predictedDiff = predictionData.indexOf(Math.max(...predictionData));

    features.dispose();
    prediction.dispose();

    console.log(`ML Prediction: Current=${currentDiff}, Predicted=${predictedDiff}, Probabilities=[${predictionData.map(p => p.toFixed(2)).join(', ')}]`);

    return predictedDiff;
}

/**
 * Rule-based adaptive difficulty (fallback)
 */
function calculateNextDifficultyRuleBased(currentDiff, perfHistory) {
    if (perfHistory.length < 2) return currentDiff;

    const recent = perfHistory.slice(-3);
    const recentAccuracy = recent.filter(p => p.correct).length / recent.length;
    const avgTime = recent.reduce((sum, p) => sum + p.time, 0) / recent.length;

    let score = 0;
    
    if (recentAccuracy >= 0.8 && avgTime < 8000) {
        score = 1;
    } else if (recentAccuracy >= 0.67) {
        score = 0;
    } else {
        score = -1;
    }

    return Math.max(0, Math.min(2, currentDiff + score));
}

/**
 * Wrapper function for adaptive difficulty
 */
async function calculateNextDifficulty(currentDiff, perfHistory) {
    if (modelTrained) {
        return await calculateNextDifficultyML(currentDiff, perfHistory);
    } else {
        return calculateNextDifficultyRuleBased(currentDiff, perfHistory);
    }
}