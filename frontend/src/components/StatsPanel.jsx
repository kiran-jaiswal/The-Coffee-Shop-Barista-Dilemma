import React from 'react';

const StatsPanel = ({ stats }) => {
    return (
        <div className="analytics-card">
            <h3 className="analytics-title">Live Analytics</h3>
            <div className="analytics-grid">
                <div className="analytics-item">
                    <span className="analytics-value green">{stats.avgWaitTime} min</span>
                    <span className="analytics-label">Avg Wait</span>
                </div>
                <div className="analytics-item">
                    <span className="analytics-value orange">{stats.totalOrders}</span>
                    <span className="analytics-label">Orders Served</span>
                </div>
                <div className="analytics-item">
                    <span className="analytics-value red">{stats.maxWaitTime || 0} min</span>
                    <span className="analytics-label">Max Wait</span>
                </div>
                <div className="analytics-item">
                    <span className="analytics-value red">{stats.missedDeadlines}</span>
                    <span className="analytics-label">SLA Violations</span>
                </div>
            </div>
        </div>
    );
};

export default StatsPanel;
