import { MENU_ITEMS } from '../utils/constants';

const API_BASE_URL = '/api';

export const api = {
    // Place a new order
    placeOrder: async (drinkType, isRegular) => {
        try {
            const response = await fetch(`${API_BASE_URL}/orders/place?drinkType=${drinkType}&regularCustomer=${isRegular}`, {
                method: 'POST',
            });
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.warn("Backend unavailable, using mock response for placeOrder");
            // Mock success response
            return {
                id: "MOCK-" + Math.random().toString(36).substr(2, 6),
                drinkType,
                regularCustomer: isRegular,
                arrivalTime: new Date().toISOString()
            };
        }
    },

    // Get pending orders
    getPendingOrders: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/orders/pending`);
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error("Error fetching pending orders:", error);
            return [];
        }
    },

    // Complete an order
    completeOrder: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/orders/${id}/complete`, {
                method: 'POST',
            });
            if (!response.ok) throw new Error('Network response was not ok');
        } catch (error) {
            console.error("Error completing order:", error);
        }
    },

    // Get statistics
    getStats: async () => {
        // This might return test cases summary, maybe not live stats.
        // We might need to implement a live stats endpoint or stick to frontend stats.
        return null;
    }
};
