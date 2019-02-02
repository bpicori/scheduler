import { EventEmitter } from "events";
import { clearInterval } from "timers";
import {Event, IEvent} from "./Event";
import { StoreManager } from "./store/StoreManager";

export default class EventManager extends EventEmitter {
  private interval: any;
  private _eventStore: StoreManager;
  private byId: Map<string, IEvent>;
  private byTimestamp: Map<number, IEvent[]>;

  /**
   * Constructor
   * @param eventStore
   */
  constructor(eventStore: StoreManager) {
    super();
    this._eventStore = eventStore;
    this.byId = new Map();
    this.byTimestamp = new Map();
    this.on("execute", this._onExecute);
  }

  /**
   * Add event
   * @param event
   */
  public addEvent(event: Event): void {
    this.byId.set(event.id, event);
    if (this.byTimestamp.has(event.timestamp)) {
      this.byTimestamp.set(event.timestamp, [...(this.byTimestamp.get(event.timestamp) as Event[]), event]);
    } else {
      this.byTimestamp.set(event.timestamp, [event]);
    }
  }

  // /**
  //  * Has event by timestamp
  //  * @param timestamp
  //  * @return boolean
  //  */
  // public hasEventByTimestamp(timestamp: number): boolean {
  //   return this.byTimestamp.has(timestamp);
  // }

  /**
   * Get Event by timestamp
   * @param timestamp
   */
  public getEventByTimestamp(timestamp: number): Event[] {
    return this.byTimestamp.get(timestamp) as Event[];
  }

  /**
   * Delete event by timestamp
   * @param timestamp
   */
  public deleteEventByTimestamp(timestamp: number): void {
    this.byTimestamp.delete(timestamp);
  }

  // /**
  //  * Get All events
  //  */
  // public getAllEvents(): Event[] {
  //   return [...this.byId.values()];
  // }

  public deleteAll() {
    this.byId = new Map<string, Event>();
    this.byTimestamp = new Map<number, Event[]>();
  }

  // TODO
  public removeEvent(eventId: string): void {
    this.emit(`event.remove.${eventId}`);
    console.log(eventId);
  }

  // /**
  //  * Empty scheduler
  //  */
  // public empty(): void {
  //     this._eventStore.deleteAll();
  // }

  // public getEvents(): Event[] {
  //     return this._eventStore.getAllEvents();
  // }

  /**
   * Start Event Manager
   */
  public async start() {
    const events = await this._eventStore.getAllEvents();
    this.byId = this.mapEventsById(events);
    this.byTimestamp = this.mapEventsByTimestamp(events);
    this.interval = setInterval(this._interval.bind(this), 1000);
  }

  /**
   * Stop EventManager
   */
  public stop() {
    clearInterval(this.interval);
  }

  /**
   * Interval every seconds and check if there is an event to emit
   * @private
   */
  private _interval(): void {
    const now = Math.round(Date.now() / 1000);
    console.log("Now ", now);
    if (this.byTimestamp.has(now)) {
      const events = this.byTimestamp.get(now) as Event[];
      for (const event of events) {
        this.emit("execute", event);
        if (event.repeat && event.interval) {
          event.timestamp = now + event.interval;
          this.addEvent(event);
        }
      }
    }
  }

  private mapEventsById(events: IEvent[]): Map<any, IEvent> {
    const map = new Map();
    for (const event of events) {
      map.set(event.id, event);
    }
    return map;
  }

  private _onExecute(event: Event) {
    event.transport.publish();
  }

  private mapEventsByTimestamp(events: IEvent[]) {
    const map = new Map();
    for (const event of events) {
      map.set(event.timestamp, event);
    }
    return map;
  }
}
