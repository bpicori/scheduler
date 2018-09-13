"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var timers_1 = require("timers");
var EventManager = /** @class */ (function (_super) {
    __extends(EventManager, _super);
    function EventManager() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // TODO
    EventManager.prototype.addEvent = function (event) {
        console.log(event);
    };
    // TODO
    EventManager.prototype.removeEvent = function (eventId) {
        console.log(eventId);
    };
    EventManager.prototype.start = function () {
        this.interval = setInterval(this._interval.bind(this), 1000);
    };
    EventManager.prototype.stop = function () {
        timers_1.clearInterval(this.interval);
    };
    EventManager.prototype._interval = function () {
        console.log("ok");
    };
    return EventManager;
}(events_1.EventEmitter));
exports.EventManager = EventManager;
