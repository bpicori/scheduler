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
   * Get All events
   */
  public getEvents(): IEvent[] {
    return Array.from(this.byId.values());
  }

  public getEventById(id: string): IEvent {
    if (!this.byId.has(id)) {
      throw new Error("Event not Found");
    }
    return this.byId.get(id) as IEvent;
  }

  /**
   * Add event
   * @param event
   */
  public addEvent(event: IEvent): IEvent {
    this.byId.set(event.id, event);
    if (this.byTimestamp.has(event.timestamp)) {
      this.byTimestamp.set(event.timestamp, [...(this.byTimestamp.get(event.timestamp) as Event[]), event]);
    } else {
      this.byTimestamp.set(event.timestamp, [event]);
    }
    return event;
  }

  /**
   * Update event
   * @param event
   */
  public updateEvent(event: IEvent): IEvent {
    if (!this.byId.has(event.id)) {
      throw new Error("Event doesn't exist");
    }
    this.byId.set(event.id, event);
    if (this.byTimestamp.has(event.timestamp)) {
      // remove old event
      this.byTimestamp.set(event.timestamp, [...(this.byTimestamp.get(event.timestamp) as Event[]).filter((e) => e.id !== event.id)]);
      this.byTimestamp.set(event.timestamp, [...(this.byTimestamp.get(event.timestamp) as Event[]), event]);
    } else {
      this.byTimestamp.set(event.timestamp, [event]);
    }
    return event;
  }

  /**
   * Delete event
   * @param event
   */
  // TODO
  public deleteEvent(event: Event) {
    throw new Error("Not Implemented yet");
  }

  /**
   * Empty scheduler
   */
  public empty(): void {
    this.byId = new Map<string, Event>();
    this.byTimestamp = new Map<number, Event[]>();
  }

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

  /**
   * Map Events by id
   * @param events
   */
  private mapEventsById(events: IEvent[]): Map<any, IEvent> {
    const map = new Map();
    for (const event of events) {
      map.set(event.id, event);
    }
    return map;
  }

  /**
   * Map events by timestamp
   * @param events
   */
  private mapEventsByTimestamp(events: IEvent[]) {
    const map = new Map();
    for (const event of events) {
      map.set(event.timestamp, event);
    }
    return map;
  }

  private async _onExecute(event: Event) {
    await event.transport.publish();
  }
}
