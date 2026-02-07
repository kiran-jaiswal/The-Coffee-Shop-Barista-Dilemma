import React, { useState } from 'react';
import { MENU_ITEMS } from '../utils/constants';

const OrderForm = ({ onPlaceOrder }) => {
    const [customerName, setCustomerName] = useState('');
    const [drinkType, setDrinkType] = useState(MENU_ITEMS[0].id);
    const [isVip, setIsVip] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!customerName.trim()) return;

        // Call parent handler
        onPlaceOrder({
            customerName,
            drinkType,
            isVip
        });

        // Reset
        setCustomerName('');
        setIsVip(false);
    };

    return (
        <div className="order-form-card">
            <h2 className="form-title">Place New Order</h2>
            <form onSubmit={handleSubmit}>
                <div className="order-form-grid">
                    <div className="form-group">
                        <label>Customer Name</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Enter name"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Drink</label>
                        <select
                            className="form-select"
                            value={drinkType}
                            onChange={(e) => setDrinkType(e.target.value)}
                        >
                            {MENU_ITEMS.map(item => (
                                <option key={item.id} value={item.id}>
                                    {item.name} ({item.prepTime} min)
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="checkbox-group" onClick={() => setIsVip(!isVip)}>
                        <input
                            type="checkbox"
                            id="vip"
                            checked={isVip}
                            onChange={(e) => setIsVip(e.target.checked)}
                        />
                        <label htmlFor="vip">Loyalty Member (Gold)</label>
                    </div>

                    <button type="submit" className="btn-submit">Submit Order</button>
                </div>
            </form>
        </div>
    );
};

export default OrderForm;
