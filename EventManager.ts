import { EventEmitter } from "events";
import {clearInterval} from "timers";

export class EventManager extends EventEmitter {
    private interval: any;
    // TODO
    public addEvent(event: IEventDataItem): void {
        console.log(event);
    }
    // TODO
    public removeEvent(eventId: string): void {
        console.log(eventId);
    }

    public start() {
        this.interval = setInterval(this._interval.bind(this), 1000);
    }

    public stop() {
        clearInterval(this.interval);
    }

    private _interval(): void {
        console.log("ok");
    }

}

interface IEventDataItem {
    id: string;
    timestamp: number;
}

interface IEventDataStore {
    [timestamp: number]: IEventDataStore;
}
