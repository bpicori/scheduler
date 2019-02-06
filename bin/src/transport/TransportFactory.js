"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Http_1 = require("./Http");
const Transport_1 = require("./Transport");
class TransportFactory {
    static getTransport(type, config) {
        if (type === Transport_1.TransportType.HTTP) {
            // return
            return new Http_1.Http(config);
        }
        throw new Error(' Type not found');
    }
}
exports.TransportFactory = TransportFactory;
//# sourceMappingURL=TransportFactory.js.map