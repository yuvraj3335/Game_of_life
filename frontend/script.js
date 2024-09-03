const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSizeSelect = document.getElementById('gridSize');

let cellSize = 10;
let rows = 50;
let cols = 50;
let grid = createGrid(rows, cols);
let running = false;

// Initialize the canvas size
setCanvasSize(rows, cols);

// Event listeners for buttons
document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('stopBtn').addEventListener('click', stopGame);
document.getElementById('saveBtn').addEventListener('click', saveGameState);
document.getElementById('loadBtn').addEventListener('click', loadGameState);

// Event listener for grid size selection
gridSizeSelect.addEventListener('change', (event) => {
  rows = cols = parseInt(event.target.value);
  grid = createGrid(rows, cols);
  setCanvasSize(rows, cols);
  drawGrid(grid);
});

// Create a grid of cells
function createGrid(rows, cols) {
  const grid = [];
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      row.push(Math.random() > 0.7 ? 1 : 0); // Random initial state
    }
    grid.push(row);
  }
  return grid;
}

// Set canvas size based on grid size
function setCanvasSize(rows, cols) {
  canvas.width = cols * cellSize;
  canvas.height = rows * cellSize;
}

// Draw the grid on the canvas
function drawGrid(grid) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      ctx.fillStyle = grid[i][j] ? 'black' : 'white';
      ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
    }
  }
}

// Get the next state of the grid
function nextGridState(grid) {
  const newGrid = grid.map(arr => [...arr]);

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const neighbors = countNeighbors(grid, i, j);
      if (grid[i][j] === 1 && (neighbors < 2 || neighbors > 3)) {
        newGrid[i][j] = 0; // Cell dies
      } else if (grid[i][j] === 0 && neighbors === 3) {
        newGrid[i][j] = 1; // Cell becomes alive
      }
    }
  }
  return newGrid;
}

// Count live neighbors for a cell
function countNeighbors(grid, x, y) {
  let count = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue; // Skip the current cell
      const ni = x + i;
      const nj = y + j;
      if (ni >= 0 && ni < rows && nj >= 0 && nj < cols) {
        count += grid[ni][nj];
      }
    }
  }
  return count;
}

// Start the game
function startGame() {
  if (!running) {
    running = true;
    gameLoop();
  }
}

// Stop the game
function stopGame() {
  running = false;
}

// Game loop
function gameLoop() {
  if (running) {
    grid = nextGridState(grid);
    drawGrid(grid);
    setTimeout(gameLoop, 100);
  }
}

// Save game state to backend
async function saveGameState() {
  const response = await fetch('http://localhost:3000/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ state: grid })
  });
  const data = await response.json();
  console.log('Game state saved:', data);
}

// Load game state from backend
async function loadGameState() {
  const response = await fetch('http://localhost:3000/load');
  const data = await response.json();
  if (data) {
    grid = data;
    drawGrid(grid);
  } else {
    console.log('No saved game state found.');
  }
}

// Initial draw
drawGrid(grid);
