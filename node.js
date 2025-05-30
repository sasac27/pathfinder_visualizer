// node.js
// Represents a tile in the grid for pathfinding visualization

export class Node {
    constructor(x, y) {
        this.cellSize = 30;

        this.x = x;
        this.y = y;

        this.g = Infinity;
        this.h = 0;

        this.isWall = false;
        this.isStart = false;
        this.isEnd = false;
        this.isVisited = false;
        this.isPath = false;
        this.inOpenSet = false;

        this.cameFrom = null;
        this.neighbors = [];

        this.dirs = [
            [0, -1], [0, 1],
            [-1, 0], [1, 0]
        ];
    }

    get f() {
        return this.g + this.h;
    }

    show(algo) {
        fill(220);
        noStroke();
        rect(this.x * this.cellSize, this.y * this.cellSize, this.cellSize, this.cellSize);

        stroke(200);

        if (this.isWall) {
            fill(0);
        } else if (this.isStart) {
            fill(0, 255, 0);
        } else if (this.isEnd) {
            fill(0, 0, 255);
        } else if (this.isPath) {
            fill(0, 255, 0);
        } else if (this.isVisited) {
            fill(255, 255, 0);
        } else {
            noFill();
        }

        rect(this.x * this.cellSize, this.y * this.cellSize, this.cellSize, this.cellSize);

        if (this.isVisited || this.isPath) {
            if (algo === "A*") {
                textSize(8);
                fill(255, 0, 0);
                textAlign(LEFT, TOP);
                text(this.g.toFixed(0), this.x * this.cellSize + 2, this.y * this.cellSize + 2);

                fill(0, 0, 255);
                textAlign(RIGHT, TOP);
                text(this.h.toFixed(0), this.x * this.cellSize + this.cellSize - 2, this.y * this.cellSize + 2);

                fill('green');
                textAlign(CENTER, BOTTOM);
                text(this.f.toFixed(0), this.x * this.cellSize + this.cellSize / 2, this.y * this.cellSize + this.cellSize - 2);

            } else if (algo === "Dijkstra") {
                textSize(10);
                fill(0);
                textAlign(CENTER, CENTER);
                text(this.g.toFixed(0), this.x * this.cellSize + this.cellSize / 2, this.y * this.cellSize + this.cellSize / 2);
            }
        }
    }

    // Updated to accept rows and cols as parameters
    getNeighbors(nodes, rows, cols) {
        this.neighbors = [];

        for (let [dx, dy] of this.dirs) {
            const newX = this.x + dx;
            const newY = this.y + dy;

            if (
                newX >= 0 && newX < cols &&
                newY >= 0 && newY < rows
            ) {
                this.neighbors.push(nodes[newY][newX]);
            }
        }
    }
}
