/**
 * Created by bpicori on 19-02-05
 */

export class Queue implements IterableIterator<any> {
  private readonly dataStore: any[];
  private pointer = 0;
  private readonly maxSize: number;
  constructor(maxSize: number) {
    this.dataStore = [];
    this.maxSize = maxSize;
  }

  /**
   * Adds element to queue
   */
  public enqueue(element: any) {
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
    return !this.dataStore.length;
  }

  /**
   * Check queue is full
   */
  public isFull() {
    return this.dataStore.length === this.maxSize;
  }

  public [Symbol.iterator](): IterableIterator<any> {
    return this;
  }

  public next(value?: any): IteratorResult<any> {
    if (this.pointer < this.dataStore.length) {
      return {
        done: false,
        value: this.dataStore[this.pointer++],
      };
    } else {
      return {
        done: true,
        // @ts-ignore
        value: null,
      };
    }
  }

}
