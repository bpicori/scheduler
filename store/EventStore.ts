import { Event } from "../Event";

export class EventStore implements IEventsStore<Event> {
    public byId: { [p: string]: Event };
    public byTimestamp: { [p: number]: Event[] };

    constructor() {
        this.byId = Object.create(null);
        this.byTimestamp = Object.create(null);
    }

    public addEvent(event: Event): void {
        this.byId[event.id] = event;
        if (this.byTimestamp[event.timestamp]) {
            this.byTimestamp[event.timestamp] = [...this.byTimestamp[event.timestamp], event];
        } else {
            this.byTimestamp[event.timestamp] = [event];
        }
    }

    /**
     * Has event by timestamp
     * @param timestamp
     * @return boolean
     */
    public hasEventByTimestamp(timestamp: number): boolean {
        return !!this.byTimestamp[timestamp];
    }

    /**
     * Get Event by timestamp
     * @param timestamp
     */
    public getEventByTimestamp(timestamp: number): Event[] {
        return this.byTimestamp[timestamp];
    }

    /**
     * Delete event by timestamp
     * @param timestamp
     */
    public deleteEventByTimestamp(timestamp: number): void {
        delete this.byTimestamp[timestamp];
    }
}

interface IEventsStore<T> {
    byId: {
        [id: string]: T,
    };
    byTimestamp: {
        [id: number]: T[],
    };
    hasEventByTimestamp(timestamp: number): boolean;
    getEventByTimestamp(timestamp: number): T[];
    deleteEventByTimestamp(timestamp: number): void;
}
