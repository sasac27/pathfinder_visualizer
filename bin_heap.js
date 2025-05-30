// Binary Heap (Min or Max) implementation with a custom comparator
export class binHeap {
    constructor(compareFn) {
        this.heap = []; // Internal array to store heap elements
        this.compare = compareFn; // Comparison function to maintain heap order
    }

    // Insert a new element into the heap
    insert(value) {
        this.heap.push(value); // Add element to the end
        let index = this.heap.length - 1; // Start bubbling up from the last index

        // Bubble up while the inserted element is less than its parent
        while (index > 0) {
            let pIndex = this.getParentIndex(index);
            let cmp = this.compare(this.heap[index], this.heap[pIndex]);
            if (cmp < 0) {
                this.swap(index, pIndex); // Swap with parent
                index = pIndex; // Move up to parent index
            } else {
                break; // Heap property restored
            }
        }
    }

    // Remove and return the minimum element (top of the heap)
    extractMin() {
        if (this.heap.length == 0) {
            return null; // Nothing to extract
        }

        const min = this.heap[0]; // Root of the heap (min element)
        const last = this.heap.pop(); // Remove last element

        if (this.heap.length > 0) {
            this.heap[0] = last; // Move last element to root
            let index = 0; // Start bubbling down
            let leastIndex;

            // Bubble down to restore heap property
            while (true) {
                let leftIndex = this.getLeftChildIndex(index);
                let rightIndex = this.getRightChildIndex(index);

                // Find the smaller of the two children
                if (leftIndex < this.heap.length && rightIndex < this.heap.length) {
                    leastIndex = this.compare(this.heap[leftIndex], this.heap[rightIndex]) < 0
                        ? leftIndex
                        : rightIndex;
                } else if (leftIndex < this.heap.length) {
                    leastIndex = leftIndex;
                } else if (rightIndex < this.heap.length) {
                    leastIndex = rightIndex;
                } else {
                    break; // No children left
                }

                // If child is smaller than current node, swap and continue
                if (this.compare(this.heap[leastIndex], this.heap[index]) < 0) {
                    this.swap(index, leastIndex);
                    index = leastIndex;
                } else {
                    break; // Heap property is restored
                }
            }
        }

        return min; // Return the extracted min element
    }

    // Return the minimum element without removing it
    peek() {
        return this.heap.length === 0 ? null : this.heap[0];
    }

    // Return true if the heap is empty
    isEmpty() {
        return this.heap.length === 0;
    }

    // Return the number of elements in the heap
    size() {
        return this.heap.length;
    }

    // Clear all elements from the heap
    clear() {
        this.heap = [];
    }

    // Get parent index of the given node index
    getParentIndex(i) {
        return Math.floor((i - 1) / 2);
    }

    // Get left child index of the given node index
    getLeftChildIndex(i) {
        return 2 * i + 1;
    }

    // Get right child index of the given node index
    getRightChildIndex(i) {
        return 2 * i + 2;
    }

    // Swap two elements in the heap
    swap(a, b) {
        let temp = this.heap[a];
        this.heap[a] = this.heap[b];
        this.heap[b] = temp;
    }
}
