import React from 'react';

const CompletedOrders = ({ orders }) => {
    return (
        <div className="completed-section">
            <h2 className="section-title">Completed Orders</h2>
            <div className="completed-list">
                {orders.map((order, i) => (
                    <div key={i} className="completed-item">
                        <span>{order.item.name}</span>
                        <span className={`wait-time ${order.totalWait > 10 ? 'late' : 'ontime'}`}>
                            {order.totalWait.toFixed(2)}m
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CompletedOrders;
