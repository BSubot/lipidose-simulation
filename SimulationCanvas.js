import React, { useRef, useEffect } from 'react';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;

const SimulationCanvas = ({ simulationState }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { particles } = simulationState;

    // Clear the canvas on each frame
    ctx.fillStyle = '#1a0000'; // Dark blood vessel background
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // --- Draw Blood Flow (simple animation) ---
    ctx.fillStyle = 'rgba(255, 0, 0, 0.1)'; // Red blood cells
    for(let i = 0; i < 50; i++) {
        const x = (Math.random() * CANVAS_WIDTH + Date.now() * 0.03) % CANVAS_WIDTH;
        const y = Math.random() * CANVAS_HEIGHT;
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, 2 * Math.PI);
        ctx.fill();
    }

    // --- Draw Catheter ---
    ctx.fillStyle = '#555555';
    ctx.fillRect(40, CANVAS_HEIGHT / 2 - 50, 20, 100);

    // --- Draw Particles ---
    // 1. Draw WBCs (White/Cream)
    ctx.fillStyle = '#FFFFE0';
    particles.wbcs.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 8, 0, 2 * Math.PI);
      ctx.fill();
    });

    // 2. Draw Bacteria (Purple)
    ctx.fillStyle = '#9400D3';
    particles.bacteria.forEach(p => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(Math.PI / 4); // Rod-shaped
      ctx.fillRect(-4, -2, 8, 4);
      ctx.restore();
    });
    
    // 3. Draw Endotoxins (Red/Danger)
    ctx.fillStyle = '#FF0000';
    particles.endotoxins.filter(e => !e.isBound).forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, 2 * Math.PI);
      ctx.fill();
    });
    
    // 4. Draw Lipidose (Blue/Therapeutic)
    ctx.fillStyle = '#00FFFF';
    particles.lipidose.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 5, 0, 2 * Math.PI);
      ctx.fill();
    });
    
    // 5. Draw Bound Complexes (Neutralized - Green)
    ctx.fillStyle = '#00FF00';
    particles.endotoxins.filter(e => e.isBound).forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, 2 * Math.PI);
      ctx.fill();
    });

  }, [simulationState]); // Re-draw whenever the simulation state changes

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      className="simulation-canvas"
    />
  );
};

export default SimulationCanvas;
