"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const Queue_1 = require("../store/Queue");
const TransportFactory_1 = require("../transport/TransportFactory");
var StatusEvent;
(function (StatusEvent) {
    StatusEvent["PENDING"] = "PENDING";
    StatusEvent["DONE"] = "DONE";
    StatusEvent["ERROR"] = "ERROR";
})(StatusEvent = exports.StatusEvent || (exports.StatusEvent = {}));
class Event {
    static serialize(event) {
        const transportConfig = event.transport.getConfigs();
        const transportType = event.transport.type;
        return Object.assign({}, event, { transportConfig, transportType });
    }
    static deserialize(event) {
        const transport = TransportFactory_1.TransportFactory.getTransport(event.transportType, event.transportConfig);
        return new Event(event.name, event.timestamp, event.repeat, event.interval, transport);
    }
    constructor(name, timestamp, repeat, interval, transport) {
        this.eventId = uuid_1.v4();
        this.name = name;
        this.timestamp = timestamp;
        this.repeat = repeat;
        this.interval = interval;
        this.transport = transport;
        this.log = new Queue_1.Queue(10);
    }
}
exports.Event = Event;
//# sourceMappingURL=Event.js.map