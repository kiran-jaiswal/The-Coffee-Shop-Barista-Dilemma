import React, { useState, useEffect } from 'react';
import { useCoffeeShopSimulation } from './hooks/useCoffeeShop';
import StatsPanel from './components/StatsPanel';
import BaristaStation from './components/BaristaStation';
import OrderQueue from './components/OrderQueue';
import OrderForm from './components/OrderForm';
import { Coffee, BarChart2, ChevronDown, ChevronUp, AlertTriangle, RefreshCw } from 'lucide-react';
import { api } from './services/api';

import { CoffeeShopEngine } from './utils/simulationEngine';

function App() {
  const { queue, baristas, completed, stats, addManualOrder } = useCoffeeShopSimulation();
  const [activeTab, setActiveTab] = useState('live');
  const [scenarios, setScenarios] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [loadingScenarios, setLoadingScenarios] = useState(false);

  const handlePlaceOrder = async (orderData) => {
    try {
      // 1. Call Backend
      const backendOrder = await api.placeOrder(orderData.drinkType, orderData.isVip);
      // 2. Add to Local Simulation
      addManualOrder({
        id: backendOrder.id || Math.random().toString(36).substr(2, 5),
        ...orderData
      });
    } catch (err) {
      console.error("Critical simulation error", err);
    }
  };

  const runScenarios = () => {
    setLoadingScenarios(true);
    setTimeout(() => {
      const engine = new CoffeeShopEngine();
      const newScenarios = [];

      // Generate 10 Test Cases as requested
      for (let i = 1; i <= 10; i++) {
        // Target: 200-300 orders per hour
        // 200 / 60 = 3.33 orders/min
        // 300 / 60 = 5.00 orders/min
        // Random arrival rate between 3.3 and 5.0
        const randomRate = 3.3 + Math.random() * 1.7;

        const config = {
          id: i,
          name: `Test Case #${i}: Peak Load`,
          description: "High volume stochastic flow (200-300 orders)",
          arrivalRate: randomRate,
          duration: 3600 // 1 Hour
        };

        const result = engine.runScenario(config);
        newScenarios.push(result);
      }

      setScenarios(newScenarios);
      setLoadingScenarios(false);
    }, 500);
  };

  // Run on first load of stats tab
  useEffect(() => {
    if (activeTab === 'stats' && scenarios.length === 0) {
      runScenarios();
    }
  }, [activeTab]);

  const toggleExpand = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="app-container">
      {/* Header Tabs */}
      <div className="header-tabs">
        <button
          className={`tab-btn ${activeTab === 'live' ? 'active' : ''}`}
          onClick={() => setActiveTab('live')}
        >
          <Coffee size={18} /> Live Dashboard
        </button>
        <button
          className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          <BarChart2 size={18} /> Peak Load Simulation
        </button>
      </div>

      {activeTab === 'live' && (
        <>
          <OrderForm onPlaceOrder={handlePlaceOrder} />
          <div className="dashboard-content">
            <div className="queue-area">
              <OrderQueue queue={queue} currentTime={stats.timeElapsed} />
            </div>
            <div className="right-panel">
              <BaristaStation baristas={baristas} />
              <StatsPanel stats={stats} />
            </div>
          </div>
        </>
      )}

      {activeTab === 'stats' && (
        <div style={{ maxWidth: '1200px', margin: '0 auto', color: 'white' }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '28px', margin: 0 }}>
              📊 Peak Load Simulation
              <span style={{ fontSize: '13px', background: '#E3F2FD', color: '#1565C0', padding: '4px 12px', borderRadius: '16px', fontWeight: 600 }}>
                Automated 7:00 AM - 10:00 AM Scenarios
              </span>
            </h1>
            <button onClick={runScenarios} className="btn-submit" disabled={loadingScenarios} style={{ height: '36px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <RefreshCw size={16} className={loadingScenarios ? 'spin' : ''} /> Rerun All
            </button>
          </div>

          <div className="queue-section" style={{ padding: 0, overflow: 'hidden', background: '#1A1A1A', border: '1px solid #333' }}>
            {/* Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr 1.5fr 1fr', padding: '16px 24px', background: '#3E2723', color: '#D7CCC8', fontWeight: 700, fontSize: '12px', letterSpacing: '1px' }}>
              <div>TEST CASE</div>
              <div>AVG WAIT</div>
              <div>MAX WAIT</div>
              <div>STAFF LOAD (B1/B2/B3)</div>
              <div>SLA ALERTS</div>
              <div style={{ textAlign: 'right' }}>ACTION</div>
            </div>

            {/* Rows */}
            {scenarios.map(scenario => (
              <React.Fragment key={scenario.id}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr 1.5fr 1fr', padding: '24px', borderBottom: '1px solid #333', alignItems: 'center', background: expandedRow === scenario.id ? '#252525' : 'transparent' }}>
                  {/* Test Case Info */}
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '16px', color: '#FFF' }}>#{scenario.id}: {scenario.name}</div>
                    <div style={{ color: '#888', fontSize: '13px', marginTop: '4px' }}>
                      ({scenario.totalOrders} orders) • {scenario.description}
                    </div>
                  </div>

                  {/* Metrics */}
                  <div style={{ color: '#42A5F5', fontWeight: 700, fontSize: '15px' }}>{scenario.avgWaitTime.toFixed(1)} min</div>
                  <div style={{ color: '#EF5350', fontWeight: 700, fontSize: '15px' }}>{scenario.maxWaitTime.toFixed(1)} min</div>
                  <div style={{ color: '#FFF', fontFamily: 'monospace' }}>
                    {scenario.staffLoad.join(' / ')}
                  </div>

                  {/* Alerts */}
                  <div>
                    {scenario.missedDeadlines > 0 ? (
                      <span style={{ background: 'rgba(239, 83, 80, 0.1)', color: '#EF5350', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <AlertTriangle size={14} /> {scenario.missedDeadlines} Violations
                      </span>
                    ) : (
                      <span style={{ color: '#66BB6A', fontSize: '12px', fontWeight: 600 }}>All Clear</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => toggleExpand(scenario.id)}
                      style={{ background: 'transparent', border: 'none', color: '#BBB', cursor: 'pointer', textDecoration: 'underline', fontSize: '13px' }}
                    >
                      {expandedRow === scenario.id ? 'Hide Details' : 'View Details'}
                    </button>
                  </div>
                </div>

                {/* Expanded Logs */}
                {expandedRow === scenario.id && (
                  <div style={{ background: '#2C2C2C', padding: '20px', borderBottom: '1px solid #333' }}>
                    <div style={{ marginBottom: '12px', fontWeight: 700, color: '#888', fontSize: '12px', textTransform: 'uppercase' }}>
                      Execution Log ({scenario.logs.length} Rows)
                    </div>
                    <div style={{ background: '#1A1A1A', borderRadius: '8px', border: '1px solid #333', overflow: 'hidden' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1.5fr 1fr 1fr 1.5fr', padding: '12px 16px', background: '#222', color: '#888', fontSize: '11px', fontWeight: 700 }}>
                        <div>TIME</div>
                        <div>CUSTOMER</div>
                        <div>DRINK</div>
                        <div>WAIT</div>
                        <div>SCORE</div>
                        <div>REASON</div>
                      </div>
                      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {scenario.logs.map((log, i) => (
                          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1.5fr 1fr 1fr 1.5fr', padding: '10px 16px', borderBottom: '1px solid #333', fontSize: '13px', color: '#CCC', alignItems: 'center' }}>
                            <div style={{ fontFamily: 'monospace', color: '#888' }}>{log.logTime}</div>
                            <div style={{ fontWeight: 600 }}>{log.id}</div>
                            <div>{log.item.name}</div>
                            <div style={{ color: log.totalWait > 10 ? '#EF5350' : '#42A5F5', fontWeight: 700 }}>{log.totalWait.toFixed(1)} m</div>
                            <div>{Math.round(log.priorityScore)}</div>
                            <div style={{ fontSize: '12px', color: '#BBB' }}>{log.reason}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}

            {scenarios.length === 0 && !loadingScenarios && (
              <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                No scenarios run yet.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
