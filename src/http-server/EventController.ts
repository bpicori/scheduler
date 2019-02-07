/**
 * Created by bpicori on 19-02-05
 */

import * as Hapi from 'hapi';
import { Event, IEvent } from '../event/Event';
import EventManager from '../event/EventManager';
import { TransportFactory } from '../transport/TransportFactory';

export class EventController {
  private scheduler: EventManager;
  constructor(scheduler: EventManager) {
    this.scheduler = scheduler;
  }

  public index(request: Hapi.Request, h: Hapi.ResponseToolkit) {
    return h.response(this.scheduler.getEvents()).code(200);
  }

  public create(request: Hapi.Request, h: Hapi.ResponseToolkit) {
    this.scheduler.addEvent(Event.deserialize(request.payload));
    return true;
  }
  // TODO
  public update(request: Hapi.Request, h: Hapi.ResponseToolkit) {

  }
  // TODO
  public delete(request: Hapi.Request, h: Hapi.ResponseToolkit) {

  }
}
