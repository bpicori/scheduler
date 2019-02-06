"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const EventManager_1 = __importDefault(require("./event/EventManager"));
const Server_1 = require("./http-server/Server");
const StoreEventsMongo_1 = require("./store/StoreEventsMongo");
/**
 * Created by bpicori on 19-02-05
 */
async function main() {
    const store = new StoreEventsMongo_1.StoreEventsMongo({
        dbName: 'scheduler',
        mongoUrl: 'mongodb://localhost:27017',
    });
    const scheduler = new EventManager_1.default(store);
    const server = new Server_1.Server('0.0.0.0', 3000, scheduler);
    await scheduler.sync();
    await scheduler.start();
    await server.start();
    // const now = Math.round(Date.now() / 1000) + 5;
    // const event = new Event('event Bpicori', now, true, 3, new Http({ url: 'http://localhost:3000' }));
    // // const event2 = new Event({ name: 'event1', timestamp: now, repeat: false, interval: 3, transport: new Http() });
    // scheduler.addEvent(event);
    // scheduler.addEvent(event2);
}
main();
//# sourceMappingURL=main.js.map