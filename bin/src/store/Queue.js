"use strict";
/**
 * Created by bpicori on 19-02-05
 */
Object.defineProperty(exports, "__esModule", { value: true });
class Queue {
    constructor(maxSize) {
        this.pointer = 0;
        this.dataStore = [];
        this.maxSize = maxSize;
    }
    /**
     * Adds element to queue
     */
    enqueue(element) {
        this.dataStore.push(element);
    }
    /**
     * Removes command from the queue
     */
    dequeue() {
        this.dataStore.shift();
    }
    /**
     * Get the first element of the queue
     */
    peek() {
        return this.dataStore[0];
    }
    /**
     * Check queue is empty
     */
    isEmpty() {
        return !this.dataStore.length;
    }
    /**
     * Check queue is full
     */
    isFull() {
        return this.dataStore.length === this.maxSize;
    }
    [Symbol.iterator]() {
        return this;
    }
    next(value) {
        if (this.pointer < this.dataStore.length) {
            return {
                done: false,
                value: this.dataStore[this.pointer++],
            };
        }
        else {
            return {
                done: true,
                // @ts-ignore
                value: null,
            };
        }
    }
}
exports.Queue = Queue;
//# sourceMappingURL=Queue.js.map