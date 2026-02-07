export const MENU_ITEMS = [
    { id: 'cold_brew', name: 'Cold Brew', prepTime: 1, price: 120, complexity: 1 },
    { id: 'espresso', name: 'Espresso', prepTime: 2, price: 150, complexity: 2 },
    { id: 'americano', name: 'Americano', prepTime: 2, price: 140, complexity: 2 },
    { id: 'cappuccino', name: 'Cappuccino', prepTime: 4, price: 180, complexity: 3 },
    { id: 'latte', name: 'Latte', prepTime: 4, price: 200, complexity: 3 },
    { id: 'mocha', name: 'Specialty (Mocha)', prepTime: 6, price: 250, complexity: 4 },
];

export const CONSTANTS = {
    BARISTA_COUNT: 3,
    MAX_WAIT_TIME: 10, // minutes
    EMERGENCY_WAIT_TIME: 8, // minutes
    POISSON_LAMBDA: 1.4, // customers per minute
    SIMULATION_SPEED: 1, // 1 real second = 1 simulation second (can be changed to speed up)
    TOLERANCE_THRESHOLD: 8, // minutes for new customers
};
