import { binHeap } from "./bin_heap.js";

let open_set = new binHeap((a, b) => a.f - b.f); // Priority queue (min-heap) sorted by lowest f-score
let endX, endY; // End node coordinates (used for heuristic calculation)
let stepQueue = []; // Stores steps for animated visualization
let intervalID; // Stores setInterval ID for animation
let index = 0; // Index to step through animation queue

function aStar(nodes, startNode, endNode, delay, algo) {
    // Reset all node states and costs
    for (let row of nodes) {
        for (let cell of row) {
            cell.g = Infinity;       // Cost from start node
            cell.h = 0;              // Heuristic to end node
            cell.inOpenSet = false;  // Flag if node is in open_set
            cell.isVisited = false;  // Visited state for visual
            cell.isPath = false;     // Path state for visual
            cell.cameFrom = null;    // Pointer to parent node
        }
    }

    // Reset global trackers
    open_set.clear();
    stepQueue = [];
    index = 0;

    // Initialize start node
    startNode.g = 0;
    startNode.h = abs(startNode.x - endNode.x) + abs(startNode.y - endNode.y); // Manhattan distance
    open_set.insert(startNode);
    startNode.inOpenSet = true;

    // Cache end coordinates
    endX = endNode.x;
    endY = endNode.y;

    let bestNode;

    // Main A* loop
    while (!open_set.isEmpty()) {
        bestNode = open_set.extractMin(); // Node with lowest f score

        // Explore neighbors
        for (let neighbor of bestNode.neighbors) {
            if (neighbor.isWall) continue; // Skip walls

            let tentativeG = bestNode.g + 1; // Cost from start to neighbor

            if (tentativeG < neighbor.g) {
                // Found a better path to neighbor
                neighbor.g = tentativeG;
                neighbor.cameFrom = bestNode;
                neighbor.h = abs(neighbor.x - endX) + abs(neighbor.y - endY);

                if (!neighbor.isVisited) {
                    neighbor.isVisited = true;
                    stepQueue.push({ node: neighbor, type: "visited" }); // Queue visited animation
                }

                if (!neighbor.inOpenSet) {
                    open_set.insert(neighbor);
                    neighbor.inOpenSet = true;
                }
            }
        }

        // If the end is reached, backtrack to build path
        if (bestNode.isEnd) {
            let current = bestNode;
            while (current.cameFrom) {
                stepQueue.push({ node: current, type: "path" }); // Queue path animation
                current.isPath = true;
                current = current.cameFrom;
            }

            // Also include the start node as part of the path
            startNode.isPath = true;
            stepQueue.push({ node: startNode, type: "path" });
            startNode.show();

            // Animate step-by-step using queued steps
            intervalID = setInterval(() => {
                let step = stepQueue[index];
                if (!step) {
                    clearInterval(intervalID); // Stop animation when done
                    return;
                }

                if (step.type == "visited") {
                    step.node.isVisited = true;
                } else if (step.type == "path") {
                    step.node.isPath = true;
                }

                step.node.show(algo); // Draw updated node state
                index++;

            }, delay); // Delay per step

            return; // End function after reaching goal
        }
    }
}

function resetAStar() {
    open_set.clear?.();
    stepQueue = [];
    index = 0;
    clearInterval(intervalID);
}

export { aStar, resetAStar }; 
