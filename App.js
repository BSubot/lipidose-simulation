import React, { useState, useMemo } from 'react';
import SimulationCanvas from './SimulationCanvas';
import Controls from './Controls';
import Dashboard from './Dashboard';
import { useSimulationLogic } from './useSimulationLogic';
import './simulation.css';

// Initial default settings
const INITIAL_SETTINGS = {
  bacterialLoad: 150,
  replicationRate: 1.0,
  endotoxinRelease: 2, // 1:low, 2:medium, 3:high
  wbcCount: 200,
  wbcEffectiveness: 0.6,
  inflammationThreshold: 2, // 1:low, 2:medium, 3:high
  introduceLipidose: false,
  lipidoseConcentration: 1, // 1:therapeutic, 2:high
  lipidoseEfficiency: 0.95,
};

function App() {
  const [settings, setSettings] = useState(INITIAL_SETTINGS);
  
  // This is our custom hook. It runs the simulation and returns the current state.
  const simulationState = useSimulationLogic(settings);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Lipidose CRBSI Simulation</h1>
        <p>Visualizing Endotoxin Neutralization in Real-Time</p>
      </header>
      
      <div className="main-content">
        <Controls settings={settings} setSettings={setSettings} />
        
        <div className="simulation-area">
          <SimulationCanvas simulationState={simulationState} />
          {/* We can add educational labels here later */}
        </div>
        
        <Dashboard stats={simulationState.stats} />
      </div>
    </div>
  );
}

export default App;
