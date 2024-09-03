// ui.js

import {
    createGrid,
    setCanvasSize,
    drawGrid,
    nextGridState,
    startGame,
    stopGame,
    grid,
    running,
    rows,
    cols,
    cellWidth,
    cellHeight,
    liveColor,
    deadColor,
    timeoutInterval
  } from './game.js';
  
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const gridSizeInput = document.getElementById('gridSize');
  const cellWidthInput = document.getElementById('cellWidth');
  const cellHeightInput = document.getElementById('cellHeight');
  const liveColorInput = document.getElementById('liveColor');
  const deadColorInput = document.getElementById('deadColor');
  const timeoutIntervalInput = document.getElementById('timeoutInterval');
  const errorSpan = document.getElementById('error');
  
  // Initialize canvas and grid
  setCanvasSize(canvas);
  drawGrid(ctx, grid);
  
  // Event listeners for buttons
  document.getElementById('startBtn').addEventListener('click', () => startGame(gameLoop));
  document.getElementById('stopBtn').addEventListener('click', stopGame);
  document.getElementById('saveBtn').addEventListener('click', saveGameState);
  document.getElementById('loadBtn').addEventListener('click', loadGameState);
  
  // Event listener for grid size input
  gridSizeInput.addEventListener('change', () => {
    const value = parseInt(gridSizeInput.value);
    if (value >= 10 && value <= 50) {
      rows = cols = value;
      grid = createGrid(rows, cols);
      setCanvasSize(canvas);
      drawGrid(ctx, grid);
      errorSpan.style.display = 'none'; // Hide error message
    } else {
      errorSpan.style.display = 'inline'; // Show error message
    }
  });
  
  // Event listeners for configuration inputs
  cellWidthInput.addEventListener('change', () => {
    cellWidth = parseInt(cellWidthInput.value);
    setCanvasSize(canvas);
    drawGrid(ctx, grid);
  });
  
  cellHeightInput.addEventListener('change', () => {
    cellHeight = parseInt(cellHeightInput.value);
    setCanvasSize(canvas);
    drawGrid(ctx, grid);
  });
  
  liveColorInput.addEventListener('change', () => {
    liveColor = liveColorInput.value;
    drawGrid(ctx, grid);
  });
  
  deadColorInput.addEventListener('change', () => {
    deadColor = deadColorInput.value;
    drawGrid(ctx, grid);
  });
  
  timeoutIntervalInput.addEventListener('change', () => {
    timeoutInterval = parseInt(timeoutIntervalInput.value);
  });
  
  function gameLoop() {
    if (running) {
      grid = nextGridState(grid);
      drawGrid(ctx, grid);
      setTimeout(gameLoop, timeoutInterval);
    }
  }
  
  async function saveGameState() {
    const response = await fetch('http://localhost:3000/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ state: grid })
    });
    const data = await response.json();
    console.log('Game state saved:', data);
  }
  
  async function loadGameState() {
    const response = await fetch('http://localhost:3000/load');
    const data = await response.json();
    if (data) {
      grid = data;
      drawGrid(ctx, grid);
    } else {
      console.log('No saved game state found.');
    }
  }
  