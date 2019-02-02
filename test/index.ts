import { expect } from "chai";
import "mocha";
import { spy } from "sinon";
import {Event} from "../Event";
import {EventManager} from "../EventManager";
import {Http} from "../transport/Http";
const delay = (time: number) => (result: any) => new Promise((resolve) => setTimeout(() => resolve(result), time));

function generateRandomEvents(numberOfEvents: number, scheduler: EventManager): void {
    const now = Math.round(Date.now() / 1000);
    for (let i = 1; i <= numberOfEvents; i++) {
        scheduler.addEvent(new Event({timestamp: now + i, transport: new Http()}));
    }
}

describe("Event Manager Test", () => {
    const scheduler = new EventManager({});
    beforeEach(async () => {
        scheduler.empty();
        scheduler.stop();
    });
    afterEach(async () => {
        scheduler.empty();
        scheduler.stop();
    });
    it("should add event and returns an Event object", () => {
        const event = new Event({timestamp: 1234, transport: new Http()} );
        expect(event.id).be.a("string");
        expect(event.timestamp).be.a("number");
        expect(event.repeat).be.a("undefined");
        expect(event.interval).be.a("undefined");
        expect(event.transport).be.a("object");
    });
    it("should add repeat event and returns an Event object", () => {
        const event = new Event({timestamp: 1234, repeat: true, interval: 2, transport: new Http()} );
        expect(event.id).be.a("string");
        expect(event.timestamp).be.a("number");
        expect(event.repeat).be.a("boolean");
        expect(event.interval).be.a("number");
        expect(event.transport).be.a("object");
    });
    it("should fire event", function(done) {
        this.timeout(5000);
        const spyExecute = spy();
        const now = Math.round(Date.now() / 1000) + 2;
        scheduler.addEvent(new Event({timestamp: now, transport: new Http()}));
        scheduler.start();
        setTimeout(() => {
            expect(spyExecute.called).to.equal(true);
            done();
        }, 3000);
        scheduler.on("execute", spyExecute);
    });
    it("check event storage length", () => {
        const nrOfEvents = 10;
        generateRandomEvents(nrOfEvents, scheduler);
        const events = scheduler.getEvents();
        expect(events).to.have.length(nrOfEvents);
    });
    it("should empty events", () => {
        const nrOfEvents = 10;
        generateRandomEvents(nrOfEvents, scheduler);
        scheduler.empty();
        expect(scheduler.getEvents()).to.have.length(0);
    });
});
