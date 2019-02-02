import { assert, expect } from 'chai';
import 'mocha';
import { spy } from 'sinon';
import {Event} from '../Event';
import EventManager from '../EventManager';
import {StoreManager} from '../store/StoreManager';
import {Http} from '../transport/Http';
const delay = (time: number) => (result: any) => new Promise((resolve) => setTimeout(() => resolve(result), time));

function generateRandomEvents(numberOfEvents: number, scheduler: EventManager): void {
    const now = Math.round(Date.now() / 1000);
    for (let i = 1; i <= numberOfEvents; i++) {
        scheduler.addEvent(new Event({name: `event${i}`, timestamp: now + i, transport: new Http()}));
    }
}

describe('Event Manager Test', () => {
    const store = new StoreManager({ filePath: '' });
    const scheduler = new EventManager(store);
    beforeEach(async () => {
        scheduler.empty();
        scheduler.stop();
    });
    afterEach(async () => {
        scheduler.empty();
        scheduler.stop();
    });
    it('should add event and returns an Event object', () => {
      const event = new Event({name: 'event1', timestamp: 1234, transport: new Http()} );
      scheduler.addEvent(event);
      const event2 = scheduler.getEventById(event.id);
      assert.equal(event.id, event2.id);
    });
    it('should update event', () => {
      // Add event
      const event = new Event({name: 'event1', timestamp: 1234, transport: new Http()} );
      scheduler.addEvent(event);
      event.timestamp = 12345;
      scheduler.updateEvent(event);
      const updatedEvent = scheduler.getEventById(event.id);
      // timestamp should be 12345
      assert.equal(updatedEvent.timestamp, 12345);
      // scheduler should have only one array
      const events = scheduler.getEvents();
      assert.lengthOf(events, 1);
    });
    it('should delete an event', () => {
      const event1 = new Event({name: 'event1', timestamp: 1234, transport: new Http()} );
      const event2 = new Event({name: 'event2', timestamp: 12345, transport: new Http()} );
      scheduler.addEvent(event1);
      scheduler.addEvent(event2);
      scheduler.deleteEvent(event1);
      assert.lengthOf(scheduler.getEvents(), 1);
      // assert.isUndefined(scheduler.byId.get(event1.id));
      // assert.isUndefined(scheduler.byTimestamp.get(event1.timestamp));
    });
    // it('should fire event', async function() {
    //     this.timeout(5000);
    //     const spyExecute = spy();
    //     await scheduler.start();
    //     const now = Math.round(Date.now() / 1000) + 2;
    //     scheduler.addEvent(new Event({name: 'event1', timestamp: now, transport: new Http()}));
    //     setTimeout(() => {
    //         expect(spyExecute.called).to.equal(true);
    //     }, 3000);
    //     scheduler.on('execute', spyExecute);
    // });
    // it("check event storage length", () => {
    //     const nrOfEvents = 10;
    //     generateRandomEvents(nrOfEvents, scheduler);
    //     const events = scheduler.getEvents();
    //     expect(events).to.have.length(nrOfEvents);
    // });
    // it("should empty events", () => {
    //     const nrOfEvents = 10;
    //     generateRandomEvents(nrOfEvents, scheduler);
    //     scheduler.empty();
    //     expect(scheduler.getEvents()).to.have.length(0);
    // });
});
