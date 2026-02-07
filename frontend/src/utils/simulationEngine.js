import { MENU_ITEMS, CONSTANTS } from './constants';
import { calculatePriorityScore } from './priorityAlgorithm';

const { MAX_WAIT_TIME, POISSON_LAMBDA } = CONSTANTS;

// Pure logic version of the simulation for batch testing
export class CoffeeShopEngine {
    constructor() {
        this.reset();
    }

    reset() {
        this.queue = [];
        this.baristas = [
            { id: 1, state: 'idle', currentOrder: null, progress: 0 },
            { id: 2, state: 'idle', currentOrder: null, progress: 0 },
            { id: 3, state: 'idle', currentOrder: null, progress: 0 },
        ];
        this.completed = [];
        this.stats = {
            totalOrders: 0,
            totalWaitTime: 0,
            missedDeadlines: 0,
        };
        this.time = 0;
    }

    // Helper: Generate order
    generateOrder() {
        const id = Math.random().toString(36).substr(2, 9);
        const item = MENU_ITEMS[Math.floor(Math.random() * MENU_ITEMS.length)];
        const isVip = Math.random() < 0.1;
        return {
            id,
            item,
            arrivalTime: this.time,
            status: 'pending',
            isVip,
            priorityScore: 0,
            simulatedPrepTime: item.prepTime * 60,
        };
    }

    // Run one second of simulation
    tick() {
        this.time += 1;

        // 1. Arrival
        const prob = POISSON_LAMBDA / 60;
        if (Math.random() < prob) {
            this.queue.push(this.generateOrder());
        }

        // 2. Priorities
        this.queue.forEach(order => {
            order.priorityScore = calculatePriorityScore(order, this.time);
        });
        this.queue.sort((a, b) => b.priorityScore - a.priorityScore);

        // 3. Assignment
        const freeBaristas = this.baristas.filter(b => b.state === 'idle');
        freeBaristas.forEach(barista => {
            if (this.queue.length > 0) {
                const order = this.queue.shift();
                barista.state = 'busy';
                barista.currentOrder = order;
                barista.progress = 0;
            }
        });

        // 4. Processing
        this.baristas.forEach(barista => {
            if (barista.state === 'busy') {
                barista.progress += 1;
                if (barista.progress >= barista.currentOrder.simulatedPrepTime) {
                    const done = {
                        ...barista.currentOrder,
                        finishedAt: this.time,
                        totalWait: (this.time - barista.currentOrder.arrivalTime) / 60
                    };
                    this.completed.push(done);

                    this.stats.totalOrders++;
                    this.stats.totalWaitTime += done.totalWait;
                    if (done.totalWait > MAX_WAIT_TIME) this.stats.missedDeadlines++;

                    barista.state = 'idle';
                    barista.currentOrder = null;
                    barista.progress = 0;
                }
            }
        });
    }

    run(durationSeconds) {
        this.reset();
        for (let i = 0; i < durationSeconds; i++) {
            this.tick();
        }
        return {
            totalOrders: this.stats.totalOrders,
            avgWaitTime: this.stats.totalOrders > 0 ? (this.stats.totalWaitTime / this.stats.totalOrders) : 0,
            missedDeadlines: this.stats.missedDeadlines,
            slaBreachRate: this.stats.totalOrders > 0 ? (this.stats.missedDeadlines / this.stats.totalOrders) * 100 : 0,
            completedCount: this.completed.length
        };
    }
}
