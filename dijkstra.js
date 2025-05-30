import { binHeap } from './bin_heap.js';
let stepQueue = [];
let intervalID;
let index = 0;

let algo_set = new binHeap((a, b) => a.g - b.g); 
// Min-heap based on g-cost (distance from start node)

function dijkstra(nodes, startNode, endNode, delay, algo) {
    // Reset all node states and costs
    for (let row of nodes) {
        for (let cell of row) {
            cell.g = Infinity;       // Cost from start node
            cell.h = 0;              // Heuristic is unused in Dijkstra
            cell.inOpenSet = false;  // Flag for priority queue
            cell.isVisited = false;  // Visual flag
            cell.isPath = false;     // Visual flag
            cell.cameFrom = null;    // Pointer to parent node
        }
    }

    // Reset heap and animation data
    algo_set.clear();
    stepQueue = [];
    index = 0;

    // Initialize start node
    startNode.g = 0;
    algo_set.insert(startNode);
    startNode.inOpenSet = true;

    let bestNode;

    // Main Dijkstra loop
    while (!algo_set.isEmpty()) {
        bestNode = algo_set.extractMin(); // Node with smallest g value

        // Explore neighbors of the current node
        for (let neighbor of bestNode.neighbors) {
            if (neighbor.isWall) continue; // Skip impassable tiles

            let tentativeG = bestNode.g + 1; // Uniform cost (distance to neighbor)

            // Found a better path to neighbor
            if (tentativeG < neighbor.g) {
                neighbor.g = tentativeG;
                neighbor.cameFrom = bestNode;

                if (!neighbor.isVisited) {
                    neighbor.isVisited = true;
                    stepQueue.push({ node: neighbor, type: "visited" }); // Animation step
                }

                if (!neighbor.inOpenSet) {
                    neighbor.inOpenSet = true;
                    algo_set.insert(neighbor); // Add to the queue
                }
            }
        }

        // Check if we’ve reached the goal
        if (bestNode === endNode) {
            let current = bestNode;

            // Backtrack from end to start to build path
            while (current.cameFrom) {
                stepQueue.push({ node: current, type: "path" }); // Animation step
                current.isPath = true;
                current = current.cameFrom;
            }

            // Include start node in path
            startNode.isPath = true;
            stepQueue.push({ node: startNode, type: "path" });
            startNode.show();

            // Animate each step from the stepQueue
            intervalID = setInterval(() => {
                console.log("Starting animation...");
                let step = stepQueue[index];
                if (!step) {
                    clearInterval(intervalID); // End animation
                    return;
                }

                // Apply visual change for each step
                if (step.type === "visited") {
                    step.node.isVisited = true;
                } else if (step.type === "path") {
                    step.node.isPath = true;
                    step.node.show();
                }

                step.node.show(algo); // Draw the updated state
                index++;
            }, delay);

            return; // Done
        }
    }
}

function resetDijkstra() {
    algo_set.clear?.();
    stepQueue = [];
    index = 0;
    clearInterval(intervalID);
}

export { dijkstra, resetDijkstra }; 
