/**
 * Created by bpicori on 19-02-05
 */
import {IEvent} from '../Event';

export class Queue implements IterableIterator<ICommand> {
  private readonly dataStore: ICommand[];
  private pointer = 0;
  constructor() {
    this.dataStore = [];
  }

  /**
   * Adds command to queue
   */
  public push(command: ICommand) {
    this.dataStore.push(command);
  }

  /**
   * Removes command from the queue
   */
  public shift() {
    this.dataStore.shift();
  }

  /**
   * Get the first element of the queue
   */
  public peekFront() {
    return this.dataStore[0];
  }

  /**
   * Inspects the last of the queue
   */
  public peekBack() {
    return this.dataStore[this.dataStore.length - 1];
  }

  /**
   * Check queue is empty
   */
  public isEmpty() {
    return !this.dataStore.length;
  }

  public [Symbol.iterator](): IterableIterator<ICommand> {
    return this;
  }

  public next(value?: any): IteratorResult<ICommand> {
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

interface ICommand {
  command: string;
  event: IEvent;
}
