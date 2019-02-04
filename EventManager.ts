import {EventEmitter} from 'events';
import {clearInterval} from 'timers';
import {Event, IEvent, StatusEvent} from './Event';
import {StoreEventsMongo} from './store/StoreEventsMongo';

export default class EventManager extends EventEmitter {
  private _byId: Map<string, IEvent>;
  private _byTimestamp: Map<number, Map<string, IEvent>>;

  private interval: any;
  private _eventStore: StoreEventsMongo;

  /**
   * Constructor
   * @param eventStore
   */
  constructor(eventStore: StoreEventsMongo) {
    super();
    this._eventStore = eventStore;
    this._byId = new Map();
    this._byTimestamp = new Map();
    this.on('execute', this._onExecute);
  }

  get byId(): Map<string, IEvent> {
    return this._byId;
  }

  /**
   * Get All events
   */
  public getEvents(): IEvent[] {
    return Array.from(this._byId.values());
  }

  /**
   * Get Event by id
   * @param eventId
   */
  public getEventById(eventId: string): IEvent {
    if (!this._byId.has(eventId)) {
      throw new Error('Event not Found');
    }
    return this._byId.get(eventId) as IEvent;
  }

  /**
   * Add event
   * @param event
   */
  public addEvent(event: IEvent): IEvent {
    this._byId.set(event.eventId, event);
    // if in this timestamp has other events
    if (this._byTimestamp.has(event.timestamp)) {
      const timestampMap = this._byTimestamp.get(event.timestamp) as Map<string, IEvent>;
      timestampMap.set(event.eventId, event);
    } else {
      this._byTimestamp.set(event.timestamp, new Map([[event.eventId, event]]));
    }
    this._eventStore.emit('addEvent', event);
    return event;
  }

  /**
   * Update event
   * @param event
   */
  public updateEvent(event: IEvent): IEvent {
    if (!this._byId.has(event.eventId)) {
      throw new Error('Event doesn\'t exist');
    }
    this._byId.set(event.eventId, event);
    if (this._byTimestamp.has(event.timestamp)) {
      const timestampMap = this._byTimestamp.get(event.timestamp) as Map<string, IEvent>;
      timestampMap.set(event.eventId, event);
    } else {
      this._byTimestamp.set(event.timestamp, new Map([[event.eventId, event]]));
    }
    return event;
  }

  /**
   * Delete event
   * @param event
   */
  public deleteEvent(event: IEvent): boolean {
    if (!this._byId.has(event.eventId)) {
      throw new Error('Event not Found');
    }
    this._byId.delete(event.eventId);
    const timestampMap = this._byTimestamp.get(event.timestamp) as Map<string, IEvent>;
    timestampMap.delete(event.eventId);
    // if timestamp map is empty
    if (!timestampMap.size) {
      this._byTimestamp.delete(event.timestamp);
    }
    return true;
  }

  /**
   * Empty scheduler
   */
  public empty(): void {
    this._byId = new Map<string, Event>();
    this._byTimestamp = new Map<number, Map<string, IEvent>>();
  }

  /**
   * Sync events with eventStore
   */
  public async sync() {
    await this._eventStore.connect();
    const events = await this._eventStore.getAllEvents();
    this._byId = this.mapEventsById(events);
    this._byTimestamp = this.mapEventsByTimestamp(events);
  }

  /**
   * Start Event Manager
   */
  public async start() {
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
    console.log(`Now: ${now}`);
    // if has event
    if (this._byTimestamp.has(now)) {
      const t = this._byTimestamp.get(now);
      for (const [id, event] of this._byTimestamp.get(now) as Map<string, IEvent>) {
        this.emit('execute', event);
        // if event is repeat
        if (event.repeat && event.interval) {
          event.timestamp = now + event.interval;
          this.addEvent(event);
        }
      }
      this._byTimestamp.delete(now);
    }
  }

  /**
   * Map Events by id
   * @param events
   */
  private mapEventsById(events: IEvent[]): Map<any, IEvent> {
    const map = new Map();
    for (const event of events) {
      map.set(event.eventId, Event.deserialize(event));
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
      map.set(event.timestamp, Event.deserialize(event));
    }
    return map;
  }

  private async _onExecute(event: IEvent) {
    await event.transport.publish();
    event.status = StatusEvent.DONE;
  }
}
