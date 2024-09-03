import { Game } from './game.js';

const game = new Game();

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSizeInput = document.getElementById('gridSize');
const cellWidthInput = document.getElementById('cellWidth');
const cellHeightInput = document.getElementById('cellHeight');
const liveColorInput = document.getElementById('liveColor');
const deadColorInput = document.getElementById('deadColor');
const timeoutIntervalInput = document.getElementById('timeoutInterval');
const errorSpan = document.getElementById('error');
const newGameBtn = document.getElementById('newGameBtn'); // New Game Button

// Initialize canvas and grid
game.setCanvasSize(canvas);
game.drawGrid(ctx);

// Event listeners for buttons
document.getElementById('startBtn').addEventListener('click', () => game.startGame(gameLoop));
document.getElementById('stopBtn').addEventListener('click', () => game.stopGame());
document.getElementById('saveBtn').addEventListener('click', saveGameState);
document.getElementById('loadBtn').addEventListener('click', loadGameState);

// Event listener for new game button
newGameBtn.addEventListener('click', async () => {
  game.initializeNewGame();
  game.setCanvasSize(canvas);
  game.drawGrid(ctx);
  await saveGameState(); // Save the new game state with a new UUID
  newGameBtn.disabled = true; // Disable the button after creating a new game
});

// Event listener for grid size input
gridSizeInput.addEventListener('change', () => {
  const value = parseInt(gridSizeInput.value);
  if (value >= 10 && value <= 50) {
    game.rows = game.cols = value;
    game.grid = game.createGrid(game.rows, game.cols);
    game.setCanvasSize(canvas);
    game.drawGrid(ctx);
    errorSpan.style.display = 'none'; // Hide error message
  } else {
    errorSpan.style.display = 'inline'; // Show error message
  }
});

// Event listeners for configuration inputs
cellWidthInput.addEventListener('change', () => {
  game.cellWidth = parseInt(cellWidthInput.value);
  game.setCanvasSize(canvas);
  game.drawGrid(ctx);
});

cellHeightInput.addEventListener('change', () => {
  game.cellHeight = parseInt(cellHeightInput.value);
  game.setCanvasSize(canvas);
  game.drawGrid(ctx);
});

liveColorInput.addEventListener('change', () => {
  game.liveColor = liveColorInput.value;
  game.drawGrid(ctx);
});

deadColorInput.addEventListener('change', () => {
  game.deadColor = deadColorInput.value;
  game.drawGrid(ctx);
});

timeoutIntervalInput.addEventListener('change', () => {
  game.timeoutInterval = parseInt(timeoutIntervalInput.value);
});

function gameLoop() {
  if (game.running) {
    game.nextGridState();
    game.drawGrid(ctx);
    setTimeout(gameLoop, game.timeoutInterval);
  }
}

async function saveGameState() {
  const response = await fetch('http://localhost:3000/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: game.gameId, state: game.grid }) // Include game ID
  });
  const data = await response.json();
  console.log('Game state saved:', data);
}

async function loadGameState() {
  const response = await fetch('http://localhost:3000/load');
  const data = await response.json();
  if (data) {
    game.grid = data.state;
    game.gameId = data.id; // Restore game ID
    game.drawGrid(ctx);
    newGameBtn.disabled = true; // Disable the button if a game is loaded
  } else {
    console.log('No saved game state found.');
  }
}
