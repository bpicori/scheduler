"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const mongodb_1 = require("mongodb");
const Event_1 = require("../event/Event");
const Queue_1 = require("./Queue");
class StoreEventsMongo extends events_1.EventEmitter {
    constructor(configs) {
        super();
        this.client = new mongodb_1.MongoClient(configs.mongoUrl, { useNewUrlParser: true, poolSize: 10, reconnectTries: Number.MAX_VALUE, reconnectInterval: 1000 });
        this.dbName = configs.dbName;
        this.db = null;
        this.on('addEvent', this.addEvent);
        this.on('updateEvent', this.updateEvent);
        this.on('deleteEvent', this.deleteEvent);
        this.commandQueue = new Queue_1.Queue(Number.MAX_VALUE);
    }
    /**
     * Find all events
     */
    async getAllEvents() {
        if (this.db && this.client.isConnected()) {
            return this.db.collection('events').find({}).toArray();
        }
        else {
            return [];
        }
    }
    /**
     * Add Event
     * @param event
     */
    async addEvent(event) {
        if (this.db && this.client.isConnected()) {
            await this.db.collection('events').insertOne(Event_1.Event.serialize(event));
        }
        else {
            this.commandQueue.enqueue({ command: 'addEvent', event });
        }
    }
    /**
     * Update Event
     * @param event
     */
    async deleteEvent(event) {
        if (this.db && this.client.isConnected()) {
            await this.db.collection('events').deleteOne({ eventId: event.eventId });
        }
        else {
            this.commandQueue.enqueue({ command: 'deleteEvent', event });
        }
    }
    /**
     * Update Event
     * @param event
     */
    async updateEvent(event) {
        if (this.db && this.client.isConnected()) {
            await this.db.collection('events').findOneAndUpdate({ eventId: event.eventId }, { $set: Event_1.Event.serialize(event) });
        }
        else {
            this.commandQueue.enqueue({ command: 'updateEvent', event });
        }
    }
    async connect() {
        try {
            await this.client.connect();
            this.db = this.client.db(this.dbName);
            this.db.on('reconnect', () => {
                console.log('Mongodb Connected');
            });
            this.db.on('close', () => {
                console.warn('Mongodb Disconnected');
            });
            return this.db;
        }
        catch (err) {
            await this._delay(1000);
            return this.connect();
        }
    }
    _delay(millis) {
        return new Promise((resolve) => setTimeout(resolve(), millis));
    }
}
exports.StoreEventsMongo = StoreEventsMongo;
//# sourceMappingURL=StoreEventsMongo.js.map