// ui.js

import {
    setCellWidth,
    setCellHeight,
    setLiveColor,
    setDeadColor,
    setTimeoutInterval,
    setRows,
    setCols,
    setRunning,
    setGrid,
    getGrid,
    getRows,
    getCols,
    getCellWidth,
    getCellHeight,
    getLiveColor,
    getDeadColor,
    getTimeoutInterval,
    getRunning,
    nextGridState,
    drawGrid,
    setCanvasSize,
    startGame,
    stopGame
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
  const newGameBtn = document.getElementById('newGameBtn');
  
  let gameId;  // Variable to store the unique game ID
  
  // Initialize canvas and grid
  setCanvasSize(canvas);
  drawGrid(ctx, getGrid());
  
  // Event listeners for buttons
  newGameBtn.addEventListener('click', async () => {
    const gridSize = parseInt(gridSizeInput.value);
    const initialState = createGrid(gridSize, gridSize);
  
    try {
      const response = await fetch('http://localhost:3000/new-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gridSize, initialState })
      });
  
      if (response.ok) {
        const data = await response.json();
        gameId = data.game_id;  // Store the unique game ID
        console.log('New game created with ID:', gameId);
        
        // Enable game controls
        document.getElementById('startBtn').disabled = false;
        document.getElementById('stopBtn').disabled = false;
        document.getElementById('saveBtn').disabled = false;
        document.getElementById('loadBtn').disabled = false;
        
        // Disable new game button
        newGameBtn.disabled = true;
      } else {
        console.error('Failed to create new game:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating new game:', error);
    }
  });
  
  document.getElementById('startBtn').addEventListener('click', () => startGame(gameLoop));
  document.getElementById('stopBtn').addEventListener('click', stopGame);
  document.getElementById('saveBtn').addEventListener('click', saveGameState);
  document.getElementById('loadBtn').addEventListener('click', loadGameState);
  
  // Function to save the game state
  async function saveGameState() {
    if (!gameId) {
      console.error('No game ID found. Cannot save game state.');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:3000/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId, state: getGrid() })  // Include gameId
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Game state saved:', data);
      } else {
        console.error('Failed to save game state:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving game state:', error);
    }
  }
  
  // Function to load the game state
  async function loadGameState() {
    if (!gameId) {
      console.error('No game ID found. Cannot load game state.');
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:3000/load?gameId=${gameId}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data) {
          setGrid(data);
          drawGrid(ctx, getGrid());
        } else {
          console.log('No saved game state found.');
        }
      } else {
        console.error('Failed to load game state:', response.statusText);
      }
    } catch (error) {
      console.error('Error loading game state:', error);
    }
  }
  
  // Game loop function
  function gameLoop() {
    if (getRunning()) {
      setGrid(nextGridState(getGrid()));
      drawGrid(ctx, getGrid());
      setTimeout(gameLoop, getTimeoutInterval());
    }
  }
  