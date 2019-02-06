"use strict";
/**
 * Created by bpicori on 19-02-05
 */
Object.defineProperty(exports, "__esModule", { value: true });
const Event_1 = require("../event/Event");
class EventController {
    constructor(scheduler) {
        this.scheduler = scheduler;
    }
    index(request, h) {
        return h.response(this.scheduler.getEvents()).code(200);
    }
    create(request, h) {
        this.scheduler.addEvent(Event_1.Event.deserialize(request.payload));
        return true;
    }
    update(request, h) {
    }
    delete(request, h) {
    }
}
exports.EventController = EventController;
//# sourceMappingURL=EventController.js.map