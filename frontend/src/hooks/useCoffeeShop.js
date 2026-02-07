import { useState, useEffect, useCallback, useRef } from 'react';
import { MENU_ITEMS, CONSTANTS } from '../utils/constants';
import { calculatePriorityScore } from '../utils/priorityAlgorithm';

const { MAX_WAIT_TIME, EMERGENCY_WAIT_TIME, POISSON_LAMBDA, SIMULATION_SPEED } = CONSTANTS;

export const useCoffeeShopSimulation = () => {
    const [queue, setQueue] = useState([]);
    const [baristas, setBaristas] = useState([
        { id: 1, state: 'idle', currentOrder: null, progress: 0 },
        { id: 2, state: 'idle', currentOrder: null, progress: 0 },
        { id: 3, state: 'idle', currentOrder: null, progress: 0 },
    ]);
    const [completedOrders, setCompletedOrders] = useState([]);
    const [stats, setStats] = useState({
        totalOrders: 0,
        avgWaitTime: 0,
        missedDeadlines: 0,
        totalWaitTime: 0,
    });

    const timeRef = useRef(0); // Simulation time in seconds
    const [timeElapsed, setTimeElapsed] = useState(0);

    // Helper: Generate Random Order
    const generateOrder = useCallback(() => {
        const id = Math.random().toString(36).substr(2, 9);
        const item = MENU_ITEMS[Math.floor(Math.random() * MENU_ITEMS.length)];
        const isVip = Math.random() < 0.1; // 10% VIP chance
        return {
            id,
            item,
            arrivalTime: timeRef.current,
            status: 'pending',
            isVip,
            priorityScore: 0,
            simulatedPrepTime: item.prepTime * 60, //Convert min to sec
        };
    }, []);

    // Helper: Calculate Poisson Arrival
    const checkArrival = useCallback(() => {
        // Lambda is customers per minute. 
        // Probability of arrival in 1 second = 1 - e^(-lambda/60)
        // Or simplified: if rand < lambda/60
        const prob = POISSON_LAMBDA / 60;
        return Math.random() < prob;
    }, []);

    // Main Simulation Loop
    useEffect(() => {
        const interval = setInterval(() => {
            timeRef.current += 1;
            setTimeElapsed(timeRef.current);
            const currentTime = timeRef.current;

            setQueue(prevQueue => {
                let newQueue = [...prevQueue];

                // 1. Order Arrival
                if (checkArrival()) {
                    newQueue.push(generateOrder());
                }

                // 2. Update Priorities & Check Timeouts
                newQueue = newQueue.map(order => ({
                    ...order,
                    // Recalculate Score
                    priorityScore: calculatePriorityScore(order, currentTime)
                })).sort((a, b) => b.priorityScore - a.priorityScore); // Sort by Priority DESC

                return newQueue;
            });

            setBaristas(prevBaristas => {
                return prevBaristas.map(barista => {
                    let newBarista = { ...barista };

                    if (newBarista.state === 'busy') {
                        newBarista.progress += (1 * SIMULATION_SPEED);
                        // Check completion
                        if (newBarista.progress >= newBarista.currentOrder.simulatedPrepTime) {
                            // Order Done
                            const doneOrder = {
                                ...newBarista.currentOrder,
                                completionTime: currentTime,
                                totalWait: (currentTime - newBarista.currentOrder.arrivalTime) / 60 // minutes
                            };

                            setCompletedOrders(prev => [doneOrder, ...prev].slice(0, 50)); // Keep last 50
                            setStats(prev => ({
                                totalOrders: prev.totalOrders + 1,
                                totalWaitTime: prev.totalWaitTime + doneOrder.totalWait,
                                avgWaitTime: (prev.totalWaitTime + doneOrder.totalWait) / (prev.totalOrders + 1),
                                missedDeadlines: doneOrder.totalWait > MAX_WAIT_TIME ? prev.missedDeadlines + 1 : prev.missedDeadlines
                            }));

                            newBarista.state = 'idle';
                            newBarista.currentOrder = null;
                            newBarista.progress = 0;
                        }
                    }
                    return newBarista;
                });
            });

            // 3. Assign Orders to Free Baristas
            // Needs access to latest queue state, so we do functionally inside setQueue or use refs.
            // Using a separate effect or structured update is better. 
            // For simplicity in this loop, we can process assignment assignment after state updates 
            // BUT React batches. So we need to do it carefully.

            // To solve the "accessing latest state" issue in interval, we'll do the assignment logic
            // inside the setBaristas updater, accessing the *current* queue via a ref or by chaining.
            // ACTUALLY, strict simulation is easier if we manage "world state" in one object 
            // or use refs for mutable simulations. 
            // Let's use a "tick" function that computes everything.

        }, 1000 / SIMULATION_SPEED);

        return () => clearInterval(interval);
    }, [checkArrival, generateOrder]);

    // Separate Effect for Assignment (reacts to queue/barista changes)
    // This might cause double-renders but safer for React state model
    useEffect(() => {
        setBaristas(prevBaristas => {
            const freeBaristaIndices = prevBaristas.map((b, i) => b.state === 'idle' ? i : -1).filter(i => i !== -1);

            if (freeBaristaIndices.length === 0) return prevBaristas;

            let assigned = false;
            // We need to read the queue, but we can't inside this setter easily without a ref
            // So let's skip the "tick" approach above and do a ref-based simulation with a single state sync.
            return prevBaristas;
        });
    }, [queue]); // Dep on queue updates

    // REFACTORED SIMULATION LOOP (Ref-based for consistency)
    // We will use a Ref to hold the "GameState" and only sync to React State for rendering.
    // This avoids the stale closure hell of setInterval + multiple  useState.

    const gameState = useRef({
        queue: [],
        baristas: [
            { id: 1, state: 'idle', currentOrder: null, progress: 0 },
            { id: 2, state: 'idle', currentOrder: null, progress: 0 },
            { id: 3, state: 'idle', currentOrder: null, progress: 0 },
        ],
        completed: [],
        stats: { totalOrders: 0, totalWaitTime: 0, missedDeadlines: 0 },
        time: 0
    });

    // Force Update Trigger
    const [tick, setTick] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            const state = gameState.current;
            state.time += 1;

            // 1. Arrival
            if (checkArrival()) {
                state.queue.push(generateOrder());
            }

            // 2. Priorities
            state.queue.forEach(order => {
                order.priorityScore = calculatePriorityScore(order, state.time);
            });
            state.queue.sort((a, b) => b.priorityScore - a.priorityScore);

            // 3. Assignment
            const freeBaristas = state.baristas.filter(b => b.state === 'idle');
            // Workload balancing?? "Overloaded baristas prefer short orders"
            // For now, basic assignment:
            freeBaristas.forEach(barista => {
                if (state.queue.length > 0) {
                    // Get highest priority order
                    const order = state.queue.shift();
                    barista.state = 'busy';
                    barista.currentOrder = order;
                    barista.progress = 0;
                }
            });

            // 4. Processing
            state.baristas.forEach(barista => {
                if (barista.state === 'busy') {
                    barista.progress += 1;
                    if (barista.progress >= barista.currentOrder.simulatedPrepTime) {
                        // Complete
                        const done = {
                            ...barista.currentOrder,
                            finishedAt: state.time,
                            totalWait: (state.time - barista.currentOrder.arrivalTime) / 60
                        };
                        state.completed.unshift(done);
                        if (state.completed.length > 50) state.completed.pop();

                        // Stats
                        state.stats.totalOrders++;
                        state.stats.totalWaitTime += done.totalWait;
                        if (done.totalWait > MAX_WAIT_TIME) state.stats.missedDeadlines++;

                        barista.state = 'idle';
                        barista.currentOrder = null;
                        barista.progress = 0;
                    }
                }
            });

            setTick(t => t + 1); // Trigger re-render
        }, 1000 / SIMULATION_SPEED);

        return () => clearInterval(timer);
    }, [checkArrival, generateOrder]);

    const addManualOrder = (orderData) => {
        const item = MENU_ITEMS.find(i => i.id === orderData.drinkType);
        const newOrder = {
            id: orderData.id,
            item: item, // Ensure item exists
            arrivalTime: gameState.current.time,
            status: 'pending',
            isVip: orderData.isVip,
            priorityScore: 0,
            simulatedPrepTime: item ? item.prepTime * 60 : 60,
            customerName: orderData.customerName
        };

        gameState.current.queue.push(newOrder);
    };

    return {
        queue: gameState.current.queue,
        baristas: gameState.current.baristas,
        completed: gameState.current.completed,
        stats: {
            ...gameState.current.stats,
            avgWaitTime: gameState.current.stats.totalOrders > 0
                ? (gameState.current.stats.totalWaitTime / gameState.current.stats.totalOrders).toFixed(2)
                : 0,
            timeElapsed: gameState.current.time,
            // Calculate max wait time for stats
            maxWaitTime: gameState.current.completed.reduce((max, o) => Math.max(max, o.totalWait), 0).toFixed(1)
        },
        addManualOrder
    };
};
