import { EventEmitter } from "events";

export class EventManager extends EventEmitter {

}

interface IEventDataItem {
    id: string;
    timestamp: number;

}

interface IEventDataStore {
    [timestamp: number]: IEventDataStore;
}
