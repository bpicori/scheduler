/**
 * Created by bpicori on 19-02-05
 */

export class Queue<T> implements IterableIterator<T> {
  private readonly dataStore: T[];
  private pointer = 0;
  private readonly maxSize: number;
  constructor(maxSize: number) {
    this.dataStore = [];
    this.maxSize = maxSize;
  }

  /**
   * Adds element to queue
   */
  public enqueue(element: T) {
    this.dataStore.push(element);
  }

  /**
   * Removes command from the queue
   */
  public dequeue() {
    this.dataStore.shift();
  }

  /**
   * Get the first element of the queue
   */
  public peek() {
    return this.dataStore[0];
  }

  /**
   * Check queue is empty
   */
  public isEmpty() {
    return this.dataStore.length === 0;
  }

  /**
   * Check queue is full
   */
  public isFull() {
    return this.dataStore.length === this.maxSize;
  }

  /**
   * Get first element and removes it from queue
   */
  public poll() {
    const element = this.peek();
    this.dequeue();
    return element;
  }

  // tslint:disable-next-line:function-name
  public [Symbol.iterator](): IterableIterator<T> {
    return this;
  }

  public next(value?: T): IteratorResult<T> {
    if (this.pointer < this.dataStore.length) {
      return {
        done: false,
        value: this.dataStore[this.pointer += 1],
      };
    }
    return {
      done: true,
        // @ts-ignore
      value: null,
    };

  }

}
