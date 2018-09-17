import { expect } from "chai";
import "mocha";
import {Event} from "../Event";
import {EventManager} from "../EventManager";
import {Http} from "../transport/Http";

describe("Event Manager Test", () => {
    const scheduler = new EventManager({});
    it("should add event and returns an Event object", () => {
        const event = new Event({timestamp: 1234, transport: new Http()} );
        expect(event.id).be.a("string");
        expect(event.timestamp).be.a("number");
        expect(event.repeat).be.a("undefined");
        expect(event.interval).be.a("undefined");
        expect(event.transport).be.a("object");
    });
});
