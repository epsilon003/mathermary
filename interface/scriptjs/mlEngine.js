/**
 * Machine Learning Adaptive Engine - Mobile-Friendly Version
 * TensorFlow.js-based difficulty adjustment with mobile optimization
 */

/**
 * Initialize and train the ML model with mobile detection and timeout
 */
async function initializeMLModel() {
    console.log('Initializing ML model...');
    
    // Detect if mobile device
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    // Set timeout based on device (mobile gets less time)
    const timeoutDuration = isMobile ? 8000 : 15000; // 8s mobile, 15s desktop
    
    console.log(`Device: ${isMobile ? 'Mobile' : 'Desktop'}, Timeout: ${timeoutDuration}ms`);
    
    // Create timeout promise
    const timeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('ML initialization timeout')), timeoutDuration)
    );
    
    try {
        // Race between ML initialization and timeout
        await Promise.race([
            actuallyInitializeML(isMobile),
            timeout
        ]);
        
        modelTrained = true;
        console.log('ML model trained successfully!');
        
    } catch (error) {
        console.warn('ML model initialization failed or timed out, using rule-based system:', error.message);
        modelTrained = false; // Will use rule-based fallback
        
        // Clean up any partial TensorFlow resources
        if (typeof tf !== 'undefined') {
            try {
                tf.disposeVariables();
            } catch (e) {
                console.log('TF cleanup skipped');
            }
        }
    }
}

/**
 * Actually initialize the ML model (separated for timeout handling)
 */
async function actuallyInitializeML(isMobile = false) {
    // Check if TensorFlow is available
    if (typeof tf === 'undefined') {
        throw new Error('TensorFlow.js not loaded');
    }
    
    // Set backend based on device
    if (isMobile) {
        // Use CPU backend for mobile (more reliable)
        await tf.setBackend('cpu');
        console.log('Using CPU backend for mobile');
    } else {
        // Desktop can try WebGL first, fallback to CPU
        try {
            await tf.setBackend('webgl');
            console.log('Using WebGL backend');
        } catch (e) {
            await tf.setBackend('cpu');
            console.log('Fallback to CPU backend');
        }
    }
    
    await tf.ready();
    
    // Create a simpler neural network for mobile
    const layerConfig = isMobile ? {
        // Simpler model for mobile
        layer1Units: 8,
        layer2Units: 4,
        dropout: 0.1
    } : {
        // Full model for desktop
        layer1Units: 16,
        layer2Units: 8,
        dropout: 0.2
    };
    
    adaptiveModel = tf.sequential({
        layers: [
            tf.layers.dense({ 
                inputShape: [5], 
                units: layerConfig.layer1Units, 
                activation: 'relu' 
            }),
            tf.layers.dropout({ rate: layerConfig.dropout }),
            tf.layers.dense({ 
                units: layerConfig.layer2Units, 
                activation: 'relu' 
            }),
            tf.layers.dense({ 
                units: 3, 
                activation: 'softmax' 
            })
        ]
    });

    adaptiveModel.compile({
        optimizer: tf.train.adam(0.001),
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy']
    });

    // Reduce training data for mobile
    const numSamples = isMobile ? 250 : 500;
    const trainingData = generateTrainingData(numSamples);
    
    const xs = tf.tensor2d(trainingData.features);
    const ys = tf.tensor2d(trainingData.labels);

    // Train the model with fewer epochs on mobile
    const epochs = isMobile ? 30 : 50;
    const batchSize = isMobile ? 64 : 32;
    
    console.log(`Training with ${numSamples} samples, ${epochs} epochs, batch size ${batchSize}`);
    
    await adaptiveModel.fit(xs, ys, {
        epochs: epochs,
        batchSize: batchSize,
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

    // Clean up training tensors
    xs.dispose();
    ys.dispose();
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

    try {
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

        // Clean up tensors
        features.dispose();
        prediction.dispose();

        console.log(`ML Prediction: Current=${currentDiff}, Predicted=${predictedDiff}, Probabilities=[${predictionData.map(p => p.toFixed(2)).join(', ')}]`);

        return predictedDiff;
        
    } catch (error) {
        console.warn('ML prediction error, using rule-based fallback:', error);
        return calculateNextDifficultyRuleBased(currentDiff, perfHistory);
    }
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

    const nextDiff = Math.max(0, Math.min(2, currentDiff + score));
    
    console.log(`Rule-based: Current=${currentDiff}, Next=${nextDiff}, Accuracy=${(recentAccuracy*100).toFixed(0)}%, Time=${(avgTime/1000).toFixed(1)}s`);
    
    return nextDiff;
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
