import EventManager from './event/EventManager';
import {Server} from './http-server/Server';
import {StoreEventsMongo} from './store/StoreEventsMongo';

/**
 * Created by bpicori on 19-02-05
 */
async function main() {

  const store = new StoreEventsMongo({
    dbName: 'scheduler',
    mongoUrl: 'mongodb://localhost:27017',
  });
  const scheduler = new EventManager(store);
  const server = new Server('0.0.0.0', 3000, scheduler);
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
