// main.js
// Entry point for UI setup and application control

// === Global State ===
let uiContainer;        // Container for UI controls
let tile = "wall";      // Currently selected tile type
let currentAlgo;        // Selected pathfinding algorithm
let start;              // Reference to start node
let end;                // Reference to end node
let speedSlider;        // Controls animation speed
let algoSelect;         // Algorithm dropdown
let startButton;        // Start button

// === Grid Module ===
import './node.js';
import { drawGrid, clearBoard, tileChange, nodes, rows, cols, cellSize } from './grid.js';
import { aStar, resetAStar } from './astar.js';
import { dijkstra, resetDijkstra } from './dijkstra.js';
import './bin_heap.js';


function setup() {
    console.log("setup running");
    createCanvas(600, 600); // Initialize canvas
    uiContainer = createDiv().id("ui_container"); // Create UI panel

    // --- Buttons ---

    startButton = createButton('Start');
    startButton.parent(uiContainer);
    startButton.mousePressed(() => {
        runAlgorithm(); // Start algorithm
    });

    const clearButton = createButton('Clear');
    clearButton.parent(uiContainer);
    clearButton.mousePressed(() => {
        clearBoard(false); // Keep walls, start, end
        resetAlgo();
    });

    const resetButton = createButton('Reset');
    resetButton.parent(uiContainer);
    resetButton.mousePressed(() => {
        clearBoard(true); // Full reset
        resetAlgo();
    });

    // --- Tile Selection ---

    const tileSelect = createSelect();
    tileSelect.option("wall");
    tileSelect.option("start tile");
    tileSelect.option("end tile");
    tileSelect.changed(() => {
        tile = tileSelect.value(); // Update selected tile type
    });

    // --- Algorithm Selection ---

    algoSelect = createSelect();
    algoSelect.option("A*");
    algoSelect.option("Dijkstra");
    algoSelect.parent(uiContainer);

    // --- Animation Speed Slider ---

    speedSlider = createSlider(1, 1000, 100);
    speedSlider.parent(uiContainer);

    // --- Draw Initial Grid ---

    background(220); // Light gray background
    noLoop();        // Disable continuous drawing
    drawGrid();      // Create grid of Node objects

    // Precompute neighbors for all nodes
    for (let row of nodes) {
        for (let cell of row) {
            if (typeof cell?.getNeighbors === "function") {
                cell.getNeighbors(nodes, rows, cols);
            }
        }
    }
}

// Handle mouse input for placing tiles
function mousePressed() {
    let x = floor(mouseX / cellSize);
    let y = floor(mouseY / cellSize);

    if (x >= 0 && x < cols && y >= 0 && y < rows) {
        let n = nodes[y][x];
        tileChange(n, tile, {
            setStart: (node) => { start = node; },
            setEnd: (node) => { end = node; }
        }); // Update tile based on selected type
        n.show(currentAlgo);            // Re-render the updated node
    }
}

// Run the selected pathfinding algorithm
function runAlgorithm() {
    currentAlgo = algoSelect.value();
    console.log("Delay", speedSlider.value());

    if (currentAlgo === "A*") {
        aStar(nodes, start, end, speedSlider.value(), currentAlgo);
    } else if (currentAlgo === "Dijkstra") {
        dijkstra(nodes, start, end, speedSlider.value(), currentAlgo);
    }
}

// Reset all algorithm-related state
function resetAlgo() {
    if (currentAlgo === "A*") {
        resetAStar();
    } else if (currentAlgo === "Dijkstra") {
        resetDijkstra();
    }
}

// Expose to p5.js when using modules
window.setup = setup;
window.mousePressed = mousePressed;
