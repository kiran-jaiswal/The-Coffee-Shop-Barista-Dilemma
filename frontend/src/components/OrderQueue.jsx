import React from 'react';

const OrderQueue = ({ queue, currentTime }) => {
    return (
        <div className="queue-section">
            <div className="queue-header">
                <h3 className="section-title">
                    Smart Waiting Queue ({queue.length})
                </h3>
                <span className="sort-label">Sorted by Dynamic Priority</span>
            </div>

            <div className="queue-table-header">
                <span>Customer</span>
                <span>Drink</span>
                <span>ETA</span>
                <span>Priority</span>
                <span>Reason</span>
            </div>

            <div className="queue-list-container">
                {queue.length === 0 ? (
                    <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        No orders in queue.
                    </div>
                ) : (
                    <div className="queue-list">
                        {queue.map((order) => {
                            const waitTime = ((currentTime - order.arrivalTime) / 60).toFixed(1);
                            const isUrgent = waitTime > 8;
                            const score = Math.round(order.priorityScore);

                            return (
                                <div key={order.id} className="queue-table-row">
                                    <div className="row-customer">
                                        {order.customerName || `Customer #${order.id}`}
                                        {order.isVip && <span className="badge-vip">GOLD</span>}
                                    </div>
                                    <div className="row-drink">{order.item.name}</div>
                                    <div style={{ color: isUrgent ? 'var(--danger)' : 'var(--text-primary)' }}>{waitTime} min</div>
                                    <div className={score > 80 ? 'priority-high' : score > 50 ? 'priority-med' : 'priority-low'}>
                                        {score}
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                        {isUrgent ? 'Wait Time > 8m' : order.isVip ? 'Loyalty Bonus' : 'Standard'}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderQueue;
