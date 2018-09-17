import { Event } from "./Event";
import { EventManager } from "./EventManager";
import {Amqp} from "./transport/Amqp";
import {Http} from "./transport/Http";

const scheduler = new EventManager({});
scheduler.start();
const now = Math.round(Date.now() / 1000) + 3;
console.log(`Now: ${now}`);
scheduler.addEvent(new Event({ timestamp: now, transport: new Amqp() }));
