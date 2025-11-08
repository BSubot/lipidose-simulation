import React from 'react';

const Controls = ({ settings, setSettings }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : parseFloat(value),
    }));
  };

  return (
    <div className="controls-panel">
      <h3>🔬 Simulation Parameters</h3>
      <div className="control-group">
        <label>Bacterial Load: {settings.bacterialLoad}</label>
        <input
          type="range"
          name="bacterialLoad"
          min="10"
          max="500"
          step="10"
          value={settings.bacterialLoad}
          onChange={handleChange}
        />
      </div>
      <div className="control-group">
        <label>WBC Count: {settings.wbcCount}</label>
        <input
          type="range"
          name="wbcCount"
          min="50"
          max="500"
          step="10"
          value={settings.wbcCount}
          onChange={handleChange}
        />
      </div>
      <div className="control-group">
        <label>WBC Effectiveness: {Math.round(settings.wbcEffectiveness * 100)}%</label>
        <input
          type="range"
          name="wbcEffectiveness"
          min="0.2"
          max="1.0"
          step="0.1"
          value={settings.wbcEffectiveness}
          onChange={handleChange}
        />
      </div>
      
      <h3><span style={{color: '#00FFFF'}}>LIPIDOSE</span> Intervention</h3>
      <div className="control-group toggle">
        <label>Introduce Lipidose</label>
        <input
          type="checkbox"
          name="introduceLipidose"
          checked={settings.introduceLipidose}
          onChange={handleChange}
        />
      </div>
      <div className="control-group">
        <label>Binding Efficiency: {Math.round(settings.lipidoseEfficiency * 100)}%</label>
        <input
          type="range"
          name="lipidoseEfficiency"
          min="0.8"
          max="0.99"
          step="0.01"
          value={settings.lipidoseEfficiency}
          onChange={handleChange}
          disabled={!settings.introduceLipidose}
        />
      </div>
    </div>
  );
};

export default Controls;
