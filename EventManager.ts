import { EventEmitter } from "events";
import { clearInterval } from "timers";
import { Event } from "./Event";
import { EventStore } from "./store/EventStore";
import {ITransport} from "./transport/Transport";

export class EventManager extends EventEmitter {
    private interval: any;
    private _eventStore: EventStore;
    constructor(configs: any) {
        super();
        this._eventStore = new EventStore();
        this.on("execute", this._onExecute);
    }

    /**
     * Add Event
     * @param event
     */
    public addEvent(event: Event): Event {
        this._eventStore.addEvent(event);
        return event;
    }
    // TODO
    public removeEvent(eventId: string): void {
        this.emit(`event.remove.${eventId}`);
        console.log(eventId);
    }

    /**
     * Start EventManager
     */
    public start() {
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
        if (this._eventStore.hasEventByTimestamp(now)) {
            const events = this._eventStore.getEventByTimestamp(now);
            for (const event of events) {
                this.emit("execute", event);
            }
        } else {
            console.log("no jobs ", now);
        }
    }

    private _onExecute(event: Event) {
        event.transport.publish();
    }
}
