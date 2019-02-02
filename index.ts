import { Event } from "./Event";
import EventManager from "./EventManager";
import {StoreManager} from "./store/StoreManager";
import {Amqp} from "./transport/Amqp";
import {Http} from "./transport/Http";

async function main() {

  const store = new StoreManager({filePath: ""});
  const scheduler = new EventManager(store);
  await scheduler.start();
  const now = Math.round(Date.now() / 1000) + 5;
  const event = new Event({ timestamp: now, repeat: true, interval: 2, transport: new Amqp() });
  scheduler.addEvent(event);
}

main();
