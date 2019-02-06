"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const timers_1 = require("timers");
const Event_1 = require("./Event");
class EventManager extends events_1.EventEmitter {
    /**
     * Constructor
     * @param eventStore
     */
    constructor(eventStore) {
        super();
        this._eventStore = eventStore;
        this._byId = new Map();
        this._byTimestamp = new Map();
        this.on('execute', this._onExecute);
    }
    get byId() {
        return this._byId;
    }
    /**
     * Get All events
     */
    getEvents() {
        return Array.from(this._byId.values());
    }
    /**
     * Get Event by id
     * @param eventId
     */
    getEventById(eventId) {
        if (!this._byId.has(eventId)) {
            throw new Error('Event not Found');
        }
        return this._byId.get(eventId);
    }
    /**
     * Add event
     * @param event
     * @param emitToStore
     */
    addEvent(event, emitToStore = true) {
        // if event is repeat
        if (event.repeat && event.interval) {
            const now = Math.round(Date.now() / 1000);
            event.timestamp = now + event.interval;
        }
        this._byId.set(event.eventId, event);
        // if in this timestamp has other events
        if (this._byTimestamp.has(event.timestamp)) {
            const timestampMap = this._byTimestamp.get(event.timestamp);
            timestampMap.set(event.eventId, event);
        }
        else {
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
    updateEvent(event, emitToStore = true) {
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
            const timestampMap = this._byTimestamp.get(event.timestamp);
            timestampMap.set(event.eventId, event);
        }
        else {
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
    deleteEvent(event, emitToStore = true) {
        if (!this._byId.has(event.eventId)) {
            throw new Error('Event not Found');
        }
        this._byId.delete(event.eventId);
        const timestampMap = this._byTimestamp.get(event.timestamp);
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
    empty() {
        this._byId = new Map();
        this._byTimestamp = new Map();
    }
    /**
     * Sync events with eventStore
     */
    async sync() {
        await this._eventStore.connect();
        const events = await this._eventStore.getAllEvents();
        const now = Math.round(Date.now() / 1000);
        for (const event of events) {
            if (event.repeat) {
                event.timestamp = now + event.interval;
            }
            this.addEvent(Event_1.Event.deserialize(event), false);
        }
    }
    /**
     * Start Event Manager
     */
    async start() {
        this.interval = setInterval(this._interval.bind(this), 1000);
    }
    /**
     * Stop EventManager
     */
    stop() {
        timers_1.clearInterval(this.interval);
    }
    /**
     * Interval every seconds and check if there is an event to emit
     * @private
     */
    _interval() {
        const now = Math.round(Date.now() / 1000);
        // if has event
        if (this._byTimestamp.has(now)) {
            for (const [id, event] of this._byTimestamp.get(now)) {
                this.emit('execute', event);
                // if event is repeat
                if (event.repeat && event.interval) {
                    event.timestamp = now + event.interval;
                    this.updateEvent(event, false);
                }
            }
            this._byTimestamp.delete(now);
        }
    }
    async _onExecute(event) {
        console.log(`Fired event: ${event.name}`);
        await event.transport.publish();
    }
}
exports.default = EventManager;
//# sourceMappingURL=EventManager.js.map