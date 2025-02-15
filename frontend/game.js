export class Game {
    constructor(rows = 50, cols = 50) {
        this.cellWidth = 10;
        this.cellHeight = 10;
        this.liveColor = 'black';
        this.deadColor = 'white';
        this.timeoutInterval = 100;
        this.rows = rows;
        this.cols = cols;
        this.grid = this.createGrid(rows, cols);
        this.running = false;
        this.startTime = null;
        this.endTime = null;
    }

    initializeFromJSON(jsonData) {
        if (jsonData.rows && jsonData.cols && jsonData.grid) {
            this.rows = jsonData.rows;
            this.cols = jsonData.cols;
            this.grid = jsonData.grid;
            this.cellWidth = jsonData.cellWidth || this.cellWidth;
            this.cellHeight = jsonData.cellHeight || this.cellHeight;
            this.liveColor = jsonData.liveColor || this.liveColor;
            this.deadColor = jsonData.deadColor || this.deadColor;
            this.timeoutInterval = jsonData.timeoutInterval || this.timeoutInterval;
            this.setCanvasSize(canvas);
            this.startTime = jsonData.startTime || null;
            this.endTime = jsonData.endTime || null;
        } else {
            console.error('Invalid JSON data');
        }
    }

    createGrid(rows, cols) {
        const grid = [];
        for (let i = 0; i < rows; i++) {
            const row = [];
            for (let j = 0; j < cols; j++) {
                row.push(0);
            }
            grid.push(row);
        }
        return grid;
    }

    setCanvasSize(canvas) {
        canvas.width = this.cols * this.cellWidth;
        canvas.height = this.rows * this.cellHeight;
    }

    drawGrid(ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                ctx.fillStyle = this.grid[i][j] ? this.liveColor : this.deadColor;
                ctx.fillRect(j * this.cellWidth, i * this.cellHeight, this.cellWidth, this.cellHeight);
            }
        }
    }

    nextGridState() {
        const newGrid = this.grid.map(arr => [...arr]);

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                const neighbors = this.countNeighbors(i, j);
                if (this.grid[i][j] === 1 && (neighbors < 2 || neighbors > 3)) {
                    newGrid[i][j] = 0; // Cell dies
                } else if (this.grid[i][j] === 0 && neighbors === 3) {
                    newGrid[i][j] = 1; // Cell becomes alive
                }
            }
        }
        this.grid = newGrid;
    }

    countNeighbors(x, y) {
        let count = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue; // Skip the current cell
                const ni = x + i;
                const nj = y + j;
                if (ni >= 0 && ni < this.rows && nj >= 0 && nj < this.cols) {
                    count += this.grid[ni][nj];
                }
            }
        }
        return count;
    }

    startGame(gameLoop) {
        if (!this.running) {
            this.running = true;
            this.startTime = new Date().toISOString(); // Set start time
            gameLoop();
        }
    }

    stopGame() {
        if (this.running) {
            this.running = false;
            this.endTime = new Date().toISOString(); // Set end time
        }
    }
}
