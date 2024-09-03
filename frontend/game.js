// game.js

export let cellWidth = 10;
export let cellHeight = 10;
export let liveColor = 'black';
export let deadColor = 'white';
export let timeoutInterval = 100;
export let rows = 50;
export let cols = 50;
export let running = false;

export let grid = createGrid(rows, cols);

export function createGrid(rows, cols) {
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
