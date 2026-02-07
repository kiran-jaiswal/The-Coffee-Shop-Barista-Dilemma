import React from 'react';

const BaristaStation = ({ baristas }) => {
    return (
        <div className="barista-section">
            <h3 className="section-title" style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Barista Status</h3>
            <div className="barista-list">
                {baristas.map((barista) => (
                    <div key={barista.id} className={`barista-card-vertical ${barista.state}`}>
                        <div className="barista-info-v">
                            <h4>Barista {barista.id}</h4>
                            <p className="barista-status-text">
                                {barista.state === 'busy'
                                    ? `Preparing ${barista.currentOrder.item.name}...`
                                    : 'Waiting for next order...'}
                            </p>
                            {barista.state === 'busy' && (
                                <div className="progress-bar-bg">
                                    <div
                                        className="progress-bar-fill"
                                        style={{ width: `${(barista.progress / barista.currentOrder.simulatedPrepTime) * 100}%` }}
                                    />
                                </div>
                            )}
                        </div>
                        <span className="barista-status-badge">
                            {barista.state}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BaristaStation;
