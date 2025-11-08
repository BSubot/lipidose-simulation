import React from 'react';

const Dashboard = ({ stats }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Critical': return '#FF0000';
      case 'Severe': return '#FFA500';
      case 'Moderate': return '#FFFF00';
      case 'Improving': return '#00FF00';
      default: return '#FFFFFF';
    }
  };

  return (
    <div className="dashboard-panel">
      <h3>📈 Real-Time Statistics</h3>
      <div className="stat-item">
        <strong>Patient Status:</strong>
        <span style={{ color: getStatusColor(stats.patientStatus), fontWeight: 'bold' }}>
          {stats.patientStatus.toUpperCase()}
        </span>
      </div>
      <div className="stat-item">
        <strong>Inflammation Index:</strong>
        <span style={{ color: `hsl(${100 - stats.inflammationIndex}, 100%, 50%)` }}>
          {stats.inflammationIndex} / 100
        </span>
      </div>
      <div className="stat-item">
        <strong>Bacterial Count:</strong>
        <span>{stats.bacterialCount}</span>
      </div>
      <div className="stat-item danger">
        <strong>Free Endotoxin (LPS):</strong>
        <span>{stats.freeEndotoxin}</span>
      </div>
      <div className="stat-item safe">
        <strong>Bound Endotoxin (Safe):</strong>
        <span>{stats.boundEndotoxin}</span>
      </div>
      <div className="stat-item">
        <strong>Active WBCs:</strong>
        <span>{stats.wbcCount}</span>
      </div>
      <div className="stat-item">
        <strong>Time Elapsed:</strong>
        <span>{stats.time}</span>
      </div>
    </div>
  );
};

export default Dashboard;
