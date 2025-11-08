import { useState, useEffect, useRef } from 'react';

// Simulation constants
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;
const CATHETER_X = 50;
const CATHETER_Y = CANVAS_HEIGHT / 2;

export const useSimulationLogic = (settings) => {
  // Use useRef to store simulation state that changes every frame
  // This avoids re-rendering the entire App component on each tick
  const particles = useRef({
    bacteria: [],
    endotoxins: [],
    wbcs: [],
    lipidose: [],
  });
  const [stats, setStats] = useState({
    time: 0,
    bacterialCount: 0,
    freeEndotoxin: 0,
    boundEndotoxin: 0,
    inflammationIndex: 0,
    wbcCount: 0,
    patientStatus: 'Stable',
  });
  
  const simulationFrameId = useRef(null);

  // Function to initialize or reset the simulation
  const initializeSimulation = () => {
    const newParticles = {
      bacteria: [],
      endotoxins: [],
      wbcs: [],
      lipidose: [],
    };

    // 1. Create initial bacteria on the catheter
    for (let i = 0; i < settings.bacterialLoad; i++) {
      newParticles.bacteria.push(createBacteria());
    }
    
    // 2. Create initial WBCs
    for (let i = 0; i < settings.wbcCount; i++) {
      newParticles.wbcs.push(createWBC());
    }
    
    particles.current = newParticles;
  };
  
  // Reset simulation when settings change (e.g., bacterial load)
  useEffect(() => {
    initializeSimulation();
  }, [
    settings.bacterialLoad, 
    settings.wbcCount,
    // Note: We don't reset on *every* setting change, just key ones.
  ]);

  // The main simulation loop
  useEffect(() => {
    const gameLoop = (timestamp) => {
      // --- 1. Update Particle States ---
      updateBacteria(particles.current, settings);
      updateEndotoxins(particles.current, settings);
      updateWBCs(particles.current, settings);
      
      if (settings.introduceLipidose) {
        updateLipidose(particles.current, settings);
      }

      // --- 2. Calculate New Statistics ---
      const newStats = calculateStats(particles.current, settings);
      setStats(newStats); // This update is batched by React

      // --- 3. Request Next Frame ---
      simulationFrameId.current = requestAnimationFrame(gameLoop);
    };

    // Start the loop
    simulationFrameId.current = requestAnimationFrame(gameLoop);

    // Cleanup function: Stop the loop when the component unmounts
    return () => {
      cancelAnimationFrame(simulationFrameId.current);
    };
  }, [settings]); // Re-run the effect if settings object changes

  // --- Particle Creation Helpers ---
  const createBacteria = () => ({
    id: Math.random(),
    x: CATHETER_X + (Math.random() - 0.5) * 20,
    y: CATHETER_Y + (Math.random() - 0.5) * 80,
    vx: 0.5 + Math.random() * 0.5, // Adrift
    vy: (Math.random() - 0.5) * 0.5,
    isAlive: true,
    replicationTimer: Math.random() * 100,
  });

  const createWBC = () => ({
    id: Math.random(),
    x: Math.random() * CANVAS_WIDTH,
    y: Math.random() * CANVAS_HEIGHT,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    type: 'wbc',
  });
  
  // --- Simulation Logic Functions (Stubs) ---
  // These would contain the detailed physics and biology
  
  const updateBacteria = (p, s) => {
    // TODO:
    // 1. Move bacteria (vx, vy)
    // 2. Handle replication based on s.replicationRate
    // 3. Release endotoxins based on s.endotoxinRelease
    // 4. Check for collision with WBCs
  };
  
  const updateEndotoxins = (p, s) => {
    // TODO:
    // 1. Move endotoxins
    // 2. Check for collision with Lipidose (if active)
  };
  
  const updateWBCs = (p, s) => {
    // TODO:
    // 1. Move WBCs (seek bacteria/endotoxins)
    // 2. "Engulf" bacteria based on s.wbcEffectiveness
  };
  
  const updateLipidose = (p, s) => {
    // ** THE CORE MECHANISM **
    // 1. Add new Lipidose particles if needed, based on s.lipidoseConcentration
    // 2. Move Lipidose particles (seek endotoxins)
    // 3. Check for collision with endotoxins
    // 4. On collision, "bind" the endotoxin based on s.lipidoseEfficiency
    // 5. Change endotoxin state to "bound" (e.g., endotoxin.isBound = true)
  };
  
  const calculateStats = (p, s) => {
    // Logic to count particles and calculate health
    const bacterialCount = p.bacteria.filter(b => b.isAlive).length;
    const freeEndotoxin = p.endotoxins.filter(e => !e.isBound).length;
    const boundEndotoxin = p.endotoxins.filter(e => e.isBound).length;
    
    // Inflammation is driven by FREE endotoxin
    let inflammationIndex = (freeEndotoxin * 100) / (s.inflammationThreshold * 1000);
    inflammationIndex = Math.min(Math.max(inflammationIndex, 0), 100);
    
    let patientStatus = 'Stable';
    if (inflammationIndex > 80) patientStatus = 'Critical';
    else if (inflammationIndex > 60) patientStatus = 'Severe';
    else if (inflammationIndex > 30) patientStatus = 'Moderate';
    else if (inflammationIndex > 0) patientStatus = 'Improving';
    
    return {
      time: stats.time + 1,
      bacterialCount,
      freeEndotoxin,
      boundEndotoxin,
      inflammationIndex: inflammationIndex.toFixed(0),
      wbcCount: p.wbcs.length,
      patientStatus,
    };
  };

  // Return the *current state* of all particles for the canvas to draw
  return { particles: particles.current, stats };
};
