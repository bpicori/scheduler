import { Event } from './Event';
import EventManager from './EventManager';
import {StoreEventsMongo} from './store/StoreEventsMongo';
// import {Amqp} from './transport/Amqp';
import {Http} from './transport/Http';

async function main() {

  const store = new StoreEventsMongo({
    dbName: 'scheduler',
    mongoUrl: 'mongodb://localhost:27017',
  });
  const scheduler = new EventManager(store);
  await scheduler.sync();
  await scheduler.start();
  const now = Math.round(Date.now() / 1000) + 5;
  const event = new Event('event Bpicori', now, true, 3, new Http({ url: 'http://localhost:3000' }));
  // const event2 = new Event({ name: 'event1', timestamp: now, repeat: false, interval: 3, transport: new Http() });
  scheduler.addEvent(event);
  // scheduler.addEvent(event2);

}

main();
