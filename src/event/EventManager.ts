import { EventEmitter } from 'events';
import { clearInterval } from 'timers';
import Logger from '../Logger';
import { StoreEventsMongo } from '../store/StoreEventsMongo';
import { Event, IEvent } from './Event';

export class EventManager extends EventEmitter {

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
    this.on('executeEvent', this.executeEvent);
    this._eventStore.on('syncEventManager', this.sync.bind(this));
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
   * @param emitToStore
   */
  public addEvent(event: IEvent, emitToStore = true): IEvent {
    // if event is repeat
    if (event.repeat && event.interval) {
      const now = Math.round(Date.now() / 1000);
      event.timestamp = now + event.interval;
    }
    this._byId.set(event.eventId, event);
    // if in this timestamp has other events
    if (this._byTimestamp.has(event.timestamp)) {
      const timestampMap = this._byTimestamp.get(event.timestamp) as Map<string, IEvent>;
      timestampMap.set(event.eventId, event);
    } else {
      this._byTimestamp.set(event.timestamp, new Map([[event.eventId, event]]));
    }
    if (emitToStore) {
      this._eventStore.emit('addEvent', event);
    }
    return event;
  }

  /**
   * Update event
   * @param event
   * @param emitToStore
   */
  public updateEvent(event: IEvent, emitToStore = true): IEvent {
    if (!this._byId.has(event.eventId)) {
      throw new Error('Event doesn\'t exist');
    }
    // check if event is repeat
    if (event.repeat && event.interval) {
      const now = Math.round(Date.now() / 1000);
      event.timestamp = now + event.interval;
    }
    this._byId.set(event.eventId, event);
    if (this._byTimestamp.has(event.timestamp)) {
      const timestampMap = this._byTimestamp.get(event.timestamp) as Map<string, IEvent>;
      timestampMap.set(event.eventId, event);
    } else {
      this._byTimestamp.set(event.timestamp, new Map([[event.eventId, event]]));
    }
    if (emitToStore) {
      this._eventStore.emit('updateEvent', event);
    }
    return event;
  }

  /**
   * Delete event
   * @param event
   * @param emitToStore
   */
  public deleteEvent(event: IEvent, emitToStore = true): boolean {
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
    if (emitToStore) {
      this._eventStore.emit('deleteEvent');
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
  public async sync(connect: boolean = true) {
    if (connect) {
      await this._eventStore.connect();
    }
    this._byId = new Map();
    this._byTimestamp = new Map();
    const events = await this._eventStore.getAllEvents();
    const now = Math.round(Date.now() / 1000);
    for (const event of events) {
      if (event.repeat) {
        event.timestamp = now + event.interval;
      }
      this.addEvent(Event.deserialize(event), false);
    }
    Logger.info('Scheduler synced with store');
  }

  /**
   * Start Event Manager
   */
  public async start() {
    Logger.info('Scheduler Started');
    await this.sync();
    this.interval = setInterval(this.eventChecker.bind(this), 1000);
  }

  /**
   * Stop EventManager
   */
  public stop() {
    Logger.info('Scheduler Stopped');
    clearInterval(this.interval);
  }

  /**
   * Interval every seconds and check if there is an event to emit
   * @private
   */
  private eventChecker(): void {
    const now = Math.round(Date.now() / 1000);
    // if has event
    if (this._byTimestamp.has(now)) {
      for (const [id, event] of this._byTimestamp.get(now) as Map<string, IEvent>) {
        this.emit('executeEvent', event);
        // if event is repeat
        if (event.repeat && event.interval) {
          event.timestamp = now + event.interval;
          this.updateEvent(event, false);
        }
      }
      this._byTimestamp.delete(now);
    }
  }

  /**
   * Fire event
   * @param event
   */
  private async executeEvent(event: IEvent) {
    Logger.info(`Fired event: ${event.name} at: ${new Date()}`);
    await event.transport.fire();
  }
}
