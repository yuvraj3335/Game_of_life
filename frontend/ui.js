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

// Initialize canvas and grid
game.setCanvasSize(canvas);
game.drawGrid(ctx);

// Event listeners for buttons
document.getElementById('startBtn').addEventListener('click', () => {
    game.startGame(gameLoop);
    document.getElementById('startBtn').disabled = true; // Disable the Start button
});

document.getElementById('stopBtn').addEventListener('click', () => {
    game.stopGame();
    document.getElementById('startBtn').disabled = false; // Enable the Start button when stopped
});

document.getElementById('saveBtn').addEventListener('click', saveGameState);
document.getElementById('loadBtn').addEventListener('click', loadGameState);

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

// Function to load grid configuration from a JSON file
document.getElementById('loadJsonBtn').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const jsonData = JSON.parse(e.target.result);
                game.initializeFromJSON(jsonData);
                game.drawGrid(ctx);
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        };
        reader.readAsText(file);
    }
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
        body: JSON.stringify({
            state: game.grid,
            initialConfig: {
                cellWidth: game.cellWidth,
                cellHeight: game.cellHeight,
                liveColor: game.liveColor,
                deadColor: game.deadColor,
                timeoutInterval: game.timeoutInterval,
                rows: game.rows,
                cols: game.cols
            },
            startTime: game.startTime,
            endTime: game.endTime
        })
    });
    const data = await response.json();
    console.log('Game state saved:', data);
}


async function loadGameState() {
    const response = await fetch('http://localhost:3000/load');
    const data = await response.json();
    if (data) {
        game.grid = data.state;
        game.cellWidth = data.cellWidth;
        game.cellHeight = data.cellHeight;
        game.liveColor = data.liveColor;
        game.deadColor = data.deadColor;
        game.timeoutInterval = data.timeoutInterval;
        game.startTime = data.startTime;
        game.endTime = data.endTime;
        game.rows = data.rows;
        game.cols = data.cols;
        game.setCanvasSize(canvas);
        game.drawGrid(ctx);
    } else {
        console.log('No saved game state found.');
    }
}
