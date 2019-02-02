import { EventEmitter } from "events";
import { Event } from "../Event";

export class EventStore extends EventEmitter {
  private byId: Map<string, Event>;
  private byTimestamp: Map<number, Event[]>;

    constructor(configs: any) {
        super();
        this.byId = new Map();
        this.byTimestamp = new Map();
    }

    /**
     * Add event
     * @param event
     */
    public addEvent(event: Event): void {
        this.byId.set(event.id, event);
        if (this.byTimestamp.has(event.timestamp)) {
            this.byTimestamp.set(event.timestamp, [...this.byTimestamp.get(event.timestamp) || [] , event]);
        } else {
            this.byTimestamp.set(event.timestamp, [event]);
        }
    }

    /**
     * Has event by timestamp
     * @param timestamp
     * @return boolean
     */
    public hasEventByTimestamp(timestamp: number): boolean {
        return !!this.byTimestamp.get(timestamp);
    }

    /**
     * Get Event by timestamp
     * @param timestamp
     */
    public getEventByTimestamp(timestamp: number): Event[] {
        return this.byTimestamp.get(timestamp) || [];
    }

    /**
     * Delete event by timestamp
     * @param timestamp
     */
    public deleteEventByTimestamp(timestamp: number): void {
        this.byTimestamp.delete(timestamp);
    }

    public getAllEvents(): Event[] {
      return [...this.byId.values()];
    }
}
