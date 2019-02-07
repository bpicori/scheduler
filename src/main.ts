import { Event } from './event/Event';
import EventManager from './event/EventManager';
import { Server } from './http-server/Server';
import { StoreEventsMongo } from './store/StoreEventsMongo';
import { Amqp } from './transport/Amqp';

/**
 * Created by bpicori on 19-02-05
 */
async function main() {

  const store = new StoreEventsMongo({
    dbName: 'scheduler',
    mongoUrl: 'mongodb://localhost:27017',
  });
  const scheduler = new EventManager(store);
  const server = new Server('0.0.0.0', 3001, scheduler);
  await scheduler.start();
  await server.start();
  const now = Math.round(Date.now() / 1000) + 5;
  // const event = new Event('event Bpicori', now, true, 3, new Amqp({
  //   exchange: '',
  //   payload: { a: 1 },
  //   rabbitUri: 'amqp://localhost',
  //   routingKey: 'consumeEvent',
  // }));
  // // const event2 = new Event({ name: 'event1', timestamp: now, repeat: false, interval: 3, transport: new Http() });
  // scheduler.addEvent(event);
  // scheduler.addEvent(event2);

}

main();
