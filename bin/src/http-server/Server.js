"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by bpicori on 19-02-05
 */
const hapi_1 = __importDefault(require("hapi"));
const EventController_1 = require("./EventController");
class Server {
    constructor(host, port, scheduler) {
        this.server = new hapi_1.default.Server({
            host,
            port,
        });
        this.controller = new EventController_1.EventController(scheduler);
    }
    async start() {
        try {
            await this.routes();
            await this.server.start();
            console.log(`Server running at: ${this.server.info.uri}`);
        }
        catch (err) {
            console.log(`Hapi error: ${err.message}`);
        }
    }
    routes() {
        // index
        this.server.route({
            handler: this.controller.index.bind(this.controller),
            method: 'GET',
            path: '/',
        });
        this.server.route({
            handler: this.controller.create.bind(this.controller),
            method: 'POST',
            path: '/',
        });
        this.server.route({
            handler: this.controller.update.bind(this.controller),
            method: 'PUT',
            path: '/',
        });
        this.server.route({
            handler: this.controller.delete.bind(this.controller),
            method: 'DELETE',
            path: '/',
        });
    }
}
exports.Server = Server;
//# sourceMappingURL=Server.js.map