// game.js

let cellWidth = 10;
let cellHeight = 10;
let liveColor = 'black';
let deadColor = 'white';
let timeoutInterval = 100;
let rows = 50;
let cols = 50;
let running = false;
let grid = createGrid(rows, cols);

export function getCellWidth() {
  return cellWidth;
}

export function getCellHeight() {
  return cellHeight;
}

export function getLiveColor() {
  return liveColor;
}

export function getDeadColor() {
  return deadColor;
}

export function getTimeoutInterval() {
  return timeoutInterval;
}

export function getRows() {
  return rows;
}

export function getCols() {
  return cols;
}

export function getRunning() {
  return running;
}

export function getGrid() {
  return grid;
}

export function setCellWidth(value) {
  cellWidth = value;
}

export function setCellHeight(value) {
  cellHeight = value;
}

export function setLiveColor(value) {
  liveColor = value;
}

export function setDeadColor(value) {
  deadColor = value;
}

export function setTimeoutInterval(value) {
  timeoutInterval = value;
}

export function setRows(value) {
  rows = value;
}

export function setCols(value) {
  cols = value;
}

export function setRunning(value) {
  running = value;
}

export function setGrid(value) {
  grid = value;
}

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

export function setCanvasSize(canvas) {
  canvas.width = cols * cellWidth;
  canvas.height = rows * cellHeight;
}

export function drawGrid(ctx, grid) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      ctx.fillStyle = grid[i][j] ? liveColor : deadColor;
      ctx.fillRect(j * cellWidth, i * cellHeight, cellWidth, cellHeight);
    }
  }
}

export function nextGridState(grid) {
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

export function startGame(gameLoop) {
  if (!running) {
    running = true;
    gameLoop();
  }
}

export function stopGame() {
  running = false;
}
