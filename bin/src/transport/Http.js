"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const Transport_1 = require("./Transport");
class Http {
    constructor(config) {
        this.type = Transport_1.TransportType.HTTP;
        this.requestParams = config;
    }
    async publish() {
        try {
            const { data, status } = await axios_1.default(this.requestParams);
            return { data, status };
        }
        catch (e) {
            if (e.response) {
                return { message: e.message, data: e.response.data, status: e.response.status };
            }
            return { message: e.message, code: e.code };
        }
    }
    getConfigs() {
        return Object.assign({}, this.requestParams);
    }
}
exports.Http = Http;
//# sourceMappingURL=Http.js.map