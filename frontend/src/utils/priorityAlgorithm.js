import { CONSTANTS } from './constants';

export const calculatePriorityScore = (order, currentTime) => {
    const waitTime = (currentTime - order.arrivalTime) / 60; // in minutes
    let score = 0;

    // 1. Wait Time (40%) - Simple linear scaling, capped at max wait
    // Normalized: 10 mins wait = 100 points contribution to this 40%
    const waitScore = Math.min((waitTime / CONSTANTS.MAX_WAIT_TIME) * 100, 100);
    score += waitScore * 0.4;

    // 2. Order Complexity (25%) - Lower complexity = Higher priority (throughput)
    // Complexity 1-4. 1 gets 100%, 4 gets 0% roughly
    // 1->100, 2->66, 3->33, 4->0
    const complexityScore = 100 - ((order.item.complexity - 1) * 33);
    score += complexityScore * 0.25;

    // 3. Loyalty Status (10%)
    if (order.isVip) {
        score += 100 * 0.10;
    }

    // 4. Urgency (25%) - Approaching timeout
    // If wait time > 8 mins (Emergency), huge boost
    if (waitTime > CONSTANTS.EMERGENCY_WAIT_TIME) {
        score += 50; // Flat emergency boost mentioned in reqs
    }

    // Dynamic urgency curve
    const urgencyScore = Math.pow((waitTime / CONSTANTS.MAX_WAIT_TIME), 2) * 100;
    score += urgencyScore * 0.25;

    return Math.min(score, 200); // Cap purely for display sanity vs infinite
};
