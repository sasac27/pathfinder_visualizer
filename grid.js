// grid.js
// Manages the grid structure, drawing, clearing, and tile assignment logic
import { Node } from './node.js';
// Grid dimensions and cell size
export const rows = 20;
export const cols = 20;
export const cellSize = 30;

// 2D array to store all Node instances
export const nodes = [];

/**
 * Initializes the grid and renders all nodes.
 * Populates the `nodes` 2D array with Node objects.
 */
export function drawGrid() {
    for (let y = 0; y < rows; y++) {
        nodes[y] = [];
        for (let x = 0; x < cols; x++) {
            let n = new Node(x, y);
            nodes[y].push(n);
            n.show(); // Draw the initial empty node
        }
    }
}

/**
 * Clears the grid state.
 * @param {boolean} full - If true, clears walls, start, and end markers as well.
 */
export function clearBoard(full) {
    for (let row of nodes) {
        for (let node of row) {
            // If full reset is requested, clear start/end/wall flags
            if (full) {
                node.isStart = false;
                node.isWall = false;
                node.isEnd = false;
            }

            // Reset pathfinding and visual state
            node.isVisited = false;
            node.isPath = false;
            node.g = Infinity;
            node.h = Infinity;
            node.cameFrom = null;

            node.show(); // Redraw the updated node
        }
    }
}

/**
 * Assigns or toggles a tile's type based on user selection.
 * @param {Node} n - The node to update.
 * @param {string} type - The type of tile ("wall", "start tile", or "end tile").
 */
export function tileChange(n, type, hooks) {
    if (n) {
        if (type === "wall") {
            // Do not allow turning start/end tiles into walls
            if (n.isStart || n.isEnd) return;
            n.isWall = !n.isWall; // Toggle wall state
        } else if (type === "start tile") {
            // Ensure only one start node in the grid
            for (let row of nodes) {
                for (let cell of row) {
                    cell.isStart = false;
                    cell.show();
                }
            }
            n.isStart = true;
            hooks?.setStart?.(n); // Set global reference via callback
        } else if (type === "end tile") {
            // Ensure only one end node in the grid
            for (let row of nodes) {
                for (let cell of row) {
                    cell.isEnd = false;
                    cell.show();
                }
            }
            n.isEnd = true;
            hooks?.setEnd?.(n); // Set global reference via callback
        }
    }
}
